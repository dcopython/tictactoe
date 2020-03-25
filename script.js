const gameBoard = (() => {
    let gameBoard = [
        ["O","X","O"],
        ["O","X","_"],
        ["X","O","X"]
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

    //MOVE TO START GAME
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

        //const nameOne = player(playerNames[0].value);
        //const nameTwo = player(playerNames[1].value);

        const nameOne = "DAN";
        const nameTwo = "BOT";

        // randomly pick a player to start
        let startingTurn = Math.round(Math.random());
        startingTurn = startingTurn == 0 ? true : false;

        const playerOne = player(nameOne, "X", startingTurn);
        const playerTwo = player(nameTwo, "O", !startingTurn)
        
        return {
            playerOne,
            playerTwo
        }
    }

    //console.log(_createPlayers());

    const playerTurn = () => {
        _createPlayers();

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

    // create players
    // const playerOne = player(_createPlayers().playerOne.name, _createPlayers().playerOne.marker, _createPlayers().playerOne.turn);
    // const playerTwo = player(_createPlayers().playerTwo.name, _createPlayers().playerTwo.marker, _createPlayers().playerTwo.turn);

    //playerTurn(); //MOVED TO START GAME FUNCTION

    return {
        playerTurn: playerTurn,
        changePlayerTurn: changePlayerTurn
    }
    
})();

const game = (() => {
    const startGame = () => {
        players.playerTurn();
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
        if (getRowMarkers() == true || getColMarkers() == true || getDiagMarkers() == true) {
            endGame("win");
        }
        else {
            if (checkForTie()) {
                endGame("tie");
            }
        }
    }
    
    // evaluate rows each turn
    const getRowMarkers = () => {
        let rows = document.querySelectorAll(".game-rows");

        for (let row of rows) {
            const results = [...row.innerText].filter((text) => {
                return (text == "X" || text == "O" || text == "_")
            })

            if (results.every((v) => {return v == results[0]})) {
                console.log("ROW WIN");
                return true;
            }
        }
    }

    // evaluate columns each turn
    const getColMarkers = () => {
        let results = [];
        
        for (i = 0; i < 3; i++) {
            let r = [];
            let cols = document.querySelectorAll(`#game-col${i}`);
            for (let col of cols) {
                r.push(col.innerText);
            }
            results.push(r); //contains all three columns in one array
        }
        //console.log(results);

        if (results.every((x) => {return Array.isArray(x)})) {
            for (let arr of results) {
                if (arr.every((v) => {return v == arr[0]})) {
                    console.log("COL WIN")
                    return true;
                }
            }
        }
    }

    // check for diagonal wins
    const getDiagMarkers = () => {
        const leftToRight = () => {
            const results = [];
            for (i = 0; i < 3; i++) {
                let rowCol = document.querySelector(`#game-row${i} #game-col${i}`)
                results.push(rowCol.innerText);
            }

            //console.log(results)

            if (results.every((v) => {return v == results[0]})) {
                console.log("DIAG WIN");
                return true;
            }
        }
        
        const rightToLeft = () => {
            const results = [];
            let count = 2;
            for (i = 0; i < 3; i++) {
                let rowCol = document.querySelector(`#game-row${i} #game-col${count}`)
                results.push(rowCol.innerText);

                count--;
            }
            
            //console.log(results);

            if (results.every((v) => {return v == results[0]})) {
                console.log("DIAG WIN");
                return true;
            }
        }

        return {
            leftToRight: leftToRight(),
            rightToLeft: rightToLeft()
        }
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

    //start button logic
    document.getElementById("start").addEventListener("click", startGame);
    
    return {
        checkWin: checkWin,
    }

})();