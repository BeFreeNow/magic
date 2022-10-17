var mainCanvas = document.getElementById('myCanvas');
// mainCanvas.style.width = window.innerWidth;
// mainCanvas.style.height = window.innerHeight;

var mainContext = mainCanvas.getContext('2d');

var circles = new Array();

var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

function Circle(radius, speed, width, xPos, yPos) {
  this.radius = radius;
  this.speed = speed;
  this.width = width;
  this.xPos = xPos;
  this.yPos = yPos;
  this.opacity = 0.01 + Math.random() * 0.5;

  this.counter = 0;

  var signHelper = Math.floor(Math.random() * 3);

  if (signHelper == 1) {
    this.sign = -1;
  } else {
    this.sign = 1;
  }
}

const DEFAULT_DATE = new Date().toLocaleString();

function personalize(userName = 'Vasili Ivanov', date = DEFAULT_DATE) {
  mainContext.font = '60px serif';
  mainContext.fillStyle = 'white';
  mainContext.fillText(`Personalized for ${userName}`, 150, 500);
  mainContext.font = '50px serif';
  mainContext.fillText(date, 200, 550);
}

Circle.prototype.update = function () {
  this.counter += this.sign * this.speed;

  mainContext.beginPath();

  mainContext.arc(
    this.xPos + Math.cos(this.counter / 50) * this.radius,
    this.yPos + Math.sin(this.counter / 50) * this.radius,
    this.width,
    0,
    Math.PI * 2,
    false
  );

  mainContext.closePath();
  mainContext.fillStyle = 'rgba(235, 245, 251,' + this.opacity + ')';
  mainContext.fill();
  personalize();
};

function drawCircles() {
  for (var i = 0; i < 150; i++) {
    var randomX = Math.round(-100 + Math.random() * 1200);
    var randomY = Math.round(-100 + Math.random() * 1200);
    var speed = 1 + Math.random() * 5;
    var size = 1 + Math.random() * 10;

    var circle = new Circle(30, speed, size, randomX, randomY);
    circles.push(circle);
  }

  draw();
}

drawCircles();

function draw() {
  mainContext.clearRect(0, 0, 1500, 1500);

  for (var i = 0; i < circles.length; i++) {
    var myCircle = circles[i];
    myCircle.update();
  }

  requestAnimationFrame(draw);
}
