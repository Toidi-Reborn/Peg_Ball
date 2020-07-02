



let x=1, y=2, z=3;

var thisObject = {
    one: 1,
    two: 2,
    three: 3
}

var dayOfWeek = ['SU','M','T','W','TH','F','SA']


person: [{
    givenName: "Michel",
    familyName: "Buffa"
}]

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;


var score = 0;



//paddle
var paddleHeight =10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) /2;
var rightPressed = false;
var leftPressed = false;


//bricks
var brickRowCount = 1;
var brickColCount = 2;
var brickW = 75;
var brickH = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var cols = 0; cols<brickColCount; cols++) {
  bricks[cols] = [];
  for ( var rows = 0; rows<brickRowCount; rows++) {
    bricks[cols][rows] = { x: 0, y: 0, status: 1 };
  }
}


// Keyboard Listen
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Mouse Listen
document.addEventListener("mousemove", mouseMoveHandler, false);



function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}


function keyDownHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if(e.key == "Left" || e.key == "ArrowLeft"){
    leftPressed = true;
  }
}


function keyUpHandler(e) {
  if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  
  }
}

x = canvas.width / 2;
y = canvas.height - 30;
// x,y is center of the ball

dx = 2;
dy = -2;


        /*
        ( x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH)
        The x position of the ball is greater than the x position of the brick.
        The x position of the ball is less than the x position of the brick plus its width.
        The y position of the ball is greater than the y position of the brick.
        The y position of the ball is less than the y position of the brick plus its height.
        */

function collisionDetection() {
  for( var c = 0; c < brickColCount; c++) {
    for( var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if ( x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
          dy = -dy;
          b.status = 0;
          score ++;
          if (score == brickColCount * brickRowCount) {
            alert("You Win!!!!!!\nIdiot");
            document.location.reload();
            //clearInterval(interval); //for Chrome
          }
        } 
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 8, 20);


}


function drawBricks() {
  for (var cols = 0; cols < brickColCount; cols++) {
    for ( var rows = 0; rows < brickRowCount; rows++) {
      if (bricks[cols][rows].status == 1) {
        var brickX = (cols*(brickW + brickPadding)) + brickOffsetLeft;
        var brickY = (rows*(brickH + brickPadding)) + brickOffsetTop;
        bricks[cols][rows].x = brickX;
        bricks[cols][rows].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY , brickW, brickH);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();

}


function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  collisionDetection();
  x += dx;
  y += dy;

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy
  }
  else if(y + dy > canvas.height-ballRadius) {
    if( x > paddleX && x < paddleX + paddleWidth){
      dy = -dy;
    }
    else {
    alert("Game Over");
    document.location.reload();
    //clearInterval(interval);
    }
  }

  if(rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width){
      paddleX = canvas.width - paddleWidth;
    }
  }
  else if(leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
  requestAnimationFrame(draw);
}


//var interval = setInterval(draw,10);   //Removed and replaced with animateFrame
draw()



/*
  // demo part - for learning (:)
  ctx.beginPath();
  ctx.rect(200, 40, 150, 50)  //  from left , from top, width, height
  ctx.fillStyle = "#FF0000"; //fill color
  ctx.fill();
  ctx.closePath();

  //close and then reopened - if not, color doesnt change
  ctx.beginPath();
  ctx.arc(240, 160, 20, 0, Math.PI*2, false); // x and y of arc center, arc radius, start and end angle, draw direction (false = clockwise)
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();

  //no fill, just outline blue
  ctx.beginPath();
  ctx.rect(200, 150, 100, 40);
  ctx.strokeStyle = "rgba(0, 0, 255, 0.25)";
  ctx.stroke();
  ctx.closePath();



}

*/