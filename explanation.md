# Complex Algorithms - SENG513 A3 (Saksham Puri 30140617)
## Algorithm to Switch from Web Version to Mobile and back

```javascript
//Function to transition from web version to mobile version and vice versa
function switchMobile() {

    //Delete all players from screen
    let displayClass = document.getElementsByClassName("display");
    while (displayClass[0]) {
        displayClass[0].parentNode.removeChild(displayClass[0]);
    }
    let playerClass = document.getElementsByClassName("player");
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
```
The function is triggered with a press of the button "Switch to Mobile Version" or "Switch to Web Version". We first delete all the display class elements which are showing the current players added to the game, and also deleting all the actual playable player elements from the screen and Javascript data. 

We check if `mode == 0` to check what the current version of the game is. The game starts of in `mode = 0` as default which is the web version. If currently in the web version, we display the 4 touch screen buttons for 2 players, and change the button to display "Switch to Web Version". We also disable the Add Players button and add the players ourselves so we can limit the total number of players to 2 in the Mobile Version. 

If `mode == 1` then we remove the 4 touch screen buttons from the screen, enable the Add Players button and change the text on Switch button to "Switch to Mobile Version"

When adding players when switching to mobile version, we create two DOM elements with random linear gradient background, and add those to the screen and save them in Javascript as well so the players can use those elements. 

## Obstacles / Powerups Generation Algorithm

Adding Randomness:
```javascript
//If speed is more than 0.1, and holdSpawn is less than 0
//try spawning obstacle
if (speed > 0.1 && holdSpawn <= speed*100) {
    console.log("Spawning");
    addObstacle(Math.random(), "obstacle");
    addObstacle(Math.random(), "power");
    holdSpawn = 400 - (speed*100);

    if (spawnTries >= 15) {
        spawnTries = 0;
        speed += 0.05;
    }

    spawnTries += 1;
}
holdSpawn -= 1;
```

Generation:
```javascript
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
```

Within the main loop of the game we have the code **Adding Randomness** where we do a few checks, we first check if the game speed is at playing level meaning the players started playing the game, and we also check if the variable `holdSpawn <= speed*100` which is check whether if the decrementing variable `holdSpawn` reached below the current game speed * 100. This check makes it so that as the game gets faster and the `speed` variable increments, the if statement will be triggered more frequently within the loop.

Once the check passes, we call the `addObstacle()` function with `Math.Random()` and the type of Obstalce being `"obstacle"` or `"power"`. We will get into this function a bit later, but after calling this function, the obstacle **might** spawn. Regardless, we set the `holdSpawn` variable to something correlating with `speed`. Now we do another check to see if we have tried spawning an obstacle 15 times. If so, we increase the speed of the game. Every 14 times in loop, we increase the speed.

For the actual generation of the obstacle, we look at `addObstacle()` function. This function takes a random float, and the type of obstacle. At the start, depending on the type of the obstacle, we set the `threshold` variable. Then we check if the random value is greater than that threshold. If so, we move onto actually generating the obstacle. 
This gives `"obstacles"` a 20% chance of spawning and `"power"` a 10% chance of spawning. Once we get past the threshold, we generate another random integer, if `"obstacle"`, we generate values 0-4, otherwise we generate 0 or 1. Now we create DOM elements, and using the newly generated integer, we decide on the type of background image the obstacle or the power up will have. We add these obstacles to the screen and to javascript data to keep track of them from here.

## Powerups usage Management
**Collision With Powerup**
```javascript
else if (tempObstacle.type == "power") {

    //If the obstacle is a power up and player doesn't have a power
    if (tempPlayer.power == undefined) {
    
        //Increase player score for getting powerup
        tempPlayer.incrementScore(2);
    
        //Give the player the power up
        tempPlayer.setPower(tempObstacle.value);
    
        //Remove it from the game
        tempObstacle.element.parentNode.removeChild(tempObstacle.element);
        obstacleList = obstacleList.filter(function (val) {
            return val !== tempObstacle;
        });
    }
}
```

**Usage**
```javascript
else if (tempPlayer.powerKey == e.code) {
    if (tempPlayer.power == 0) {
        tempPlayer.setShield(true);

    } else if (tempPlayer.power == 1 && !tempPlayer.jumping) {
        tempPlayer.speedY = Math.floor(jumpHeight*1.5);
        tempPlayer.jumping = true;
        tempPlayer.setPower(undefined);
    }
}
```
**Collision with Obstacle while having Shield**
```javascript
 //Check if they have shield
if (tempPlayer.shieldActive == true) {
    tempPlayer.setPower(undefined);
    tempPlayer.setShield(false);
}
```

Once a player collides with a power up element, we check if the player already has a power up, if so, the player doesn't gain the new powerup. But if the player doesn't have a powerup yet, we give the player 2 score for picking up the power up, and give them the powerup they collided with and remove the powerup from the screen

The player can then use the power up with the keys they have set for powerup. When the player clicks that button, we check what power up they had. If they had a shield, we enable their shield but don't get rid of their power up until the shield is used up. If the powerup was the Jump Boost, we make the player jump 1.5 times higher than usual, and remove the player's power up so they can pickup another one.

If the player has a shield **enabled** they will see a blue outline around their player on the screen, and if they collide with a obstacle while the shield is enabled, they will lose the shield and now the player will lose the power up of shield enabling them to pickup another power up. 