(function(){
    'use strict'
    console.log('reading JS');

const startGame = document.querySelector('#startgame');
const gameControl = document.querySelector('#gamecontrol');
const game = document.querySelector('#game');
const score = document.querySelector('#score');
const actionArea = document.querySelector('#actions');

const gameData = {
	dice: ['1.png', '2.png', '3.png', 
		   '4.png', '5.png', '6.png'],
	players: ['player 1', 'player 2'],
	score: [0, 0],
	roll1: 0,
	roll2: 0,
	rollSum: 0,
	index: 0,
	gameEnd: 29
};

const username = prompt('Enter your name:');

if (username) {
    gameData.players[0] = username;
document.querySelector('#welcome').innerHTML =
    `Welcome, <span class="playername">${username}!</span>`;}

startGame.addEventListener('click', function(){

    gameData.index = Math.round(Math.random());
    console.log(gameData.index);

    gameControl.innerHTML='<h3>The game has started!</h3>';
    gameControl.innerHTML +='<button id="quit">Quit?</button>';
    document.querySelector('#quit').addEventListener('click', function (){
        location.reload();
    });

    // console.log('set up the turn');
    setupTurn();
}); // end start game function

function setupTurn(){
    game.innerHTML=`<p>Roll the dice for the ${gameData.players[gameData.index]}</p>`;
    actionArea.innerHTML='<button id="roll">Roll the dice</button>';
    document.querySelector('#roll').addEventListener('click', function(){
        // console.log('roll the dice');
        throwDice();

    });
}

    function throwDice(){
        actionArea.innerHTML = '';
        gameData.roll1 = Math.floor(Math.random() * 6) +1;
        gameData.roll2 = Math.floor(Math.random() * 6) +1;

        // console.log(gameData.roll2);

        game.innerHTML = `<p>Roll the dice for the ${gameData.players[gameData.index]}</p>`;
        game.innerHTML += `<img src="images/${gameData.dice[gameData.roll1-1]}"> <img src="images/${gameData.dice[gameData.roll2-1]}">`;
        gameData.rollSum = gameData.roll1 + gameData.roll2;

        if(gameData.rollSum === 2){
            // console.log('snake eyes!');
            game.innerHTML += '<p>Oh snap! Snake eyes!</p>';
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            setTimeout(setupTurn, 2000);
        }
        
        else if (gameData.roll1 === 1 || gameData.roll2 === 1){
            // console.log('one of the two dice rolled a 1');
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            game.innerHTML = `<p>Sorry one of your rolls was a one, switching to ${gameData.score[gameData.index]}</p>`;
            setTimeout(setupTurn, 2000);
        }

        else {
            console.log('neither die was a 1. game continues');
            gameData.score[gameData.index]= gameData.score[gameData.index] + gameData.rollSum;
            actionArea.innerHTML = '<butto id = "rollagain">Roll Again</button> or <button id="pass">Pass</button>';

            document.querySelector('#rollagain').addEventListener('click', function(){
                throwDice();

            });

            document.querySelector('#pass').addEventListener('click', function(){
                gameData.index ? (gameData.index = 0) : (gameData.index = 1); 
                setupTurn();

            });

            function checkWinningCondition(){
                if(gameData.score[gameData.index] > gameData.gameEnd){
                    score.innerHTML = `<h2>${gameData.players[gameData.index]} wins with ${gameData.score[gameData.index]} points!</h2>`;

                    actionArea.innerHTML = '';
                    document,querySelector('#quit').innerHTML = 'Start a new game?';

                }
                // else {
                    function showCurrentScore() {
                    score.innerHTML = `<p>Tbe score is currently <strong> ${gameData.players[0]} : ${gameData.score[0]} </strong> 
                    and <strong> ${gameData.players[1]} : ${gameData.score[1]} </strong> </p>`;
            }
            // function showCurrentScore(){
            //     score.innerHTML = `<p>The score is currently <strong> ${} ${} </strong> and <strong> ${} ${} </strong></p>`;
            // }
        }
    }
    }

})();