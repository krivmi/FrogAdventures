const MENU_STATES = {
  SINGLE_PLAYER_MENU: "SINGLE_PLAYER_MENU",
  MULTI_PLAYER_MENU: "MULTI_PLAYER_MENU",
  OPTIONS_MENU: "OPTIONS_MENU",
  PAUSE_MENU: "PAUSE_MENU",
  MULTIPLAYER_PAUSE_MENU: "MULTIPLAYER_PAUSE_MENU",
  START_MENU: "START_MENU",
  IN_GAME_MENU: "IN_GAME_MENU",
  IN_GAME_MULTIPLAYER_MENU: "IN_GAME_MULTIPLAYER_MENU",
  LEVEL_MENU: "LEVEL_MENU",
  LEVEL_END_MENU: "LEVEL_END_MENU",
}
var MENU_FUNCTIONS = {
  retry_game_bool: false,
  resume_game_bool: false,
  return_to_menu_bool: false,
  stop_game_bool: false,
  start_one_PC_game_bool: false,
  start_MP_game_bool: false,
  level_change_bool: false,
  level_change_id: null,
  change_hero_bool: false,
  change_hero: null,
  createMPGame_bool: false,
  joinMPGame_bool: false
}

var ASSETS = {}; 

const MenuManager = function (context, buffer, menu_assets) {

  this.current_state = MENU_STATES.START_MENU;
  this.last_state = MENU_STATES.START_MENU;

  ASSETS = menu_assets;

  this.startMenu = new MenuManager.StartMenu(context, buffer, ASSETS["menu_background"], MENU_STATES.START_MENU);
  this.multiplayerMenu = new MenuManager.MultiplayerMenu(context, buffer, ASSETS["menu_background"], MENU_STATES.MULTI_PLAYER_MENU);
  this.pauseMenu = new MenuManager.PauseMenu(context, buffer, "rgba(200, 103, 55, 0.64)", MENU_STATES.PAUSE_MENU); 
  this.multiplayerPauseMenu = new MenuManager.MultiplayerPauseMenu(context, buffer, "rgba(200, 103, 55, 0.64)", MENU_STATES.MULTIPLAYER_PAUSE_MENU); 
  this.inGameMenu = new MenuManager.InGameMenu(context, buffer, "#ff000080", MENU_STATES.IN_GAME_MENU);
  this.inGameMultiplayerMenu = new MenuManager.InGameMultiplayerMenu(context, buffer, "#ff000080", MENU_STATES.IN_GAME_MULTIPLAYER_MENU);
  this.levelMenu = new MenuManager.LevelMenu(context, buffer, ASSETS["menu_background"], MENU_STATES.LEVEL_MENU);
  this.levelEndMenu = new MenuManager.LevelEndMenu(context, buffer, ASSETS["menu_background"], MENU_STATES.LEVEL_END_MENU);

  this.startMenu.render();
  //this.levelEndMenu.render();
}
MenuManager.prototype = {

  constructor: MenuManager,

  update: function () {

    switch (this.current_state) {
      case MENU_STATES.START_MENU:
        this.render(this.startMenu);

        var state = this.startMenu.update();
        if (state != null) { this.stateToogle(this.startMenu.name, state); }

        break;

      case MENU_STATES.MULTI_PLAYER_MENU:
        this.render(this.multiplayerMenu);

        var state = this.multiplayerMenu.update();
        if (state != null) { this.stateToogle(this.multiplayerMenu.name, state); }

        break;

      case MENU_STATES.PAUSE_MENU:
        this.render(this.pauseMenu);

        var state = this.pauseMenu.update();
        if (state != null) { this.stateToogle(this.pauseMenu.name, state); }

        break;
      case MENU_STATES.MULTIPLAYER_PAUSE_MENU:
        this.render(this.multiplayerPauseMenu);

        var state = this.multiplayerPauseMenu.update();
        if (state != null) { this.stateToogle(this.multiplayerPauseMenu.name, state); }

        break;
      case MENU_STATES.IN_GAME_MENU:
        this.render(this.inGameMenu);

        var state = this.inGameMenu.update();
        if (state != null) { this.stateToogle(this.inGameMenu.name, state); }

        break;
      case MENU_STATES.IN_GAME_MULTIPLAYER_MENU:
        this.render(this.inGameMultiplayerMenu);

        var state = this.inGameMultiplayerMenu.update();
        if (state != null) { this.stateToogle(this.inGameMultiplayerMenu.name, state); }

        break;
      case MENU_STATES.LEVEL_MENU:
        this.render(this.levelMenu);

        var state = this.levelMenu.update();
        if (state != null) { this.stateToogle(this.levelMenu.name, state); }

        break;
      case MENU_STATES.LEVEL_END_MENU:
        this.render(this.levelEndMenu);

        var state = this.levelEndMenu.update();
        if (state != null) { this.stateToogle(this.levelEndMenu.name, state); }

        break;
    }
    //console.log(this.current_state);

  },
  stateToogle(caller, state) {
    //console.log(caller);

    if (state == MENU_STATES.SINGLE_PLAYER_MENU && caller != MENU_STATES.SINGLE_PLAYER_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.SINGLE_PLAYER_MENU;
    }
    else if (state == MENU_STATES.PAUSE_MENU && caller != MENU_STATES.PAUSE_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.PAUSE_MENU;
    }
    else if (state == MENU_STATES.MULTIPLAYER_PAUSE_MENU && caller != MENU_STATES.MULTIPLAYER_PAUSE_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.MULTIPLAYER_PAUSE_MENU;
    }
    else if (state == MENU_STATES.MULTI_PLAYER_MENU && caller != MENU_STATES.MULTI_PLAYER_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.MULTI_PLAYER_MENU;
    }
    else if (state == MENU_STATES.START_MENU && caller != MENU_STATES.START_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.START_MENU;
    }
    else if (state == MENU_STATES.IN_GAME_MENU && caller != MENU_STATES.IN_GAME_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.IN_GAME_MENU;
    }
    else if (state == MENU_STATES.IN_GAME_MULTIPLAYER_MENU && caller != MENU_STATES.IN_GAME_MULTIPLAYER_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.IN_GAME_MULTIPLAYER_MENU;
    }
    else if (state == MENU_STATES.LEVEL_MENU && caller != MENU_STATES.LEVEL_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.LEVEL_MENU;
    }
    else if (state == MENU_STATES.LEVEL_END_MENU && caller != MENU_STATES.LEVEL_END_MENU) {
      this.last_state = this.current_state;
      this.current_state = MENU_STATES.LEVEL_END_MENU;
    }

  },
  resize: function (tile_size, game_width, game_height) {

    this.startMenu.resize(tile_size, game_width, game_height);
    this.multiplayerMenu.resize(tile_size, game_width, game_height);
    this.pauseMenu.resize(tile_size, game_width, game_height);
    this.multiplayerPauseMenu.resize(tile_size, game_width, game_height);
    this.inGameMenu.resize(tile_size, game_width, game_height);
    this.inGameMultiplayerMenu.resize(tile_size, game_width, game_height);
    this.levelMenu.resize(tile_size, game_width, game_height);
    this.levelEndMenu.resize(tile_size, game_width, game_height);

  },
  render: function (caller) {
    if (this.last_state != this.current_state) { // render menu if change in state is detected
      caller.render();
      this.last_state = this.current_state;
    }
  }
};
MenuManager.Menu = function (context, buffer, background, name) {
  this.ctx = context;
  this.buffer = buffer;
  this.background = background;
  this.name = name;

  this.buttons = [];
  this.labels = [];
  this.inputs = [];
}
MenuManager.Menu.prototype = {

  constructor: MenuManager,

  drawBackground: function (color) {
    if (color != null) {
      this.buffer.fillStyle = color;
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    }
  },
  drawBackgroundImage: function (image) {
    this.buffer.drawImage(image, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  },
  render: function () {
    for (let i = 0; i < this.buttons.length; i++) {
      document.body.appendChild(this.buttons[i].docElement);
    }

    for (let i = 0; i < this.labels.length; i++) {
      document.body.appendChild(this.labels[i].docElement);
    }

    for (let i = 0; i < this.inputs.length; i++) {
      document.body.appendChild(this.inputs[i].docElement);
    }

    if (typeof (this.background) === 'string') {
      this.drawBackground(this.background);
    }
    else {
      this.drawBackgroundImage(this.background);
    }
  },
  destroy: function () {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].docElement.remove();
    }
    for (let i = 0; i < this.labels.length; i++) {
      this.labels[i].docElement.remove();
    }
    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].docElement.remove();
    }

  },
  resize: function (game_width, game_height) {
    var rectangle = this.ctx.canvas.getBoundingClientRect();

    var width_ratio = rectangle.width / game_width;
    var height_ratio = rectangle.height / game_height;

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].resize(rectangle, width_ratio, height_ratio, game_height);
    }

    for (let i = 0; i < this.labels.length; i++) {
      this.labels[i].resize(rectangle, width_ratio, height_ratio, game_height);
    }

    for (let i = 0; i < this.inputs.length; i++) {
      this.inputs[i].resize(rectangle, width_ratio, height_ratio, game_height);
    }
  },
  update: function () {
    for (let i = 0; i < this.buttons.length; i++) {

      var thatButtonElement = this.buttons[i].docElement;
      var thatButton = this.buttons[i];

      if (thatButtonElement.clicked) { // if the button was pressed to launch some action

        if (thatButton.fc != null) { // function
          thatButtonElement.clicked = false;

          var arg = thatButton.arg;
          thatButton.fc(arg);
        }

        let nextState = thatButtonElement.nextState; // getting different menu state

        if (nextState == MENU_STATES.SINGLE_PLAYER_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.MULTI_PLAYER_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.OPTIONS_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.START_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.PAUSE_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.MULTIPLAYER_PAUSE_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.IN_GAME_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.IN_GAME_MULTIPLAYER_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.LEVEL_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
        if (nextState == MENU_STATES.LEVEL_END_MENU) {
          thatButtonElement.clicked = false;
          this.destroy();
          return nextState;
        }
      }
    }
  }
};

 // START_MENU

MenuManager.StartMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var headingLabel = new MenuManager.Component.Label(10, 30, 300, 50, "An adventurous journey of Firefrog and Waterfrog", 22, "black");
  var singlePlayerButton = new MenuManager.Component.Button(70, 100, 180, 55, "One PC Multiplayer", 17, MENU_STATES.LEVEL_MENU, "black", ASSETS["button_gray"], null, null);
  var multiPlayerButton = new MenuManager.Component.Button(70, 170, 180, 55, "Multiplayer", 17, MENU_STATES.MULTI_PLAYER_MENU, "black", ASSETS["button_gray"], null, null);
  //var optionsButton = new MenuManager.Component.Button(75, 150, 170, 50, "Options", MENU_STATES.OPTIONS_MENU, "black", "#05668D", null, null);

  this.labels.push(headingLabel);
  this.buttons.push(singlePlayerButton);
  this.buttons.push(multiPlayerButton);
  //this.buttons.push(optionsButton);

};

MenuManager.StartMenu.prototype = {
  constructor: MenuManager.StartMenu,
}
Object.assign(MenuManager.StartMenu.prototype, MenuManager.Menu.prototype);

// PAUSE_MENU

MenuManager.PauseMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var retryButton = new MenuManager.Component.Button(70, 50, 180, 55, "Retry", 15, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray"], this.retryGame, null);
  var resumeButton = new MenuManager.Component.Button(70, 120, 180, 55, "Resume", 15, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray"], this.resumeGame, null);
  var startMenuButton = new MenuManager.Component.Button(70, 190, 180, 55, "Menu", 15, MENU_STATES.START_MENU, "black", ASSETS["button_gray"], this.returnToMenu, null);

  this.buttons.push(retryButton);
  this.buttons.push(resumeButton);
  this.buttons.push(startMenuButton);
};

MenuManager.PauseMenu.prototype = {
  constructor: MenuManager.PauseMenu,

  retryGame: function () {
    MENU_FUNCTIONS.retry_game_bool = true;
  },
  resumeGame: function () {
    MENU_FUNCTIONS.resume_game_bool = true;
  },
  returnToMenu: function() {
    MENU_FUNCTIONS.return_to_menu_bool = true;
  }
}
Object.assign(MenuManager.PauseMenu.prototype, MenuManager.Menu.prototype);

// MULTIPLAYER_PAUSE_MENU

MenuManager.MultiplayerPauseMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var retryButton = new MenuManager.Component.Button(70, 50, 180, 55, "Retry", 15, MENU_STATES.IN_GAME_MULTIPLAYER_MENU, "black", ASSETS["button_gray"], this.retryGame, null);
  var resumeButton = new MenuManager.Component.Button(70, 120, 180, 55, "Resume", 15, MENU_STATES.IN_GAME_MULTIPLAYER_MENU, "black", ASSETS["button_gray"], this.resumeGame, null);
  var startMenuButton = new MenuManager.Component.Button(70, 190, 180, 55, "Menu", 15, MENU_STATES.START_MENU, "black", ASSETS["button_gray"], this.returnToMenu, null);

  this.buttons.push(retryButton);
  this.buttons.push(resumeButton);
  this.buttons.push(startMenuButton);
};

MenuManager.MultiplayerPauseMenu.prototype = {
  constructor: MenuManager.MultiplayerPauseMenu,

  retryGame: function () {
    MENU_FUNCTIONS.retry_game_bool = true;
  },
  resumeGame: function () {
    MENU_FUNCTIONS.resume_game_bool = true;
  },
  returnToMenu: function() {
    MENU_FUNCTIONS.return_to_menu_bool = true;
  }
}
Object.assign(MenuManager.MultiplayerPauseMenu.prototype, MenuManager.Menu.prototype);

// MULTIPLAYER_MENU

MenuManager.MultiplayerMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var fireButton = new MenuManager.Component.Button(50, 10, 80, 80, "", 15, null, "black", ASSETS["fire_jump"], this.selectHero, "fire");
  var waterButton = new MenuManager.Component.Button(180, 10, 80, 80, "", 15, null, "black", ASSETS["water_jump"], this.selectHero, "water");

  var heroLabel = new MenuManager.Component.Label(10, 100, 120, 60, "To create a game, choose a hero, tap 'create game' and share generated code", 15, "black");
  var joinLabel = new MenuManager.Component.Label(10, 210, 120, 60, "To join the game, enter your friend's code...", 15, "black");
  var codeLabel = new MenuManager.Component.Label(160, 150, 130, 40, "Code: ", 15, "black");
  var errorLabel = new MenuManager.Component.Label(160, 170, 130, 40, "", 13, "red", null);

  // I should add something like waiting Menu
  var createSessionButton = new MenuManager.Component.Button(160, 105, 130, 40, "Create game", 15, null, "black", ASSETS["button_gray"], this.createMPGame, null);
  var joinSessionButton = new MenuManager.Component.Button(160, 240, 130, 30, "Join game", 15, null, "black", ASSETS["button_gray_short_2"], this.joinMPGame, null);
  var startMenuButton = new MenuManager.Component.Button(70, 280, 170, 35, "Menu", 15, MENU_STATES.START_MENU, "black", ASSETS['button_gray_long'], null, null);

  var codeInput = new MenuManager.Component.Input(160, 215, 130, 20, "Code...", 15, "black");

  codeInput.docElement.style.border = "3px solid black";

  codeLabel.docElement.style.textAlign = "left";
  errorLabel.docElement.style.textAlign = "left";

  fireButton.docElement.style.imageRendering = "pixelated";
  waterButton.docElement.style.imageRendering = "pixelated";
  
  this.buttons.push(fireButton);
  this.buttons.push(waterButton);
  this.buttons.push(createSessionButton);
  this.buttons.push(joinSessionButton);
  this.buttons.push(startMenuButton);

  this.labels.push(heroLabel);
  this.labels.push(joinLabel);
  this.labels.push(codeLabel);
  this.labels.push(errorLabel);

  this.inputs.push(codeInput);

};

MenuManager.MultiplayerMenu.prototype = {
  constructor: MenuManager.MultiplayerMenu,
  startMP: function (level) {
    MENU_FUNCTIONS.level_change_id = level;
    MENU_FUNCTIONS.start_MP_game_bool = true;
    MENU_FUNCTIONS.level_change_bool = true;
  },
  selectHero: function(hero){
    MENU_FUNCTIONS.change_hero = hero;
    MENU_FUNCTIONS.change_hero_bool = true;
  },
  createMPGame: function(){
    MENU_FUNCTIONS.createMPGame_bool = true;
  },
  joinMPGame: function(){
    MENU_FUNCTIONS.joinMPGame_bool = true;
  }

}

Object.assign(MenuManager.MultiplayerMenu.prototype, MenuManager.Menu.prototype);

// IN_GAME_MENU

MenuManager.InGameMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var timeLabel = new MenuManager.Component.Label(-38, 5, 150, 50, "Time: 00:00", 12, "black", null, null);
  var diamondsLabel = new MenuManager.Component.Label(30, 5, 150, 50, "Diamonds: 0", 12, "black", null, null);
  var stopButton = new MenuManager.Component.Button(275, 3, 40, 30, "Stop", 12, MENU_STATES.PAUSE_MENU, "black", ASSETS["button_gray_short"], this.stopGame, null);

  this.labels.push(timeLabel);
  this.labels.push(diamondsLabel);
  this.buttons.push(stopButton);

};

MenuManager.InGameMenu.prototype = {
  constructor: MenuManager.InGameMenu,
  timerManage: function (seconds, minutes) {
    var text = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

    this.labels[0].text = text;
    this.labels[0].docElement.innerHTML = text;
  },
  stopGame: function () {
    MENU_FUNCTIONS.stop_game_bool = true;
  },
  updateScore: function (score) {
    this.labels[1].docElement.innerHTML = "Diamonds: " + score;
  }
}

Object.assign(MenuManager.InGameMenu.prototype, MenuManager.Menu.prototype);

// IN_GAME_MULTIPLAYER_MENU

MenuManager.InGameMultiplayerMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var timeLabel = new MenuManager.Component.Label(-38, 5, 150, 50, "Time: 00:00", 12, "black", null, null);
  var diamondsLabel = new MenuManager.Component.Label(30, 5, 150, 50, "Diamonds: 0", 12, "black", null, null);
  var stopButton = new MenuManager.Component.Button(275, 3, 40, 30, "Stop", 12, MENU_STATES.MULTIPLAYER_PAUSE_MENU, "black", ASSETS["button_gray_short"], this.stopGame, null);

  this.labels.push(timeLabel);
  this.labels.push(diamondsLabel);
  this.buttons.push(stopButton);

};

MenuManager.InGameMultiplayerMenu.prototype = {
  constructor: MenuManager.InGameMultiplayerMenu,
  timerManage: function (seconds, minutes) {
    var text = minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");

    this.labels[0].text = text;
    this.labels[0].docElement.innerHTML = text;
  },
  stopGame: function () {
    MENU_FUNCTIONS.stop_game_bool = true;
  },
  updateScore: function (score) {
    this.labels[1].docElement.innerHTML = "Diamonds: " + score;
  }
}

Object.assign(MenuManager.InGameMultiplayerMenu.prototype, MenuManager.Menu.prototype);

//LEVEL_MENU

MenuManager.LevelMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var heading = new MenuManager.Component.Label(133, 30, 40, 30, "Levels", 17, "black", null);

  var level_01 = new MenuManager.Component.Button(20, 80, 40, 30, "1", 12, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray_short"], this.change_level, "01"); // "#606060"
  var level_02 = new MenuManager.Component.Button(80, 80, 40, 30, "2", 12, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray_short"], this.change_level, "02");
  var level_03 = new MenuManager.Component.Button(140, 80, 40, 30, "3", 12, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray_short"], this.change_level, "03");
  var level_04 = new MenuManager.Component.Button(200, 80, 40, 30, "4", 12, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray_short"], this.change_level, "04");
  var level_05 = new MenuManager.Component.Button(260, 80, 40, 30, "5", 12, MENU_STATES.IN_GAME_MENU, "black", ASSETS["button_gray_short"], this.change_level, "05");

  var startMenuButton = new MenuManager.Component.Button(115, 260, 100, 30, "Menu", 15, MENU_STATES.START_MENU, "black", ASSETS["button_gray"], null, null);

  this.labels.push(heading);
  this.buttons.push(level_01);
  this.buttons.push(level_02);
  this.buttons.push(level_03);
  this.buttons.push(level_04);
  this.buttons.push(level_05);
  this.buttons.push(startMenuButton);
};

MenuManager.LevelMenu.prototype = {
  constructor: MenuManager.LevelMenu,
  change_level: function (level) {

    MENU_FUNCTIONS.level_change_id = level;
    MENU_FUNCTIONS.start_one_PC_game_bool = true;
    MENU_FUNCTIONS.level_change_bool = true;
  }
}

Object.assign(MenuManager.LevelMenu.prototype, MenuManager.Menu.prototype);

// LEVEL_END_MENU

MenuManager.LevelEndMenu = function (context, buffer, background, name) {

  MenuManager.Menu.call(this, context, buffer, background, name);

  var headingLabel = new MenuManager.Component.Label(10, 30, 300, 50, "Congratulations, you have finished all multiplayer levels!", 22, "black");
  var menuButton = new MenuManager.Component.Button(70, 250, 180, 55, "Back to menu", 17, MENU_STATES.START_MENU, "black", ASSETS["button_gray"], this.returnToMenu, null);

  this.labels.push(headingLabel);
  this.buttons.push(menuButton);
};

MenuManager.LevelEndMenu.prototype = {
  constructor: MenuManager.LevelEndMenu,

  returnToMenu: function() {
    MENU_FUNCTIONS.return_to_menu_bool = true;
  }
}
Object.assign(MenuManager.LevelEndMenu.prototype, MenuManager.Menu.prototype);

// Component

MenuManager.Component = function (x, y, width, height, text, font_size, text_color, back_color) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.text = text;
  this.font_size = font_size;
  this.text_color = text_color;
  this.back_color = back_color;
};

MenuManager.Component.prototype = {
  constructor: MenuManager.Component,

  resize: function (rectangle, width_ratio, height_ratio, game_height) {
    this.docElement.style.left = rectangle.left + this.x * width_ratio + "px";
    this.docElement.style.top = rectangle.top + this.y * height_ratio + "px";

    this.docElement.style.width = this.width * width_ratio + "px";
    this.docElement.style.height = this.height * height_ratio + "px";

    this.docElement.style.fontSize = this.font_size * rectangle.height / game_height + "px";
  }
}

// BUTTON

MenuManager.Component.Button = function (x, y, width, height, text, font_size, nextState, textColor, backColor, fc, arg) {

  MenuManager.Component.call(this, x, y, width, height, text, font_size, textColor, backColor);
  
  var b = document.createElement("button");

  this.next_state = nextState;
  this.clicked = false;
  this.fc = fc;
  this.arg = arg;

  if (typeof(backColor) === "string") {
    b.style.backgroundColor = backColor;
  }
  else {
    b.style.background = "none";
    b.style.border = "none";
    b.style.backgroundImage = "url('" + backColor.src + "')";
    b.style.backgroundSize = "cover";
  }

  b.style.position = "fixed";
  b.style.color = textColor;
  b.style.width = width + "px";
  b.style.height = height + "px";
  b.style.font_size = font_size + "px";
  b.style.cursor = "pointer";

  b.innerHTML = text;
  b.addEventListener('click', this.click, false);
  b.addEventListener('mouseover', this.mouse_over, false);
  b.addEventListener('mouseout', this.mouse_out, false);
  b.nextState = nextState;
  b.clicked = false;

  this.docElement = b;
};

MenuManager.Component.Button.prototype = {
  constructor: MenuManager.Component.Button,

  click: function (e) {
    //console.log(e.currentTarget.nextState);
    e.currentTarget.style.color = "black";
    e.currentTarget.clicked = true;
  },
  mouse_over: function (e) {
    e.currentTarget.style.color = "white";
  },
  mouse_out: function (e) {
    e.currentTarget.style.color = "black";
  }
}
Object.assign(MenuManager.Component.Button.prototype, MenuManager.Component.prototype);

// LABEL

MenuManager.Component.Label = function (x, y, width, height, text, font_size, textColor, backColor) {

  MenuManager.Component.call(this, x, y, width, height, text, font_size, textColor, backColor);

  var p = document.createElement("p");

  p.style.position = "fixed";
  p.style.backgroundColor = backColor;
  p.style.color = textColor;
  p.style.width = width + "px";
  p.style.height = height + "px";
  p.style.font_size = font_size + "px";
  p.style.textAlign = "center";

  p.innerHTML = text;
  this.docElement = p;
};

MenuManager.Component.Label.prototype = {
  constructor: MenuManager.Component.Label,
}
Object.assign(MenuManager.Component.Label.prototype, MenuManager.Component.prototype);

// INPUT

MenuManager.Component.Input = function (x, y, width, height, text, font_size, textColor, backColor) {

  MenuManager.Component.call(this, x, y, width, height, text, font_size, textColor, backColor);

  var i = document.createElement("input");

  i.style.position = "fixed";
  i.style.backgroundColor = backColor;
  i.style.color = textColor;
  i.style.width = width + "px";
  i.style.height = height + "px";
  i.style.font_size = font_size + "px";
  i.style.textAlign = "center";

  i.innerHTML = text;
  this.docElement = i;
};

MenuManager.Component.Input.prototype = {
  constructor: MenuManager.Component.Input,
}
Object.assign(MenuManager.Component.Input.prototype, MenuManager.Component.prototype);

