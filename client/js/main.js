window.addEventListener('load', (event) => {

    const ZONE_PREFIX = "/client/assets/levels/level";
    const ZONE_SUFFIX = ".json";
    const FPS = 30;
    const GAME_STATE = {
        MENU: "MENU",
        RUNNING_MP: "RUNNING_MP",
        RUNNING_ONE_PC: "RUNNING_ONE_PC",
    }

    var assets = ['/client/assets/tilemap/my-tiles-map.png',
        '/client/assets/characters/water/frog_tiles.png',
        '/client/assets/characters/fire/frog_tiles.png',
        '/client/assets/background/start_menu_bgr.png',
        '/client/assets/menu/button_gray_2.png',
        '/client/assets/menu/button_gray_short.png',
        '/client/assets/menu/button_gray_short_2.png',
        '/client/assets/menu/button_gray_long.png',
        '/client/assets/characters/fire/jump_left.png',
        '/client/assets/characters/water/jump_right.png',
        '/client/assets/characters/fire/jump_left_red.png',
        '/client/assets/characters/water/jump_right_blue.png',
    ];
    const TimeManager = function () {
        this.timer = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.lastSec = null;
        this.actualSec = null;
    };

    TimeManager.prototype = {
        constructor: Game.TimeManager,
        calculateTime: function () {
            this.seconds = Math.floor(this.timer);
            this.minutes = Math.floor(this.seconds / 60);
            this.seconds %= 60;

            return [this.seconds, this.minutes];
        },
        restartTimer: function () {
            this.timer = 0;
        },
        setTimer: function (time) {

            if (time != null) {
                var timeDivided = time / 1000;
                var timeStr = timeDivided.toString().split('.')[0];

                this.actualSec = timeStr;

                if (this.lastSec != this.actualSec) {
                    this.timer += 1;
                }

                this.lastSec = this.actualSec;
            }
        }
    };
    const AssetsManager = function () {
        this.imagesLoaded = 0;
        this.imagesCount = undefined;
        this.result = {};
    };
    AssetsManager.prototype = {
        constructor: AssetsManager,
        loadAssets: function (assets, callback) {
            this.imagesCount = assets.length;

            var onload = function () {
                if (--assets_manager.imagesCount == 0) {
                    callback();
                };
            };

            for (var n = 0; n < assets.length; n++) {
                var name = assets[n];
                this.result[name] = document.createElement('img');
                this.result[name].addEventListener('load', onload);
                this.result[name].src = name;
            }
        },
        setAssets: function () {
            this.menu_background = this.result['/client/assets/background/start_menu_bgr.png'];
            this.tile_set_image = this.result['/client/assets/tilemap/my-tiles-map.png'];
            this.player_water_image = this.result['/client/assets/characters/water/frog_tiles.png'];
            this.player_fire_image = this.result['/client/assets/characters/fire/frog_tiles.png'];
            this.button_gray = this.result['/client/assets/menu/button_gray_2.png'];
            this.button_gray_short = this.result['/client/assets/menu/button_gray_short.png'];
            this.button_gray_long = this.result['/client/assets/menu/button_gray_long.png'];
            this.button_gray_short_2 = this.result['/client/assets/menu/button_gray_short_2.png'];
            this.fire_jump = this.result['/client/assets/characters/fire/jump_left.png'];
            this.water_jump = this.result['/client/assets/characters/water/jump_right.png'];
            this.fire_jump_red = this.result['/client/assets/characters/fire/jump_left_red.png'];
            this.water_jump_blue = this.result['/client/assets/characters/water/jump_right_blue.png'];
        },
        getMenuImages: function () {
            var menu_assets = {};

            menu_assets["button_gray"] = this.button_gray;
            menu_assets["button_gray_short"] = this.button_gray_short;
            menu_assets["button_gray_long"] = this.button_gray_long;
            menu_assets["button_gray_short_2"] = this.button_gray_short_2;
            menu_assets["menu_background"] = this.menu_background;
            menu_assets["fire_jump"] = this.fire_jump;
            menu_assets["water_jump"] = this.water_jump;

            return menu_assets;
        },
        requestJSON: function (url, callback) {

            let request = new XMLHttpRequest();

            request.addEventListener("load", function (event) {

                callback(JSON.parse(this.responseText));

            }, { once: true });

            request.open("GET", url);
            request.send();
        }
    };
    const Multiplayer = function () {
        this.role = undefined;
        this.socket = undefined;
        this.code = null;
        this.on = false;
    }
    Multiplayer.prototype = {

        constructor: Multiplayer,

        initMultiplayer: function () {
            this.on = true;
            this.socket = io(); // function initializing socket 

            this.socket.on('newPosition', function (data) {
                if (game_state == GAME_STATE.RUNNING_MP) {
                    for (var i = 0; i < data.length; i++) {

                        if (data[i].role == "fire" && multiplayer.role == "water") {
                            game.world.player_fire.x = data[i].x;
                            game.world.player_fire.y = data[i].y;
                            game.world.player_fire.velocity_x = data[i].velocity_x;
                            game.world.player_fire.velocity_y = data[i].velocity_y;
                            game.world.player_fire.direction_x = data[i].direction_x;
                            //console.log(data[i]);
                        }
                        else if (data[i].role == "water" && multiplayer.role == "fire") {
                            game.world.player_water.x = data[i].x;
                            game.world.player_water.y = data[i].y;
                            game.world.player_water.velocity_x = data[i].velocity_x;
                            game.world.player_water.velocity_y = data[i].velocity_y;
                            game.world.player_water.direction_x = data[i].direction_x;
                            //console.log(data[i]);
                        }
                    }
                }
            });
            this.socket.on('startMPGame', function (data) {
                var message = data.message;

                if (data.startMPGame) {
                    console.log("starting new level");

                    game_state = GAME_STATE.RUNNING_MP;

                    multiplayer.role = data.pRole;
                    multiplayer.code = data.code;
                    
                    game.world.zone_id = data.level_id;

                    menuManager.multiplayerMenu.destroy();
                    menuManager.stateToogle("MULTIPLAYER_MENU", "IN_GAME_MULTIPLAYER_MENU");

                    resetGame();
                }
                else {
                    //console.log(data.message);
                    menuManager.multiplayerMenu.labels[3].docElement.innerHTML = message;
                }
            });
            this.socket.on('disconnect', function () {
                console.log("Other player quit the game");
                //alert("Other player quit the game");
            });
            this.socket.on('gameCode', function (data) {
                menuManager.multiplayerMenu.labels[2].docElement.innerHTML = "Code: " + data.gameCode;
            });
            this.socket.on('infoMessage', function (data) {
                var message = data.message;

                if (data.flag == 'gameAlreadyCreated') {
                    //console.log(message);
                    menuManager.multiplayerMenu.labels[3].docElement.innerHTML = message;
                }
                else if (data.flag == 'cannotStartMP') {
                    //console.log(message);
                    menuManager.multiplayerMenu.labels[3].docElement.innerHTML = message;
                }
                else if (data.flag == 'playerQuit') {
                    console.log(message);
                    //alert(message);
                }
            });
            this.socket.on('resetGameLevel', function (data) {
                if (data.reset) {
                    console.log("reseting game");
                    resetGame();
                }
            });
            this.socket.on('startNewLevel', function (data) {
                if (data.start) {
                    console.log("starting new level");
                    game.world.zone_id = data.level_id;
                    resetGame();
                }
                else{
                    console.log("could not start a game");
                }
            });
        },
        closeMultiplayer: function () {
            this.socket.disconnect();
            this.role = undefined;
            this.socket = undefined;
            this.code = null;
            this.on = false;
        },
        resetLevel: function () {
            //console.log("Sending message to server to reset level");
            this.socket.emit('resetLevel', { level: game.world.zone_id, code: multiplayer.code });
        },
        setLevel: function () {
            //console.log("Sending message to server to set level");
            this.socket.emit('setLevel', { level: game.world.zone_id, code: multiplayer.code });
        }
    }
    var keyDownUp = function (event) {
        controller.keyDownUp(event.type, event.keyCode);
    };
    var tooglePause = function () {
        if (game_state == GAME_STATE.RUNNING_ONE_PC) { game_state = GAME_STATE.MENU; }
        else if (game_state == GAME_STATE.MENU) { game_state = GAME_STATE.RUNNING_ONE_PC; }
    };
    var resize = function (event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();

        menuManager.resize(game.world.width, game.world.height);
    };
    var resetSize = function () {
        game.world.rows = 10; // Basic size of map
        game.world.cols = 10;

        game.world.height = game.world.tile_size * game.world.rows;
        game.world.width = game.world.tile_size * game.world.cols;

        display.buffer.canvas.height = game.world.height;
        display.buffer.canvas.width = game.world.width;

        menuManager.resize(game.world.width, game.world.height);
    }

    var render = function () {

        switch (game_state) {
            case GAME_STATE.RUNNING_ONE_PC:
            case GAME_STATE.RUNNING_MP:
                display.drawBackground("orange");

                display.drawMap(assets_manager.tile_set_image,
                    game.world.tile_set.columns, game.world.graphical_map, game.world.columns, game.world.tile_set.tile_size);

                let frame_water = game.world.player_water_set.frames[game.world.player_water.frame_value];
                let frame_fire = game.world.player_fire_set.frames[game.world.player_fire.frame_value];

                display.drawObject(assets_manager.player_water_image, frame_water.x, frame_water.y,
                    game.world.player_water.x + Math.floor(game.world.player_water.width * 0.5 - frame_water.width * 0.5) + frame_water.offset_x,
                    game.world.player_water.y + frame_water.offset_y + 5, // 5 added for offset
                    frame_water.width, frame_water.height); //image, sx, sy, dx, dy, width, height, offset, offset

                display.drawObject(assets_manager.player_fire_image, frame_fire.x, frame_fire.y,
                    game.world.player_fire.x + Math.floor(game.world.player_fire.width * 0.5 - frame_fire.width * 0.5) + frame_fire.offset_x,
                    game.world.player_fire.y + frame_fire.offset_y + 5, // 5 added for offset
                    frame_fire.width, frame_fire.height); //image, sx, sy, dx, dy, width, height, offset, offset

                //display.drawBoundingBox(game.world.player_water.x, game.world.player_water.y, game.world.player_water.width, game.world.player_water.height, "blue");
                //display.drawBoundingBox(game.world.player_fire.x, game.world.player_fire.y, game.world.player_fire.width, game.world.player_fire.height, "red");

                // Diamonds
                for (let index = game.world.diamonds.length - 1; index > -1; --index) {
                    let diamond = game.world.diamonds[index];

                    let frame = game.world.tile_set.frames[diamond.frame_value];

                    display.drawObject(assets_manager.tile_set_image, frame.x, frame.y,
                        diamond.x + Math.floor(diamond.width * 0.5 - frame.width * 0.5) + frame.offset_x,
                        diamond.y + frame.offset_y, frame.width, frame.height);
                }
                break;
            case GAME_STATE.MENU:
                break;
        }
        display.render();
    };

    var resetGame = function () {
        engine.stop();
        time_manager.restartTimer();

        assets_manager.requestJSON(ZONE_PREFIX + game.world.zone_id + ZONE_SUFFIX, (zone) => {
            game.world.setup(zone);

            // I have to reset size of buffer because of map alteration
            display.buffer.canvas.height = game.world.height;
            display.buffer.canvas.width = game.world.width;

            engine.start();

        });
    }
    var setNewLevel = function(z_id = null){
        if(z_id != null){
            game.world.zone_id = z_id;
        } 
        else {
            if (game.world.zone_id == "05") { // end of all levels
                game.world.zone_id = "01";
                
                if(game_state == GAME_STATE.RUNNING_MP){
                    menuManager.inGameMultiplayerMenu.destroy();
                    menuManager.stateToogle("IN_GAME_MULTIPLAYER_MENU", "LEVEL_END_MENU");
                    game_state = GAME_STATE.MENU;

                    multiplayer.closeMultiplayer();
                }
                else if(game_state == GAME_STATE.RUNNING_ONE_PC){
                    menuManager.inGameMenu.destroy();
                    menuManager.stateToogle("IN_GAME_MENU", "LEVEL_END_MENU");
                    game_state = GAME_STATE.MENU;
                }
    
            } else {
                let zone = (parseInt(game.world.zone_id) + 1).toString();
    
                if (zone.length < 2) {zone = zone.padStart(2,"0")}
                
                game.world.zone_id = zone;
            }
        }
    }

    var update = function () {
        switch (game_state) {
            case GAME_STATE.RUNNING_MP:
                //console.log("gameRunning multiplayer");

                if (multiplayer.role == "fire") {
                    multiplayer.socket.emit('updatePosition', {
                        x: game.world.player_fire.x, y: game.world.player_fire.y,
                        vel_x: game.world.player_fire.velocity_x, vel_y: game.world.player_fire.velocity_y,
                        direction_x: game.world.player_fire.direction_x, gRole: multiplayer.role
                    }); // send information about movement to server

                    if (controller.left_1.active) { game.world.player_fire.moveLeft(); } // move with your player to left
                    if (controller.right_1.active) { game.world.player_fire.moveRight(); }
                    if (controller.up_1.active) { game.world.player_fire.jump(); controller.up_1.active = false; }

                }
                else if (multiplayer.role == "water") {
                    multiplayer.socket.emit('updatePosition', {
                        x: game.world.player_water.x, y: game.world.player_water.y,
                        vel_x: game.world.player_water.velocity_x, vel_y: game.world.player_water.velocity_y,
                        direction_x: game.world.player_water.direction_x, gRole: multiplayer.role
                    });

                    if (controller.left_1.active) { game.world.player_water.moveLeft(); }
                    if (controller.right_1.active) { game.world.player_water.moveRight(); }
                    if (controller.up_1.active) { game.world.player_water.jump(); controller.up_1.active = false; }

                }

                game.update();

                if (game.world.newLevel) { 
                    setNewLevel();
                    if(multiplayer.on){
                        multiplayer.setLevel(game.world.zone_id);
                    }

                    game.world.newLevel = false;
                } else if(game.world.restartLevel){
                    multiplayer.resetLevel();

                    game.world.restartLevel = false;
                }

                // Update timer
                time_manager.setTimer(engine.time);
                var game_time = time_manager.calculateTime();
                menuManager.inGameMultiplayerMenu.timerManage(game_time[0], game_time[1]);

                // Update score
                menuManager.inGameMultiplayerMenu.updateScore(game.world.diamond_count);

                break;
            case GAME_STATE.RUNNING_ONE_PC:
                //console.log("gameRunning One PC");

                if (controller.left_0.active) { game.world.player_water.moveLeft(); }
                if (controller.right_0.active) { game.world.player_water.moveRight(); }
                if (controller.up_0.active) { game.world.player_water.jump(); controller.up_0.active = false; } // if I want to prevent player to jump constantly, controller.up.active must be false

                if (controller.left_1.active) { game.world.player_fire.moveLeft(); }
                if (controller.right_1.active) { game.world.player_fire.moveRight(); }
                if (controller.up_1.active) { game.world.player_fire.jump(); controller.up_1.active = false; }

                game.update();

                if (game.world.newLevel) { 
                    setNewLevel();
                    resetGame();

                    game.world.newLevel = false;
                } else if(game.world.restartLevel){
                    resetGame();  

                    game.world.restartLevel = false;
                }

                // Update timer
                time_manager.setTimer(engine.time);
                var game_time = time_manager.calculateTime();
                menuManager.inGameMenu.timerManage(game_time[0], game_time[1]);

                // Update score
                menuManager.inGameMenu.updateScore(game.world.diamond_count);

                break;
            case GAME_STATE.MENU:
                //console.log("gamePaused");
                break;

        }

        menuManager.update();

        if (MENU_FUNCTIONS.retry_game_bool) {
            //console.log("Game reset")

            if (game_state == GAME_STATE.RUNNING_MP) {
                multiplayer.resetLevel();
            }
            else {
                resetGame();
                game_state = GAME_STATE.RUNNING_ONE_PC;
            }

            MENU_FUNCTIONS.retry_game_bool = false;
        }
        if (MENU_FUNCTIONS.start_MP_game_bool) {
            //console.log("Multiplayer init")

            //initMultiplayer();
            //resetGame();
            //game_state = GAME_STATE.RUNNING_MP;
            MENU_FUNCTIONS.start_MP_game_bool = false;
        }
        if (MENU_FUNCTIONS.start_one_PC_game_bool) {
            //console.log("One PC init")

            resetGame();
            game_state = GAME_STATE.RUNNING_ONE_PC;
            MENU_FUNCTIONS.start_one_PC_game_bool = false;
        }

        if (MENU_FUNCTIONS.resume_game_bool) {
            //console.log("Resume Game")

            tooglePause();
            MENU_FUNCTIONS.resume_game_bool = false;
        }
        if (MENU_FUNCTIONS.stop_game_bool) {
            //console.log("Pause game")

            tooglePause();
            MENU_FUNCTIONS.stop_game_bool = false;
        }
        if (MENU_FUNCTIONS.level_change_bool) {
            //console.log("Change level")

            if(game_state == GAME_STATE.RUNNING_MP){
                multiplayer.setLevel(game.world.zone_id);
            }
            else{
                setNewLevel(MENU_FUNCTIONS.level_change_id);
                resetGame();
            }

            MENU_FUNCTIONS.level_change_bool = false;
        }
        if (MENU_FUNCTIONS.return_to_menu_bool) {
            //console.log("Return to menu");

            if (game_state == GAME_STATE.RUNNING_MP) {
                multiplayer.closeMultiplayer();
            }

            resetSize();
            game_state = GAME_STATE.MENU;
            MENU_FUNCTIONS.return_to_menu_bool = false;
        }
        if (MENU_FUNCTIONS.change_hero_bool) { // Change of hero
            if (MENU_FUNCTIONS.change_hero == "fire") {
                menuManager.multiplayerMenu.buttons[0].docElement.style.backgroundImage = "url('" + assets_manager.fire_jump_red.src + "')";
                menuManager.multiplayerMenu.buttons[1].docElement.style.backgroundImage = "url('" + assets_manager.water_jump.src + "')";
            }
            else {
                menuManager.multiplayerMenu.buttons[1].docElement.style.backgroundImage = "url('" + assets_manager.water_jump_blue.src + "')";
                menuManager.multiplayerMenu.buttons[0].docElement.style.backgroundImage = "url('" + assets_manager.fire_jump.src + "')";
            }

            multiplayer.role = MENU_FUNCTIONS.change_hero;
            MENU_FUNCTIONS.change_hero_bool = false;
        }
        if (MENU_FUNCTIONS.createMPGame_bool) {

            if (!multiplayer.on) {
                multiplayer.initMultiplayer();
            }

            if (multiplayer.role != null) { // if user selected a role, create a game on server
                multiplayer.socket.emit('createGame', { gRole: multiplayer.role });
            }
            else { // if user did not select a role, let him know
                menuManager.multiplayerMenu.labels[3].docElement.innerHTML = "You must choose a hero!";
            }

            MENU_FUNCTIONS.createMPGame_bool = false;
        }
        if (MENU_FUNCTIONS.joinMPGame_bool) {
            var myCode = menuManager.multiplayerMenu.inputs[0].docElement.value;

            if (myCode) {
                if (!multiplayer.on) {
                    multiplayer.initMultiplayer();
                }
                multiplayer.socket.emit('joinGame', { code: myCode });
            }
            else {
                //console.log("Code is not valid");
                menuManager.multiplayerMenu.labels[3].docElement.innerHTML = "Code is not valid.";
            }

            MENU_FUNCTIONS.joinMPGame_bool = false;
        }
        if (controller.pause.down && (GAME_STATE.RUNNING_ONE_PC || GAME_STATE.MENU)) {
            //console.log("Paused by button");
            controller.pause.down = false;

            tooglePause();

            if (!controller.pause.pause_confirm) {
                // begin pause
                menuManager.inGameMenu.destroy();
                menuManager.stateToogle("IN_GAME_MENU", "PAUSE_MENU");
            }
            else {
                // end pause
                menuManager.pauseMenu.destroy();
                menuManager.stateToogle("PAUSE_MENU", "IN_GAME_MENU");
            }
        }

    };

    var game_state = GAME_STATE.MENU;

    var assets_manager = new AssetsManager();
    var time_manager = new TimeManager();
    var controller = new Controller();
    var display = new Display(document.querySelector("canvas"));
    var game = new Game();
    var multiplayer = new Multiplayer();
    var engine = new Engine(1000 / FPS, render, update);

    var menuManager = null;

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;
    display.buffer.imageSmoothingEnabled = false;

    assets_manager.loadAssets(assets, () => {
        assets_manager.setAssets();

        menuManager = new MenuManager(display.returnContext(), display.returnBuffer(), assets_manager.getMenuImages());
        resize();
        resetGame();

    });
    window.addEventListener("keydown", keyDownUp);
    window.addEventListener("keyup", keyDownUp);
    window.addEventListener("resize", resize);

});