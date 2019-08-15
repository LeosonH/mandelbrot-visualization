/*
--------------------------------------------------------------
2019 Leoson Hoay
leoson@uchicago.edu
 
Permission is granted by the author listed above, to any person
obtaining a copy of this script and associated files to use,
copy, modify, merge, publish, and distribute copies of files 
for non-commercial purposes, subject to the following
conditions:
 
- The above permission notice shall be included in all copies or
substantial portions of the original code. 

For commercial and other collaborative inquiries, please contact
the original author.

The images originally referenced to in this script are copyright
free:
- question_mark_2.png
- question_mark.png
- mandelbrot_latex.png
--------------------------------------------------------------
*/

(function(host) {
  // set initial color alpha
  var ALPHA = 255;
  var font_size = 20;
  // load image assets
  var q_image = new Image;
  q_image.src = 'images/question_mark_2.png';
  var q_image2 = new Image;
  q_image2.src = 'images/question_mark.png';
  var e_image = new Image;
  e_image.src = 'images/mandelbrot_latex.png';


  function Display(canvas, width, height) {
    this.context = null;
    this.imageData = null;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
  }

  Display.prototype.init = function() {
    this.canvas.setAttribute('width', window.innerWidth);
    this.canvas.setAttribute('height', window.innerHeight);
    this.context = this.canvas.getContext('2d');
    this.context.font = font_size + 'px Courier New';
    this.imageData = this.context.getImageData(0, 0, this.width, this.height);
  }

  Display.prototype.draw = function(x, y, color) {
    // update pixel values
    var index = (x + y * this.width) * 4;
    this.imageData.data[index + 0] = color;
    this.imageData.data[index + 1] = color;
    this.imageData.data[index + 2] = 70;
    this.imageData.data[index + 3] = ALPHA;
  }

  Display.prototype.repaint = function() {
    // update image data
    this.context.putImageData(this.imageData, 0, 0);
    // create axis lines
    this.context.beginPath();
    this.context.moveTo(window.innerWidth/2, 0);
    this.context.lineTo(window.innerWidth/2, window.innerHeight);
    this.context.strokeStyle = "grey";  
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(0, window.innerHeight/2);
    this.context.lineTo(window.innerWidth, window.innerHeight/2);
    this.context.stroke();
    // text
    this.context.fillStyle = 'yellow';
    this.context.fillText("The Mandelbrot Set", 20, 30);
    this.context.drawImage(q_image, 245, 12, 25, 25);
    this.context.fillText("source code", 20, window.innerHeight-32);
  }

  Display.prototype.tracker = function() {
    // text to monitor rendering
    this.context.fillStyle = 'gold';
    this.context.fillText("Rendering... ", 20, 60);
  }

  Display.prototype.pointIndicator = function(x, y) {
    // update point coordinate display 
    this.context.fillStyle = 'gold';
    this.context.fillText("Rendering Complete!", 20, 60);
    this.context.fillText("x: " + x + "  y: " + y, window.innerWidth-236, 30);
    this.context.fillText("C = " + x + " + (" + y + ")i", window.innerWidth-256, 60);;
  }

  Display.prototype.explain = function(x, y) {
    // display the explanation blurb
    if (x > 245 && y < 47
          && x < 270 && y > 12) {
        this.context.drawImage(q_image2, 245, 12, 25, 25);
        this.context.globalAlpha = 0.9;   
        this.context.drawImage(e_image, 20, 80, 575, 165);
        this.context.globalAlpha = 1.0;
      } else {
        this.context.drawImage(q_image, 245, 12, 25, 25);
        this.context.globalAlpha = 1.0;
      }
  }

  Display.prototype.sourceHover = function(x, y) {
    if (x > 20 && y < window.innerHeight-27
          && x < 250 && y > window.innerHeight-52) {
        this.context.fillText("source code (click!)", 20, window.innerHeight-32);
      } else {
        this.context.fillText("source code", 20, window.innerHeight-32);
      }
  }

  Display.prototype.sourceLink = function(x, y) {
    // link to source code repository
    if (x > 20 && y < window.innerHeight-27
          && x < 250 && y > window.innerHeight-52) {
        window.location.assign("https://www.github.com/LeosonH/mandelbrot-viz")
      }
  }

  host.Display = Display;
})(this);

(function(host) {
  var INIT_COLOR = 255;
  var MAX_NORM = 4.0;
  var MAX_ITERATIONS = 35;
  var GRADIENT_SCALE = Math.floor(INIT_COLOR / MAX_ITERATIONS);

  function EscapeAlgorithm(pointX, pointY) {
    // Escape Algorithm
    var current = 0;
    var x = 0;
    var y = 0;
    /*
    While current iteration number is less than preset limit and norm is
    less than its preset limit, repeat algorithm as defined by the mandelbrot
    set recurrence relation, and increment iteration number. Return the
    iteration number at the end. 
    */
    while ((current < MAX_ITERATIONS) && (x * x + y * y < MAX_NORM)) {
      const xNext = x * x - y * y;
      const yNext = 2 * x * y;
      x = xNext + pointX;
      y = yNext + pointY;
      current++;
    }

    return current;
  }

  function getSingleColor(iterations) {
    // the iteration number is used to determine the color gradient.
    return Math.min(iterations * GRADIENT_SCALE, INIT_COLOR);
  }

  host.getColors = {
    getColor: function(x, y) {
      return getSingleColor(EscapeAlgorithm(x, y));
    }
  }
})(this);

(function(host) {
  const SCALE_N = 4;
  const STEP_SIZE = 50;

  function Visualization(display, width, height) {
    this.display = display;
    this.width = width;
    this.height = height;
    this.size = Math.min(width, height);
  }

  Visualization.prototype.scaleX = function(x) {
    // scale the visualization by window size and desired scale
    return (SCALE_N * x / this.size) - (SCALE_N * this.width) / (2 * this.size);
  }

  Visualization.prototype.scaleY = function(y) {
    // scale the visualization by window size and desired scale
    return (SCALE_N * y / this.size) - (SCALE_N * this.height) / (2 * this.size);
  }

  Visualization.prototype.paint = function() {
    var promises = [];
    var self = this;
    var width = this.width;
    var height = this.height;

    for (var y = 0; y < height; y++) {
      promises.push(new Promise(function(resolve, reject) {
        setTimeout(function(y) {
          for (var x = 0; x < width; x++) {
            const color = getColors.getColor(self.scaleX(x), self.scaleY(y));
            self.display.draw(x, y, color);
          }
          self.paintStep(y);
          resolve();
        }, 0, y);
      }));
    }

    Promise.all(promises).then(function() {
      self.display.repaint();


      document.addEventListener("mousemove", function(ev){
        self.display.repaint();

        var width = window.outerWidth;
        var height = window.outerHeight;
        /* 
        track mouse coordinates for displaying coordinates on complex plane,
        and for animating interactive objects.   
        */
        /* 
        for displaying complex plane coordinates, scale and center raw 
        mouse position
        */
        self.display.pointIndicator(((event.clientX - width/2)/(height/SCALE_N)).toFixed(2),
         ((-event.clientY + height/2)/(height/SCALE_N)).toFixed(2));
        self.display.explain(event.clientX, event.clientY);
        self.display.sourceHover(event.clientX, event.clientY);
      });

      document.addEventListener("click", function(ev){
        // track mouse click on link to source code
        self.display.sourceLink(event.clientX, event.clientY);
      });

      document.addEventListener("touchstart", function(ev){
        self.display.repaint();
        var width = window.innerWidth;
        var height = window.innerHeight;
        // track touch events on link to source code
        self.display.sourceLink(ev.touches[0].pageX, ev.touches[0].pageY);
        self.display.pointIndicator(((ev.touches[0].pageX - width/2)/(height/SCALE_N)).toFixed(2),
         ((-ev.touches[0].pageY + height/2)/(height/SCALE_N)).toFixed(2));
        self.display.explain(ev.touches[0].pageX, ev.touches[0].pageY);
        self.display.sourceHover(ev.touches[0].pageX, ev.touches[0].pageY);
      });
    });
  }

  Visualization.prototype.paintStep = function(y) {
    if (y % STEP_SIZE === 0) {
      this.display.repaint();
      this.display.tracker();
    }
  }

  host.Visualization = Visualization;
})(this);

// final rendering function
function render() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  // get canvas element from html
  var canvas = document.getElementById('myCanvas');
  var display = new Display(canvas, width, height);
  var mandelbrot = new Visualization(display, width, height);

  display.init();
  mandelbrot.paint();
}

render();
