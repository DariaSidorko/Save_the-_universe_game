
// total number of enemy ships for the game
const totalNumOfEnemies = 6;


// UTILITY FUNCTIONS
function hitOrMiss(accuracy){
  if (Math.round(10 * (Math.random() * (0.9 - 0.1) + 0.1))/10 < accuracy) return true; 
  else return false;
}

// function randomAccuracy(min, max){
//   return Math.round(10 * (Math.random() * (max - min) + min))/10;
// } 

function sendMessage(message, tag){
  document.querySelector(tag).textContent = message;
}

function hide(classToRemove){
  document.querySelector(classToRemove).classList.remove('visible');
}

function show(classToAdd){
  document.querySelector(classToAdd).classList.add('visible');
}

function youMissedHit(){
  if (hit){
    sendMessage('You have been hit!', '.inGameMessage');
    sendMessage('Attack back!!!', '.inGameMessage-2')
    sendMessage('', '.numOfEnemies');
  }
}

function hitOrMiss(hit){
  if (hit){
    sendMessage('You have been hit!', '.inGameMessage');
    sendMessage('Attack back!!!', '.inGameMessage-2')
    sendMessage('', '.numOfEnemies');
  }
  else {
    sendMessage("You got lucky! Enemy's aim was weak! Its your turn.", '.inGameMessage');
    sendMessage('Attack back!!!', '.inGameMessage-2');
    sendMessage('', '.numOfEnemies');
  }
}

function setBackgroundImage(class_, imageURL){
  document.querySelector(class_).style.backgroundImage = imageURL
}

// hull, fight power, accuracy generic update before the fight
function genericStatUpdate(){
  document.querySelector(".enemyHull").textContent = `Hull  :  ?`;
  document.querySelector(".enemyFirePower").textContent = `FirePower  :  ?`
  document.querySelector(".enemyAccuracy").textContent = `Accuracy  :  ?`
}


// MAIN CLASS
class Spaseship {
  constructor(hull, firePower, accuracy) {
    this.hull = hull;
    this.firePower = firePower;
    this.accuracy = accuracy;
    this.alive = true;
  }

  get_hull(){
    return this.hull;
  }

  get_firepower(){
    return this.firePower;
  }

  get_accuracy(){
    return this.accuracy;
  }

  get_alive(){
    return this.alive;
  }

  decreaseHealth(hull){
    this.hull -= hull;
  }

  lifeStatUpdate(){
    if (this.hull <= 0){
      this.alive = false;
    }
  }
}

// hero class
class PlayerShip extends Spaseship {
  constructor() {
    super(20, 5, .7, true);
  }

  // hull, fight power, accuracy update
  statUpdate(){
    const hull = document.querySelector(".heroHull");
    this.hull <= 0 ? hull.textContent = `Hull  :  DEAD` : hull.textContent = `Hull  :  ${this.hull}`
    document.querySelector(".heroFirePower").textContent = `FirePower  :  ${this.firePower}`;
    document.querySelector(".heroAccuracy").textContent = `Accuracy  :  ${this.accuracy}`;
  }

}

// enemy class
class AlienShip extends Spaseship  {
  constructor() {
    super(Math.floor(Math.random() * (6 - 3) ) + 3, 
          Math.floor(Math.random() * (4 - 2) ) + 2, 
          Math.round(10 * (Math.random() * (0.8 - 0.6) + 0.6))/10);
  }

  // hull, fight power, accuracy update
  statUpdate(){
    const hull = document.querySelector(".enemyHull");
    this.hull <= 0  ? hull.textContent = `Hull  :  DEAD` : hull.textContent = `Hull  :  ${this.hull}`
    document.querySelector(".enemyFirePower").textContent = `FirePower  :  ${this.firePower}`
    document.querySelector(".enemyAccuracy").textContent = `Accuracy  :  ${this.accuracy}`
  }

  // in fight hull, fight power, accuracy update with hidden fight power and accuracy
  staInFightUpdate(){
    document.querySelector(".enemyHull").textContent = `Hull  :  ${this.hull}`
    document.querySelector(".enemyFirePower").textContent = `FirePower  :  ?`;
    document.querySelector(".enemyAccuracy").textContent = `Accuracy  :  ?`;
  }

}

// buttons selected for all event listeners
let retriveButton = document.querySelector('.retrive');
let newGameButton = document.querySelector('.newGame');
let startButton = document.querySelector('.startGame');
let attacktButton = document.querySelector('.attack');

// classes selected for event backbround color toggle
let heroTag = document.querySelector('.heroTag');
let enemyTag = document.querySelector('.enemyTag');


// start the game button even listener
startButton.addEventListener('click', () => {
  
  // start button disabled
  startButton.disabled = true;

  // set game containier with attack.retrive buttons and first message to show
  sendMessage('Attack your enemy or run away!', '.inGameMessage')
  show('.gameButtonContainier');
  
  // set enemy counter to 0 
  let enemyCounter = 0;

  // create hero and enemy 
  const hero = new PlayerShip();
  let enemy = new AlienShip();
  // update stats
  hero.statUpdate();
  genericStatUpdate();

  // make hero tag active(green)
  heroTag.style.backgroundColor = 'green';

  // attackStatus parameter to toggle the fight (1 - player is hitting 0 - computer is hitting)
  let attackStatus = 1; 
    
  // attack button event listener
  attacktButton.addEventListener('click', () => {
      
    // reset enemy tag, gif and stats 
      attacktButton.textContent = "ATTACK";
      enemy.staInFightUpdate();
      setBackgroundImage('.enemyImage', 'url("/images/enemy.gif")');
      document.querySelector('.enemyHull').classList.remove('dead-hull');

      // hero hit status
      let hit = 0;
     
    // check if hero and enemy alive and num of enemies less than max in the game
    if(hero.get_alive() && enemy.get_alive() && enemyCounter !== totalNumOfEnemies){ 
      // accuracy check
      // *** utility function did not work for soem reason
      let heroAccuracy = Math.round(10 * (Math.random() * (0.9 - 0.1) + 0.1))/10 < hero.get_accuracy();
      let enemyAccuracy = Math.round(10 * (Math.random() * (0.9 - 0.1) + 0.1))/10 < enemy.get_accuracy();

      // fight toggle between hero and enemy (1 for hero)
      if (attackStatus === 1) {
        // hero attack enemy
        // accuracy true/false check for hit or miss
        if (heroAccuracy){
          enemy.decreaseHealth(hero.get_firepower());
          enemy.staInFightUpdate();
          enemy.lifeStatUpdate();

          // condition to stop the game if hero killed the enemy
          if(hero.get_alive() && !enemy.get_alive()){ 

           //+1 to enemy counter
            enemyCounter++;

            // condition to stop the game if hero won the game
            if (enemyCounter === totalNumOfEnemies && hero.get_alive()){
              enemy.statUpdate();
              hide('.gameButtonContainier');
              sendMessage('YOU WIN!', '.finalMessage');
              show('.finalMessage')
              show('.newGame');
              setBackgroundImage('.enemyImage', 'url("/images/hero-enemy-dead.jpg")');
              setBackgroundImage('.playerImage', 'url("/images/hero-won.gif")');
              document.querySelector('.enemyHull').classList.add('dead-hull');
              document.querySelector('body').style.backgroundColor= 'rgb(39, 39, 39)';
              return;
            }

            // hero killed the enemy, but not won the game yet 
            show('.gameButtonContainier');
            sendMessage(`You killed your enemy! Do you want to fight the next one?`, '.inGameMessage');
            sendMessage('Enemies left to kill:', '.inGameMessage-2');
            sendMessage(`${totalNumOfEnemies - enemyCounter}`, '.numOfEnemies');
            setBackgroundImage('.enemyImage', 'url("/images/enemy-dead.jpg")');
            attacktButton.textContent = "NEXT ENEMY"
            document.querySelector('.enemyHull').classList.add('dead-hull');
            enemy.statUpdate();
            // new enemy created
            enemy = new AlienShip();
          }

        // if hero missed hitting enemy
        } else {
          show('.gameButtonContainier', '.inGameMessage-2');
          sendMessage(`Bummer!`, '.inGameMessage');
          sendMessage('Your aim was weak, you missed the enemy! Enemies turn!', '.inGameMessage-2');
          attacktButton.textContent = "NEXT"
        }
        attackStatus = 0;
      
      // fight toggle between hero and enemy 
      } else {
        // enemy attacks hero
        // accuracy check for hit or miss
        if (enemyAccuracy){
          hero.decreaseHealth(enemy.get_firepower());
          hero.statUpdate();
          hero.lifeStatUpdate()
          hit = 1;
          //condition to stop the game if hero was killed
          if(!hero.get_alive()){
            sendMessage('GAME OVER', '.finalMessage');
            hide('.gameButtonContainier');
            show('.newGame');
            show('.finalMessage');
            setBackgroundImage('.playerImage', 'url("/images/hero-enemy-dead.jpg")');
            setBackgroundImage('.enemyImage', 'url("/images/enemy.gif")');
            document.querySelector('.heroHull').classList.add('dead-hull');
            document.querySelector('.finalMessage').style.color = 'red';
            heroTag.style.backgroundColor = 'black';
            enemyTag.style.backgroundColor = 'red';
          }
        } 
        attackStatus = 1;
        hitOrMiss(hit)
        show('.gameButtonContainier');
      }
    }

  }); //attack button event listener closing bracket

}) // start game button eventListener closing bracket


// Event Listeners

// retrive button
retriveButton.addEventListener('click', () => {
  alert('Are you sure you want to quit the game?')
  location.reload();
})

// new game button
newGameButton.addEventListener('click', () => {
  location.reload();
})





