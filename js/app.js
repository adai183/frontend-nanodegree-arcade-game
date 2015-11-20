
"use strict";
// Board object to hold constants for the board
// and any other default values.
// During the game the values ENEMY_MAX_SPEED, ENEMY_MIN_SPEED and LEVEL 
// are modified to increase difficulty for highr levels.
var Board = {
    BOARD_HEIGHT: 606,
    BOARD_WIDTH: 505,
    BLOCK_WIDTH: 101,
    BLOCK_HEIGHT: 83,
    PLAYER_START_X: 202,
    PLAYER_START_Y: 392,
    GEM_WIDTH : 25,
    GEM_HEIGHT: 42,
    Y_OFFSET: 60,
    ENEMY_MAX_SPEED: 200,
    ENEMY_MIN_SPEED: 100,
    ENEMY_NUMBER: 3,
    LEVEL: 1,
    LIVES: 3,
    PLAYER_SPRITES: ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png']
};



// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Default min and max speeds
    this.minSpeed = Board.ENEMY_MIN_SPEED;
    this.maxSpeed = Board.ENEMY_MAX_SPEED;
    
    // Calculate default speed of this enemy
    this.speed = this.maxSpeed - this.minSpeed;

    // Set this enemy in a starting position.
    this.returnToStart();

    // Set wait parameter to false on instantiation
    this.wait = false;
    
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
 
// Avoid collision between enemies
    this.avoidCollision();

 // Check whether this enemy has collided with player
    this.checkForCollisionWithPlayer();

    // If this enemy is off the board, return it to the start.
    // Otherwise move forward based on this enemy's speed.
    if (this.x > Board.BOARD_WIDTH) {
        this.returnToStart();
    } else if (!this.wait) { // check wether enemy has to wait
        this.x = this.x + dt * this.speed;
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Return the Enemy to a starting position
Enemy.prototype.returnToStart = function() {
/* Set the x position to off the left of the board. Icrease offboard distance randomly  
to achieve different enemy formations. Algorythm can be improved to adjust difficulty of the game.
 */

    this.x = - Board.BLOCK_WIDTH * (Math.floor(Math.random() * 6)) ;
    
    // Set the y position to a random row
    this.setRandomRow();
};



// Set random Row for this enemy
Enemy.prototype.setRandomRow = function() {
    this.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT * Math.floor(Math.random() * 3);

};

// Set random speed for this enemy

Enemy.prototype.setRandomSpeed = function (){
    this.speed = Math.floor(Math.random() * (Board.ENEMY_MAX_SPEED -Board.ENEMY_MIN_SPEED) + Board.ENEMY_MIN_SPEED);
};

function getEnemyPairs() {
    // Permutation helper funtion to list every possible pair in an array. 
    var enemyPairs = []; 
    for (var i = 0, len = allEnemies.length; i < len; i++) {
        for (var j = i + 1; j < allEnemies.length; j++) {
               var arr = [allEnemies[i], allEnemies[j]];
                enemyPairs.push(arr);
        }
        //allEnemies[i].wait = false; // not needed -DN
    }
    return enemyPairs;
}

// Set the wait property of every member of allEnemies to bool (true or false)
function setAllEnemiesWait(bool) {
    for (var i = 0, len = allEnemies.length; i < len; i++) {
       allEnemies[i].wait = bool;
    }
}

// Avoid Collision between enemies by using the wait prameter
Enemy.prototype.avoidCollision = function(){
    setAllEnemiesWait(false);
    enemyPairs.forEach(function(pair) {
    // This code must handle the checking-for-collision of each array `pair`
    // which is guaranteed to hold two unique enemies.
        var e1 = pair[0];
        var e2 = pair[1];
    
    // Do this to be sure e1 is the one enemy further back
        var temp;

        if (e2.x < e1.x) {
          temp = e1;
          e1 = e2;
          e2 = temp;
        }
    
    // Detect collision
    // Check whether this enemy's bounds overlap with other enemy
    // Use BLOCK_HEIGHT to ensure that collisions only occur if on the same row.
    // Descrease the widths from 101 to 95 to provide more detailed
    // collision detection rather than just being on the same block.
        if (e1.x < e2.x + 95 &&
            e1.x + 95 > e2.x &&
            e1.y < e2.y + Board.BLOCK_HEIGHT &&
            Board.BLOCK_HEIGHT + e1.y > e2.y) {
            
            // collision detected!
            // make e1 wait and e2 accelerate
            e1.wait = true;
            e2.speed = e1.speed + 30;
        }
    });
};


// Check for collision with player
Enemy.prototype.checkForCollisionWithPlayer = function() {
// Check whether this enemy's bounds overlap with the player
// Use BLOCK_HEIGHT for both player and enemy heights to ensure
// that collisions only occur if on the same row.
// Descrease the widths from 101 to 60 to provide more detailed
// collision detection rather than just being on the same block.
    if (Math.floor(this.x) < player.x + 60 &&
        Math.floor(this.x) + 60 > player.x &&
        this.y < player.y + Board.BLOCK_HEIGHT &&
        Board.BLOCK_HEIGHT + this.y > player.y) {
        // collision detected!
        // cause players death
        player.death();
        
    }
};






// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Load player image
    this.sprite = 'images/char-boy.png';

    // Select a random sprite to start
    this.changeToRandomCharacter();

     // Start with 3 lives
    this.lives = 3;

    // Set game_over parameter to false on instantiation
    this.game_over = false;

    // Set won_game parameter to false on instantiation
    this.won_game = false;

    // Set got_hit parameter to false on instantiation
    this.got_hit = false;

    // Place player at starting position
    this.returnToStart();


    // Gems player can collect
    // Load gem image
    this.gemSprite = 'images/Gem Orange.png';
    // Set gem to a random start position
    this.randomGemlocation();
    // Set the amount of gems the player collected to 0 at the beginning
    this.gemsCollected = 0;

};

// Add random gem positon inside the stone area
Player.prototype.randomGemlocation = function() {
     
     // Position gem randomly in one of the 5 stone columns
     this.gemX =   Board.BLOCK_WIDTH  * Math.floor(Math.random() * 5) + Math.floor(Board.BLOCK_WIDTH/2);
     
     // Position gem randomly in one of the 3 stone rows
     this.gemY = Board.PLAYER_START_Y - Board.BLOCK_HEIGHT - Board.BLOCK_HEIGHT * Math.floor(Math.random() * 3);
},

// Check for collision between player and gem
Player.prototype.collectGem = function() {
// Check players position and see whether player should collect gem. 
// Caution: I resized the Orange gem.png to more or less 50% size!!! 
// This is why I have to subtract 50% block width for overlapping X coordinates
//I figured out I had to subtract block height for overlapping  Y coordinates.
    
    if (this.x == this.gemX - Math.floor(Board.BLOCK_WIDTH/2) &&
        this.y == this.gemY - Board.BLOCK_HEIGHT) {
        // collision detected!
        // reposition gem 
        this.randomGemlocation();
        // add gem to player score
        this.gemsCollected++;
    }
};

Player.prototype.update = function(dt) {

     // Check if the player has won
    if (this.hasWonTheGame()) {
        this.wonGame();
    }
};

Player.prototype.render = function() {
    var showWon = function (){
                ctx.fillStyle = "green";
                ctx.font = "bold 64px console";
                ctx.fillText("YOU WIN !!! ", 80, 200);
                ctx.font = "bold 46px console";
                ctx.fillText("LEVEL " + Board.LEVEL , 150, 270);
    };


     var showOuch = function (){
                ctx.fillStyle = "red";
                ctx.font = "bold 64px console";
                ctx.fillText("OUCH !!!",  120, 200);
                ctx.font = "bold 46px console";
                ctx.fillText( Board.LIVES + "  LIVES", 150, 270);
    };

    // render player
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
   // console.log ("Player", this.x, this.y)
   
    // Show GAME OVER on canvas
    if (this.game_over === true){
        
                ctx.fillStyle = "red";
                ctx.font = "bold 64px console";
                ctx.fillText("GAME OVER", 50, 275);
        
    }

    // Show YOU WON !!! on canvas  
    if (this.won_game === true){
        showWon();
    }

    // Show OUCH !!! on canvas  
    if (this.got_hit === true && this.game_over === false){
        showOuch();
    }    
    
    // check wether gem got collected
     this.collectGem();
    // render gems 
    ctx.drawImage(Resources.get(this.gemSprite), this.gemX, this.gemY);
    
};


Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        // Allow all 'up' movements, as a win will be
        // anything in the water at the top of the board
        this.y = this.y - Board.BLOCK_HEIGHT;
        this.won_game = false;
        this.got_hit = false;
    } else if (key == 'left') {
        // Ensure player will still be on the board
        if (this.x > 0) {
            this.x = this.x - Board.BLOCK_WIDTH;
        }
    } else if (key == 'right') {
        // Ensure player will still be on the board
        if (this.x < Board.BOARD_WIDTH - Board.BLOCK_WIDTH) {
            this.x = this.x + Board.BLOCK_WIDTH;
        }
    } else if (key == 'down') {
        // Ensure player will still be on the board
        if (this.y < Board.PLAYER_START_Y) {
            this.y = this.y + Board.BLOCK_HEIGHT;
        }
    }else if (key == 'enter') {
            location.reload();
    }else if (key == 'c') {
        // Change the player sprite image
        this.changeCharacter();
    }
};


// Check whether the player has successfully won the game.
// Return true if the player is in a state where they have won.
// Return false if the player is not in a winning state.
Player.prototype.hasWonTheGame = function() {
    // Default win is if the player is in the water
    return (this.y <= 0) ? true : false;
};

// Action to take when player wins
Player.prototype.wonGame = function() {
    // Let user know they won the game
    this.won_game = true;
    
    // Return player to start
    this.returnToStart();
    
    // Create faster enemies for next level
    Board.ENEMY_MIN_SPEED = Board.ENEMY_MIN_SPEED * 1.3;
    Board.ENEMY_MAX_SPEED = Board.ENEMY_MAX_SPEED * 1.3;
    Board.LEVEL++;
    

    allEnemies = [];
    for (var i = 0; i < Board.ENEMY_NUMBER; i++) {
    var enemy = new Enemy();
    enemy.setRandomRow();
    enemy.setRandomSpeed();
    allEnemies.push(enemy);
    }
    enemyPairs = getEnemyPairs();
};

// Action to take when player loses
Player.prototype.lostGame = function() {
    // Let user know they lost the game
    scoreboard.message = "---------- Sorry, You Lost :( ----------";
    this.gameOver();
};

// Game Over Sequence
Player.prototype.gameOver = function() {
   
    // Return player to start
    this.returnToStart();

    // Clear all the enemies
    allEnemies = [];

    // Remove the key input listener to
    // prevent player from moving after gameover.
    document.removeEventListener('keyup', passKeyUpValue);
};



// Action to take on player's death
Player.prototype.death = function() {
    // Take away a life
    this.lives--;
    Board.LIVES--;

    // Set got_hit  to true to show OUCH message 
    this.got_hit = true;

    // Return player to the start
    this.returnToStart();

    
    if (this.lives < 1) {
        this.lostGame();
        this.game_over = true;
    }
};

// Return player to starting position
Player.prototype.returnToStart = function() {
    // x position: left side of player is 2 block widths over.
    this.x = Board.BLOCK_WIDTH * 2;
    // y position: top side of player is 4 blocks down + an offset.
    this.y = Board.BLOCK_HEIGHT * 4 + Board.Y_OFFSET;
};


// Change the player's sprite image
// Parameter: optional index of a specific sprite
Player.prototype.changeCharacter = function(spriteNumber) {
    // Use the input spriteNumber if provided
    if (spriteNumber != null) {
        this.currentSpriteNumber = spriteNumber;
    } else {  // otherwise just toggle through the sprites
        this.currentSpriteNumber = this.currentSpriteNumber + 1;
    }

    // If the curent value is beyone the range of
    // available sprites, default to 0.
    if (this.currentSpriteNumber >= Board.PLAYER_SPRITES.length) {
        this.currentSpriteNumber = 0;
    }

    this.sprite = Board.PLAYER_SPRITES[this.currentSpriteNumber];
};

// Select a random sprite for player
Player.prototype.changeToRandomCharacter = function() {
    // Choose a random sprite number based on the total
    // available sprites
    var spriteNumber = Math.floor(Math.random() *
        Board.PLAYER_SPRITES.length);

    this.changeCharacter(spriteNumber);
};


// Scoreboard class
// Display lives and messages
var Scoreboard = function() {
    this.message = "Game On --------- Get to the Water!";
};

// Update the scoreboard
Scoreboard.prototype.update = function() {
    scoreboardElement.innerHTML = this.message +
    "<br>Press 'C' to change character, Press" +
    "<br>Press 'enter' to start over." +
    "<br><div id='lives'>" + player.lives + " LIVES</div>  " + 
    "<div id='gems'>" + player.gemsCollected + " GEMS</div>  " +
    "<div id='level'>LEVEL " +  Board.LEVEL + "</div>";
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];

for (var i = 0; i < Board.ENEMY_NUMBER; i++) {
    var enemy = new Enemy();
    enemy.setRandomRow();
    enemy.setRandomSpeed();
    allEnemies.push(enemy);
}

// Array of all possible enemy interactions for collision detection.
var enemyPairs = getEnemyPairs();

// Place the player object in a variable called player
var player = new Player();

// Create Scoreboard
var scoreboard = new Scoreboard();




// This listens for key presses and sends the keys to your
// Player.handleInput() method.
// I had to add a named function to allow for call
// to document.removeEventListener
var passKeyUpValue = function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c',
        32: 'space',
    };

    player.handleInput(allowedKeys[e.keyCode]);
};

// Second Eventlistener to enable player to restart game after game over
var passKeyUpValueGo = function(e) {
    var allowedKeys = {
        13: 'enter'
    };

    player.handleInput(allowedKeys[e.keyCode]);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', passKeyUpValue);
document.addEventListener('keyup', passKeyUpValueGo);




