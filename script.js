const gameBoard = (() => {
    let gameBoard = [
        ["_","X","X"],
        ["X","O","O"],
        ["O","X","X"]
    ];

    const createGameBoard = (board) => {
        const gameTable = document.getElementById('game-table');
        let table = "";

        board.forEach((row, i) => {
            let template = `<tr class="game-rows" id="game-row${i}">`;

            row.forEach((column, i) => {
                template += `
                    <td class="game-cols" id="game-col${i}">${column}</td>
                `
            })

            template += `</tr>`;
            table += template;
        });

        gameTable.innerHTML = table;
        _boardTarget();
    }

    const _boardTarget = () => {
        const boardPositions = document.querySelectorAll(".game-cols");
        boardPositions.forEach((position) => {
            position.addEventListener("click", function (e) {
                if (e.target.innerHTML == "_") {
                    // check who's turn it is
                    // place current player's marker
                    let currentPlayer = players.playerTurn();
                    e.target.innerHTML = currentPlayer.marker;
                    game.checkWin(currentPlayer);
                    players.changePlayerTurn(currentPlayer);
                }
                else {
                    gameMessage().innerHTML += "<p>Not a valid move!</p>";
                }
            })
        })
    }

    const gameMessage = () => {
        let msg = document.querySelector("#game-messages");
        return msg;
    }

    createGameBoard(gameBoard);

    return {
        gameMessage: gameMessage
    };

})();

const players = (() => {
    const player = (name, marker, turn) => {
        name,
        marker,
        turn
        return {name, marker, turn}
    };
    
    const _createPlayers = () => {
        const playerNames = document.querySelectorAll(".forminputs");

        // const playerOne = player(playerNames[0].value);
        // const playerTwo = player(playerNames[1].value);

        // const startingTurn = Math.round(Math.random()); // randomly pick a player to start
        let startingTurn = 0; // randomly pick a player to start

        startingTurn = startingTurn == 0 ? true : false;

        return startingTurn;
    }

    const playerTurn = () => {
        let currentPlayer;

        if (playerOne.turn == true) {
            currentPlayer = playerOne;
        }
        else {
            currentPlayer = playerTwo;
        }

        gameBoard.gameMessage().innerHTML = `${currentPlayer.name}'s (${currentPlayer.marker}) Turn`;
        return currentPlayer;
    }

    const changePlayerTurn = (player) => {
        player.turn = false;
        if (player == playerOne) {
            playerTwo.turn = true;
            gameBoard.gameMessage().innerHTML = `${playerTwo.name}'s (${playerTwo.marker}) Turn`;
        }
        else {
            playerOne.turn = true;
            gameBoard.gameMessage().innerHTML = `${playerOne.name}'s (${playerOne.marker}) Turn`;
        }
    }

    // TEST PLAYERS
    const playerOne = player("DAN", "X", _createPlayers())
    const playerTwo = player("BOT", "O", !(_createPlayers()))

    playerTurn();

    return {
        playerOne,
        playerTwo,
        playerTurn: playerTurn,
        changePlayerTurn: changePlayerTurn
    }
    
})();

const game = (() => {
    const startGame = () => {
        // assign the starting player when the game starts
    }

    const restartGame = () => {
        //run when user hits play another game
        closeWinMsg();
    }

    const endGame = (gameResult) => {
        if (gameResult == "tie") {
            document.getElementById("gamewin-header").innerHTML = "TIE GAME!"
        }
        else {
            document.getElementById("gamewin-header").innerHTML = `${players.playerTurn().name} WINS!`
        }
        
        const openWinMsg = () => {
            document.getElementById("gamewin-container").style.display = "block";
        }

        const closeWinMsg = () => {
            document.getElementById("gamewin-container").style.display = "none";
        }

        openWinMsg();
        return closeWinMsg;
    }

    const checkWin = () => {
        if (getRowMarkers()) {
            endGame("win");
        }
        getColMarkers();
        //getDiagMarkers()
        
        // if (checkForTie()) {
        //     endGame("tie");
        // }
    }

    const evalResults = (result) => {  
        if (result.every((x) => {return Array.isArray(x)})) { // check for column win if result contains three arrays
            result.forEach((arr) => { 
                if (arr.every((v) => {return v == arr[0]})) {
                    console.log("COL WIN")
                    endGame("win");
                }
            })
        }
        else { // check for row/diag win if result contains strings
            if (result.every((v) => {return v == result[0]})) {
                console.log("ROW OR DIAG WIN");
                //endGame("win");
                return "win";
            }
        }
    }
    
    // evaluate rows each turn
    const getRowMarkers = () => {
        let rows = document.querySelectorAll(".game-rows");

        rows.forEach((row) => {
            const results = [...row.innerText].filter((text) => {
                return (text == "X" || text == "O" || text == "_")
            })
            
            if (evalResults(results) == "win") {
            }
        })
    }

    // evaluate columns each turn
    const getColMarkers = () => {
        let results = [];
        
        for (i = 0; i < 3; i++) {
            let r = [];
            let cols = document.querySelectorAll(`#game-col${i}`);
            cols.forEach((col) => {
                r.push(col.innerText);
                
            })
            results.push(r); //contains all three columns in one array
        }

        evalResults(results)
        //console.log(results);
    }

    // check for diagonal wins
    const getDiagMarkers = () => {
        const leftToRight = () => {
            const results = [];
            for (i = 0; i < 3; i++) {
                let rowCol = document.querySelector(`#game-row${i} #game-col${i}`)
                results.push(rowCol.innerText);
            }
            evalResults(results);
            //console.log(results)
        }
        
        const rightToLeft = () => {
            const results = [];
            let count = 2;
            for (i = 0; i < 3; i++) {
                let rowCol = document.querySelector(`#game-row${i} #game-col${count}`)
                results.push(rowCol.innerText);

                count--;
            }
            evalResults(results);
            //console.log(results);
        }

        leftToRight();
        rightToLeft();
    }

    //check for tie
    const checkForTie = () => {
        //if there's no more empty spots, end the game with a tie
        const allspots = [...document.querySelectorAll(".game-cols")].filter((spot) => {
            if (spot.innerText == "_") {
                return spot;
            }
        })

        if (allspots.length == 0) {
            console.log("TIE");
            return true;
        }
    }

    return {
        checkWin: checkWin
    }

})();

//FIGURE OUT HOW TO FLAG END OF GAME