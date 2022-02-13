const Controller = function () {

  this.left_0 = new Controller.ButtonInput();
  this.right_0 = new Controller.ButtonInput();
  this.up_0 = new Controller.ButtonInput();

  this.left_1 = new Controller.ButtonInput();
  this.right_1 = new Controller.ButtonInput();
  this.up_1 = new Controller.ButtonInput();

  this.pause = new Controller.ButtonInput();

  this.keyDownUp = function (type, key_code) {

    var down = (type == "keydown") ? true : false;
    var up = (type == "keyup") ? true : false;

    switch (key_code) {
      case 65: this.left_0.getInput(down); break;
      case 87: this.up_0.getInput(down); break;
      case 68: this.right_0.getInput(down); break;

      case 37: this.left_1.getInput(down); break;
      case 38: this.up_1.getInput(down); break;
      case 39: this.right_1.getInput(down); break;

      case 80: this.pause.getInputPause(up); break;
    }
  };
};
Controller.prototype = {
  constructor: Controller
};

Controller.ButtonInput = function () {
  this.active = this.down = false;

  // Only for pause purposes
  this.pause_counter = 0;
  this.pause_confirm = false;
};

Controller.ButtonInput.prototype = {
  constructor: Controller.ButtonInput,
  getInput: function (down) {

    if (this.down != down) {
      this.active = down;
    }
    this.down = down;

  },
  getInputPause: function (up) {
    // In here must be reversed logic, I need a constant false and change it to true only after keyup event  
    // After that I set Pause in main and change this.up to false

    if (this.down != up) {
      this.active = up;
    }
    this.down = up;
    //console.log(this.down);

    if(this.down){
      this.pause_counter++;

      if (this.pause_counter % 2 == 0) {
        this.pause_confirm = true; 
      }
      else {
        this.pause_confirm = false;
      }
    }
    
  }

};