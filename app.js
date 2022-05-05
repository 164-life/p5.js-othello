

var holding = false;

function getRandomInt(min, max) {
  return min+Math.floor(Math.random() * Math.floor(max-min));
}

function preload(){
    
}

function setup(){
    var canvas = createCanvas(600,300);
    canvas.parent('canvas');
    textSize(20);
    stroke(0,0,0);
    fill(0,0,0);
    background(255,255,255);
}

function mousePressed(){
    holding = true;
    
}

function mouseReleased() {
    holding = false;

}

function touchStarted(){
    mousePressed();
}

function touchEnded(){
    mouseReleased();
}

function draw(){
    
}