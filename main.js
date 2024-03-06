window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
});

const WINDOW_WIDTH = 1200;
const WINDOW_HEIGHT = 800;
const AMOUNT_OF_INVADERS = 20;

class Bullet{
    constructor(x, y, bulled_width, bullet_height, vel){
        this.body = new Sprite(x, y, bulled_width, bullet_height, 'd');
        this.body.vel.y = vel;
        this.body.debug = true;
    }
}

class InvadersBullet extends Bullet{
    constructor(x, y, vel){
        super(x, y, 10, 10, vel);
    }

    checkCollisionWithPlayer(){
        if (this.body.overlaps(player.sprite)) {
            this.body.remove();
            invadersBullets.splice(invadersBullets.indexOf(this), 1);
            return true
        }
        
    }
}

class InvaderBulletType1 extends InvadersBullet{
    constructor(x, y){
        super(x, y, 3);
        this.body.img = './assets/invaderbullet.png';
        this.damage = 10
    }

    checkCollisionWithPlayer(){
       if (super.checkCollisionWithPlayer()){
        console.log(`hit with ${this.damage} damage`);
       }
    }
}

class InvaderBulletType2 extends InvadersBullet{
    constructor(x, y){
        super(x, y, 4)
        this.body.img = './assets/invaderbullet.png'; // Here will goes a differente texture, by now im gonna use the same
        this.damage = 20
    }

    checkCollisionWithPlayer(){
        if (super.checkCollisionWithPlayer()){
            console.log(`hit with ${this.damage} damage`); // Here will go something like player.getDamage(this.damage)
        }
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

let invadersBullets = [];
let invaders

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
    // invaders = new Invaders();
    // invaders.spawnInvaders();
    let bullet = new InvaderBulletType1(100, 100);
    let bullet2 = new InvaderBulletType2(WINDOW_WIDTH/2, WINDOW_HEIGHT - 700)
    invadersBullets.push(bullet);
    invadersBullets.push(bullet2);

    
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

    invadersBullets.forEach(bullet => {
        bullet.checkCollisionWithPlayer(invadersBullets);
    })

    // invaders.moveInvaders();

}
