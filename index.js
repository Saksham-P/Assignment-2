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

let jumpHeight = window.innerHeight/170;
let mainInterval;
let speed = 0.1;

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
        powerInputButton.innerHTML = "Press Button To Record Jump Button";
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
    }
}

//Player class that holds all the components for a player
class Player {
    constructor(element, jumpKey, powerKey) {
        this.element = element;
        this.jumpKey = jumpKey;
        this.powerKey = powerKey;
        this.speedX = 4.7;
        this.speedY = 0;
        this.jumping = false;
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
    constructor(element, type) {
        this.element = element;
        this.type = type
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

    const divElement = document.createElement('div');
    divElement.classList.add("display");
    divElement.style.background = styleColor;
    divElement.style.fontSize = "2vh";
    divElement.innerHTML = `Player ${playerCount}`;
    showPlayers.append(divElement);

    const playerElement = document.createElement('div');
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
            const divElement = document.createElement('div');
            divElement.classList.add("display");
            divElement.style.background = styleColor;
            divElement.style.fontSize = "2vh";
            divElement.innerHTML = `Player ${playerCount}`;
            showPlayers.append(divElement);

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
function addObstacle(random) {
    //Threshold to spawn objects
    let threshold = 0.9;

    //If random number above threshold spawn object
    if (random >= threshold) {

        console.log("success");
        //Generate random number to decide a random obstacle
        random = Math.floor(Math.random() * 5);
        const obstacleElement = document.createElement('div');
        obstacleElement.classList.add("obstacle");
        if (random >= 0 && random <= 4) {
            obstacleElement.classList.add(`obstacle${random}`);
        }
        mainPlayers.append(obstacleElement);
        const obstacle = new Elem(obstacleElement, "obstacle");
        obstacleList.push(obstacle);

        threshold = 0.9;
    }

    //Decrease the threshold each time obstacle doesn't spawn to increase the odds
    threshold -= 0.0001;
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
    
    //Remove the text and buttons in an animated way
    mainText.style.position = "relative";
    let y = mainText.offsetTop;
    let intervalID = setInterval(function() {
        mainText.style.top = `${y}px`;
        y -= 1;
        if ((y + mainText.offsetHeight) < 0) {
            mainText.style.display = "none";
            clearInterval(intervalID);
        }
    }, 1);

    //Increase the speed of the background animations and the gameplay animations
    speed = 0.4;
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
    let floor = ground.offsetTop;

    //Variables for player and obstacles
    let rotation = 0;
    let gravity = 0.05;
    let holdSpawn = 100 - (speed * 10);
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
            let tempPlayer = playerList[i];

            //Set the rotation of the player
            tempPlayer.setRotation(rotation);

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
                if (tempObstacle.getLeft() <= tempPlayer.getRight() && tempObstacle.getRight() >= tempPlayer.getLeft()) {
                }
            }
        }

        //Increase rotation
        rotation += 1;

        //If speed is more than 0.1, and holdSpawn is less than 0
        //try spawning obstacle
        if (speed > 0.1 && holdSpawn <= 0) {
            console.log("Spawning");
            addObstacle(Math.random());
            holdSpawn = 100 - (speed * 10)*2;

            if (spawnTries >= 30) {
                spawnTries = 0;
                speed += 0.1;
            }

            spawnTries += 1;
        }

        holdSpawn -= 1;
    }, 5);
}