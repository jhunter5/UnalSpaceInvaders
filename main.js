window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
    if (event.keyCode === 37 || event.keyCode === 39) {
      event.preventDefault();
    }
});

let WINDOW_WIDTH ;
let WINDOW_HEIGHT;       
const AMOUNT_OF_INVADERS = 40;

const isVerticalOutside = (sprite) => {
    return sprite.y < 0 || sprite.y > WINDOW_HEIGHT - sprite.height;
}

const isHorizontalOutside = (sprite) => {
    return sprite.x < 0 || sprite.x > WINDOW_WIDTH - sprite.width;
}

const isInRightLimit = (sprite) => {
    return sprite.x > WINDOW_WIDTH - sprite.width / 2;
}

const isInLeftLimit = (sprite) => {
    return sprite.x < sprite.width / 2;
}

let player = null;
let invaders = null;
let invaderBoss = null;

let invadersWave = 0
let score = 0;
let gameStatus = 'playing';
let invadersBullets = [];
let playerBullets = [];

let gameOverElement;
let restartButton;
let scoreElement;

document.addEventListener('DOMContentLoaded', function() {
    gameOverElement = document.querySelector(".game-over");
    restartButton = document.querySelector("#restart-button");
    scoreElement = document.querySelector("#score");
    document.body.style.zoom = "65%";
    


    restartButton.addEventListener("click", () => {
        clear();
        removeAllSprites();
        gameStatus = 'playing';
        player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
        player.updateLifeDisplay();
        invaders = new Invaders()
        invaderBoss = null;
        invadersWave = 0;
        invaders.spawnInvaders('normal')
        loop();
    });
});

class Bullet{
    constructor(x, y, bulled_width, bullet_height, velX, velY, damage){
        this.body = new Sprite(x, y, bulled_width, bullet_height, 'n');
        this.body.vel.x = velX;
        this.body.vel.y = velY;
        this.body.debug = false;
        this.damage = damage;
    }

    removeFromArray(array){
        array.splice(array.indexOf(this), 1);
    }

    checkOutside(arrayOfBullets){
        if (isVerticalOutside(this.body) || isHorizontalOutside(this.body)) {
            this.body.remove();
            this.removeFromArray(arrayOfBullets);
            if (arrayOfBullets == playerBullets) {
                score > 0 ? score -= 10 : null;
            }
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
            player.getDamage(this.damage);
        }
    }
}

class PlayerBullet extends Bullet{
    constructor(x, y, velX, velY, damage){
        super(x, y, 10, 10, velX, velY, damage);
        this.body.img = './assets/bullet.png'
    }

    checkOutside(){
        super.checkOutside(playerBullets);
    }

    checkCollisionWithInvader(){
        invaders.group.forEach(invader => {
            if (this.body.overlaps(invader.sprite)) {
                this.body.remove();
                this.removeFromArray(playerBullets);
                invader.getDamage(this.damage, invader);
            }
        });
    }

    checkCollisionWithInvaderBoss(){
        if (this.body.overlaps(invaderBoss.sprite)) {
            this.body.remove();
            this.removeFromArray(playerBullets);
            invaderBoss.getDamage(this.damage);
        }
    }
}

class BasicInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 5, 10);
        this.body.img = './assets/basicInvaderBullet.png';
    }
}

class AdvanceInvaderBullet extends InvadersBullet{
    constructor(x, y){
        super(x, y, 0, 6, 20)
        this.body.img = './assets/advanceInvaderBullet.png'; 
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
        this.sprite.img = './assets/boss.png';
        this.sprite.debug = true;
        this.sprite.diameter = 500;
        this.sprite.scale = 0.6;
        this.health = 5000;
        this.lifes = 2;
        this.attackPattern = 0; 
        this.attackTimer = 0;
        this.movementPattern = 0
        this.flag = 0;
    }

    stay(){
        this.sprite.vel.x = 0;
        this.sprite.vel.y = 0;
    }

    moveRight(velocity){
        this.sprite.vel.x = velocity;
        
    }

    moveLeft(velocity){
        this.sprite.vel.x = -velocity;
    }

    moveUp(velocity){
        this.sprite.vel.y = -velocity;
    }

    moveDown(velocity){
        this.sprite.vel.y = velocity;
    }

    verifyUpperLimit(){
        return this.sprite.y < 50;
    }

    verifyLowerLimit(){
        return this.sprite.y > 150;
    }

    move() {
        if (this.movementPattern == 0) {
            if (this.flag == 0 ) {
                if(!isInRightLimit(this.sprite)){
                    this.moveRight(4);
                }
                else {
                    this.flag = 1;
                }  
            }
            else if (this.flag == 1) {
                if(!isInLeftLimit(this.sprite)){
                    this.moveLeft(4);
                }
                else {
                    this.flag = 0;
                }
            }
        }
        else if (this.movementPattern == 1) {
            if (this.flag == 0 ) {
                if(!isInRightLimit(this.sprite)){
                    this.moveRight(5);
                }
                else {
                    this.flag = 1;
                }  
            }
            else if (this.flag == 1) {
                if(!isInLeftLimit(this.sprite)){
                    this.moveLeft(5);
                }
                else {
                    this.flag = 0;
                }
            }
        }
        else if (this.movementPattern == 2) {
            if (this.flag == 0 ) {
                if(!isInRightLimit(this.sprite) && !this.verifyLowerLimit()){
                    this.moveRight(4);
                    this.moveDown(3);
                }
                else {
                    this.verifyLowerLimit() ? this.flag = 1 : this.flag = 2;
                }  
            }
            else if (this.flag == 1) {
                if(!isInRightLimit(this.sprite) && !this.verifyUpperLimit()){
                    this.moveRight(4);
                    this.moveUp(3);
                }
                else {
                    this.verifyUpperLimit() ? this.flag = 0 : this.flag = 3;
                }
            }
            else if (this.flag == 2) {
                if(!isInLeftLimit(this.sprite) && !this.verifyLowerLimit()){
                    this.moveLeft(4);
                    this.moveDown(3);
                }
                else {
                    this.verifyLowerLimit() ? this.flag = 3 : this.flag = 0;
                }
            }
            else if (this.flag == 3) {
                if(!isInLeftLimit(this.sprite) && !this.verifyUpperLimit()){
                    this.moveLeft(4);
                    this.moveUp(3);
                }
                else {
                    this.verifyUpperLimit() ? this.flag = 2 : this.flag = 1;
                }
            }
        }
    }

    updateHealthBar() {
        const healthBar = document.getElementById('boss-health-bar');
        const percentage = (this.health / 5000) * 100;
        healthBar.style.width = `${percentage}%`;
    }

    getDamage(damage){
        this.health -= damage;
        this.updateHealthBar();
        this.checkStatus();
    }

    checkStatus(){
        if (this.health <= 2500 && this.lifes == 2) {
            this.movementPattern = 2;
            this.attackPattern = 1;
            score += 100;
        }
        if (this.health == 0 && this.lifes == 2) {
            this.lifes -= 1;
            score += 500;
            this.reborn();
        }

        if ( this.health == 0 && this.lifes == 1) {
            score += 1000;
            this.die();
            invaderBoss = null
        }
    }

    die(){
        this.sprite.remove();
        let explosion = new Sprite(this.sprite.x, this.sprite.y, 900, 900, 'n');
        gameStatus = 'won';
    }

    reborn(){
        this.sprite.img = './assets/boss2.png';
        this.sprite.scale = 1;
        this.sprite.diameter = 200;
        this.sprite.x = WINDOW_WIDTH/2;
        this.sprite.y = 150;
        this.flag = 0
        this.stay()
        this.health = 5000;
        this.updateHealthBar()
        this.movementPattern = 1;
        this.attackPattern = 2;
    }

    attack () {
        if (this.attackPattern == 0) {
            let x = this.sprite.x - 100;
            let y = this.sprite.y + 100;
            for (let i = 0; i < 5; i++) {
                let bullet = new BasicInvaderBullet(x, y);
                invadersBullets.push(bullet);
                x += 50;
            }
        }

        else if (this.attackPattern == 1) {
            let x = this.sprite.x - 150;
            let y = this.sprite.y + 100;
            for (let i = 0; i < 5; i++) {
                let bullet = new AdvanceInvaderBullet(x, y);
                invadersBullets.push(bullet);
                if (i == 2) {
                    x = this.sprite.x + 100;
                }
                x += 50;
            }
        }

        else if (this.attackPattern == 2) {
            let x = this.sprite.x - 100;
            let y = this.sprite.y;
            let velX = 3;
            for (let i = 0; i < 5; i++) {
                let bullet = new DiagonalInvaderBullet(x, y, velX, 5);
                invadersBullets.push(bullet);   
                if (i == 2) {
                    x = this.sprite.x + 100;
                }
                velX *= -1;
                x += 50;
            }
        }
    }

    increaseAttackTimer (){
        this.attackTimer += 1;
        if (this.attackPattern == 0) {
            if (this.attackTimer % 60 == 0){
                this.attack()
            }
        }   

        else if (this.attackPattern == 1) {
            if (this.attackTimer % 30 == 0){
                this.attack()
            }
        }

        else if (this.attackPattern == 2) {
            if (this.attackTimer % 20 == 0){
                this.attack()
            }
        }
    }
}

class Invader{
    constructor(x, y, type){
        this.sprite = new Sprite(x, y, 50, 50);
        this.type = type;
        if (this.type == 'normal') {
            this.sprite.img = './assets/invader.png';
            this.life = 50;
        }
        else if (this.type == 'advance') {
            this.sprite.img = './assets/invaderAdvance.png';
            this.life = 100;
        }
        this.sprite.diameter = 30;
        this.sprite.scale = 1;
        this.sprite.debug = false;
    }

    shoot(){
        if (this.type == 'normal') {
            let bullet = new BasicInvaderBullet(this.sprite.x, this.sprite.y);
            invadersBullets.push(bullet);
        }
        else if (this.type == 'advance') {
            let bullet = new AdvanceInvaderBullet(this.sprite.x, this.sprite.y);
            invadersBullets.push(bullet);
        }
    }

    getDamage(damage, invader){
        this.life -= damage;
        this.checkDeath(invader);
    }

    checkDeath(invader){
        if (this.life == 0) {
            this.die(invader);  
        }
    }

    die(invader){
        if (invader.type == 'normal') {
            score += 20;
        }
        else if (invader.type == 'advance') {
            score += 30;
        }
        invaders.group.splice(invaders.group.indexOf(invader), 1);
        this.sprite.remove();
        let explosion = new Sprite(this.sprite.x, this.sprite.y, 50, 50, 'n');
        explosion.img = './assets/invaderexplosion.gif';
        explosion.scale = .25;
        explosion.diameter = 50;
        explosion.life = 30;
    }

    checkCollideBottom(){
        return this.sprite.y > WINDOW_HEIGHT - (this.sprite.height + player.sprite.height + 50);
    }
}

class Invaders{
    constructor() {
        this.group = new Array();
        this.movement = 7;  
        this.repetition = 0;
        this.attackTimer = 0;
    }

    spawnInvaders(type){
        let x = 100;
        let y = 50;
        let i = 0;  
        while (this.group.length < AMOUNT_OF_INVADERS) {
            x += 50;
            let invader = new Invader(x, y, type);
            this.group.push(invader);
            i++;
            if (i % 10 == 0) {
                x = 100;
                y += 50;
            }
        }
    }

    move() {
        const minX = this.group.reduce((min, invader) => Math.min(min, invader.sprite.x), Infinity);
        const maxX = this.group.reduce((max, invader) => Math.max(max, invader.sprite.x), -Infinity);
        const leftInvader = this.group.find(invader => invader.sprite.x === minX);
        const rightInvader = this.group.find(invader => invader.sprite.x === maxX);
      
        this.group.forEach(invader => {
          invader.sprite.x += this.movement;
        });
      
        if (isInRightLimit(rightInvader.sprite)) {
          this.movement = -7;
          this.repetition += 1;
        } else if (isInLeftLimit(leftInvader.sprite)) {
          this.movement = 7;
          this.repetition += 1;
        }
      
        if (this.repetition % 2 == 0 && this.repetition != 0) {
          this.group.forEach(invader => {
            invader.sprite.y += 40;
          });
          this.repetition = 0;
        }
      }
      

    shoot(){
        this.attackTimer += 1;
        if (this.attackTimer % 35 == 0){
            for (let i = 0; i < 5; i++) {
                let randomInvader = this.group[Math.floor(Math.random() * this.group.length)];
                randomInvader.shoot();
            }
        }
    }

    checkCollideBottom(){
        this.group.some(invader => invader.checkCollideBottom()) ? gameStatus = 'game-over' : null;
    }
}

class Player{
    constructor(x, y){
        this.sprite = new Sprite(x, y, 50, 50, 'k');
        this.sprite.img = './assets/ship.png'; 
        this.sprite.diameter = 40;
        this.sprite.debug = false;
        this.life = 120;
    }

    moveRight(){
        this.sprite.move(10, 'right', 3)
    }

    moveLeft(){
        this.sprite.move(10, 'left', 3)
    }

    shoot(){
        let bullet = new PlayerBullet(this.sprite.x, this.sprite.y, 0, -7, 50);
        playerBullets.push(bullet);
    }

    updateLifeDisplay() {
        document.getElementById('player-life-value').textContent = this.life;
    }

    getDamage(damage){ 
        this.life -= damage;
        this.updateLifeDisplay();
    }

    checkDeath(){
        if (this.life <= 0) {
            gameStatus = 'game-over';
        }
    }
};

function removeAllSprites(){
    const healthBar = document.getElementById('boss-health-bar');
    healthBar.style.width = `0%`;
    player.sprite.remove();
    playerBullets.forEach(bullet => bullet.body.remove());
    if (invaders != null){
        invaders.group.forEach(invader => invader.sprite.remove());
    }
    invadersBullets.forEach(bullet => bullet.body.remove());
    if (invaderBoss != null){
        invaderBoss.sprite.remove();
    }
}

function keyPressed() {
    if (key == 'p' || key == 'P') {
        if (gameStatus == 'playing') {
            noLoop();
            gameStatus = 'paused';
        }
        else if (gameStatus == 'paused') {
            loop();
            gameStatus = 'playing';
        }
    }
    if (keyCode === 32) {
        player.shoot();
    }
}

function preload() {
    soundFormats('mp3', 'ogg');
    song = loadSound('./assets/Space Invaders - Space Invaders.mp3');
}

let canvas

function setup() {
    gameHolder = document.querySelector("#game-holder");
    WINDOW_WIDTH = gameHolder.offsetWidth;
    WINDOW_HEIGHT = gameHolder.offsetHeight;
    canvas = createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
    canvas.parent('game-holder');
    player = new Player(WINDOW_WIDTH/2, WINDOW_HEIGHT - 50, 'd');
    invaders = new Invaders()
    invaders.spawnInvaders('normal')
    document.getElementById("boss-health-bar").style.display = "none";
    space = loadImage('./assets/space.jpg');
};


function draw() {
    
    background(space);
    if (kb.pressing('right')) {
        player.moveRight();
    }
    if (kb.pressing('left')) {
        player.moveLeft();
    }
    if (invaderBoss != null){
        document.getElementById("boss-health-bar").style.display = "block";
        invaderBoss.increaseAttackTimer();
        invaderBoss.move();
    }

    if (invaders != null){
        invaders.move()
        invaders.shoot()
        invaders.checkCollideBottom()
    }
    
    if (playerBullets.length > 0) {
        if (invaderBoss != null){
            playerBullets.forEach(bullet => {
                bullet.checkCollisionWithInvaderBoss();
                bullet.checkOutside();
            })
        }
        if (invaders != null){
            playerBullets.forEach(bullet => {
                bullet.checkCollisionWithInvader();
                bullet.checkOutside();
            })
        }
    }

    if (invadersBullets.length > 0) {
        invadersBullets.forEach(bullet => {
            bullet.checkCollisionWithPlayer();
            bullet.checkOutside();
        })
    }

    if (invadersWave == 0 && invaders != null){
        if (invaders.group.length == 0) {
            invadersWave += 1;
            invaders.spawnInvaders('advance')
        }
    }
    else if (invadersWave == 1){
        if (invaders.group.length == 0) {
            invadersWave = null;  
            invaders = null;
            playerBullets = [];
            invadersBullets = [];
            invaderBoss = new InvaderBoss(WINDOW_WIDTH/2, 150);
        }
    }

    player.checkDeath();

    if (gameStatus == 'game-over') {
        noLoop();
        gameOverElement.classList.add("visible");
        scoreElement.textContent = score;
    } 
    else if (gameStatus == 'won') {
        noLoop();
        gameOverElement.classList.add("visible");
        scoreElement.textContent = score;
    }
    else {
        gameOverElement.classList.remove("visible");
    }
}
