// Board object to hold constants for the board
// and any other default values.
// This could be expanded into a more complex classs / function
// that would allow for different levels to increase
// the difficulty of the game and/or level layout details.
var Board = {
    BOARD_HEIGHT: 606,
    BOARD_WIDTH: 505,
    BLOCK_WIDTH: 101,
    BLOCK_HEIGHT: 83,
    Y_OFFSET: 60,
    ENEMY_SPEED: 600,
    ENEMY_NUMBER: 3,
    ROCK_SPEED: 300,
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

   
    // Set default avarge speed
   
    this.speed = Board.ENEMY_SPEED;


    // Set this enemy in a starting position.
    this.returnToStart();

    
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // If this enemy is off the board, return it to the start.
    // Otherwise move forward based on this enemy's speed.
    if (this.x > Board.BOARD_WIDTH) {
        this.returnToStart();
    } else {
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
to achieve different enemy formations. Algorythm can be improved to to adjust difficulty of the game.
Why do enemies overlap???
 */
    this.x = -Board.BLOCK_WIDTH - Board.BLOCK_WIDTH * (Math.floor(Math.random() * 6)) ;
    // Set the y position to a random row
    this.setRandomRow();
};



// Set random Row for this enemy
Enemy.prototype.setRandomRow = function() {
    this.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT * Math.floor(Math.random() * 3);

};

// Set random speed for this enemy
/*
Enemy.prototype.setRandomSpeed = function (){
    this.speed = Math.floor(Math.random() * (Board.ENEMY_MAX_SPEED -Board.ENEMY_MIN_SPEED) + Board.ENEMY_MIN_SPEED);
}
*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // load player image
    this.sprite = 'images/char-boy.png';

    //set player initial location
    this.x = 200;
    this.y = 400;

};

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dt) {

};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
for (var i = 0; i < Board.ENEMY_NUMBER; i++) {
    var enemy = new Enemy();
    enemy.setRandomRow();
    //enemy.setRandomSpeed();
    allEnemies.push(enemy);
}
// Place the player object in a variable called player
var player = new Player();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});





