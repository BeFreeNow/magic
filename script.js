var body = document.querySelector('body');
body.style.backgroundColor = getRandomColor();
var mainCanvas = document.getElementById('myCanvas');
var mainContext = mainCanvas.getContext('2d');
var isPlaying = false;
var circles = new Array();

var bufferSize = 4096;
var soundLength = 15000;
var audioContext;
var brownNoise;

var WHITE_FACTOR = getRandom(1, 3);
const RED = getRandom(0, 255);
const GREEN = getRandom(0, 255);
const BLUE = getRandom(0, 255);
const TEXT_COLOR = invertRgb(RED, GREEN, BLUE);
const SIZE = getRandom(0, 100);

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function generateRandomColor(){
  return `rgba(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0.01, 0.6)})`;
}

function invertRgb(r, g, b) {
  return [255 - r, 255 - g, 255 - b];
}





function getRandomColor(maxOpacity = 0.6) {
//get random rgba color
  return `rgba(${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0, 255)}, ${getRandom(0.01, 0.3)})`;
}

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

  var signHelper = Math.floor(Math.random() * 5);

  if (signHelper == 1) {
    this.sign = -1;
  } else {
    this.sign = 1;
  }
}

let initialDate = new Date().toLocaleString();

function personalize(userName = 'Vasili Ivanov', date = initialDate) {
  mainContext.font = '60px serif';
  mainContext.fillStyle = TEXT_COLOR;
  mainContext.fillText(`Personalized for ${userName}`, 100, 250);
  mainContext.font = '40px serif';
  // mainContext.fillStyle = color;
  mainContext.fillText('WONT BE EFFECTIVE FOR OTHER VIEWERS!', 100, 375);
  mainContext.font = '50px serif';
  // mainContext.fillStyle = color;
  mainContext.fillText(`updated at ${date}`, 150, 450);
  mainContext.font = '50px serif';
  mainContext.fillText('*updated on every play, to prevent', 100, 600);
  mainContext.fillText('adoption and keep the efficiency', 100, 650);
}

Circle.prototype.update = function () {
  this.counter += this.sign * this.speed;

  mainContext.beginPath();

  mainContext.arc(
    this.xPos + Math.cos(this.counter / 100) * this.radius,
    this.yPos + Math.sin(this.counter / 100) * this.radius,
    this.width,
    0,
    Math.PI * 5,
    false
  );

  mainContext.closePath();
  mainContext.fillStyle = `rgba(${RED}, ${GREEN}, ${BLUE}, ${this.opacity})`;
  mainContext.fill();
  personalize();
};

function drawCircles() {
  if (!isPlaying) {
    return;
  }
  for (var i = 0; i < 150; i++) {
    var randomX = Math.round(-100 + Math.random() * 1200);
    var randomY = Math.round(-100 + Math.random() * 1200);
    var speed = 1 + Math.random() * SIZE;
    var size = 1 + Math.random() * getRandom(0, 100);
    var radius = Math.round(100 + Math.random() * 300);

    var circle = new Circle(radius, speed, size, randomX, randomY);
    circles.push(circle);
  }

  draw();
}

function draw() {
  if (!isPlaying) {
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
        var white = Math.random() * WHITE_FACTOR - 0.5;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.5; // (roughly) compensate for gain
      }
    };
    return node;
  })();

  brownNoise.connect(audioContext.destination);
}

let timeOut;

function play() {
  if (isPlaying) {
    return;
  }

  isPlaying = true;
  initialDate = new Date().toLocaleString();
  playBrownNoise();
  drawCircles();
  timeOut = setTimeout(() => {
    stop();
  }, soundLength);
}

function stop() {
  if (!isPlaying) {
    return;
  }

  isPlaying = false;
  clearTimeout(timeOut);
  mainContext?.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  brownNoise?.disconnect();
  location.reload();
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

