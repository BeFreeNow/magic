var mainCanvas = document.getElementById('myCanvas');
var mainContext = mainCanvas.getContext('2d');
var isPlaying = false;
var circles = new Array();

var bufferSize = 4096;
var soundLength = 15000;
var audioContext;
var brownNoise;

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

let initialDate = new Date().toLocaleString();

function personalize(userName = 'Vasili Ivanov', date = initialDate) {
  mainContext.font = '60px serif';
  mainContext.fillStyle = 'white';
  mainContext.fillText(`Personalized for ${userName}`, 100, 300);
  mainContext.font = '50px serif';
  mainContext.fillText(date, 150, 375);
  mainContext.font = '40px serif';
  mainContext.fillText('WONT BE EFFECTIVE FOR OTHER VIEWERS!', 100, 450);
  mainContext.fillText('adjusted video is loaded on every play', 100, 525);
  mainContext.fillText('*in order to prevent adoption,', 100, 600);
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
  if(!isPlaying) {
    return;
  }
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

function draw() {
  if(!isPlaying) {
    return;
  }
  mainContext.clearRect(0, 0, 1500, 1500);

  for (var i = 0; i < circles.length; i++) {
    var myCircle = circles[i];
    myCircle.update();
  }

  requestAnimationFrame(draw);
}

  function playBrownNoise() {
    audioContext = new AudioContext();
    brownNoise = (function () {
      var lastOut = 0.0;
      var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
      node.onaudioprocess = function (e) {
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 0.5;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 0.5; // (roughly) compensate for gain
        }
      };
      return node;
    })();

    brownNoise.connect(audioContext.destination);
    setTimeout(() => {
      stop();
      isPlaying = false;
    }, soundLength);
  }

  function play() {
    if (isPlaying) {
      return;
    }
    initialDate = new Date().toLocaleString();
    isPlaying = true;
    playBrownNoise();
    drawCircles();
  }

function stop() {
  mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  isPlaying = false;
  brownNoise.disconnect();
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

