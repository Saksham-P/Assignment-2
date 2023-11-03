/* Course: SENG 513 */
/* Date: Oct 26, 2023 */
/* Assignment 3 */
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
let powerImg1 = "https://cdn.icon-icons.com/icons2/2066/PNG/512/shield_icon_125161.png"
let powerImg2 = "https://cdn.icon-icons.com/icons2/3196/PNG/512/angle_up_double_icon_194765.png"

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
let deadPlayers = [];
let obstacleList = [];
let playerCount = 0;

let jumpHeight = window.innerHeight/170;
let mainInterval;
let speed = 0.1;

let gameStarted = false;
let gameFinished = false;

//If device in portrait mode, suggest landscape
window.matchMedia("(orientation: portrait)").addEventListener("change", e => {
    const portrait = e.matches;

    //If portrait mode, suggest landscape using alert
    if (portrait) {
        window.alert("The website is built for landscape mode, " + 
        "if you can, Please change the Orientation to Landscape");
    } else {
        //Otherwise reset main loop, and restart game
        if (mainInterval != undefined) {
            clearInterval(mainInterval);
            startLoop();
        }
    }
});

//If a key is pressed, react accordingly
document.addEventListener("keydown", (e) => {

    //When recording inputs for jump button or power button
    if (readingType == 1) {
        jumpInputText.innerHTML = `Button Selected: ${e.code}`;
        tempJump = e.code;
        jumpInputButton.innerHTML = "Press Button To Record Jump Button";
        readingType = 0;
    } else if (readingType == 2) {
        powerInputText.innerHTML = `Button Selected: ${e.code}`;
        tempPower = e.code;
        powerInputButton.innerHTML = "Press Button To Record Power Up Button";
        readingType = 0;
    }

    //Go through the player list to check which player the key correlates to
    for (let i = 0; i < playerList.length; i++) {
        //Depending on the key, do player action
        let tempPlayer = playerList[i];
        if (tempPlayer.jumpKey == e.code) {
            if (!tempPlayer.jumping) {
                tempPlayer.speedY = Math.floor(jumpHeight);
                tempPlayer.jumping = true;
            }
        } else if (tempPlayer.powerKey == e.code) {
            if (tempPlayer.power == 0) {
                tempPlayer.setShield(true);

            } else if (tempPlayer.power == 1 && !tempPlayer.jumping) {
                tempPlayer.speedY = Math.floor(jumpHeight*1.5);
                tempPlayer.jumping = true;
                tempPlayer.setPower(undefined);
            }
        }
    }
})

//If using mobile and player buttons are pressed
function playerButton(player, action) {

    //Do actions accordingly
    if (action == 0) {
        if (!playerList[player].jumping) {
            playerList[player].speedY = Math.floor(jumpHeight);
            playerList[player].jumping = true;
        }
    } else if (action == 1) {
        if (playerList[player].power == 0) {
            playerList[player].setShield(true);

        } else if (playerList[player].power == 1 && !playerList[player].jumping) {
            playerList[player].speedY = Math.floor(jumpHeight*1.5);
            playerList[player].jumping = true;
            playerList[player].setPower(undefined);
        }
    }
}

//Player class that holds all the components for a player
class Player {
    constructor(element, jumpKey, powerKey) {
        this.element = element;
        this.jumpKey = jumpKey;
        this.powerKey = powerKey;

        this.score = 0;
        this.scoreElement = undefined;

        this.power = undefined;
        this.powerElement = undefined;
        this.shieldActive = false;
        
        this.speedX = 4.7;
        this.speedY = 0;
        this.jumping = false;
    }

    setShield(val) {
        if (val) {
            this.element.style.border = '2px solid blue';
            this.shieldActive = true;
        } else {
            this.element.style.border = 'none';
            this.shieldActive = false;
        }
    }

    incrementScore(score) {
        this.score += score;
        this.scoreElement.innerHTML = `Score: ${this.score}`;
    }

    setScoreElement(element) {
        this.scoreElement = element;
    }

    setPower(power) {
        this.power = power;
        if (power == undefined) this.powerElement.style.display = "none";
        else {
            this.powerElement.style.display = "inline";
            if (power == 0) this.powerElement.src = powerImg1;
            else if (power == 1) this.powerElement.src = powerImg2;
        }
        
    }

    setPowerElement(element) {
        this.powerElement = element;
    }

    //function to input gravity to player
    fall() {
        this.element.style.top = `${this.getTop() - this.speedY}px`
    }

    //function to set the player on certain floor
    setOn(floor) {
        this.element.style.top = `${floor - this.element.offsetHeight}px`
    }

    //To get the top of the player
    getTop() {
        return this.element.offsetTop;
    }

    //To get the bottom of the player
    getBottom() {
        return this.element.offsetTop + this.element.offsetHeight;
    }

    //To get left side of the player
    getLeft() {
        return this.element.offsetLeft;
    }

    //To get right side of the player
    getRight() {
        return this.element.offsetLeft + this.element.offsetWidth;
    }

    //To set the rotation of the player
    setRotation(rot) {
        this.element.style.transform = `rotate(${(rot * this.speedX * speed)%360}deg)`;
    }
}

//Elem class that holds all the components for the obstacle or powerups
class Elem {
    constructor(element, type, value) {
        this.element = element;
        this.type = type;
        this.value = value;
    }

    //To get the top of the element
    getTop() {
        return this.element.offsetTop;
    }

    //To get the bottom of the element
    getBottom() {
        return this.element.offsetTop + this.element.offsetHeight;
    }

    //To get the left of the element
    getLeft() {
        return this.element.offsetLeft;
    }

    //To get the right of the element
    getRight() {
        return this.element.offsetLeft + this.element.offsetWidth;
    }

    //To set the X position of the element
    setX(val) {
        this.element.style.left = `${val}px`
    }
}

//Function to transition from web version to mobile version and vice versa
function switchMobile() {

    //Delete all players from screen
    displayClass = document.getElementsByClassName("display");
    while (displayClass[0]) {
        displayClass[0].parentNode.removeChild(displayClass[0]);
    }
    playerClass = document.getElementsByClassName("player");
    while (playerClass[0]) {
        playerClass[0].parentNode.removeChild(playerClass[0]);
    }
    playerList = []
    playerCount = 0;

    //If currently in web version Reset game and make changes to make it mobile version
    if (mode == 0) {

        //Display Mobile version elements
        player1Touch.style.display = "block";
        player2Touch.style.display = "block";
        addPlayerButton.disabled = true;
        switchMobileButton.innerHTML = "Switch to Web Version";

        //Switch mode and add players 
        mode = 1;
        addPlayer();
    } else {

        //Display Web version elements
        player1Touch.style.display = "none";
        player2Touch.style.display = "none";
        addPlayerButton.disabled = false;
        switchMobileButton.innerHTML = "Switch to Mobile Version";

        //Switch mode
        mode = 0;
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
    if (tempJump == undefined || tempPower == undefined) {
        window.alert("One or more inputs aren't set");
        return;
    }
    if (usedInputs.includes(tempJump) || usedInputs.includes(tempPower)) {
        window.alert("One or more of the inputs are being used by another player");
        return;
    } else if (tempJump == tempPower) {
        window.alert("Please select unique inputs");
        return;
    }

    usedInputs.push(tempJump);
    usedInputs.push(tempPower);

    //If so, increment player count, add a player to the screen by creating a div
    //Style the div, display it properly on screen, and store it in a list for future manipulation
    playerCount += 1;
    let styleColor = `linear-gradient(rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
    ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
    ${Math.floor(Math.random() * 256)}, 0.8))`;

    const parentDiv = document.createElement("div");
    parentDiv.style.textAlign = "center";

    const divElement = document.createElement("div");
    divElement.classList.add("display");
    divElement.style.background = styleColor;
    divElement.style.fontSize = "2vh";
    divElement.innerHTML = `Player ${playerCount}`;
    parentDiv.append(divElement);
    showPlayers.append(parentDiv);

    const playerElement = document.createElement("div");
    playerElement.classList.add("player");
    playerElement.style.background = styleColor;
    mainPlayers.append(playerElement);

    const player = new Player(playerElement, tempJump, tempPower);
    playerList.push(player);

    inputPopup.style.display = "none";
    jumpInputText.innerHTML = `Button Selected: None`;
    powerInputText.innerHTML = `Button Selected: None`;
}

//Function to add Players to the screen and to the game
function addPlayer() {
    //If in mobile version of the game, then add 2 players
    if (mode == 1) {
        playerCount = 2;
        for (let i = 0; i < 2; i++) {

            //Generate random gradient
            let styleColor = `linear-gradient(rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
            ${Math.floor(Math.random() * 256)}, 0.8), rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
            ${Math.floor(Math.random() * 256)}, 0.8))`;

            //Create div element and put it as display player
            const parentDiv = document.createElement("div");
            parentDiv.style.textAlign = "center";
            
            const divElement = document.createElement("div");
            divElement.classList.add("display");
            divElement.style.background = styleColor;
            divElement.style.fontSize = "2vh";
            divElement.innerHTML = `Player ${playerCount}`;
            parentDiv.append(divElement);
            showPlayers.append(parentDiv);

            //Create div element for player
            const playerElement = document.createElement('div');
            playerElement.classList.add("player");
            playerElement.style.background = styleColor;
            mainPlayers.append(playerElement);

            const player = new Player(playerElement, 0, 1);
            playerList.push(player);
        }
    } else {
        //Else let the user add players upto 5

        //Stop the user from adding more players if already reached 5
        //or if screen width is < 800 and 2 players have been added
        if ((window.innerWidth < 800 && playerCount <= 2) || window.innerWidth >= 800 && playerCount >= 5) {
            window.alert("More Players cannot be added!");
            return
        }

        //Display Popup for user inputs
        inputPopup.style.display = "flex";
    }
}

//Function to add obstacles to the screen and to the game
function addObstacle(random, type) {
    let threshold;

    //Threshold to spawn objects
    if (type == "obstacle") threshold = 0.8;
    else if (type == "power") threshold = 0.9;

    //If random number above threshold spawn object
    if (random >= threshold) {

        //Generate random number to decide a random obstacle
        if (type == "obstacle") random = Math.floor(Math.random() * 5);
        else if (type == "power") random = Math.floor(Math.random() * 2);

        const obstacleElement = document.createElement('div');
        
        if (type == "obstacle") {
            obstacleElement.classList.add("obstacle");
            obstacleElement.classList.add(`obstacle${random}`);
        }
        else if (type == "power") {
            obstacleElement.classList.add("power");
            obstacleElement.classList.add(`power${random}`);
        }

        mainPlayers.append(obstacleElement);

        const obstacle = new Elem(obstacleElement, type, random);
        obstacleList.push(obstacle);
    }
}

//function to remove the text/buttons and start the gameplay
function playGame() {

    //If no players added, alert the user and exit the function
    if (playerCount == 0) {
        window.alert("No Players added!");
        return;
    } else if (playerCount == 1) {
        //If only 1 player added, ask if they want to play alone
        let response = window.confirm("Only 1 Player added, are you sure you want to play alone");
        if (!response) {
            return;
        }
    }

    let cloneDiv = showPlayers.cloneNode(true);
    let cloneElems = cloneDiv.children;

    for (let i = 0; i < cloneElems.length; i++) {
        let tempChild = cloneElems[i];

        let tempP = document.createElement('p');
        tempP.style.fontSize = "1.4vw";
        tempP.innerHTML = "score: 0";
        tempChild.append(tempP);

        let tempImg = document.createElement('img');
        tempImg.style.height = "6svh";
        tempImg.style.width = "6svh";
        tempChild.append(tempImg);

        playerList[i].setScoreElement(tempP);
        playerList[i].setPowerElement(tempImg);
    }

    cloneDiv.style.justifyContent = "space-evenly";
    
    //Remove the text and buttons in an animated way
    mainText.style.position = "relative";
    let y = mainText.offsetTop;
    let intervalID = setInterval(function() {
        mainText.style.top = `${y}px`;
        y -= 1;
        if ((y + mainText.offsetHeight) < 0) {
            mainText.style.display = "none";
            background.append(cloneDiv);
            clearInterval(intervalID);
        }
    }, 1);

    //Increase the speed of the background animations and the gameplay animations
    speed = 0.4;

    floor = ground.offsetTop;
    gameStarted = true;
}

//main loop that keeps everything moving
function startLoop() {

    //If device in portrait mode, suggest landscape mode
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    if (portrait) {
        window.alert("The website is built for landscape mode, " + 
        "if you can, Please change the Orientation to Landscape");
    }

    //Variables for background and ground movement
    let backgroundSpeed = 1;
    let backgroundPosX = 0;

    let groundSpeed = 5.5;
    let groundPosX = 0;
    var floor = ground.offsetTop;

    //Variables for player and obstacles
    let rotation = 0;
    let gravity = 0.05;
    let holdSpawn = 400;
    let holdScore = 200;
    let spawnTries = 0;

    mainInterval = setInterval(function() {

        //Start moving the background
        background.style.backgroundPositionX = `${backgroundPosX}px`;
        backgroundPosX -= (backgroundSpeed * speed);
        if (backgroundPosX <= -window.innerWidth) {
            backgroundPosX = 0;
        }

        //Start moving the ground
        ground.style.backgroundPositionX = `${groundPosX}px`;
        groundPosX -= (groundSpeed * speed);
        if (groundPosX <= -window.innerWidth) {
            groundPosX = 0;
        }

        //For each obstacle that exists
        for (let i = 0; i < obstacleList.length; i++) {

            //Move the obstacle at the same speed as ground
            let tempObstacle = obstacleList[i];
            tempObstacle.setX(tempObstacle.getLeft() - (groundSpeed * speed));

            //If obstacle out of screen, remove obstacle
            if (tempObstacle.getRight() < 0) {
                tempObstacle.element.parentNode.removeChild(tempObstacle.element);
                obstacleList = obstacleList.slice(1);
            }
        }

        //For each player that exists
        for (let i = 0; i < playerList.length; i++) {
            if (!gameStarted) break;

            let tempPlayer = playerList[i];

            //Set the rotation of the player
            tempPlayer.setRotation(rotation);

            if (holdScore <= 0) {
                tempPlayer.incrementScore(1);
            }

            //Affect player by gravity
            if (tempPlayer.jumping || tempPlayer.getBottom() < floor) {
                tempPlayer.fall();
                tempPlayer.speedY -= gravity;
            }

            //If player below floor, set on floor
            if (tempPlayer.getBottom() >= floor) {
                tempPlayer.setOn(floor);
                tempPlayer.speedY = 0;
                tempPlayer.jumping = false;
            }

            //Go through each obstacle and check if collided with player
            for (let i = 0; i < obstacleList.length; i++) {
                let tempObstacle = obstacleList[i];
                if (tempObstacle.getLeft() <= tempPlayer.getRight() && tempObstacle.getRight() >= tempPlayer.getLeft()
                && tempObstacle.getTop() <= tempPlayer.getBottom() && tempObstacle.getBottom() >= tempPlayer.getTop()) {
                    if (tempObstacle.type == "obstacle") {
                        if (tempPlayer.shieldActive == true) {
                            tempPlayer.setPower(undefined);
                            tempPlayer.setShield(false);
                        }
                        else {
                            deadPlayers.push(tempPlayer);
                            tempPlayer.element.parentNode.removeChild(tempPlayer.element);
                            playerList = playerList.filter(function (val) {
                                return val !== tempPlayer;
                            });
                            playerCount -= 1;

                            if (playerCount <= 1) {
                                gameFinished = true;
                            }
                        }
                        tempObstacle.element.parentNode.removeChild(tempObstacle.element);
                        obstacleList = obstacleList.filter(function (val) {
                            return val !== tempObstacle;
                        });
                    } else if (tempObstacle.type == "power") {
                        if (tempPlayer.power == undefined) {
                            tempPlayer.incrementScore(10);
                            tempPlayer.setPower(tempObstacle.value);
                            tempObstacle.element.parentNode.removeChild(tempObstacle.element);
                            obstacleList = obstacleList.filter(function (val) {
                                return val !== tempObstacle;
                            });
                        }
                    }
                }
            }
        }

        if (holdScore <= 0) {
            holdScore = 200;
        }
        holdScore -= 1;

        //Increase rotation
        rotation += 1;

        //If speed is more than 0.1, and holdSpawn is less than 0
        //try spawning obstacle
        if (speed > 0.1 && holdSpawn <= speed*100) {
            console.log("Spawning");
            addObstacle(Math.random(), "obstacle");
            addObstacle(Math.random(), "power");
            holdSpawn = 400;

            if (spawnTries >= 15) {
                spawnTries = 0;
                speed += 0.05;
            }

            spawnTries += 1;
        }

        holdSpawn -= 1;
    }, 5);
}