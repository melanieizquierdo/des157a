(function () {
    'use strict';

    console.log('reading JS');

    const startGame = document.querySelector('#startgame');
    const gameControl = document.querySelector('#gamecontrol');
    const game = document.querySelector('#game');
    const score = document.querySelector('#score');
    const actionArea = document.querySelector('#actions');

    // sound
    const buttonSound = new Audio('sounds/button.m4a');
    const diceSound = new Audio('sounds/dice.m4a');
    const gameMusic = new Audio('sounds/game.m4a');
    gameMusic.loop = true;

    gameMusic.volume = 0.15;
    diceSound.volume = 0.40;
    buttonSound.volume = 0.2;

    // background music button
    const backgroundBtn = document.querySelector('#background');
    backgroundBtn.addEventListener('click', function () {
        if (gameMusic.paused) {
            gameMusic.play();
            backgroundBtn.textContent = 'Pause Music';
        } else {
            gameMusic.pause();
            backgroundBtn.textContent = 'Play Music';
        }
    });

    function playDice(callback) {
        diceSound.pause();
        diceSound.currentTime = 0;

        diceSound.onended = function () {
            callback();
            diceSound.onended = null;
        };

        diceSound.play();
    }

    // function celebrateWinner() {
    //     confetti({
    //         particleCount: 150,
    //         spread: 90,
    //         origin: { y: 0.6 }
    //     });
    // }

    function celebrateWinner() {
    confetti({
        particleCount: 250,       
        spread: 150,              
        origin: { y: 0.6 },
        colors: ['#ff0000'],      
        scalar: 1.5               
    });
}



    const gameData = {
        dice: ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png'],
        players: ['player 1', 'Player 2'],
        score: [0, 0],
        roll1: 0,
        roll2: 0,
        rollSum: 0,
        index: 0,
        gameEnd: 30
    };

    // player name
    let username = localStorage.getItem('playerName');
    if (!username) {
        username = prompt('Enter your name:');
        localStorage.setItem('playerName', username);
    }

    if (username) {
        gameData.players[0] = username;
        document.querySelector('#welcome').innerHTML =
            `Welcome, <span class="playername">${username}!</span>`;
    }

    startGame.addEventListener('click', function () {
        buttonSound.play();
        gameData.index = Math.round(Math.random());

        gameControl.innerHTML = `
            <h3>The game has started!</h3>
            <button id="quit">Quit?</button>
        `;

        showCurrentScore();

        document.querySelector('#quit').addEventListener('click', function () {
            buttonSound.play();
            location.reload(); // full reset only if they quit
        });

        setupTurn();
    });

    function setupTurn() {
        game.innerHTML = `<p>Roll the dice for ${gameData.players[gameData.index]}</p>`;
        actionArea.innerHTML = `<button id="roll">Roll the dice</button>`;

        document.querySelector('#roll').addEventListener('click', function () {
            playDice(throwDice);
        });
    }

    function throwDice() {
        actionArea.innerHTML = '';

        gameData.roll1 = Math.floor(Math.random() * 6) + 1;
        gameData.roll2 = Math.floor(Math.random() * 6) + 1;
        gameData.rollSum = gameData.roll1 + gameData.roll2;

        game.innerHTML = `
            <p>Roll the dice for ${gameData.players[gameData.index]}</p>
            <img src="images/${gameData.dice[gameData.roll1 - 1]}">
            <img src="images/${gameData.dice[gameData.roll2 - 1]}">
        `;

        // snake eyes
        if (gameData.rollSum === 2) {
            game.innerHTML += '<p>Oh snap! Snake eyes!</p>';
            gameData.index = gameData.index === 0 ? 1 : 0;
            setTimeout(setupTurn, 2000);
            return;
        }

        // one die rolled a 1
        if (gameData.roll1 === 1 || gameData.roll2 === 1) {
            gameData.index = gameData.index === 0 ? 1 : 0;
            game.innerHTML += `<p>Sorry, one of your rolls was a 1. Switching to ${gameData.players[gameData.index]}.</p>`;
            setTimeout(setupTurn, 2000);
            return;
        }

        // turn
        gameData.score[gameData.index] += gameData.rollSum;
        showCurrentScore();

        if (checkWinningCondition()) return;

        actionArea.innerHTML = `
            <button id="rollagain">Roll Again</button>
            or
            <button id="pass">Pass</button>
        `;

        document.querySelector('#rollagain').addEventListener('click', function () {
            playDice(throwDice);
        });

        document.querySelector('#pass').addEventListener('click', function () {
            buttonSound.play();
            gameData.index = gameData.index === 0 ? 1 : 0;
            setupTurn();
        });
    }

    function checkWinningCondition() {
        if (gameData.score[gameData.index] >= gameData.gameEnd) {
            celebrateWinner();

            // show winner in the game area not in #score
            game.innerHTML = `
                <h2 style="margin-top: 65px; font-size: 60px;">
                    And the winner is ${gameData.players[gameData.index]}
                    with ${gameData.score[gameData.index]} points!
                </h2>
            `;

            actionArea.innerHTML = '';

            gameControl.innerHTML = `
                <h3>The game has ended!</h3>
                <button id="quit">Start a New Game?</button>
            `;

            document.querySelector('#quit').addEventListener('click', function () {
                buttonSound.play();

                // reset only game state NOT score layout
                gameData.score = [0, 0];
                gameData.roll1 = 0;
                gameData.roll2 = 0;
                gameData.rollSum = 0;
                gameData.index = Math.round(Math.random());

                showCurrentScore(); // keeps score lef right

                gameControl.innerHTML = `
                    <h3>The game has started!</h3>
                    <button id="quit">Quit?</button>
                `;

                document.querySelector('#quit').addEventListener('click', function () {
                    buttonSound.play();
                    location.reload(); // full reset if quit
                });

                setupTurn();
            });

            return true;
        }

        return false;
    }

    function showCurrentScore() {
        score.innerHTML = `
            <div>${gameData.players[0]}: ${gameData.score[0]}</div>
            <div>${gameData.players[1]}: ${gameData.score[1]}</div>
        `;
    }
})();