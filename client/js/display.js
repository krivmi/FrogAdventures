const Display = function(canvas) {

  this.buffer  = document.createElement("canvas").getContext("2d"),
  this.context = canvas.getContext("2d");

  /* This function draws the map to the buffer. */
  this.drawMap = function(image, image_columns, map, map_columns, tile_size) {

    var counter = 0;
    for (let index = 0; index < map.length; index++) {

      let value         = map[index] - 1; // odsazení - chci začínat nulou, ne jedničkou
      let source_x      =           (value % image_columns) * tile_size;
      let source_y      = Math.floor(value / image_columns) * tile_size;
      let destination_x =           (index % map_columns  ) * tile_size;
      let destination_y = Math.floor(index / map_columns  ) * tile_size;
      
      this.buffer.drawImage(image, source_x, source_y, tile_size, tile_size, destination_x, destination_y, tile_size, tile_size);
      /* 
      // Show grid coordinates
      this.buffer.beginPath()
      this.buffer.rect(destination_x, destination_y, tile_size, tile_size);
      this.buffer.stroke()
     
      var i = destination_x / tile_size;
      var j = destination_y / tile_size;
      var pos = i + "" + j
           
      this.buffer.fillStyle  = "blue";
      this.buffer.font = "15px Arial";
      this.buffer.fillText(pos, destination_x, destination_y + tile_size/2);
      */
    }

  };
  this.returnContext = function() {
    return this.context;
  };
  this.returnBuffer = function() {
    return this.buffer;
  };

  this.drawBackground = function(color) {
      this.buffer.fillStyle = color;
      this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
  };
  
  this.drawBackgroundImage = function (image) {
    this.buffer.drawImage(image, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
},


  this.drawObject = function(image, source_x, source_y, destination_x, destination_y, width, height) {
    this.buffer.drawImage(image, source_x, source_y, width, height, Math.round(destination_x), Math.round(destination_y), width, height);

  };
  this.drawBoundingBox = function(destination_x, destination_y, width, height, color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(Math.round(destination_x), Math.round(destination_y), width, height);
  };


  this.resize = function(width, height, height_width_ratio) {

    if (height / width > height_width_ratio) {

      this.context.canvas.height = width * height_width_ratio;
      this.context.canvas.width  = width;

    } else {

      this.context.canvas.height = height;
      this.context.canvas.width  = height / height_width_ratio;

    }

    this.context.imageSmoothingEnabled = false;

  };

  this.drawTime = function(seconds, minutes){
    var p = document.createElement("p");
    p.setAttribute("style", "color:#c07000; font-size:1.5em; position:fixed;");
    p.innerHTML = minutes.toString().padStart(2,"0") + ":" + seconds.toString().padStart(2,"0");

    var rectangle = this.context.canvas.getBoundingClientRect();

    p.style.left = rectangle.left + "px";
    p.style.top  = rectangle.top + "px";
    p.style.fontSize = "32px";

    document.body.appendChild(p);
  };  

};

Display.prototype = {

  constructor : Display,

  render:function() { 
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); 
  },

};