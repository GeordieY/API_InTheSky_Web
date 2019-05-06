var img;
var x = -200;
var startX = 0;
var y = -200;
var startY = 0;

function preload() {
	img = loadImage("images/map.png");
}

function setup() {
  var canvas = createCanvas(1500, 500);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('sketch-holder');

    background(230);
}

function draw() {
  background(230);
  //ellipse(50, 50, 80, 80);
  image(img, x, y, 1416, 1206);
}

function mousePressed() {
	 startX = mouseX;
   startY = mouseY;
}

function mouseDragged() {
	var diff = startX - mouseX;
  x = x - diff;
  startX = mouseX;
  diff = startY - mouseY;
  y = y - diff;
  startY = mouseY;
}
