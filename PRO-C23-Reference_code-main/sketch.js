const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon;
var cannonBall;
var balls=[];
var boats=[];



function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  
  angleMode(DEGREES);
  angle = 15;

  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  tower = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, tower);

  cannon = new Cannon(180, 110, 130, 100, angle);

  cannonBall = new CannonBall(cannon.x, cannon.y);
}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  Engine.update(engine);

  push();
  fill("brown");
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width * 2, 1);
  pop();

  push();
  imageMode(CENTER);
  image(towerImage, tower.position.x, tower.position.y, 160, 310);
  pop();

  //display cannon
  cannon.display();

  //display the boats
  showBoats();

  //display multiple balls
  for (var i = 0; i < balls.length; i++) {
    showCannonBalls(balls[i]);
    collisionWithBoat(i);
  }
 
}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

function showCannonBalls(ball) {
  if (ball) {
    ball.display();
  }
}

function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    
  }
}

function showBoats() {
  //if boat array is greater than 0 
  
  if (boats.length > 0) {

    //check whether the boats array's length-1 is undefined and position is less than width
    if (
      boats[boats.length - 1] === undefined ||
      boats[boats.length - 1].body.position.x < width - 300
    ) {

      //create 4 different positions for the boat
      var positions = [-40, -60, -70, -20];
      //choose random among the 4 
      var position = random(positions);
      //create the boat by calling the Boat class
      var boat = new Boat(width, height - 100, 170, 170, position);

      //push each and every boat to boats array
      boats.push(boat);
    }

    //using for loop to display the boats
    for (var i = 0; i < boats.length; i++) {
      //giving seperate velocity for boats
      if (boats[i]) {
        Matter.Body.setVelocity(boats[i].body, {
          x: -0.9,
          y: 0
        });

        //display each boat
        boats[i].display();
      } 
    }
  } 
  //else create a new boat at end of the canvas
  else {
    var boat = new Boat(width, height - 60, 170, 170, -60);
    boats.push(boat);
  }
}

//detect the collision between boat and ball and remove them from canvas
function collisionWithBoat(index) {
  for (var i = 0; i < boats.length; i++) {
    //if balls and boats array is not empty
    if (balls[index] !== undefined && boats[i] !== undefined) {
      //using SAT checking the collision between two objects ie., ball and boat
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);

     // if collision occured remove the boat from the canvas
      if (collision.collided) {
        //calling the remove function written in Boat class
        boats[i].remove(i);

        //remove the ball directly
        Matter.World.remove(world, balls[index].body);
        //delete balls array
        delete balls[index];
      }
    }
  }
}