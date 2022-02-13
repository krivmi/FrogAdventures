var express = require('express');
var app = express();
var server = require('http').createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
}); // this returns index page after connecting
// this nodeJS server must be started

app.use('/client', express.static(__dirname + '/client'));
// this determine what folders/files client can load from server

var port = 10937;
server.listen(port, () => {
    console.log('Server started. Listening on port ' + port);
});

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var GAME_LIST = {};
var s_id = 0;
var g_id = 0;

var Player = function (id) {
    var self = {
        x: 0,
        y: 0,
        velocity_x: 0,
        velocity_y: 0,
        direction_x: 1,
        id: id,
        role: "",

        pack_player_info: function () {

            var packed_info = {
                x: this.x,
                y: this.y,
                velocity_x: this.velocity_x,
                velocity_y: this.velocity_y,
                direction_x: this.direction_x,
                id: this.id,
                role: this.role,
            };

            return packed_info;
        }
    }

    return self;
}
var Game = function (g_code) {
    var self = {
        code: g_code,
        level: null,
        player_water: null,
        player_fire: null,
        running: null,
    }
    return self;
}

io.sockets.on('connection', (socket) => {
    socket.id = s_id++;
    console.log("Player " + socket.id + " connected to server ");

    SOCKET_LIST[socket.id] = socket;
    // every player has ID of the socket 
    var player = Player(socket.id);

    PLAYER_LIST[socket.id] = player;

    socket.on('disconnect', function () {
        console.log("Player " + socket.id + " quit the game ");

        // run through every game and see if player was its part, then set flag to unactive and send message to other player
        for (var i in GAME_LIST) {
            if (GAME_LIST[i].player_water != null) {
                if (GAME_LIST[i].player_water.id == socket.id) {
                    GAME_LIST[i].running = false;
                    //console.log("Player water quit the game ");
                    var socket_fire = SOCKET_LIST[GAME_LIST[i].player_fire.id];
                    if(socket_fire != null || socket_fire != undefined){ // check if player is still connected
                        socket_fire.emit('infoMessage', {message: 'Player ' + socket.id + ' quit the game', flag: 'playerQuit'});
                    }
                }
            }
            if (GAME_LIST[i].player_fire != null) {
                if (GAME_LIST[i].player_fire.id == socket.id) {
                    GAME_LIST[i].running = false;
                    //console.log("Player fire quit the game ");
                    var socket_water = SOCKET_LIST[GAME_LIST[i].player_water.id];
                    if(socket_water != null || socket_water != undefined){ // check if player is still connected
                        socket_water.emit('infoMessage', {message: 'Player ' + socket.id + ' quit the game', flag: 'playerQuit'});
                    }
                }
            }

        }
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
    });
    
    socket.on('resetLevel', function (data) {
        
        for(var i in GAME_LIST){
            if(GAME_LIST[i].code == data.code){
                //console.log("resetLevel");
                GAME_LIST[i].level = data.level;

                var socket_fire = SOCKET_LIST[GAME_LIST[i].player_fire.id];
                var socket_water = SOCKET_LIST[GAME_LIST[i].player_water.id];

                socket_fire.emit('resetGameLevel', {reset: true});
                socket_water.emit('resetGameLevel', {reset: true});
                //break;
            }
        }
    });

    socket.on('setLevel', function (data) {
        for(var i in GAME_LIST){
            if(GAME_LIST[i].code == data.code){
                //console.log("resetLevel");
                GAME_LIST[i].level = data.level;

                var socket_fire = SOCKET_LIST[GAME_LIST[i].player_fire.id];
                var socket_water = SOCKET_LIST[GAME_LIST[i].player_water.id];

                socket_fire.emit('startNewLevel', {start: true, level_id: GAME_LIST[i].level});
                socket_water.emit('startNewLevel', {start: true, level_id: GAME_LIST[i].level});
                //break;
            }
        }
    });

    socket.on('updatePosition', function (data) {
        player.role = data.gRole;
        player.x = data.x;
        player.y = data.y;
        player.velocity_x = data.vel_x;
        player.velocity_y = data.vel_y;
        player.direction_x = data.direction_x;
        //console.log(player);
    });

    socket.on('createGame', function (data) {
        var gameNotFound = true;

        for (var i in GAME_LIST) {
            if (GAME_LIST[i].player_water != null) {
                if (GAME_LIST[i].player_water.id == socket.id) {
                    gameNotFound = false;
                    //console.log("Player has already created a game");
                    socket.emit('infoMessage', { message: 'You have already created a game.', flag: 'gameAlreadyCreated' });
                }
            }
            if (GAME_LIST[i].player_fire != null) {
                if (GAME_LIST[i].player_fire.id == socket.id) {
                    gameNotFound = false;
                    //console.log("Player has already created a game");
                    socket.emit('infoMessage', { message: 'You have already created a game.', flag: 'gameAlreadyCreated' });
                }
            }
        }

        if (gameNotFound) {
            g_id = g_id + 1; // increase game_id

            var game = Game(g_id); // init a new game 
            console.log("Player created the game with code: " + g_id);

            if (data.gRole == "fire") {
                PLAYER_LIST[socket.id].role = "fire";
                game.player_fire = PLAYER_LIST[socket.id];

            }
            else if (data.gRole == "water") {
                PLAYER_LIST[socket.id].role = "water";
                game.player_water = PLAYER_LIST[socket.id];
            }
            else { console.log("Something is really wrong"); }

            GAME_LIST[g_id] = game;

            socket.emit('gameCode', { gameCode: g_id });
        }
    });

    socket.on('joinGame', function (data) {

        var foundGame = false;
        var ownGameJoin = false;
        var gameHasTwoPlayers = false;
        // last two variables are pointless, I should declare variables, where I should store info and
        // in the end I should have just one socket.emit(), which would send all at once

        for (var i in GAME_LIST) {
            //console.log(GAME_LIST[i].running);

            if (GAME_LIST[i].code == data.code) { // if given code is valid

                if (GAME_LIST[i].player_water != null) { // if player water wants to join his own game
                    if (GAME_LIST[i].player_water.id == socket.id) {
                        socket.emit('infoMessage', { message: 'You cannot join your own game.', flag: 'gameAlreadyCreated' });
                        ownGameJoin = true;
                        break;
                    }
                }
                if (GAME_LIST[i].player_fire != null) { // if player fire wants to join his own game
                    if (GAME_LIST[i].player_fire.id == socket.id) {
                        socket.emit('infoMessage', { message: 'You cannot join your own game.', flag: 'gameAlreadyCreated' });
                        ownGameJoin = true;
                        break;
                    }
                }
                
                if (GAME_LIST[i].running == null && !ownGameJoin) {
                    foundGame = true;
                    // second player can join the game
                    console.log("player wants to join game" + GAME_LIST[i].code);

                    if (GAME_LIST[i].player_fire == null) {
                        PLAYER_LIST[socket.id].role = "fire";
                        GAME_LIST[i].player_fire = PLAYER_LIST[socket.id];
                    }
                    else if (data.player_water == null) {
                        PLAYER_LIST[socket.id].role = "water";
                        GAME_LIST[i].player_water = PLAYER_LIST[socket.id];
                    }
                    else { console.log("Player could not join the game."); }

                    GAME_LIST[i].running = true;

                    var socket_fire = SOCKET_LIST[GAME_LIST[i].player_fire.id];
                    var socket_water = SOCKET_LIST[GAME_LIST[i].player_water.id];
                    socket_fire.emit('startMPGame', { startMPGame: true, pRole: "fire", code: GAME_LIST[i].code, level_id: "04" });
                    socket_water.emit('startMPGame', { startMPGame: true, pRole: "water", code: GAME_LIST[i].code, level_id: "04"  });

                    //console.log(GAME_LIST[i]);

                    break;
                }
                else {
                    if(!ownGameJoin){
                        gameHasTwoPlayers = true;

                        socket.emit('startMPGame', { // Game has already two players or it was canceled.
                            startMPGame: false,
                            message: 'Game has already two players or it does not exist.',
                            flag: 'cannotStartMP'
                        });
                    }
                    break;
                }
            }
        }
        if (!foundGame && !ownGameJoin && !gameHasTwoPlayers) { // if game was not found and player did not try to join his own game
            socket.emit('startMPGame', {
                startMPGame: false,
                message: 'Game with this code does not exist :('
            });
        }
    });

});

setInterval(function () {
    for (var i in GAME_LIST) {
        if (GAME_LIST[i].running) {
            
            // Game actively running, I can send info to players connected to game
            var player_fire = GAME_LIST[i].player_fire;
            var player_water = GAME_LIST[i].player_water;

            var pack = []; // this pack contains info about all players in the Game which will be send to every player connected to game

            pack.push(player_fire.pack_player_info());
            pack.push(player_water.pack_player_info());

            //console.log(pack);

            var socket_fire = SOCKET_LIST[GAME_LIST[i].player_fire.id];
            var socket_water = SOCKET_LIST[GAME_LIST[i].player_water.id];

            socket_fire.emit('newPosition', pack);
            socket_water.emit('newPosition', pack);
        }
    }
}, 1000 / 30);
