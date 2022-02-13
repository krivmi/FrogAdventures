const Game = function () {
  this.world = new Game.World();

  this.update = function () {
    this.world.update();
  };
};

Game.World = function (friction = 0.85, gravity = 1.8) {

  this.collider = new Game.World.Collider(); 

  this.friction = friction;
  this.gravity = gravity;
  
  this.columns = 10;
  this.rows = 10;

  this.tile_size = 32;
  this.tile_set = new Game.World.TileSet(15, this.tile_size); 
  // In tileset I need just columns since it is 1D Array

  this.player_fire_set = new Game.World.TileSet(12, this.tile_size);
  this.player_water_set = new Game.World.TileSet(12, this.tile_size);

  this.zone_id = "01"; // The current zone
  this.newLevel = false;
  this.restartLevel = false;

  this.door_blue = undefined;
  this.door_red = undefined;
  this.diamonds = []; 
  this.diamond_count = 0; // the number of diamonds players have

  this.height = this.tile_size * this.rows;
  this.width = this.tile_size * this.columns;

};

Game.World.prototype = {
  constructor: Game.World,

  collideObject: function (object) {

    if (object.x < 0) { object.x = 0; object.velocity_x = 0; }
    else if (object.x + object.width > this.width) { object.x = this.width - object.width; object.velocity_x = 0; }
    if (object.y < 0) { object.y = 0; object.velocity_y = 0; }
    else if (object.y + object.height > this.height) { object.jumping = false; object.y = this.height - object.height; object.velocity_y = 0; }

    var bottom, left, right, top, value;

    top = Math.floor(object.getTop() / this.tile_size);
    left = Math.floor(object.getLeft() / this.tile_size);
    value = this.collision_map[top * this.columns + left];
    this.collider.collide(value, object, left * this.tile_size, top * this.tile_size, this.tile_size);

    top = Math.floor(object.getTop() / this.tile_size);
    right = Math.floor(object.getRight() / this.tile_size);
    value = this.collision_map[top * this.columns + right];
    this.collider.collide(value, object, right * this.tile_size, top * this.tile_size, this.tile_size);

    bottom = Math.floor(object.getBottom() / this.tile_size);
    left = Math.floor(object.getLeft() / this.tile_size);
    value = this.collision_map[bottom * this.columns + left];
    this.collider.collide(value, object, left * this.tile_size, bottom * this.tile_size, this.tile_size);


    bottom = Math.floor(object.getBottom() / this.tile_size);
    right = Math.floor(object.getRight() / this.tile_size);
    value = this.collision_map[bottom * this.columns + right];
    this.collider.collide(value, object, right * this.tile_size, bottom * this.tile_size, this.tile_size);
  },
  setCollisions: function(g_map){
    result = [];

    for(var i = 0; i < g_map.length; i++){
      switch(g_map[i] - 1){
        // No collision
        case 0: case 7: case 15:case 22: case 43:case 51:
        case 55: case 56: case 57: case 58: case 59: case 62:
        case 63: case 66: case 71: case 72: case 73: case 74:
        case 77: case 78: case 81: case 86:case 87: case 88: 
        case 89:case 92:
          result[i] = 0;
          break;
        // All sides collision
        case 1: case 4: case 8: case 12: case 13: case 14:
        case 19:case 21:case 24: case 30:case 34: case 36:
        case 37: case 39: case 41: case 42:case 44:case 45:
        case 47: case 49:case 52: case 54:case 60: case 67: 
        case 69: case 75: case 79: case 82: case 93:
        case 96:case 99: case 100:
          result[i] = 15;
          break;
        // top_left collision
        case 2: case 9:case 40:case 55: case 65: case 80:
        case 91: case 98:
          result[i] = 9;
          break;        
        // top collision
        case 5: case 20:case 26: case 27: case 28: case 29:
        case 31:case 35:case 38:case 46:case 50: case 53: 
        case 61:case 68: case 76: case 83:
          result[i] = 1;
          break;
        // top_right collision
        case 6:case 10:case 11:case 17:case 32: case 70:
        case 85: case 95:
          result[i] = 3;
          break;
        // slope_left collision
        case 16:case 23:case 25: case 94:
          result[i] = 24;
          break;
        // slope_right collision
        case 64: case 84: case 90: case 97:
          result[i] = 25;
          break;
        // water collision
        case 3:case 18:
          result[i] = 34;
          break;
        // fire collision
        case 33:case 48:
          result[i] = 35;
          break;
        default:
          result[i] = 0;
      }
    }
    return result;

  },
  setup: function (zone) {
    this.graphical_map = zone.graphical_map;
    this.collision_map = this.setCollisions(zone.graphical_map);
    this.rows = zone.rows;
    this.columns = zone.columns;
    this.zone_id = zone.id;
    this.doors = new Array();
    this.diamonds = new Array();
    this.diamond_count = 0;
    this.starting_positions = new Array();

    this.height = this.tile_size * this.rows;
    this.width = this.tile_size * this.columns;

    // Players
    for (let index = zone.starting_positions.length - 1; index > -1; --index) {
      let pos = zone.starting_positions[index];

      if (pos.player == "water") this.player_water = new Game.World.Object.Player(pos.x, pos.y, "water");
      else this.player_fire = new Game.World.Object.Player(pos.x, pos.y, "fire");
    }
    // Doors
    for(let index = 0; index < this.graphical_map.length; index++){
      if(this.graphical_map[index] == 72){ // Blue door
        var d_x = (index % this.columns) * this.tile_size;
        var d_y = Math.floor(index / this.columns) * this.tile_size;

        let door = {x:d_x, y:d_y, width:this.tile_size, height:this.tile_size, color:"blue"};
         
        this.door_blue = new Game.World.Object.Door(door);
      }
      if(this.graphical_map[index] == 73){ // Red door
        var d_x = (index % this.columns) * this.tile_size;
        var d_y = Math.floor(index / this.columns) * this.tile_size;

        let door = {x:d_x, y:d_y, width:this.tile_size, height:this.tile_size, color:"red"};
         
        this.door_red = new Game.World.Object.Door(door);
      }
      // Diamonds
      if(this.graphical_map[index] == 87){ // Blue diamond
        var d_x = (index % this.columns) * this.tile_size;
        var d_y = Math.floor(index / this.columns) * this.tile_size;

        let diamond = {x:d_x, y:d_y, color:"blue"};
         
        this.diamonds.push(new Game.World.Object.Diamond(diamond));
        this.graphical_map[index] = 0;
      }
      if(this.graphical_map[index] == 88){ // Red diamond
        var d_x = (index % this.columns) * this.tile_size;
        var d_y = Math.floor(index / this.columns) * this.tile_size;

        let diamond = {x:d_x, y:d_y, color:"red"};
         
        this.diamonds.push(new Game.World.Object.Diamond(diamond));
        this.graphical_map[index] = 0;
      }
    }

  },

  update: function () {
    this.player_water.updatePosition(this.gravity, this.friction);
    this.player_fire.updatePosition(this.gravity, this.friction);

    this.collideObject(this.player_water);
    this.collideObject(this.player_fire);

    var fire_ok = false;
    var water_ok = false;

    if (this.door_red.collideObject(this.player_fire)) {
      fire_ok = true;
    }
    if (this.door_blue.collideObject(this.player_water)) {
      water_ok = true;
    }

    if (fire_ok && water_ok) {
      //console.log("endGame, success"); // Frogs are home
      this.newLevel = true;
    }

    // Diamonds
    for (let index = this.diamonds.length - 1; index > -1; --index) {

      let diamond = this.diamonds[index];

      if (diamond.color == "red") {
        if (diamond.collideObjectOnTouch(this.player_fire)) {

          this.diamonds.splice(this.diamonds.indexOf(diamond), 1);
          this.diamond_count++;
        }
      }
      else if (diamond.color == "blue") {
        if (diamond.collideObjectOnTouch(this.player_water)) {
          this.diamonds.splice(this.diamonds.indexOf(diamond), 1);
          this.diamond_count++;
        }
      }
      diamond.updatePosition();
      diamond.animate();
    }

    
    if ((!this.player_water.alive || !this.player_fire.alive) && (this.player_fire.final_sip || this.player_water.final_sip)) {
      // Alive - Game over, load the same level
      this.restartLevel = true;
    }

    this.player_water.updateAnimation();
    this.player_fire.updateAnimation();
  },
  /*
  writeToLocalStorage(){
    var storage = window.localStorage;

    var win_array = {"level": this.zone_id, "diamonds": this.diamond_count};
  }*/
}
Game.World.Collider = function () {
  this.collide = function (value, object, tile_x, tile_y, tile_size) {

    switch (value) { // Platform Collision
      case 1: this.collidePlatformTop(object, tile_y); break;
      case 2: this.collidePlatformRight(object, tile_x + tile_size); break;
      case 3: if (this.collidePlatformTop(object, tile_y)) return;
        this.collidePlatformRight(object, tile_x + tile_size); break;
      case 4: this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 5: if (this.collidePlatformTop(object, tile_y)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 6: if (this.collidePlatformRight(object, tile_x + tile_size)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 7: if (this.collidePlatformTop(object, tile_y)) return;
        if (this.collidePlatformRight(object, tile_x + tile_size)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 8: this.collidePlatformLeft(object, tile_x); break;
      case 9: if (this.collidePlatformTop(object, tile_y)) return;
        this.collidePlatformLeft(object, tile_x); break;
      case 10: if (this.collidePlatformLeft(object, tile_x)) return;
        this.collidePlatformRight(object, tile_x + tile_size); break;
      case 11: if (this.collidePlatformTop(object, tile_y)) return;
        if (this.collidePlatformLeft(object, tile_x)) return;
        this.collidePlatformRight(object, tile_x + tile_size); break;
      case 12: if (this.collidePlatformLeft(object, tile_x)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 13: if (this.collidePlatformTop(object, tile_y)) return;
        if (this.collidePlatformLeft(object, tile_x)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 14: if (this.collidePlatformLeft(object, tile_x)) return;
        if (this.collidePlatformRight(object, tile_x)) return; 
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      case 15: if (this.collidePlatformTop(object, tile_y)) return;
        if (this.collidePlatformLeft(object, tile_x)) return;
        if (this.collidePlatformRight(object, tile_x + tile_size)) return;
        this.collidePlatformBottom(object, tile_y + tile_size); break;
      // Slope Collision
      case 24: if (this.collideSlopeRight(object, tile_x, tile_y, tile_size)) return;
        if (this.collideRightSlopeTop(object, tile_x, tile_y, tile_size)) return;
        this.collideSlopeBottom(object, tile_x, tile_y + tile_size, tile_size); break;
      case 25: if (this.collideSlopeLeft(object, tile_x, tile_y, tile_size)) return;
        if (this.collideLeftSlopeTop(object, tile_x, tile_y, tile_size)) return;
        this.collideSlopeBottom(object, tile_x, tile_y + tile_size, tile_size); break;
      // Element Collision
      case 34: if (this.collideWaterElementTop(object, tile_y + 15)) return; // Water steps onto top
      case 35: if (this.collideFireElementTop(object, tile_y + 15)) return; // Fire steps onto top

    }
  }
}
Game.World.Collider.prototype = {
  constructor: Game.World.Collider,

  collideFireElementTop: function (object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      if (object.identity == "fire") {
        object.setBottom(tile_top);
        object.velocity_y = 0;
        object.jumping = false;
        return true;
      }
      else {
        object.alive = false;
      }

    } return false;

  },
  collideWaterElementTop: function (object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      if (object.identity == "water") {
        object.setBottom(tile_top);
        object.velocity_y = 0;
        object.jumping = false;
        return true;
      }
      else {
        object.alive = false;
      }
      //console.log("collision under player, Player bottom: ", object.getBottom(), " Tile's top: ",tile_top)

    } return false;

  },

  collideSlopeBottom: function (object, tile_left, tile_bottom, tile_size) {
    var centerX = object.getCenterX();
    var centerTileX = tile_left + tile_size / 2;
    var distFromMiddle = Math.abs(centerX - centerTileX); // aby nedochazelo k záseku hráče  

    if (object.getTop() - 2 < tile_bottom && object.getOldTop() >= tile_bottom && distFromMiddle < 23) {

      object.setTop(tile_bottom);
      object.velocity_y = 0;
      return true;

    } return false;

  },

  collideSlopeRight(object, slope_left, slope_top, tile_size) {

    if (object.getBottom() >= slope_top && object.getBottom() <= slope_top + 2 /*this 2 number necessary*/) {
      // top slope access 
      return false;
    }

    if (object.getLeft() < slope_left + tile_size && object.getOldLeft() >= slope_left + tile_size) { // collision (slope to left, player to right)
      object.setLeft(slope_left + tile_size);
      object.velocity_x = 0;
      return true;

    } return false;
  },
  collideSlopeLeft(object, slope_left, slope_top, tile_size) {
    //var distIntoTileX = object.getLeft() - slope_left;
    //var distIntoTileY = tile_size - distIntoTileX;

    if (object.getBottom() >= slope_top && object.getBottom() <= slope_top + 2 /*this 2 number necessary*/) {
      // top slope access  
      return false;
    }

    if (object.getRight() > slope_left && object.getOldRight() <= slope_left) { // collision (player to left, slope to right)
      object.setRight(slope_left - 0.01);
      object.velocity_x = 0;
      return true;

    } return false;
  },

  collideRightSlopeTop(object, slope_left, slope_top, tile_size) {
    var distIntoTileX = object.getRight() - slope_left;
    var distIntoTileY = tile_size - distIntoTileX;

    if (distIntoTileX > tile_size) {
      distIntoTileY *= -1;
    }

    if (object.getOldBottom() > object.getBottom()) { // if object jump from bottom 
      return false;
    }

    if (distIntoTileX > tile_size) { // if object is on top
      object.velocity_y = 0;
      object.setBottom(slope_top - 1);
      object.jumping = false; // permission to jump on slope
      return true;
    }
    if (object.getBottom() >= slope_top + distIntoTileY) {
      //console.log("Object is in the right slope"); 
      object.velocity_y = 0;
      object.velocity_x += -0.1;
      object.setBottom(slope_top + distIntoTileY);
      object.jumping = false; // permission to jump on slope
      return true;
    }
    return false;
  },

  collideLeftSlopeTop(object, slope_left, slope_top, tile_size) {
    var distIntoTileX = (slope_left + tile_size) - object.getLeft();
    var distIntoTileY = tile_size - distIntoTileX;

    //if (distIntoTileX < tile_size) {
    //distIntoTileY *= -1;
    //}

    if (object.getOldBottom() > object.getBottom()) { // if object jump from bottom 
      return false;
    }

    if (distIntoTileX > tile_size) { // if object is on top
      object.velocity_y = 0;
      object.setBottom(slope_top - 1);
      object.jumping = false; // permission to jump on slope
      return true;
    }
    if (object.getBottom() >= slope_top + distIntoTileY) {
      //console.log("Object is in the left slope"); 
      object.velocity_y = 0;
      object.velocity_x += 0.1;
      object.setBottom(slope_top + distIntoTileY);
      object.jumping = false; // permission to jump on slope
      return true;
    }
    return false;
  },

  collidePlatformBottom: function (object, tile_bottom) {

    /* If the top of the object is above the bottom of the tile and on the previous
    frame the top of the object was below the bottom of the tile, we have entered into
    this tile. Pretty simple stuff. */
    if (object.getTop() < tile_bottom && object.getOldTop() >= tile_bottom) {

      object.setTop(tile_bottom);// Move the top of the object to the bottom of the tile.
      object.velocity_y = 0;     // Stop moving in that direction.
      return true;               // Return true because there was a collision.
    } 
    return false;              // Return false if there was no collision.

  },

  collidePlatformLeft: function (object, tile_left) {

    if (object.getRight() > tile_left && object.getOldRight() <= tile_left) {
      //console.log("collision right of player, Player right: ", object.getRight(), " Tile's left: ",tile_left)

      object.setRight(tile_left - 0.01);
      object.velocity_x = 0;
      return true;
    } 
    return false;

  },

  collidePlatformRight: function (object, tile_right) {

    if (object.getLeft() < tile_right && object.getOldLeft() >= tile_right) {
      object.setLeft(tile_right);
      object.velocity_x = 0;
      return true;
    } 

    return false;
  },

  collidePlatformTop: function (object, tile_top) {

    if (object.getBottom() > tile_top && object.getOldBottom() <= tile_top) {
      //console.log("collision under player, Player bottom: ", object.getBottom(), " Tile's top: ",tile_top)
      object.setBottom(tile_top - 0.01);
      object.velocity_y = 0;
      object.jumping = false;
      return true;
    } 
    return false;
  }
};

Game.World.Object = function (x, y, width, height) {
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;
};
Game.World.Object.prototype = {

  /* Tests for collision between this door object and a MovingObject */
  collideObject: function (object) {

    if (object.getLeft() > this.getLeft() &&
      object.getRight() < this.getRight() &&
      object.getTop() > this.getTop() &&
      object.getBottom() < this.getBottom()) {
      return true;
    }
    return false;
  },
  collideObjectOnTouch: function (object) {

    if (object.getLeft() < this.getRight() &&
      object.getRight() > this.getLeft() &&
      object.getTop() < this.getBottom() &&
      object.getBottom() > this.getTop()) {
      return true;
    }
    return false;
  },

  /* Does rectangular collision detection with the center of the object */
  collideObjectCenter: function (object) {

    let center_x = object.getCenterX();
    let center_y = object.getCenterY();

    if (center_x < this.getLeft() || center_x > this.getRight() ||
      center_y < this.getTop() || center_y > this.getBottom()) return false;

    return true;

  },

  getBottom: function () { return this.y + this.height; },
  getCenterX: function () { return this.x + this.width * 0.5; },
  getCenterY: function () { return this.y + this.height * 0.5; },
  getLeft: function () { return this.x; },
  getRight: function () { return this.x + this.width; },
  getTop: function () { return this.y; },
  setBottom: function (y) { this.y = y - this.height; },
  setCenterX: function (x) { this.x = x - this.width * 0.5; },
  setCenterY: function (y) { this.y = y - this.height * 0.5; },
  setLeft: function (x) { this.x = x; },
  setRight: function (x) { this.x = x - this.width; },
  setTop: function (y) { this.y = y; }

};

Game.World.MovingObject = function (x, y, width, height, velocity_max = 16) {

  Game.World.Object.call(this, x, y, width, height);

  this.jumping = false;
  this.velocity_max = velocity_max; // added velocity_max so velocity can't go past 16
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.x_old = x;
  this.y_old = y;

};

Game.World.MovingObject.prototype = {

  getOldBottom: function () { return this.y_old + this.height; },
  getOldCenterX: function () { return this.x_old + this.width * 0.5; },
  getOldCenterY: function () { return this.y_old + this.height * 0.5; },
  getOldLeft: function () { return this.x_old; },
  getOldRight: function () { return this.x_old + this.width; },
  getOldTop: function () { return this.y_old; },
  setOldBottom: function (y) { this.y_old = y - this.height; },
  setOldCenterX: function (x) { this.x_old = x - this.width * 0.5; },
  setOldCenterY: function (y) { this.y_old = y - this.height * 0.5; },
  setOldLeft: function (x) { this.x_old = x; },
  setOldRight: function (x) { this.x_old = x - this.width; },
  setOldTop: function (y) { this.y_old = y; }

};
Object.assign(Game.World.MovingObject.prototype, Game.World.Object.prototype);
Game.World.MovingObject.prototype.constructor = Game.World.MovingObject;

/* --------------------------------------- DOOR --------------------------------------------- */
Game.World.Object.Door = function (door) { // Constructor for door

  Game.World.Object.call(this, door.x, door.y, door.width, door.height);

  this.color = door.color;
};
Game.World.Object.Door.prototype = {};
Object.assign(Game.World.Object.Door.prototype, Game.World.Object.prototype);
/* --------------------------------------- END OF DOOR --------------------------------------------- */

Game.World.Object.Animator = function (frame_set, delay, mode = "loop") {
  this.count = 0;
  this.delay = (delay >= 1) ? delay : 1;
  this.frame_set = frame_set;
  this.frame_index = 0;
  this.frame_value = frame_set[0];
  this.mode = mode;
  this.end = false;
};
Game.World.Object.Animator.prototype = {
  constructor: Game.World.Object.Animator,

  animate: function () {
    switch (this.mode) {
      case "loop": this.loop(); break;
      case "pause": break;
      case "loop_once": this.loopOnce();
    }
  },

  changeFrameSet(frame_set, mode, delay = 10, frame_index = 0) {
    if (this.frame_set === frame_set) { return; }

    this.count = 0;
    this.delay = delay;
    this.frame_set = frame_set;
    this.frame_index = frame_index;
    this.frame_value = frame_set[frame_index];
    this.mode = mode;
  },

  loop: function () {
    this.count++;

    while (this.count > this.delay) {
      this.count -= this.delay;
      this.frame_index = (this.frame_index < this.frame_set.length - 1) ? this.frame_index + 1 : 0;
      this.frame_value = this.frame_set[this.frame_index];
    }
  },
  loopOnce: function () {
    this.count++;

    while (this.count > this.delay) {
      this.count -= this.delay;

      if (this.frame_index < this.frame_set.length - 1) {
        this.frame_index = this.frame_index + 1;
      }
      else {
        this.frame_set.length - 1;
        this.final_sip = true;
      }
      this.frame_value = this.frame_set[this.frame_index];
    }
  }
};

Game.World.Object.Player = function (x, y, identity) {
  Game.World.MovingObject.call(this, x, y, 15, 20);
  Game.World.Object.Animator.call(this, Game.World.Object.Player.prototype.frame_sets["idle-left"], 10);

  this.identity = identity;
  this.alive = true;
  this.final_sip = false;
  this.jumping = true;
  this.direction_x = -1;
  this.velocity_x = 0;
  this.velocity_y = 0;
};

Game.World.Object.Player.prototype = {

  frame_sets: {
    "move-right": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "move-left": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    "idle-left": [12],
    "idle-right": [11],
    "jump-left": [24],
    "jump-right": [25],
    "hit": [28, 29, 30, 31, 32, 33]
  },

  jump: function () {

    if (!this.jumping) {
      this.jumping = true;
      this.velocity_y -= 30;      
    }
  },

  moveLeft: function () {
    this.direction_x = -1; // Make sure to set the player's direction.
    this.velocity_x -= 0.55;
  },
  moveRight: function () {
    this.direction_x = 1;
    this.velocity_x += 0.55;
  },

  updateAnimation: function () { // animation changes regarding to player speed and velocity

    if (!this.alive) {
      this.changeFrameSet(this.frame_sets["hit"], "loop_once", 2);
    }
    else {
      if (this.velocity_y < 0) {

        if (this.direction_x < 0) this.changeFrameSet(this.frame_sets["jump-left"], "pause");
        else this.changeFrameSet(this.frame_sets["jump-right"], "pause");

      } else if (this.direction_x < 0) {

        if (this.velocity_x < -0.1) this.changeFrameSet(this.frame_sets["move-left"], "loop", 2);
        else this.changeFrameSet(this.frame_sets["idle-left"], "pause");

      } else if (this.direction_x > 0) {

        if (this.velocity_x > 0.1) this.changeFrameSet(this.frame_sets["move-right"], "loop", 2);
        else this.changeFrameSet(this.frame_sets["idle-right"], "pause");
      }

    }
    this.animate();

  },

  updatePosition: function (gravity, friction) { // Changed from the update function
    this.x_old = this.x;
    this.y_old = this.y;

    this.velocity_y += gravity;
    this.velocity_x *= friction;

    /* Made it so that velocity cannot exceed velocity_max */
    if (Math.abs(this.velocity_x) > this.velocity_max)
      this.velocity_x = this.velocity_max * Math.sign(this.velocity_x);

    if (Math.abs(this.velocity_y) > this.velocity_max)
      this.velocity_y = this.velocity_max * Math.sign(this.velocity_y);

    this.x += this.velocity_x;
    this.y += this.velocity_y;
  }

}; // inheritance
Object.assign(Game.World.Object.Player.prototype, Game.World.MovingObject.prototype);
Object.assign(Game.World.Object.Player.prototype, Game.World.Object.Animator.prototype);
Game.World.Object.Player.prototype.constructor = Game.World.Object.Player;

Game.World.TileSet = function (columns, tile_size) {

  this.columns = columns;
  this.tile_size = tile_size;

  let f = Game.World.TileSet.Frame;

  var g_offset = -15;
  // f is a particular frame from image object (from tile-map, image of frog, etc.)
  this.frames = [
    // walk-right
    new f(0, 0, 32, 32, 0, g_offset), new f(32, 0, 32, 32, 0, g_offset), new f(64, 0, 32, 32, 0, g_offset),
    new f(92, 0, 32, 32, 0, g_offset), new f(128, 0, 32, 32, 0, g_offset), new f(160, 0, 32, 32, 0, g_offset),
    new f(192, 0, 32, 32, 0, g_offset), new f(224, 0, 32, 32, 0, g_offset), new f(256, 0, 32, 32, 0, g_offset),
    new f(288, 0, 32, 32, 0, g_offset), new f(320, 0, 32, 32, 0, g_offset), new f(352, 0, 32, 32, 0, g_offset),
    // walk-left
    new f(0, 32, 32, 32, 0, g_offset), new f(32, 32, 32, 32, 0, g_offset), new f(64, 32, 32, 32, 0, g_offset),
    new f(92, 32, 32, 32, 0, g_offset), new f(128, 32, 32, 32, 0, g_offset), new f(160, 32, 32, 32, 0, g_offset),
    new f(192, 32, 32, 32, 0, g_offset), new f(224, 32, 32, 32, 0, g_offset), new f(256, 32, 32, 32, 0, g_offset),
    new f(288, 32, 32, 32, 0, g_offset), new f(320, 32, 32, 32, 0, g_offset), new f(352, 32, 32, 32, 0, g_offset),
    // jump-left
    new f(96, 64, 32, 32, 0, g_offset),
    // jump-right
    new f(64, 64, 32, 32, 0, g_offset),
    // diamond - 86, 87
    new f(352, 160, 32, 32, 6, 0), //offset = 0
    new f(384, 160, 32, 32, 6, 0),
    // hit - starts with 28
    new f(192, 64, 32, 32, 0, g_offset), new f(224, 64, 32, 32, 0, g_offset), new f(256, 64, 32, 32, 0, g_offset),
    new f(288, 64, 32, 32, 0, g_offset), new f(320, 64, 32, 32, 0, g_offset), new f(352, 64, 32, 32, 0, g_offset)
  ];
};
Game.World.TileSet.prototype = { constructor: Game.World.TileSet };

Game.World.TileSet.Frame = function (x, y, width, height, offset_x, offset_y) { 
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.offset_x = offset_x;
  this.offset_y = offset_y;
};

Game.World.TileSet.Frame.prototype = { constructor: Game.World.TileSet.Frame };

/* --------------------------------------- DIAMOND --------------------------------------------- */
Game.World.Object.Diamond = function (diamond) {

  Game.World.Object.call(this, diamond.x, diamond.y, 20, 20);

  this.color = diamond.color;
  this.frame_index = Math.floor(Math.random() * 2);

  /* base_x and base_y are the point around which the Diamonds revolves. position_x
  and y are used to track the vector facing away from the base point to give the Diamonds
  the floating effect. */
  this.base_x = diamond.x;
  this.base_y = diamond.y;
  this.position_x = Math.random() * Math.PI * 2;
  this.position_y = this.position_x * 2;

  if (this.color == "red") {
    Game.World.Object.Animator.call(this, Game.World.Object.Diamond.prototype.frame_sets["twirl_red"], 10);
  }
  else if (this.color == "blue") {
    Game.World.Object.Animator.call(this, Game.World.Object.Diamond.prototype.frame_sets["twirl_blue"], 10);
  }
  else {
    Game.World.Object.Animator.call(this, Game.World.Object.Diamond.prototype.frame_sets["twirl_blue"], 10);
  }

};
Game.World.Object.Diamond.prototype = {

  frame_sets: {
    "twirl_red": [27], 
    "twirl_blue": [26]
  },

  updatePosition: function () {
    //this.position_x += 0.1;
    this.position_y += 0.3;

    this.x = this.base_x + Math.cos(this.position_x) * 2;
    this.y = this.base_y + Math.sin(this.position_y);
  }

};
Object.assign(Game.World.Object.Diamond.prototype, Game.World.Object.Animator.prototype);
Object.assign(Game.World.Object.Diamond.prototype, Game.World.Object.prototype);
Game.World.Object.Diamond.prototype.constructor = Game.World.Object.Diamond;
/* --------------------------------------- END OF DIAMOND --------------------------------------------- */