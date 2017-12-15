var Persona = function(sprite, x, y) {
    this.sprite = sprite;
    Resources.load(this.sprite);
    this.x = x;
    this.y = y;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Persona.call(this, 'images/enemy-bug.png', 0 * 101, (Math.floor(Math.random() * 3) + 1) * 83);
    this.speed = Math.random();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype = Object.create(Persona.prototype);

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += 101 * this.speed * dt;
    if (this.x > 505) {
        this.x = 0;
    }
    // console.log("Enemy x, y " + this.x + ", " + this.y);
    // console.log("player x, y " + player.x + ", " + player.y);
    if ((this.x + 101 >= player.x && this.x <= player.x)
        && this.y == player.y) {
        console.log("bang");
        player.startSquare();
    }
    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    Persona.call(this, 'images/char-pink-girl.png', 2 * 101, 5 * 83);
    this.startSquare();
};

Player.prototype = Object.create(Persona.prototype);

Player.prototype.update = function() {
    if (this.y == 0) {
        console.log("you won");
        this.startSquare();
        allEnemies.forEach(function(enemy){
            enemy.x = -101;
        });
    }
};

Player.prototype.render = function() {
    this.image = Resources.get(this.sprite);
    ctx.drawImage(this.image, this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    console.log("key " + key);
    switch (key) {
        case 'left':
            if (this.col > 0) {
                this.col--;
                this.x = this.col * 101;
                this.render();
            }
            break;
        case 'up':
            if (this.row > 0) {
                this.row--;
                this.y = this.row * 83;
                this.render();
            }
            break;
        case 'right':
            if (this.col < 4) {
                this.col++;
                this.x = this.col * 101;
                this.render();
            }
            break;
        case 'down':
            if (this.row < 5) {
                this.row++;
                this.y = this.row * 83;
                this.render();
            }
            break;
        default:

    }
};

Player.prototype.startSquare = function() {
    this.col = 2;
    this.row = 5;
    this.x = this.col * 101;
    this.y = this.row * 83;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var numOfEnemies = 3;
for (var i=0; i<numOfEnemies; i++) {
    allEnemies.push(new Enemy());
};
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
    if (allowedKeys.hasOwnProperty(e.keyCode)) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});
