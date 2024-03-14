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

    removeFromArray(array){
        array.splice(array.indexOf(this), 1);
    }

    checkOutside(arrayOfBullets){
        if (isVerticalOutside(this.body) || isHorizontalOutside(this.body)) {
            this.body.remove();
            this.removeFromArray(arrayOfBullets);
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
            this.removeFromArray(invadersBullets);
            console.log(`hit with ${this.damage} damage`); // Here will go something like player.getDamage(this.damage)
        }
        
    }
}

class BasicInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 3, 10);
        this.body.img = './assets/basicInvaderBullet.png';
    }
}

class AdvanceInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 4, 20)
        this.body.img = './assets/advanceInvaderBullet.png'; // Here will goes a differente texture, by now im gonna use the same
    }
}

class DiagonalInvaderBullet extends InvadersBullet{
    constructor(x, y, velX, velY){
        super(x, y, velX, velY, 10);
        this.body.img = './assets/basicInvaderBullet.png';
    }
}

class InvaderBoss {
    constructor(x, y){
        this.sprite = new Sprite(x, y, 900, 900, 'n');
        this.sprite.img = './assets/boss.jpg';
        this.sprite.debug = true;
        this.sprite.diameter = 900;
        this.sprite.scale = 0.4;
        this.health = 5000;
        this.lifes = 2;
        this.attackPattern = 0; 
        this.attackTimer = 0;
        this.movementPattern = 0
        this.flag = 0;
    }

    moveRight(){
        this.sprite.move(10, 'right', 3)
    }

    moveLeft(){
        this.sprite.move(10, 'left', 3)
    }

    verifyRightLimit(){
        if (this.sprite.x > WINDOW_WIDTH - 200) {
            return true;
        }
        return false;
    }

    verifyLeftLimit(){
        if (this.sprite.x < 200) {
            return true;
        }
        return false;
    }

    die(){
        this.sprite.remove();
    }

    reborn(){
        this.sprite.img = './assets/boss2.jpg';
        this.lifes -= 1;
        this.health = 5000;
        this.sprite.scale = 1;
        this.sprite.diameter = 200;
       
    }

    getDamage(damage){
        this.health -= damage;
        if (this.health <= 0 && this.lifes > 0) {
            this.reborn();
        }
        if (this.lifes <= 0) {
            this.die();
        }
    }

    
    move() {
        if (this.movementPattern == 0) {
            console.log(this.flag);
            if (this.flag == 0 ) {
                if(!this.verifyRightLimit()){
                    this.moveRight();
                }
                else {
                    this.flag = 1;
                }  
            }
            else if (this.flag == 1) {
                if(!this.verifyLeftLimit()){
                    this.moveLeft();
                }
                else {
                    this.flag = 0;
                }
            }
        }
    }


    attack () {
        if (this.attackPattern == 0) {
            let bullet = new BasicInvaderBullet(this.sprite.x - 100, this.sprite.y + 100);
            let bullet2 = new BasicInvaderBullet(this.sprite.x - 50 , this.sprite.y + 100);
            let bullet3 = new BasicInvaderBullet(this.sprite.x + 50, this.sprite.y + 100);
            let bullet4 = new BasicInvaderBullet(this.sprite.x + 100, this.sprite.y + 100);
            invadersBullets.push(bullet, bullet2, bullet3, bullet4);
        }

        else if (this.attackPattern == 1) {
            let bullet = new AdvanceInvaderBullet(this.sprite.x - 150, this.sprite.y + 100);
            let bullet2 = new AdvanceInvaderBullet(this.sprite.x - 100, this.sprite.y + 100);
            let bullet3 = new AdvanceInvaderBullet(this.sprite.x + 100, this.sprite.y + 100);
            let bullet4 = new AdvanceInvaderBullet(this.sprite.x + 150, this.sprite.y + 100);
            invadersBullets.push(bullet , bullet2, bullet3, bullet4);
        }

        else if (this.attackPattern == 2) {
            let bullet = new DiagonalInvaderBullet(this.sprite.x - 100, this.sprite.y, 3, 5);
            let bullet2 = new DiagonalInvaderBullet(this.sprite.x -50, this.sprite.y, -3, 5);
            let bullet3 = new DiagonalInvaderBullet(this.sprite.x + 50, this.sprite.y, 3, 5);
            let bullet4 = new DiagonalInvaderBullet(this.sprite.x + 100, this.sprite.y, -3, 5);
            invadersBullets.push(bullet, bullet2, bullet3, bullet4);
        }
    }

    increaseAttackTimer (){
        if (this.attackPattern == 0) {
            this.attackTimer += 1;
            if (this.attackTimer % 60 == 0){
                this.attack()
            }
        }   

        else if (this.attackPattern == 1) {
            this.attackTimer += 1;
            if (this.attackTimer % 40 == 0){
                this.attack()
            }
        }

        else if (this.attackPattern == 2) {
            this.attackTimer += 1;
            if (this.attackTimer % 20 == 0){
                this.attack()
            }
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
        let bullet = new Bullet(this.sprite.x, this.sprite.y, 5, 5, 0, -4, 10);
        playerBullets.push(bullet);
    }
};

let player;
let invader;

let invadersBullets = [];
let playerBullets = [];
let invaders
let invaderBoss

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
    // invaders = new Invaders();
    // invaders.spawnInvaders();
    // let bullet = new BasicInvaderBullet(100, 100);
    // let bullet2 = new AdvanceInvaderBullet(WINDOW_WIDTH/2, WINDOW_HEIGHT - 700)
    // invadersBullets.push(bullet);
    // invadersBullets.push(bullet2);
    // let diagonalBullet = new DiagonalInvaderBullet(500, 100, 5, 5);
    // let diagonalBullet2 = new DiagonalInvaderBullet(500, 100, -5, 5);
    // invadersBullets.push(diagonalBullet);

    invaderBoss = new InvaderBoss(WINDOW_WIDTH/2, 150);
    // invaderBoss.reborn()
    invaderBoss.attackPattern = 1;
    
    
       
 
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
        bullet.checkOutside();
    })
    invaderBoss.increaseAttackTimer();
    invaderBoss.move();
    
    // console.log(invaderBoss.attackTimer);
    

    // invaders.moveInvaders();

}
