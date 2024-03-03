window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
});

const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;
const BULLET_WIDTH = 9;
const BULLET_HEIGHT = 14;
const BULLET_SPEED = -4;
const AMOUNT_OF_INVADERS = 20;

class Bullet{
    constructor(x, y, type){
        this.sprite = new Sprite(x, y, BULLET_WIDTH, BULLET_HEIGHT, type);
        this.sprite.img = './assets/bullet.png';
        this.sprite.vel.y = BULLET_SPEED;
    }

    checkCollision(invaders) {
        invaders.forEach(invader => {
          if (this.sprite.overlap(invader.sprite)) {
            invader.explosion();
            invader.sprite.remove();
            this.sprite.remove();
            bullets.splice(bullets.indexOf(this), 1);
          }
        
        });
      }
}

class Invader{
    constructor(x, y, type){
        this.sprite = new Sprite(x, y, 50, 50, type);
        this.sprite.img = './assets/invader.png';
        this.sprite.diameter = 30;
        this.sprite.scale = 1;
        this.sprite.debug = true;
    }

    shoot(){
        let bullet = new Bullet(this.sprite.x, this.sprite.y, 'n');
        bullets.push(bullet);
    }

    explosion(){
        let explosion = new Sprite(this.sprite.x, this.sprite.y, 50, 50, 'n');
        explosion.img = './assets/invaderexplosion.gif';
        explosion.scale = .25;
        explosion.diameter = 50;
        explosion.life = 30;
    }
}

class Invaders{
    constructor() {
        this.group = new Array();
        this.movement = 3;  
        this.repetition = 0;
    }

    spawnInvaders(){
        let x = 100;
        let y = 50;
        let i = 0;  
        while (this.group.length < AMOUNT_OF_INVADERS) {
            x += 50;
            let invader = new Invader(x, y, 'd');
            this.group.push(invader);
            i++;
            if (i % 10 == 0) {
                x = 100;
                y += 50;
            }
        }
    }

    moveInvaders(){
        if (this.group.length == 0) {
            this.spawnInvaders();
        }
        this.group.forEach(invader => {
            console.log(this.repetition);
            invader.sprite.x += this.movement;
        });
        if (this.group[this.group.length - 1].sprite.x > WINDOW_WIDTH - 50) {
            this.movement = -3
            this.repetition += 1;
        }
        if (this.group[0].sprite.x < 50) {
            this.movement = 3
            this.repetition += 1;
        }
        if (this.repetition % 2 == 0 && this.repetition != 0) {
            this.group.forEach(invader => {
                invader.sprite.y += 50;
                this.repetition = 0;
            });
        }
    }
}

class Player{
    constructor(x, y){
        this.sprite = new Sprite(x, y, 50, 50, 'k');
        this.sprite.img = './assets/ship.png'; 
        this.sprite.diameter = 40;
        this.sprite.debug = true;
    }

    moveRight(){
        this.sprite.move(10, 'right', 3)
    }

    moveLeft(){
        this.sprite.move(10, 'left', 3)
    }

    moveUp(){
        this.sprite.move(10, 'up', 3)
    }

    moveDown(){
        this.sprite.move(10, 'down', 3)
    }

    shoot(){
        let bullet = new Bullet(this.sprite.x, this.sprite.y, 'n');
        bullets.push(bullet);
        console.log(bullets);
    }
};

let player;
let invader;

let bullets = [];
let invaders

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    
    player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
    invaders = new Invaders();
    invaders.spawnInvaders();
    
}
  
function draw() {
    background('black'); 

    if (kb.pressing('right')) {
        player.moveRight();
    }
    if (kb.pressing('left')) {
        player.moveLeft();
    }
    if (kb.pressing('up')) {
        player.moveUp();
    }
    if (kb.pressing('down')) {
        player.moveDown();
    }
    if (kb.presses('space')) {
        player.shoot();
    }

    bullets.forEach(bullet => {
        bullet.checkCollision(invaders.group);
    });

    invaders.moveInvaders();

}
