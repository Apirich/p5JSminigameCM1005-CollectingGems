/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var previousKeycode;

var trees_x;
var clouds;
var mountains;
var canyons;
var collectables;

var game_score;

var flagpole;

var lives;

var jumpSound;

var platforms;

var enemies;


function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    
    //Lives
    lives = 3;
    
    //Start game
    startGame();
}


function draw()
{
    //Fill the sky blue
	background(100, 155, 255); 

    //Draw some green ground
	noStroke();
	fill(0, 155, 0);
	rect(0, 
         floorPos_y, 
         width, 
         height/4); 

    push();
    translate(scrollPos, 0);
    
	//Draw clouds.
    drawClouds();
    
	//Draw mountains.
    drawMountains();

	//Draw trees.
    drawTrees();
    
	//Draw canyons.
    for(var i = 0; i < canyons.length; i++)
        {
            drawCanyons(canyons[i]);
            if(!isPlummeting)
            {
                checkCanyons(canyons[i]);
                
                //Draw lives
                checkPlayerDie();
            }
        }

    //Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
        {
            //Check collectable items
            if(!collectables[i].isFound)
            {
                drawCollectables(collectables[i]);
                checkCollectables(collectables[i]); 
            } 
        }

    //Draw flag pole
    renderFlagpole();
    
    //Draw platforms
    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
    
    //Draw enemies
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
        
        var en_isContacted = enemies[i].checkContacted(gameChar_world_x, gameChar_y);
        if(en_isContacted)
        {
            if(lives > 0)
            {
                lives -= 1;
                startGame();
                break;
            }
        }
    }
    
    //Plummeting is true
    if(isPlummeting)
    {
        gameChar_y += 3;
    }
    
    pop();
    
    //Draw game score
    fill(255);
    noStroke();
    textSize(16);
    text("Score:" + game_score, 20, 20);
    
    //Draw life tokens
    for(var i = 0; i < lives; i++)
        {
            fill(255);
            text("Lives :", 20, 40);
            fill(170, 200, 120);
            ellipse(80 + 30 * i, 35, 17, 17);
        }
    
	//Draw game character.
	drawGameChar();
    
	//Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

    //Draw game over
    if(lives < 1)
    {
        var GameOver = "Game Over. Press space to continue.";
        var tW_GO = textWidth(GameOver);
        fill(255, 30, 30);
        textSize(37);
        textStyle(BOLD);
        text(GameOver, width/2 - tW_GO, height/2);
        return
    }
    
    //Draw Level Complete
    if(flagpole.isReached)
    {
        var LevelComplete = "Level complete. Press space to continue.";
        var tW_LC = textWidth(LevelComplete);
        fill(255, 30, 30);
        textSize(37);
        textStyle(BOLD);
        text(LevelComplete, width/2 - tW_LC, height/2);
        return
    }

    
	//Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y)
    {
        var pf_isContacted = false;
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y))
            {
                pf_isContacted = true;
                break;
            }
        }
        if(!pf_isContacted)
        {
            gameChar_y += 2;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    
    //Draw check flag pole
    if(!flagpole.isReached)
    {
        checkFlagpole();
    }

	//Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    //If statements to control the animation of the character when
	//Keys are pressed.
    if(keyCode == 37)
    {
        isLeft = true;
    }
    
    if(keyCode == 39)
    {
        isRight = true;
    }
    
    if(keyCode == 32)
    {
        if(!isFalling)
        {
            gameChar_y -= 100;
            jumpSound.play();
        }
    }
    
    if((previousKeycode == 37 || previousKeycode == 39) && keyCode == 32)
    {
        isFalling = true;
        jumpSound.play();
    }
    previousKeycode = keyCode;
}


function keyReleased()
{
	//If statements to control the animation of the character when
	//Keys are released.
    if(keyCode == 37)
    {
        isLeft = false;
    }
    else if(keyCode == 39)
    {
        isRight = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

//Function to draw the game character.

function drawGameChar()
{
	//Draw game character
	if(isLeft && isFalling)
	{
    //Jumping to the left
    //body
    fill(100, 100, 240);
    rect(gameChar_x - 11, 
         gameChar_y - 42, 
         22, 
         38);

    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 56, 
            24, 
            34);
    
    //Left eye
    fill(0);
    ellipse(gameChar_x - 6, 
            gameChar_y - 60, 
            5, 
            7);
    
    //Right hand
    fill(230, 80, 80);
    rect(gameChar_x - 3, 
         gameChar_y - 74, 
         8, 
         38, 
         3);
    
    //Right foot
    fill(230, 80, 80);
    rect(gameChar_x - 3, 
         gameChar_y - 8, 
         8, 
         8, 
         2);
	}
    
	else if(isRight && isFalling)
	{                                            
    //Jumping right
    //Body
    fill(100, 100, 240);
    rect(gameChar_x - 11, 
         gameChar_y - 42, 
         22, 
         38);
    
    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 56, 
            24, 
            34);
    
    //Right eye
    fill(0);
    ellipse(gameChar_x + 6, 
            gameChar_y - 60, 
            5, 
            7);
    
    //Right hand
    fill(230, 80, 80);
    rect(gameChar_x - 5, 
         gameChar_y - 74, 
         8, 
         38, 
         3);
    
    //Right foot
    fill(230, 80, 80);
    rect(gameChar_x - 5, 
         gameChar_y - 8, 
         8, 
         8, 
         2);
	}
    
	else if(isLeft)
	{
    //Walking, turned left
    //Body
    fill(100, 100, 240);
    rect(gameChar_x - 10, 
         gameChar_y - 42, 
         18, 
         40);
	
    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 58, 
            26, 
            36);
    
    //Left eye
    fill(0);
    ellipse(gameChar_x - 6, 
            gameChar_y - 62, 
            5, 
            5);
    
    //Left hand
    fill(230, 80, 80);
    rect(gameChar_x - 9, 
         gameChar_y - 44, 
         10, 
         10, 
         3);
    
    //Left foot
    fill(230, 80, 80);
    rect(gameChar_x - 9, 
         gameChar_y - 8, 
         10, 
         10, 
         2); 
	}
    
	else if(isRight)
	{
    //Walking, turned right
    //Body
    fill(100, 100, 240);
    rect(gameChar_x - 9, 
         gameChar_y - 42, 
         18, 
         40);
	
    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 58, 
            26, 
            36);
    
    //Right eye
    fill(0);
    ellipse(gameChar_x + 6, 
            gameChar_y - 62, 
            5, 
            5);
    
    //Right hand
    fill(230, 80, 80);
    rect(gameChar_x - 2, 
         gameChar_y - 44, 
         10, 
         10, 
         3);
    
    //Right foot
    fill(230, 80, 80);
    rect(gameChar_x - 2, 
         gameChar_y - 8, 
         10, 
         10, 
         2);
	}
    
	else if(isFalling || isPlummeting)
	{
    //Jumping facing forwards
    //Body
    fill(100, 100, 240);
    rect(gameChar_x - 11, 
         gameChar_y - 42, 
         22, 
         38);
    
    //Hands
    fill(230, 80, 80);
    //Left
    rect(gameChar_x - 18, 
         gameChar_y - 74, 
         8, 
         38, 
         3);
    //Right
    rect(gameChar_x + 10, 
         gameChar_y - 74, 
         8, 
         38, 
         3);
    
    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 56, 
            34, 
            34);
    
    //Eyes
    fill(0);
    //Left 
    ellipse(gameChar_x - 7, 
            gameChar_y - 60, 
            5, 
            7);
    //Right
    ellipse(gameChar_x + 7, 
            gameChar_y - 60, 
            5, 
            7);
    
    //Feet
    fill(230, 80, 80);
    //Left
    rect(gameChar_x - 14, 
         gameChar_y - 8, 
         8, 
         8, 
         2); 
    //Right
    rect(gameChar_x + 6, 
         gameChar_y - 8, 
         8, 
         8, 
         2);
	}
    
	else
	{
    //Standing front facing 
    //Body
    fill(100, 100, 240);
    rect(gameChar_x - 12, 
         gameChar_y - 42, 
         24, 
         40);
    
    //Head
    fill(230, 130, 100);
    ellipse(gameChar_x, 
            gameChar_y - 58, 
            36, 
            36);
    
    //Eyes
    fill(0);
    //Left 
    ellipse(gameChar_x - 7, 
            gameChar_y - 62, 
            5, 
            5);
    //Right
    ellipse(gameChar_x + 7, 
            gameChar_y - 62, 
            5, 
            5);

    //Hands
    fill(230, 80, 80);
    //Left
    rect(gameChar_x - 15, 
         gameChar_y - 44, 
         10, 
         10, 
         3);
    //Right
    rect(gameChar_x + 5, 
         gameChar_y - 44, 
         10, 
         10, 
         3);
    
    //Feet
    fill(230, 80, 80);
    //Left
    rect(gameChar_x - 15, 
         gameChar_y - 8, 
         10, 
         10, 
         2); 
    //Right
    rect(gameChar_x + 5, 
         gameChar_y - 8, 
         10, 
         10, 
         2);
	}
}


// ---------------------------
// Background render functions
// ---------------------------

//Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
        {
            //Rightcloud
                fill(255); 
                ellipse(clouds[i].x_pos + 200, 
                        clouds[i].y_pos, 
                        clouds[i].width + 20, 
                        65); 
    
            //Leftcloud
            fill(150, 190, 220);
            ellipse(clouds[i].x_pos + 120, 
                    clouds[i].y_pos + 5, 
                    clouds[i].width, 
                    55); 
    
            //Middlecloud
            fill(255, 255, 255);
            ellipse(clouds[i].x_pos + 140, 
                    clouds[i].y_pos - 25, 
                    clouds[i].width - 20, 
                    60); 
        }
}


//Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
        {
            //1stleft
            fill(0, 160, 170);
            triangle(mountains[i] + 450, 256, 
                     mountains[i] + 500, 216, 
                     mountains[i] + 580, 256); 
    
            //2ndleft
            fill(0, 160, 170, 160);
            triangle(mountains[i] + 520, 256, 
                     mountains[i] + 560, 190, 
                     mountains[i] + 700, 256); 
    
            //3rdleft
            fill(30, 130, 150);
            triangle(mountains[i] + 580, 256, 
                     mountains[i] + 800, 160, 
                     mountains[i] + 900, 256); 
        }
}


//Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
        {
            //Trunk
            fill(150, 110, 100);
            rect(trees_x[i], 
                floorPos_y - 82, 
                30, 
                82); 

            //Littetrunk
            fill(150, 110, 100);
            ellipse(trees_x[i] + 5, 
                    floorPos_y - 44, 
                    32, 
                    10); 
    
            //Lowbushes
            fill(215, 190, 0);
            ellipse(trees_x[i] + 5, 
                    floorPos_y - 87, 
                    140, 
                    50); 

            //Centerbushes
            fill(220, 190, 0);
            ellipse(trees_x[i] + 15, 
                    floorPos_y - 112, 
                    70, 
                    92); 
        }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.
function drawCanyons(t_canyon)
{
    //1stleft
            noStroke();
            fill(200, 100, 0);
            rect(t_canyon.x_pos + 15, 
                 486, 
                 t_canyon.width - 50, 
                 90, 
                 30, 10, 0, 0); 
    
            //roundcanyon
            stroke(240, 120, 30);
            strokeWeight(30);
            point(t_canyon.x_pos + (t_canyon.width/2) - 10, 
                  471); 

            //2ndleft
            noStroke();
            fill(220, 140, 50);
            rect(t_canyon.x_pos + t_canyon.width - 35, 
                 432, 
                 t_canyon.width - 20, 
                 144, 
                 10, 20, 0, 0); 

            //1stlefttexture
            stroke(255, 180, 0);
            strokeWeight(3);
            line(t_canyon.x_pos + t_canyon.width - 25, 432, 
                 t_canyon.x_pos + t_canyon.width - 25, 532); 

            //2ndlefttexture
            stroke(200, 40, 0);
            strokeWeight(20);
            line(t_canyon.x_pos + t_canyon.width, 460, 
                 t_canyon.x_pos + t_canyon.width + 10, 576); 
}


// Function to check character is over a canyon.
function checkCanyons(t_canyon)
{
    //Jumping over the canyon
    if(t_canyon.x_pos < gameChar_world_x 
       && gameChar_world_x < (t_canyon.x_pos + t_canyon.width) 
       && gameChar_y == floorPos_y)
    {
        isPlummeting = true;
    } 
}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.
function drawCollectables(t_collectable)
{
    //gemstone
    noStroke();
    fill(100, 0, 180);
    rect(t_collectable.x_pos, 
         t_collectable.y_pos, 
         10, 
         22, 
         4); 
}


// Function to check character has collected an item.
function checkCollectables(t_collectable)
{
    // Coll items are collected
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 30)
    {
        t_collectable.isFound = true;
        game_score += 1;
    }
}


// ----------------------------------
//Flag pole render and check functions
// ----------------------------------

//Function to draw flag pole
function renderFlagpole()
{
    push();
    stroke(255, 0, 0);
    strokeWeight(12);
    line(flagpole.x_pos, 
         floorPos_y, 
         flagpole.x_pos, 
         floorPos_y - 230);
    noStroke();
    fill(0, 0, 230);
    
    //Flag pole isReached conditional statement
    if(flagpole.isReached)
    {
        triangle(flagpole.x_pos - 10, floorPos_y - 200, 
                 flagpole.x_pos - 10, floorPos_y - 250, 
                 flagpole.x_pos + 70, floorPos_y - 200);
    }
    else
    {
        triangle(flagpole.x_pos - 10, floorPos_y, 
                 flagpole.x_pos - 10, floorPos_y - 50, 
                 flagpole.x_pos + 70, floorPos_y);
    }
    
    pop();
}


//Function to check flag pole
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d < 16)
    {
        flagpole.isReached = true;
    }
}


// ----------------------------------
//Lives, start game and check player die
// ----------------------------------

//Function to check player die
function checkPlayerDie()
{
    if(isPlummeting)
    {
        lives -= 1;
    }
    if(isPlummeting && lives > 0)
    {
        startGame();
    }
}


//Function to start game
function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
    
    //previous Keycode for movement
    previousKeycode = "";

	// Initialise arrays of scenery objects.
    //trees
    trees_x = [-15, 760, 1480, 2030];
    
    //clouds
    clouds = [
                {x_pos: -10, y_pos: 100, width: 100},
                {x_pos: 830, y_pos: 150, width: 80},
                {x_pos: 1680, y_pos: 120, width: 120},
                {x_pos: 2280, y_pos: 120, width: 110}
             ];
    
    //mountains
    mountains = [-450, 365, 1000, 1600];
    
    //canyons
    canyons = [
                {x_pos: 20, width: 100},
                {x_pos: 940, width: 100},
                {x_pos: 1840, width: 100}
             ];
    
    //collectable items
    collectables = [
                    {x_pos: 350, y_pos: 410, isFound: false},
                    {x_pos: 1430, y_pos: 410, isFound: false},
                    {x_pos: 2330, y_pos: 410, isFound: false}
                 ];
    
    //game score
    game_score = 0;
    
    //flag pole
    flagpole = {x_pos: 2600, isReached: false};
    
    //platforms
    platforms = [];
    for(var i = 0; i < 3; i++)
    {
        platforms.push(createPlatforms(200 + i * 600, floorPos_y - 100, 120 + i * 30));
    }
    
    //enemies
    enemies = [];
    for(var i = 0; i < 3; i++)
    {
        enemies.push(new Enemy(230 + i * 430, floorPos_y, 120 + i * 20));
    }
}

//Platform Extension comment

//This extension is not so difficult for me and I didn't get stuck at all, but I learnt that when we use a factory pattern or an object in a created function then we have to return the value of the object at the end of the function otherwise when the function is called p5.js will not get the value.

//Function to create a platform
function createPlatforms(x, y, length)
{
    var p = {
                x: x,
                y: y,
                length: length,
                draw: function()
                {
                    fill(255, 0, 0);
                    rect(this.x, this.y, this.length, 17);
                },
                checkContact: function(gc_x, gc_y)
                {
                    if(gc_x > this.x && gc_x < this.x + this.length)
                    {
                        var d = this.y - gc_y;
                        if(d >= 0 && d < 5)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
            }
    
    return p;
}


//Enemy Extension comment

//I can easily pass this extension with the tutor the video. I learnt that when we draw two characters or more, the distance between them is somehow not accurate at all with our calculation, just as the tutor video, p5.js calculations and my calculations for the distance between game character and enemies character are not match, not that much different thus around 10 - 20 pxl. The trick is that we can fix it by using console.log.

//Function to create an enemy
function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.incr = 1;
    
    this.update = function()
    {
        this.currentX += this.incr;
        if(this.currentX >= this.x + this.range)
        {
            this.incr = -1;
        }
        else if(this.currentX < this.x)
        {
            this.incr = 1;
        }
    }
    
    this.draw = function()
    {
        this.update()
        fill(210, 180, 140);
        beginShape();
        vertex(this.currentX, this.y);
        vertex(this.currentX + 12, this.y - 12);
        vertex(this.currentX + 24, this.y);
        vertex(this.currentX + 36, this.y - 12);
        vertex(this.currentX + 48, this.y);
        vertex(this.currentX + 36, this.y - 24);
        vertex(this.currentX + 24, this.y - 12);
        endShape(CLOSE);
        fill(0, 0, 0);
        ellipse(this.currentX + 36, this.y - 18, 2);
    }
    
    this.checkContacted = function(gc_x, gc_y)
    {
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        if(d < 23)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
