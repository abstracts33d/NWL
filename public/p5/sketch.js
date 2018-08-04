function Vehicle(x, y, r) {
  this.pos = createVector(random(width), random(height));
  this.target = createVector(x, y);
  this.vel = p5.Vector.random2D();
  this.acc = createVector();
  this.r = r;
  this.maxspeed = 20;
  this.maxforce = 2;
}

Vehicle.prototype.behaviors = function() {
  var arrive = this.arrive(this.target);
  var mouse = createVector(mouseX, mouseY);
  var flee = this.flee(mouse);

  arrive.mult(1);
  flee.mult(5);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Vehicle.prototype.applyForce = function(f) {
  this.acc.add(f);
}

Vehicle.prototype.update = function() {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Vehicle.prototype.show = function() {
  stroke(255);
  strokeWeight(this.r);
  point(this.pos.x, this.pos.y);
}


Vehicle.prototype.arrive = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  var speed = this.maxspeed;
  if (d < 100) {
    speed = map(d, 0, 100, 0, this.maxspeed);
  }
  desired.setMag(speed);
  var steer = p5.Vector.sub(desired, this.vel);
  steer.limit(this.maxforce);
  return steer;
}

Vehicle.prototype.flee = function(target) {
  var desired = p5.Vector.sub(target, this.pos);
  var d = desired.mag();
  if (d < 50) {
    desired.setMag(this.maxspeed);
    desired.mult(-1);
    var steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}


var font;
var vehicles = [];
var time = 0;
var dt = 0.01;

function preload() {
  font = loadFont('public/images/Vitreous-Light.ttf');
  font = loadFont('public/images/JustBreathe.otf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(51);
  var points = font.textToPoints('Nested Wires Lab', window.innerWidth/2-400, 300, 100, {
    sampleFactor: 0.2
  });

  for (var i = 0; i < points.length; i++) {
    var pt = points[i];
    var vehicle = new Vehicle(pt.x, pt.y,3);
    vehicles.push(vehicle);
  }
}

function draw() {
  background(51,51,51);
  noFill();
  strokeWeight(0.5);
  textFont("Vitreous-Light");
  textSize(30);
  textAlign(CENTER);
  text('PROCEDURAL WEB RADIO', width/2, 400);

  time += dt;
  stroke(165,255,255,20);
  strokeWeight(1);
  noFill();

  // stroke(240, 117, 140)
  for (var y = -40; y <= height +80; y += 20) {
    beginShape();
    for (var x = 0; x <= width +20; x += 20) {
      var drift = (noise(x/100, y/300, time)-0.5)*300;
      vertex(x, y+drift);
    }
    vertex(width +100, height);
    vertex(0, height +10);
    endShape(CLOSE);
  }

  // translate(3,0,0)
  // // stroke(60, 248, 253)
  // for (var y = -40; y <= height +80; y += 20) {
  //   beginShape();
  //   for (var x = 0; x <= width +20; x += 20) {
  //     var drift = (noise(x/100, y/300, time)-0.5)*300;
  //     vertex(x, y+drift);
  //   }
  //   vertex(width +100, height);
  //   vertex(0, height +10);
  //   endShape(CLOSE);
  // }


  for (var i = 0; i < vehicles.length; i++) {
    var v = vehicles[i];
    v.behaviors();
    v.update();
    v.show();
  }
}
