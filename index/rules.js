
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
var logoPlay = true;
var showMenu = false;

var pegWasHit = false;
var liveResetLevel = true;

var showMenuSetLives;
var showMenuLifeReset;
var showControls;
var showLevels;
//this change

var levelSet = 0;
var pegsLeft;
var multiPeg = 1;

var score = 0;
var angleMOD = 0;
var running = true;
var bulCount = 1;


//show debug info
var debugMode = true;
var showPegNumbers = false;


// Fold ALL > ctl - K - 0


/* ##########  To-Do / Future Plans  ##########
/* region todo *\
DONE > Start (:
DONE > Fix Launcher Class
> Fix / Fine Tune collision
>>> Collison/ bul direction when edge of wall hit goes in wrong direction
> Peg image?
> Bullet Image?
> Intro sprite when first loaded
DONE > Rotate Launcher
DONE > Launcher Move Left/Right
DONE > Reset Game
DONE > Rules Menu
> Game Mode?
DONE > Custom Lives
> Unlimited Lives disabled in Custom Lives - Create way to unlock
DONE >>> Life reset on Level change
DONE >  Make Main Menu function a class to use with other menus
DONE > Menu Hover
DONE > Menu disable
DONE > Next Level Trigger
> Peg explosion/animation when hit
DONE > Score multiplier with 2+ peg hits on one launch
DONE > Game Over trigger
DONE > Main Menu button during gameplay
DONE > Save Levels?????
DONE > Choose Level???? - Would need to complete a way to save progress
> Reset level save
> More Levels
> Make peg location groups - easier level creation
> Bonus Pegs?
> Random +1 Life Peg?
> Bonus Level
DONE > Score Area
DONE > Correct Life calculation
DONE > Moving Walls
DONE > Fix odd peg location generation - Needs to generate with 1st row being 0-9, 2nd row 10-19, etc.... 
DONE > Correct Score, level, life reset on game over
DONE > Message event during gameplay (multi, no more ammo, can not fire, cant move further, etc )
> Center message on screen with variable sized string???
> Need to load bul message
DONE > Score section text disapears with game over - Fix
> 2nd Mode with On/Off pegs

> Another Mode - Maybe - Enclose entire play area and have countdown til bul ends....  have bul fill with different color to show countdown??
*/

// ##########  Images  ##########


//walls
var wallImageSRC = 'index/images/wall3.jpg';
var wallImage = new Image();
wallImage.src = wallImageSRC;
wallImage.width = 10;
wallImage.height = 10;

//background
var bgSRC = 'index/images/bg.jpg';
var bgImage = new Image();
bgImage.src = bgSRC;

//launcher
var launcherPath = 'index/images/launch.png'
var launcherIMG = new Image();
launcherIMG.src = launcherPath;

//pegs
var pegPath = 'index/images/peg.png'
var pegIMG = new Image();
pegIMG.src = pegPath;

//Controls
var controlPath = 'index/images/controls.png'
var controlIMG = new Image();
controlIMG.src = controlPath;

// Logo
var logosrc = 'index/images/myLogoSprite.png';
var logoImage = new Image();
logoImage.src = logosrc;


class logoClass {
  constructor() {
    
    this.image = logoImage;
    this.w = 450;
    this.x = (canvas.width / 2) - (this.w / 2);
    this.y = 50;
    this.totalFrames = 7;
    this.frame = 0;
    this.step = 1;
    this.picW = 825;
    this.picH = 1000;
    this.stepTime = 0;
  }


  drawLogo = function() {
    ctx.drawImage(this.image, this.picW * this.frame, 0, this.picW, this.picH, this.x, this.y, 500, 500);
    this.stepTime += 1;
    if (this.stepTime == 50 && this.frame != this.totalFrames) {
      this.stepTime = 47;
      this.frame += this.step;
    }

    if (this.stepTime == 100){
      logoPlay = false;
      mainMenuDisplay()
    }    
  }
}
var logo = new logoClass();

// ##########  Level Storage  ##########

class levelS{
  constructor() {
    this.ls = localStorage.getItem('level');
    if (this.ls == null) {
      this.ls = "Nothing Saved";
    } else {
      this.ls = this.ls;
    }
    this.checklevels();
  }

  checklevels = function() {
      if (this.ls == null) {
          console.log("Nothing Saved");
          //localStorage.setItem('group1','Show');
      } else {
          console.log("Saved Level: " + this.ls);
          
      }	
  console.log(this.ls);
  }
}

levelSave = new levelS()


//Menu Control
function mainMenuDisplay(){
  showMenuSetLives = false;
  showMenuLifeReset = false;
  showControls = false;
  showLevels = false;
  showMenu = true;
}

//mainMenuDisplay()

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
  constructor(names, nbut, wPercent, cols) {
    this.wPercent = wPercent;
    this.cols = cols;
    this.w = 500;
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
    this.switch = true;

    this.lGap = (this.w - (this.bW * 2) - this.bGap) / 3;
    
    this.rGap = (this.lGap * 2) + this.bW + this.bGap;
    /*
    this.lGap = (this.w - (this.bW * 2) - this.bGap) / 2;
    this.rGap = this.lGap + this.bW + this.bGap;
    */


    this.createButtons();
  }



  createButtons = function() {
    for (var i = 1; i <= this.numButtons; i++) {
      this.buttons[i] = [];
      this.buttons[i]["name"] = this.names[i];
      if (this.cols == 1) {
        this.buttons[i]["x"] = ((this.w * (1 - this.wPercent) / 2)) + this.x;
        //this.buttons[i]["x"] =this.x;
      }
      else if (this.cols == 2){
        if (this.switch) {
          this.buttons[i]["x"] = this.x + this.lGap;
          this.switch = !this.switch;
        } else {
          this.buttons[i]["x"] = this.x + this.rGap;
          this.switch = !this.switch;

        }
      }
      
      this.buttons[i]["y"] = this.bY;
      this.buttons[i]["w"] = this.bW;
      this.buttons[i]["h"] = this.bH;
      this.buttons[i]["hover"] = false;
      this.buttons[i]["enabled"] = true;

      if (this.switch) {
        this.bY += this.bGap + this.bH;
      }
  
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

// Menu setups
// names, number of buttons, width %, cols
var mainMenuNames = ["","Play","Reset / New Game","Controls","Set Lives","Set Life Reset", "Select Level","Reset Saved Level"];
var menu = new menuCreate(mainMenuNames, 7, 0.75, 1);
menu.buttons[6].enabled = true;
var menuSetLives = new menuCreate(["",1,2,3,4,5,6,7,8,9,"Unlimited"], 10, 0.40, 1);
menuSetLives.buttons[10].enabled = false;
var menuSetLivesRegen = new menuCreate(["","Yes - Easy","No - Hard"], 2, 0.45, 2);
var controlMenu = new menuCreate(['','Main Menu'], 1, 0.75, 1);
var levelT = [""];
for (var i = 1; i <= 20; i++) {
  levelT.push("Level " + i);
}
var levelMenu = new menuCreate(levelT, 20, 0.35, 2);

function setLevelBlackOut() {
  for (var i = 1; i <= 20; i++) {
    levelMenu.buttons[i].enabled = true;
    if (i > levelSave.ls) {
      levelMenu.buttons[i].enabled = false;
    }
  }
}

setLevelBlackOut();



//launcher
class launcherClass {
  constructor() {
    this.width = 50;
    this.height = 75;
    this.angleR = 0;
    this.angle = 0;
    this.degreeAdjust = (360-45) * Math.PI / 180;
    this.center = 0;
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
    //levelSet = 0;     ////////////////////////////////  LEVEL SET
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
  constructor(name, x, y, w, h, s, ml, mr){
    this.name = name;
    this.enabled = false;
    this.moving = false;
    this.speed = s;
    this.maxLeft = ml;
    this.maxRight = mr;
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

  moveWallX = function() {
    if (this.x + this.w >= this.maxRight || this.x <= this.maxLeft) {
      this.speed = -this.speed;
    }
    this.x += this.speed;
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

//list of walls  (x,y,w,h, speed, max L, max R)
walls[0] = new createWall("Left Side",0,0,wallThickness, canvas.height - gameAreaBottom, 0, 0, 0);
walls[0].enabled = true;
walls[1] = new createWall("Right Side", canvas.width - wallThickness, 0, wallThickness, canvas.height - gameAreaBottom, 0, 0, 0);
walls[1].enabled = true;
walls[2] = new createWall("Bottom", 0, canvas.height - gameAreaBottom, canvas.width, wallThickness, 0, 0, 0);
walls[2].enabled = true;
walls[3] = new createWall("Mid Beam", (canvas.width / 2 ) - 75, (canvas.height - gameAreaBottom) * 0.50, 150, wallThickness, 2, 100, canvas.width - 100 );
walls[4] = new createWall("Low Beam Hard", 40, canvas.height * 0.65, 200, 5, wallThickness, 30, canvas.width - 30 );

//walls[5] = new createWall();
//walls[6] = new createWall();
//walls[7] = new createWall();


/////////////////////////////////   PEG SET-UP    /////////////////////////////////
// setting pegsets for levels 
const pegRows = [];
const pegCols = [];

// Totals
var rows = 11; // Max that will fit - 15
var cols = 17; // Max that will fit - 21
// If totals are changed, level pegsets need to be reworked.
// pegsets for rows and cols auto set... no need to change those

var rowGap = (canvas.height - (canvas.height * 0.6)) / (rows);
for (var i = 0; i < rows; i ++) {
  pegRows[i] = rowGap + (rowGap * i);
}

var colGap = canvas.width / (cols + 1);
for (var i = 0; i < cols; i++) {
  pegCols[i] = (colGap + (colGap * i)) - 10;  // -10 is to offset the peg image to its center
}

var pegLocations = [];
var curRow = 0;
var curCol = 0;

//creating all peg locations
var curPegName = 0;

for (var iR = 0; iR < pegRows.length; iR++){
  console.log(iR);
  for (var iC = 0; iC < pegCols.length; iC++){
    pegLocations[curPegName] = [];
    pegLocations[curPegName][0] = "" + curPegName;
    pegLocations[curPegName][2] = pegRows[iR];  
    pegLocations[curPegName][1] = pegCols[iC];
    curPegName += 1;
  }
}

// creationg 50 sets for 50 levels
const pegSets = [];
for (var i = 0; i < 50; i++) {
  pegSets[i] = [];
}

// create level with all locations
var allPegs = [];
for (var i = 0; i < cols * rows; i++){
  allPegs.push(i);
}

// location sets
var locationGroup = [];
var locRowSet = ["row1","row2","row3","row4","row5","row6","row7","row8","row9","row10","row11","row12","row13","row14","row15","row16","row17"]
var locColSet = ["col1","col2","col3","col4","col5","col6","col7","col8","col9","col10","col11","col12","col13","col14","col15","col16","col17"]
//rows
for (var i = 0; i < rows; i++){
  locationGroup[locRowSet[i]] = Array.from(Array(cols), (_, ii) => ii + (cols * i));
  //pegSets[i+1] = locationGroup[locRowSet[i]];
}
//cols
for (var i = 0; i < cols; i++){
  locationGroup[locColSet[i]] = [];
  for(var ii = 0; ii < rows; ii++){
    locationGroup[locColSet[i]].push(i + ii * (cols));
  }
  //pegSets[rows + i] = locationGroup[locColSet[i]];
}
//shapes

locationGroup["v"] = [38,73,108,143,178,145,112,79,46];
locationGroup["w"] = [34,69,104,139,174,141,108,75,42,77,112,147,182,149,116,83,50];
locationGroup["hi"] = [19,20,36,37,53,54,70,71,87,88,104,105,121,122,138,139,155,156,23,24,40,41,57,58,74,75,91,92,108,109,125,126,142,143,159,160,89,90,106,107,
26,27,28,29,30,31,43,44,45,46,47,48,62,63,79,80,96,97,113,114,130,131,145,146,147,148,149,150,162,163,164,165,166,167]

locationGroup["all"] = allPegs;


pegSets[0] = locationGroup["all"];  // for testing and position numbers // future plan to use as a Bonus Round
pegSets[1] = locationGroup['col7'].concat(locationGroup['col11']);
pegSets[2] = locationGroup['col6'].concat(locationGroup['col12']);
pegSets[3] = locationGroup['col5'].concat(locationGroup['col13']);
pegSets[4] = locationGroup['col4'].concat(locationGroup['col14']);
pegSets[5] = locationGroup['col6'].concat(locationGroup['col12']); //w moving wall
pegSets[6] = locationGroup['col5'].concat(locationGroup['col13']); //w moving wall
pegSets[7] = locationGroup['col4'].concat(locationGroup['col14']); //w moving wall
pegSets[8] = locationGroup['col7'].concat(locationGroup['col8'], locationGroup['col9'], locationGroup['col10'], locationGroup['col11']);
pegSets[9] = locationGroup['col4'].concat(locationGroup['col5'],locationGroup['col6'],locationGroup['col12'],locationGroup['col13'],locationGroup['col14']);
pegSets[10] = locationGroup["hi"];
pegSets[11] = locationGroup['v'];
pegSets[12] = locationGroup['w'];
pegSets[13] = locationGroup['v'].concat(locationGroup['w']);
pegSets[14] = locationGroup['v'].concat(locationGroup['w']);


//pegs
class pegSet {
  constructor(name, x, y) {
    this.name = name; 
    this.x = x;
    this.y = y;
    this.state = 1;
    this.r = 10;
  }

  draw = function () {
    if (showPegNumbers) {
      //for peg pos
      ctx.font = "20px Arial";
      ctx.fillStyle = "red";
      ctx.fillText(this.name, this.x, this.y) 
    }
    else {    
      
      ctx.drawImage(pegIMG, this.x, this.y, 20, 20);
      
      /*
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();   
      */
    }
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
  if (levelSet > localStorage.getItem('level')){
    localStorage.setItem('level',levelSet);
  }

  if (levelSet == 5 || levelSet == 6 || levelSet == 7 || levelSet == 8 || levelSet == 14){
    walls[3].enabled = true;
    walls[3].moving = true;
  }
  else {
    walls[3].enabled = false;
    walls[3].enabled = false;
  }

  if (levelSet == 9 || levelSet == 10 || levelSet == 14){
    walls[4].enabled = true;
    walls[4].moving = true;
  }
  else {
    walls[4].enabled = false;
    walls[4].enabled = false;
  }
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

function drawControls(){
  w = 300;
  h = 200;
  x = (canvas.width / 2) - (this.w / 2);
  y = 200;
  ctx.drawImage(controlIMG, x, y, w, h);

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
var menuClicked4;
var menuClicked5;


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
        menu.buttons[6].enabled = false;
        break;

      case 2:
        menu.buttons[4].enabled = true;
        menu.buttons[5].enabled = true;
        menu.buttons[6].enabled = true;
        menu.buttons[1].enabled = true;
        bul = new bullet();
        launcher = new launcherClass();
        levelSet = 0;
        nextLevel();
        gameOver = false;
        setLevelBlackOut();
        
        break;

      case 3:
        showMenu = false;
        showControls = true;

        break;

      case 4:
        showMenu = false;
        showMenuSetLives = true;
        break;
          
      case 5:
        showMenu = false;
        showMenuLifeReset = true;
        break;

      case 6:
        showMenu = false;
        showLevels = true;
        break;

      case 7:
        localStorage.removeItem('level');
        console.log(levelSave.ls);
        levelSave.ls = 1;
        setLevelBlackOut();
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
  
    if (showControls){
      if (menuClicked4 == 1) {
        //showMenu = true;
        //showControls = false;
        mainMenuDisplay();
      }
    }

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

    if(showLevels){
      if (menuClicked5 != 0){
        levelSet = menuClicked5 - 1; //take one away because it will call "next level" function that adds a level
        nextLevel();
        mainMenuDisplay();
      }
    }

    if (homeButton.hover) {
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
  
  else if(showControls) {
    var trigger4;
    for (var i = 1; i < controlMenu.buttons.length; i++) {
      controlMenu.buttons[i].hover = false;
    }
    for (var i = 1; i < controlMenu.buttons.length; i++) {
      if (e.clientX - canvas.offsetLeft > controlMenu.buttons[i].x && e.clientX - canvas.offsetLeft < controlMenu.buttons[i].x + controlMenu.buttons[i].w && e.clientY - canvas.offsetTop > controlMenu.buttons[i].y && e.clientY - canvas.offsetTop < controlMenu.buttons[i].y + controlMenu.buttons[i].h) {
        if (controlMenu.buttons[i].enabled) {
          controlMenu.buttons[i].hover = true;
          menuClicked4 = i;
          trigger4 = true;
        }
      }
    }
    if (trigger4 == false) {
      menuClicked4 = 0;
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

  else if(showLevels){
    var trigger5 = false;
    for (var i = 1; i < levelMenu.buttons.length; i++) {
      levelMenu.buttons[i].hover = false;
    }
    for (var i = 1; i < levelMenu.buttons.length; i++) {
      if (e.clientX - canvas.offsetLeft > levelMenu.buttons[i].x && e.clientX - canvas.offsetLeft < levelMenu.buttons[i].x + levelMenu.buttons[i].w && e.clientY - canvas.offsetTop > levelMenu.buttons[i].y && e.clientY - canvas.offsetTop < levelMenu.buttons[i].y + levelMenu.buttons[i].h) {
        if (levelMenu.buttons[i].enabled) {
          levelMenu.buttons[i].hover = true;
          menuClicked5 = i;
          trigger5 = true;
        }
        else {
          menuClicked5 = 0;
        }
      }      
    }
    if (trigger5 == false) {
      menuClicked5 = 0;
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
    if (bul.loaded == true && bul.fired == false && leftPressed == false && rightPressed == false && leftMove == false && rightMove == false) {
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

  if (logoPlay) {
    logo.drawLogo();
  }


  if (showMenu) {
    menu.drawMenu();
    }

  if (showControls){
    controlMenu.drawMenu();
    drawControls();
  }

  if (showMenuSetLives) {
    menuSetLives.drawMenu();
  }
  
  if (showMenuLifeReset) {
    menuSetLivesRegen.drawMenu();
  }

  if (showLevels){
    levelMenu.drawMenu();

  }


  if (gameRunning) {
    ctx.drawImage(bgImage, 0, 0);

    ctx.beginPath();
    ctx.rect(0, canvas.height - gameAreaBottom, canvas.width, gameAreaBottom);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();


    for (var i = 0; i < walls.length; i++) {
      if (walls[i].enabled) {
        if (walls[i].moving) {
          walls[i].moveWallX();
        }        
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

    //draw lives
    bul.drawScoreBoard();




    // Game Over
    if (gameOver) {
      ctx.font = "100px Arial";
      ctx.fillStyle = "red";
      ctx.fillText("Game Over", 80, canvas.height/2);
      menu.buttons[1].enabled = false;
    } 


    // Not Game over
    else {


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


