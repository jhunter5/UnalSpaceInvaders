window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
});

const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;
const AMOUNT_OF_INVADERS = 20;

const isVerticalOutside = (sprite) => {
    return sprite.y < 0 || sprite.y > WINDOW_HEIGHT - sprite.height;
}

const isHorizontalOutside = (sprite) => {
    return sprite.x < 0 || sprite.x > WINDOW_WIDTH - sprite.width;
}

class Bullet{
    constructor(x, y, bulled_width, bullet_height, velX, velY, damage){
        this.body = new Sprite(x, y, bulled_width, bullet_height, 'n');
        this.body.vel.x = velX;
        this.body.vel.y = velY;
        this.body.debug = true;
        this.damage = damage;
    }

    checkOutside(arrayOfBullets){
        if (isVerticalOutside(this.body) || isHorizontalOutside(this.body)) {
            this.body.remove();
            arrayOfBullets.splice(arrayOfBullets.indexOf(this), 1);
        }
    }
}

class InvadersBullet extends Bullet{
    constructor(x, y, velX, velY, damage){
        super(x, y, 10, 10, velX, velY, damage);
    }

    checkOutside(){
        super.checkOutside(invadersBullets); 
    }
    
    checkCollisionWithPlayer(){
        if (this.body.overlaps(player.sprite)) {
            this.body.remove();
            invadersBullets.splice(invadersBullets.indexOf(this), 1);
            console.log(`hit with ${this.damage} damage`); // Here will go something like player.getDamage(this.damage)
        }
        
    }
}

class BasicInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 3, 10);
        this.body.img = './assets/invaderbullet.png';
    }
}

class AdvanceInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 4, 20)
        this.body.img = './assets/invaderbullet.png'; // Here will goes a differente texture, by now im gonna use the same
    }
}

class DiagonalInvaderBullet extends InvadersBullet{
    constructor(x, y, velX, velY){
        super(x, y, velX, velY, 10);
        this.body.img = './assets/invaderbullet.png';
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
        let bullet = new Bullet(this.sprite.x, this.sprite.y, 5, 5, -3, 10);
        playerBullets.push(bullet);
    }
};

let player;
let invader;

let invadersBullets = [];
let playerBullets = [];
let invaders

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
    // invaders = new Invaders();
    // invaders.spawnInvaders();
    // let bullet = new BasicInvaderBullet(100, 100);
    // let bullet2 = new AdvanceInvaderBullet(WINDOW_WIDTH/2, WINDOW_HEIGHT - 700)
    // invadersBullets.push(bullet);
    // invadersBullets.push(bullet2);
    let diagonalBullet = new DiagonalInvaderBullet(500, 100, 5, 5);
    let diagonalBullet2 = new DiagonalInvaderBullet(500, 100, -5, 5);
    invadersBullets.push(diagonalBullet);
       
 
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
    console.log(invadersBullets);
    console.log(playerBullets);
    

    invadersBullets.forEach(bullet => {
        bullet.checkCollisionWithPlayer(invadersBullets);
        bullet.checkOutside();
    })

    

    // invaders.moveInvaders();

}
