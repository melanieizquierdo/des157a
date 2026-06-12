(function(){
    'use strict'
    console.log('reading JS');

const startGame = document.querySelector('#startgame');
const gameControl = document.querySelector('#gamecontrol');
const game = document.querySelector('#game');
const score = document.querySelector('#score');
const actionArea = document.querySelector('#actions');

//my sounds
const buttonSound = new Audio('sounds/button.m4a');
const diceSound = new Audio('sounds/dice.m4a');
const gameMusic = new Audio('sounds/game.m4a');
gameMusic.volume = 0.15;

// background music button
const backgroundBtn = document.querySelector('#background');

backgroundBtn.addEventListener('click', function() {
    if (gameMusic.paused) {
        gameMusic.play();
        backgroundBtn.textContent = 'Pause Music'; // optional: change button text
    } else {
        gameMusic.pause();
        backgroundBtn.textContent = 'Play Music'; // optional: change button text
    }
});

//play the dice rolling sound
function playDice(callback){
    diceSound.pause();
    diceSound.currentTime = 0;

    diceSound.onended = function(){
        callback();
        diceSound.onended = null;
    };

    diceSound.play();
}

function celebrateWinner() {
    confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
    });
}


//stores gama data and also dice images
const gameData = {
    dice: ['1.png', '2.png', '3.png', 
           '4.png', '5.png', '6.png'],
    players: ['player 1', 'player 2'],
    score: [0, 0],
    roll1: 0,
    roll2: 0,
    rollSum: 0,
    index: 0,
    gameEnd: 30
};

 // user input (their name)
const username = prompt('Enter your name:');

// rplace player 1 with entered name
if (username) {
    gameData.players[0] = username;
document.querySelector('#welcome').innerHTML =
    `Welcome, <span class="playername">${username}!</span>`;}

//start
startGame.addEventListener('click', function(){
    buttonSound.play(); // play button sound when starting
    gameData.index = Math.round(Math.random());
    console.log(gameData.index);

    gameControl.innerHTML='<h3>The game has started!</h3>';
    gameControl.innerHTML +='<button id="quit">Quit?</button>';

    showCurrentScore(); // ADD THIS

    document.querySelector('#quit').addEventListener('click', function (){
        buttonSound.play(); // play button sound on quit
        location.reload();
    });

    // console.log('set up the turn');
    setupTurn();
}); // end start game function

function setupTurn(){
    game.innerHTML=`<p>Roll the dice for the ${gameData.players[gameData.index]}</p>`;
    actionArea.innerHTML='<button id="roll">Roll the dice</button>';

document.querySelector('#roll').addEventListener('click', function(){
    playDice(throwDice);
});
}
// handles dice rolling
function throwDice(){
        actionArea.innerHTML = '';
        gameData.roll1 = Math.floor(Math.random() * 6) +1;
        gameData.roll2 = Math.floor(Math.random() * 6) +1;

        game.innerHTML = `<p>Roll the dice for the ${gameData.players[gameData.index]}</p>`;
        game.innerHTML += `<img src="images/${gameData.dice[gameData.roll1-1]}"> <img src="images/${gameData.dice[gameData.roll2-1]}">`;
       // calculats total roll
        gameData.rollSum = gameData.roll1 + gameData.roll2;
        // snake eyes (1 + 1)
        if(gameData.rollSum === 2){
            game.innerHTML += '<p>Oh snap! Snake eyes!</p>';
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            setTimeout(setupTurn, 2000);
        }
        
        else if (gameData.roll1 === 1 || gameData.roll2 === 1){
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            game.innerHTML = `<p>Sorry one of your rolls was a one, switching to ${gameData.score[gameData.index]}</p>`;
            setTimeout(setupTurn, 2000);
        }

        else {
            console.log('neither die was a 1. game continues');
            gameData.score[gameData.index]= gameData.score[gameData.index] + gameData.rollSum;

            showCurrentScore();
            checkWinningCondition();

            actionArea.innerHTML = '<button id="rollagain">Roll Again</button> or <button id="pass">Pass</button>';

            document.querySelector('#rollagain').addEventListener('click', function(){
                playDice(throwDice);
            });

            document.querySelector('#pass').addEventListener('click', function(){
                buttonSound.play(); // play button sound on pass
                gameData.index ? (gameData.index = 0) : (gameData.index = 1); 
                setupTurn();
            });

            function checkWinningCondition(){
    if(gameData.score[gameData.index] >= gameData.gameEnd){
        celebrateWinner();
        
        score.innerHTML = `<h2>Winner is ${gameData.players[gameData.index]} with ${gameData.score[gameData.index]} points!</h2>`;

        actionArea.innerHTML = '';
        game.innerHTML = '';

        document.querySelector('#quit').innerHTML = 'Start a new game?';
    }


                //check if anyone won
                    function showCurrentScore() {
                    score.innerHTML = `<p>Tbe score is currently <strong> ${gameData.players[0]} : ${gameData.score[0]} </strong> 
                    and <strong> ${gameData.players[1]} : ${gameData.score[1]} </strong> </p>`;
            }
        }
    }
    }

    function showCurrentScore() {
    score.innerHTML = `
        <p>
            <strong>${gameData.players[0]}</strong>: ${gameData.score[0]} points
            <br>
            <strong>${gameData.players[1]}</strong>: ${gameData.score[1]} points
        </p>
    `;
}



})();
