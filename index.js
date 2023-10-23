/* Course: SENG 513 */
/* Date: Oct 10, 2023 */
/* Assignment 2 */
/* Name: Saksham Puri */
/* UCID: 30140617 */

//All element refrences to getting keyboard input for jump and power buttons
const inputPopup = document.getElementById("popup");
const jumpInputText = document.getElementById("jump");
const powerInputText = document.getElementById("power");
const jumpInputButton = document.getElementById("jump-input");
const powerInputButton = document.getElementById("power-input");

let readingType = 0;
let usedInputs = [];
let tempJump;
let tempPower;

//All DOM element refrences if user plays in mobile version
const player1Touch = document.getElementById("player-1-touch");
const player2Touch = document.getElementById("player-2-touch");
const addPlayerButton = document.getElementById("add-player");
const switchMobileButton = document.getElementById("mobile-button");
let mode = 0;

//All DOM element refrences to display obstacles and players
const mainText = document.getElementById("main-text");
const showPlayers = document.getElementById("show-players");
const mainPlayers = document.getElementById("main-players");
const background = document.getElementById("main-content"); 
const ground = document.getElementById("ground");

//All varialbes to keep track of players
let playerList = [];
let obstacleList = [];
let playerCount = 0;

let jumpHeight = window.innerHeight/70;
let mainInterval;
let speed = 1;

//If device in portrait mode, suggest landscape
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;

    //If portrait mode, suggest landscape using alert
    if (portrait) {
        
    } else {
        //Otherwise reset main loop, and restart game
    }
});

//If a key is pressed, react accordingly
document.addEventListener("keydown", (e) => {

    //When recording inputs for jump button or power button
    if (readingType == 1) {

    } else if (readingType == 2) {

    }

    //Go through the player list to check which player the key correlates to
    for (let i = 0; i < playerList.length; i++) {
        //Depending on the key, do player action
    }
})

//If using mobile and player buttons are pressed
function playerButton(player, action) {

    //Do actions accordingly
    if (action == 0) {
    } else if (action == 1) {
    }
}

//Player class that holds all the components for a player
class Player {
    constructor(element, jumpKey, powerKey) {
        this.element = element;
        this.jumpKey = jumpKey;
        this.powerKey = powerKey;
    }

    //function to input gravity to player
    fall() {
    }

    //function to set the player on certain floor
    setOn(floor) {
    }

    //To get the top of the player
    getTop() {
    }

    //To get the bottom of the player
    getBottom() {
    }

    //To get left side of the player
    getLeft() {
    }

    //To get right side of the player
    getRight() {
    }

    //To set the rotation of the player
    setRotation(rot) {
    }
}

//Obstacle class that holds all the components for the obstacle
class Obstacle {
    constructor(element) {
        this.element = element;
    }

    //To get the top of the obstacle
    getTop() {
    }

    //To get the bottom of the obstacle
    getBottom() {
    }

    //To get the left of the obstacle
    getLeft() {
    }

    //To get the right of the obstacle
    getRight() {
    }

    //To set the X position of the obstacle
    setX(val) {
    }
}

//Power class that holds all the components for the powerup
class Power {
    constructor(element) {
        this.element = element;
    }

    //To get the top of the powerup
    getTop() {
    }

    //To get the bottom of the powerup
    getBottom() {
    }

    //To get the left of the powerup
    getLeft() {
    }

    //To get the right of the powerup
    getRight() {
    }

    //To set the X position of the powerup
    setX(val) {
    }
}

//Function to transition from web version to mobile version and vice versa
function switchMobile() {

    //If currently in web version
    if (mode == 0) {
        //Reset game and make changes to make it mobile version
    } else {
        //If currently in mobile version, reset game and make changes to make it web version
    }
}

//Function to read the inputs when user deciding input for a player
function readInput(type) {
    if (type == "jump") {
        readingType = 1;
        jumpInputButton.innerHTML = "Reading....";
    } 
    else if (type == "power") {
        readingType = 2;
        powerInputButton.innerHTML = "Reading....";
    }
}

//function to check if the selected player inputs can indeed be used and then create the player
function checkInputs() {
    //Check if selected inputs are valid

    //If so, increment player count, add a player to the screen by creating a div
    //Style the div, display it properly on screen, and store it in a list for future manipulation
}

//Function to add Players to the screen and to the game
function addPlayer() {
    //If in mobile version of the game, then add 2 players
    if (mode == 1) {
    } else {
        //Else let the user add players upto 5
    }
}

//Function to add obstacles to the screen and to the game
function addObstacle(random) {
    //Include some randomness when adding obstacles
}

//function to remove the text/buttons and start the gameplay
function playGame() {

    //If no players added, alert the user and exit the function
    if (playerCount == 0) {
    } else if (playerCount == 1) {
        //If only 1 player added, ask if they want to play alone
    }
    
    //Remove the text and buttons in an animated way

    //Increase the speed of the background animations and the gameplay animations
}

//main loop that keeps everything moving
function startLoop() {

    //If device in portrait mode, suggest landscape mode
    //Set the variables such as gravity and player speed

    //Start the main loop
        //Animate ground moving
        //Animate background moving
        //Animate any obstacles and player in the scene
        //Check for obstacle or power up collisions
        //Add Powerups and Obstacles to the scene
}