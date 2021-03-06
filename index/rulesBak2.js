
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var canvasCenterX = canvas.width / 2;
var wallThickness = 20;
var gameAreaLeftStart = wallThickness;
var gameAreaRightEnd = canvas.width - wallThickness;
var gameAreaWidth = gameAreaRightEnd - gameAreaLeftStart;
var gameAreaBottom = 100;
var gameRunning = false;
var gameHasStarted = false;
var gameOver = false;

var pegWasHit = false;
var liveResetLevel = true;

var showMenu;
var showMenuSetLives;
var showMenuLifeReset;


var levelSet;
var pegsLeft;
var multiPeg = 1;


var score = 0;
var angleMOD = 0;
var running = true;
var bulCount = 1;


//show debug info
var debugMode = true;

// ##########  Images  ##########

//walls
var wallImageSRC = 'index/images/wall.jpg';
var wallImage = new Image();
wallImage.src = wallImageSRC;
wallImage.width = 10;
wallImage.height = 10;

//background
var bgSRC = 'index/images/bg.jpg';
var bgImage = new Image();
bgImage.src = bgSRC;

//launcher
var launcherPath = 'index/images/launcher.png'
var launcherIMG = new Image();
launcherIMG.src = launcherPath;


//Menu Control
function mainMenuDisplay(){
  showMenuSetLives = false;
  showMenuLifeReset = false;
  showMenu = true;
  
}

mainMenuDisplay()

class returnHome {
  constructor() {
    this.name = "Home Button";
    this.x = canvas.width - 200;
    this.y = canvas.height - 65;
    this.w = 175;
    this.h = 50;
    this.hover = false;
  }

  drawButton = function() {    
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h); 
    if (this.hover == true) {
      ctx.fillStyle = "pink";
    }
    else {
      ctx.fillStyle = "grey";
    }
    ctx.fill();
    ctx.closePath();
    ctx.font = "25px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Main Menu", this.x + 25, this.y + 35);   
  }
}
homeButton = new returnHome();



class menuCreate {
  constructor(names, nbut, wPercent) {
    this.wPercent = wPercent;
    this.w = 400;
    this.h = 700;
    this.x = (canvas.width / 2) - (this.w / 2);
    this.y = 50;
    this.buttons = [];
    //this.b1X = 70;
    this.bGap = 10;
    this.bY = this.y + this.bGap + 50;
    this.bW = this.w * wPercent;
    this.bH = 50;
    this.names = names;
    this.numButtons = nbut;
    this.createButtons();
  }

  createButtons = function() {
    for (var i = 1; i <= this.numButtons; i++) {
      this.buttons[i] = [];
      this.buttons[i]["name"] = this.names[i];
      this.buttons[i]["x"] = ((this.w * (1 - this.wPercent) / 2)) + this.x;
      this.buttons[i]["y"] = this.bY;
      this.buttons[i]["w"] = this.bW;
      this.buttons[i]["h"] = this.bH;
      this.buttons[i]["hover"] = false;
      this.buttons[i]["enabled"] = true;
      this.bY += this.bGap + this.bH;
    }
  }

  drawMenu = function() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h); 
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();

    for (var i = 1; i < this.buttons.length; i++) {
      ctx.beginPath();
      ctx.rect(this.buttons[i].x, this.buttons[i].y, this.bW, this.bH); 
      if (this.buttons[i].hover == true) {
        ctx.fillStyle = "pink";
      }
      else if (this.buttons[i].enabled == false){
        ctx.fillStyle = "grey";
      }
      else {
        ctx.fillStyle = "red";
      }
      ctx.fill();
      ctx.closePath();
      ctx.font = "25px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(this.buttons[i].name, this.buttons[i].x + 15, this.buttons[i].y + this.bH - 15);    
    }


  
  }
}

// names, nbut, width %
var mainMenuNames = ["","Play","Reset / New Game","Rules","Set Lives","Set Life Reset"];
var menu = new menuCreate(mainMenuNames, 5, 0.75);
var menuSetLives = new menuCreate(["",1,2,3,4,5,6,7,8,9,"Unlimited"], 10, 0.40);
menuSetLives.buttons[10].enabled = false;
var menuSetLivesRegen = new menuCreate(["","Yes - Easy","No - Hard"], 2, 0.40);




//launcher

class launcherClass {
  constructor() {
    this.width = 50;
    this.height = 75;
    this.angleR = 0;
    this.angle = 0;
    this.degreeAdjust = (360-45) * Math.PI / 180;
    this.center = 0;
    //this.center = canvas.width / 2 - (this.width / 2 );
    //this.bottom = canvas.height - this.height;
    }

  drawLauncher() {
    ctx.save();
    //ctx.setTransform(scale, 0, 0, scale, x, y); //sets scale and origin
    ctx.translate(canvas.width / 2 + this.center, canvas.height - gameAreaBottom - 20);
    ctx.rotate(this.angleR);
    ctx.drawImage(launcherIMG, -this.width / 2, -this.height, this.width, this.height);
    ctx.restore();
    }
}

var launcher = new launcherClass();


// bullet (used for drawing into scoreboard too)
class bullet {
  constructor() {
    this.name = "bullet";
    this.count = bulCount;
    this.xTravel = 0;
    this.yTravel = 1.5;
    this.speed = 10;  //1-10?
    this.speedSet = this.speed;
    this.lives = 5;
    this.livesSave = this.lives;
    this.liveXAdjust = 90;
    this.noDeath = false;
    this.number = 0;
    levelSet = 0;
    score = 0;
    this.messageDelay = 0;    
    this.playerMessage = "PLACE HOLDER TEXT";
    this.messageShow = false;
    this.resetUnit();
  }

  resetUnit = function() {
    if (this.lives < 0 && pegsLeft > 0) {
      console.log("no more ammo");
      gameOver = true;
    } else {
      if (this.noDeath) {
        this.lives = 10;
      }

      pegWasHit = false;
      this.color = "black";
      this.x = canvas.width / 2;
      this.y = canvas.height - gameAreaBottom - 20;
      this.r = ballRadius;
      //this.slowDown = 0.00145;
      this.slowDown = 0;
      this.aTravel = 0;
      this.speed = this.speedSet;
      this.fired = false;
      this.loaded = false;
      this.stopped = false;
      }
  }

  drawScoreBoard = function(){
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Lives: ", 10, canvas.height - 60 + (this.r/2));
    ctx.fillText("Score: ", 10, canvas.height - 30 + (this.r/2));
    ctx.fillText("Level: ", canvas.width /2 + 10, canvas.height - 60 + (this.r/2));
    ctx.fillText(score, this.liveXAdjust - this.r, canvas.height - 30 + (this.r/2));
    ctx.fillText(levelSet, canvas.width / 2 + this.liveXAdjust, canvas.height - 60 + (this.r/2));

    for (var i = 0; i < this.lives; i++) {
      ctx.beginPath();
      ctx.arc(this.liveXAdjust, canvas.height - 60, this.r, 0, Math.PI*2); 
      ctx.fillStyle = "white";
      this.liveXAdjust += 25;
      ctx.fill();
      ctx.closePath();
      }
    this.liveXAdjust = 90;
    }

  drawPlayerMessage = function(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(this.playerMessage, 175, canvas.height - 300);
  } 

  drawBullet = function() {
    if (this.fired == false){
      this.x = canvas.width / 2 + launcher.center;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); 
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();  
    }

  reload = function() {
    if(this.fired == true) {
      this.resetUnit();
      console.log("Reload");
      this.loaded = true;
    }
  }

  fire = function() {    
    this.y -= (this.yTravel) * this.speed; 
    this.x -= (this.xTravel) * this.speed;
       
    if (this.speed > 0) {
      this.speed -= this.slowDown;
    } else {
      this.speed = 0;
    }
  }

  stoppedF = function() {
    this.stopped = true;
    this.color = "red";
  }
}

var bul = new bullet();



/////////////////////////////////   WALL SET-UP    /////////////////////////////////

const walls = [];

class createWall {
  constructor(name, x, y, w, h){
    this.name = name;
    this.enabled = false;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = "red";
  }

  drawWall = function() {
    for (var i = this.x; i < this.w + this.x; i += wallThickness) {
      for(var ii = this.y; ii < this.h + this.y; ii += wallThickness){
        ctx.drawImage(wallImage, i, ii, wallThickness, wallThickness);
      }
    }
  }

  wallHit = function() {
    var wX = (this.x);
    var wY = (this.y);
    var wW = (this.w);
    var wH = (this.h);

    if (bul.y + bul.r > wY && bul.y - bul.r < wY + wH && bul.x + bul.r > wX && bul.x - bul.r < wX + wW && this.enabled == true) {
      var dyb = (bul.y + bul.r) - this.y;
      var dyt = (this.y + this.h) - (bul.y - bul.r);
      var dxr = (bul.x + bul.r) - this.x;
      var dxl = (this.x + this.w) - (bul.x - bul.r);

      if (dyt < 1 + bul.speed) {
        bul.yTravel = -bul.yTravel;
        //bul.xTravel = -bul.xTravel;
        console.log("1");
        }
      if (dyb < 1 + bul.speed) {
        bul.yTravel = -bul.yTravel;
        //bul.xTravel = -bul.xTravel;
        console.log("2");
        }
      if (dxl < 1 + bul.speed) {
        bul.xTravel = -bul.xTravel;
        console.log("3");
        }
      if (dxr < 1 + bul.speed) {
        bul.xTravel = -bul.xTravel;
        console.log("4");
        }           
      }
    }
  }


//list of walls  (x,y,w,h)
walls[0] = new createWall("Left Side",0,0,wallThickness, canvas.height - gameAreaBottom);
walls[0].enabled = true;
walls[1] = new createWall("Right Side", canvas.width - wallThickness, 0, wallThickness, canvas.height - gameAreaBottom);
walls[1].enabled = true;
walls[2] = new createWall("Bottom", 0, canvas.height - gameAreaBottom, canvas.width, wallThickness);
walls[2].enabled = true;
walls[3] = new createWall("Mid Beam", (canvas.width / 2 ) - 75, canvas.height * 0.55, 300, wallThickness );
walls[4] = new createWall("Lower Beam", 40, canvas.height * 0.75, 200, wallThickness );
//walls[5] = new createWall();
//walls[6] = new createWall();
//walls[7] = new createWall();



/////////////////////////////////   PEG SET-UP    /////////////////////////////////
// setting pegsets for levels 
const pegRows = [];
const pegCols = [];

var rows = 0;
for (var i = 50; i <= 350; i += 50) {
  pegRows[rows] = i;
  rows++;
}
var cols = 5;
var colGap = canvas.width / (cols + 2);
for (var i = 0; i <= cols; i++) {
  pegCols[i] = colGap + (colGap * i);
  console.log(pegCols[i]);
}

const pegLocations = [];
var curRow = 0;
var curCol = 0;

//creating all peg locations
for (var i = 0; i < (pegRows.length * pegCols.length); i++) {
  pegLocations[i] = [];
  pegLocations[i][0] = "" + i;
  pegLocations[i][1] = pegCols[curCol];
  curCol++;
  if (curCol == pegCols.length) {
    curCol = 0;
  }
  pegLocations[i][2] = pegRows[curRow];
  curRow ++;
  if (curRow == pegRows.length) {
    curRow = 0;
  }
}

// creationg 50 sets for 50 levels
const pegSets = [];
for (var i = 0; i < 50; i++) {
  pegSets[i] = [];
}

// Sets / Pegs Locations
pegSets[0] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,33,34,35,36,37,38,39,40,41];
pegSets[1] = [20,27];
pegSets[2] = [19,40];
pegSets[3] = [24,17];
pegSets[4] = [18,25,32,39,4,11];
pegSets[5] = [1,22];
pegSets[6] = [30,23];
pegSets[7] = [0,14,21,35];
pegSets[8] = [12,6,5,41];
pegSets[9] = [31,38,3,10];
pegSets[10] = [25,19,13,4,40,34];
pegSets[11] = [24,31,38,3,10,17,18,25,32,39,4,11];
pegSets[12] = [24,31,38,3,10,17,18,25,32,39,4,11,36,1,8,15,22,29];
pegSets[13] = [30,23,14,21];
pegSets[14] = [2,31,18,9,10,11];
pegSets[15] = [35,29,23,41,0,36,30,6];
pegSets[16] = [37,2,9,16,31,38,3,10,25,32,39,4,19,26,33,40];
pegSets[17] = [2,31,18,9,10,11,0,7,28,35];
pegSets[18] = [37,2,9,16,31,38,3,10,19,26,33,40];
pegSets[19] = [37,2,9,16,31,38,3,10,25,32,39,4,19,26,33,40,0,35,36,29];
pegSets[20] = [37,2,9,16,31,38,3,10,25,32,39,4,0,7,14,21,28,35];


//pegs
class pegSet {
  constructor(name, x, y) {
    this.name = name; 
    this.x = x;
    this.y = y;
    this.state = 1;
    this.r = 10;

  }
  boom = function () {
    console.log("lalalalalala")
  }

  draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = "black";
    //ctx.fill();
    ctx.closePath();


    
    //for peg pos
    ctx.font = "20px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(this.name, this.x, this.y) 
    
    
    }
    

  death = function () {
    this.state = 0;
    this.y = -100;
    score += (5 * multiPeg);
    console.log(multiPeg + " - " + score);
    if (multiPeg >= 2){
      //bul.playerMessage = multiPeg + "X Multiplier"
      //bul.messageShow = true;
    }
    
    
    multiPeg += 1;
    pegsLeft --;
  }



}

const peg = [];


//creating pegs
function setPegs() {
  pegsLeft = pegSets[levelSet].length;
  for (var i = 0; i < pegSets[levelSet].length; i++) {
    var l = pegSets[levelSet][i];
    //console.log(l)
    peg[i] = new pegSet(pegLocations[l][0], pegLocations[l][1], pegLocations[l][2]);
  }
}


/////////////////////////////////   Func it Up!!    /////////////////////////////////


function nextLevel() {
  levelSet++;
  setPegs();
  if (liveResetLevel) {
    bul.lives = bul.livesSave - 1;
  }
  bul.reload();
  
}


//peg - bul collision detect
function pegHit() {
  for (var i = 0; i < pegSets[levelSet].length; i++) {
    var dx = bul.x - peg[i].x;
    var dy = bul.y - peg[i].y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < peg[i].r + bul.r) {
      peg[i].death();
      pegWasHit = true;
    };
  };  
}


function drawDebug() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Angle: " + launcher.angle, 28, 20);
  ctx.fillText("AngleR: " + launcher.angleR, 28, 40);
  ctx.fillText("Speed: " + bul.speed, 28, 60);
  ctx.fillText("SlowDown: " + bul.slowDown, 28, 80);
  ctx.fillText("xTravel: " + bul.xTravel, 28, 100);
  ctx.fillText("yTravel: " + bul.yTravel , 28, 120);
  ctx.fillText("aTravel: " + bul.aTravel, 28, 140);
  ctx.fillText("firedl: " + bul.fired, 28, 160);
  ctx.fillText("loaded: " + bul.loaded, 28, 180);
  ctx.fillText("GamrOver: " + gameOver, 28, 200);
  ctx.fillText("Level: " + levelSet, 28, 220);
  ctx.fillText("Multi: " + multiPeg, 28, 240);
}



/////////////////////////////////   Listen to Me    /////////////////////////////////

// Keyboard Listen
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Mouse Listen
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

//handler vars
var rightPressed = false;
var leftPressed = false;
var rightMove = false;
var leftMove = false;
var menuClicked;
var menuClicked2;
var menuClicked3;


//////////////////////////// Mouse Move/Click ///////////////////////////////////



function mouseClickHandler() {
  if (showMenu){ 
    console.log(menuClicked);
    switch(menuClicked) {
      case 1:
        showMenu = false;
        homeButton.hover = false;
        gameRunning = true;
        menu.buttons[4].enabled = false;
        menu.buttons[5].enabled = false;
        break;

      case 2:
        menu.buttons[4].enabled = true;
        menu.buttons[5].enabled = true;
        bul = new bullet();
        launcher = new launcherClass();
        levelSet = 0;
        nextLevel();
        gameOver = false;
        
        break;

      case 3:

        break;

      case 4:
        showMenu = false;
        showMenuSetLives = true;
        break;
          
      case 5:
        showMenu = false;
        showMenuLifeReset = true;

        break;

      default:
        console.log("Switch hit default");
      }
      menuClicked = 0;
      for (var i = 1; i < menu.buttons.length; i++) {
        menu.buttons[i].hover = false;
      }
    }
  
    else {
      
      if (showMenuSetLives){     
        if (menuClicked2 == 10 && menuSetLives.buttons[10].enabled) {
          bul.noDeath = true;
          bul.lives = 10;
          mainMenuDisplay();
          
        } 
        else if(menuClicked2 < 10 && menuClicked2 > 0) {
          bul.noDeath = false;
          bul.lives = menuClicked2;
          bul.livesSave = menuClicked2;
          mainMenuDisplay();
        }
      }

    if (showMenuLifeReset){
      if (menuClicked3 == 1) {
        liveResetLevel = true;
        mainMenuDisplay();

      } 
      else if (menuClicked3 == 2) {
        liveResetLevel = false;
        mainMenuDisplay();
      }
    }

    if (homeButton.hover == true) {
      gameRunning = false;
      //mainMenuDisplay();
      showMenu = true;
    }
  }
}

function mouseMoveHandler(e) {
  var trigger1 = false;
  if (showMenu) {  
    for (var i = 1; i < menu.buttons.length; i++) {
      menu.buttons[i].hover = false;
    }
    for (var i = 1; i < menu.buttons.length; i++) {
      if (e.clientX - canvas.offsetLeft > menu.buttons[i].x && e.clientX - canvas.offsetLeft < menu.buttons[i].x + menu.buttons[i].w && e.clientY - canvas.offsetTop > menu.buttons[i].y && e.clientY - canvas.offsetTop < menu.buttons[i].y + menu.buttons[i].h) {
        if(menu.buttons[i].enabled) {  
          menu.buttons[i].hover = true;
          menuClicked = i;
          trigger1 = true;
        }
      }
    }
    if (trigger1 == false) {
      menuClicked = 0;
    }
  }
  


  else if (showMenuSetLives) {
    var trigger2 = false;
    for (var i = 1; i < menuSetLives.buttons.length; i++) {
      menuSetLives.buttons[i].hover = false;
    }
    for (var i = 1; i < menuSetLives.buttons.length; i++) {
      if (e.clientX - canvas.offsetLeft > menuSetLives.buttons[i].x && e.clientX - canvas.offsetLeft < menuSetLives.buttons[i].x + menuSetLives.buttons[i].w && e.clientY - canvas.offsetTop > menuSetLives.buttons[i].y && e.clientY - canvas.offsetTop < menuSetLives.buttons[i].y + menuSetLives.buttons[i].h) {
        if (menuSetLives.buttons[i].enabled) {
          menuSetLives.buttons[i].hover = true;
          menuClicked2 = i;
          trigger2 = true;
        }
      }
    }
    if (trigger2 == false) {
      menuClicked2 = 0;
    }
  }
  

  else if (showMenuLifeReset) {  
    var trigger3 = false;
    for (var i = 1; i < menuSetLivesRegen.buttons.length; i++) {
      menuSetLivesRegen.buttons[i].hover = false;
    }
    for (var i = 1; i < menuSetLivesRegen.buttons.length; i++) {
      if (e.clientX - canvas.offsetLeft > menuSetLivesRegen.buttons[i].x && e.clientX - canvas.offsetLeft < menuSetLivesRegen.buttons[i].x + menuSetLivesRegen.buttons[i].w && e.clientY - canvas.offsetTop > menuSetLivesRegen.buttons[i].y && e.clientY - canvas.offsetTop < menuSetLivesRegen.buttons[i].y + menuSetLivesRegen.buttons[i].h) {
        menuSetLivesRegen.buttons[i].hover = true;
        menuClicked3 = i;
        trigger3 = true;    
      }
    }
    if (trigger3 == false){
      menuClicked3 = 0;
    }   
  }
    
  else if (gameRunning) {
   if (e.clientX - canvas.offsetLeft > homeButton.x && e.clientX - canvas.offsetLeft < homeButton.x + homeButton.w && e.clientY - canvas.offsetTop > homeButton.y && e.clientY - canvas.offsetTop < homeButton.y + homeButton.h) {
    homeButton.hover = true;
   } 
   else {
    homeButton.hover = false;
   }

  }


  }

//////////////////////////// KEY INPUT ///////////////////////////////////


function keyDownHandler(e) {
  //console.log(e.key);

  if(e.key == "a" && bul.fired == false) {
    leftMove = true;
  }

  else if(e.key == "s" && bul.fired == false) {
    rightMove = true;
  }

  else if((e.key == "Right" || e.key == "ArrowRight") && bul.fired == false) {
    rightPressed = true;
  }
  

  else if((e.key == "Left" || e.key == "ArrowLeft") && bul.fired == false){
    leftPressed = true;
  }

  else if((e.key == "Up" || e.key == "ArrowUp") && bul.fired == false){
    bul.speed += 1;
    bul.speedSet = bul.speed;
  }

  else if((e.key == "Down" || e.key == "ArrowDown") && bul.fired == false){
    bul.speed -= 1;
    bul.speedSet = bul.speed;
  }

  else if(e.key == "Escape") {
    gameRunning = false;
    mainMenuDisplay();
    console.log("BOOM!!!");
  }

  else if(e.key == "l") {
    if (bul.loaded == false){
      console.log("Loaded and Ready!!")
      bul.loaded = true;
      bul.lives--;
    } 
    else if(bul.fired == true && bul.stopped == true) {
      bul.lives--;
      bul.reload();
    }
    else {
      bul.playerMessage = "Launcher is Already Loaded";
      bul.messageShow = true;


      console.log("Launcher is already loaded!!")
    }
  }

  else if (e.key == " ") {
    if (bul.loaded == true && bul.fired == false && leftPressed == false && rightPressed == false) {
      bul.fired = true;
      console.log("FIRE!!!!");
      bul.fire();
    } else {
      console.log("Can not Fire");
    }
  }
}


function keyUpHandler(e) {
  if(e.key == "a" && bul.fired == false) {
    leftMove = false;
  }

  else if(e.key == "s" && bul.fired == false) {
    rightMove = false;
  }

  else if(e.key == "Right" || e.key == "ArrowRight"){
    rightPressed = false;
  }
  
  else if(e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  
  }
}

setPegs();

//Main Loop
function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);


  if (showMenu) {
    menu.drawMenu();
    }

  if (showMenuSetLives) {
    menuSetLives.drawMenu();
  }
  
  if (showMenuLifeReset) {
    menuSetLivesRegen.drawMenu();
  }

  if (gameRunning) {
    ctx.drawImage(bgImage, 0, 0);

    ctx.beginPath();
    ctx.rect(0, canvas.height - gameAreaBottom, canvas.width, gameAreaBottom);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();


    for (var i = 0; i < walls.length; i++) {
      if (walls[i].enabled == true) {
        walls[i].drawWall();   
      }
    }
    for (var i = 0; i < walls.length; i++) {
      walls[i].wallHit();
    }

    launcher.drawLauncher();
    pegHit();


    if (debugMode) {
      drawDebug();
    }

    homeButton.drawButton();

    // Game Over
    if (gameOver) {
      ctx.font = "100px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("Game Over", 80, canvas.height/2);
    } 


    // Not Game over
    else {

      //draw lives
      bul.drawScoreBoard();


      // player message
      if (bul.messageShow){
        if (bul.messageDelay < 40) {
          bul.drawPlayerMessage();
        }
        if (bul.messageDelay > 75) {
          bul.messageDelay = 0;
          bul.messageShow = false;  // block out line to show msg more than once
        }
        bul.messageDelay += 1;
      }

      if (leftMove && canvas.width / 2 + launcher.center > 150) {
        launcher.center -= 2;
      }
      else if (leftMove) {
          bul.playerMessage = "Limit Hit";
          bul.messageShow = true;
      }

      if (rightMove && canvas.width / 2 + launcher.center < canvas.width - 150){
        launcher.center += 2;
      }
      else if (rightMove) {
          bul.playerMessage = "Limit Hit";
          bul.messageShow = true;
      }



      // rotate launcher
      if(rightPressed) {
        if(launcher.angle < 80) {
          launcher.angleR += 1 * Math.PI / 180;
          launcher.angle = Math.round((launcher.angleR * 180/Math.PI), 0);
          //launcher.degreeAdjust += 1 * Math.PI / 180;
          var cos = Math.cos(launcher.angleR - launcher.degreeAdjust);
          var sin = Math.sin(launcher.angleR - launcher.degreeAdjust);
          bul.xTravel = cos - sin;
          bul.yTravel = sin + cos;

        }
        else {
          bul.playerMessage = "Angle Limit Hit";
          bul.messageShow = true;
        }
  

      }
      if(leftPressed) {
        if (launcher.angle > -80) {
          launcher.angleR -= 1 * Math.PI / 180;
          launcher.angle = Math.round((launcher.angleR * 180/Math.PI), 0);
          //launcher.degreeAdjust += 1 * Math.PI / 180;
          var cos = Math.cos(launcher.angleR - launcher.degreeAdjust);
          var sin = Math.sin(launcher.angleR - launcher.degreeAdjust);
          bul.xTravel = cos - sin;
          bul.yTravel = sin + cos;
        }
        else {
          bul.playerMessage = "Angle Limit Hit";
          bul.messageShow = true;
        }
      }

      // draw pegs
      for (var i = 0; i < pegSets[levelSet].length; i++) {
        if (peg[i].state == 1) {
          peg[i].draw();
        } 
      }

      //draw bullet
      if (bul.loaded == true) {
        bul.drawBullet();
      }
      if (bul.fired == true) {
        if(bul.speed > 0) {
          bul.fire();
          //goes out of canvas
          if (bul.y < 0 || bul.y > canvas.height || bul.x < 0 || bul.x > canvas.width) {
            console.log(pegWasHit);
            if (pegWasHit == false) {
              bul.lives--;
              bul.playerMessage = "Nothing Hit    Life Lost";
              bul.messageShow = true;
              multiPeg = 1;  // 1 is equal to reseting the multiplier
              }

            if (pegsLeft <= 0) {
              console.log("Next Level");
              nextLevel();
            }     

            bul.reload();
            var cos = Math.cos(launcher.angleR - launcher.degreeAdjust);
            var sin = Math.sin(launcher.angleR - launcher.degreeAdjust);
            bul.xTravel = cos - sin;
            bul.yTravel = sin + cos;
                            

          
          
          }
        } 
        
        else {
          bul.stoppedF();
          if (pegWasHit == false) {
            bul.lives--;
            }
          //below needed to recalculate fire angle in case wall hit reversed it
          var cos = Math.cos(launcher.angleR - launcher.degreeAdjust);
          var sin = Math.sin(launcher.angleR - launcher.degreeAdjust);
          bul.xTravel = cos - sin;
          bul.yTravel = sin + cos;
        }
      }
    }
  }

  if (running) {
    requestAnimationFrame(draw);
  }
}


//var interval = setInterval(draw,10);   //Removed and replaced with animateFrame

draw()


