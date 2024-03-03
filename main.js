window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  });

class Bullet{
    constructor(x, y, type){
        this.sprite = new Sprite(x, y, 9, 14, type);
        this.sprite.img = './assets/bullet.png';
        this.sprite.vel.y = -2;
    }

    checkCollision(invaders) {
        invaders.forEach(invader => {
          if (this.sprite.overlap(invader.sprite)) {
            invader.sprite.remove();
            this.sprite.remove();
            bullets.splice(bullets.indexOf(this), 1);
            console.log(bullets)
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
}

class Player{
    constructor(x, y, w, h, type){
        this.sprite = new Sprite(x, y, w, h, type);
        this.sprite.img = './assets/ship.png'; 
        this.sprite.diameter = 40;
        this.sprite.scale = 1;
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
let invaders = [];

function setup() {
    window.createCanvas(window.innerWidth, window.innerHeight); 
    
    player = new Player(100, 100, 50, 50, 'd');
    invader = new Invader(100, 100, 'd');
    invaders.push(invader);
    
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
        bullet.checkCollision(invaders);
    });

}

// Path: classes/entity.j