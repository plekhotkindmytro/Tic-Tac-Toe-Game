var winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

var icons = [];
var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var result = [0, 0];

var Game = function () {
    var player1 = {
        score: 0,
        name: "Player",
        icon: null
    };
    var player2 = {
        score: 0,
        name: "Computer",
        icon: null
    }

    this.setPlayer1Icon = function (icon) {
        player1.icon = icon;
    }
    this.setPlayer2Icon = function (icon) {
        player2.icon = icon;
    }

    this.getPlayer1Icon = function () {
        return player1.icon;
    }

    this.getPlayer2Icon = function () {
        return player2.icon;
    }

    this.printGameDebugLog = function () {
        console.log(player1, player2);
    }
};

var currentX, currentO, currentEdition;

var game = new Game();

var isEnd = false;
var computerTurn = false;

$(document).ready(function () {
    applySeaStyles();
    showIconsToChoose();
    $("#reset-btn").on("click", resetAll(showGameMenu));
    $("#play-again-btn").on("click", function () {
        if (isEnd) {
            clearCells();
            return;
        }
    });
    $("#game-board tr td").on("click", playSymbol);

});

function applySeaStyles() {
    isEnd = false;
    var x_sea = [
        "img/x/dolphin.svg",
        "img/x/fish-4.svg",
        "img/x/hummerhead.svg",
        "img/x/medusa.svg",
        "img/x/octopus.svg",
        "img/x/seal.svg"
    ];
    var o_sea = [
        "img/o/eel.svg",
        "img/o/fish-5.svg",
        "img/o/fish-6.svg",
        "img/o/fish-7.svg",
        "img/o/swordfish.svg",
        "img/o/turtle.svg"
    ];

    currentX = x_sea;
    currentO = o_sea;
    currentEdition = "sea";
    $("body").css("background-image", "url(img/bg6.jpg)");
    $("body").css("color", "#0A369D");
    $("#global-links, #edition-switch").css("background-color", "#0A369D");
    $("#global-links a").css("color", "white");
    $("#global-links a").hover(function () {
        $(this).css("color", "white");
    });
    $("#edition-switch").html('<img class="edition-icon" src="img/dino_logo2.svg">');
    $("#edition-switch").prop('onclick', null).off('click');
    $("#edition-switch").on('click', resetAll(function () {
        showGameMenu();
        applyDinoStyles();
        showIconsToChoose();
    }));
    //    $("#global-links a").css("color", "#0A369D");
    //$("body").css("color", "#2752A1");
    $(".footer, a").css("color", "white");
    $("a").hover(function () {
        $(this).css("color", "white");
    });
    $("#x-party-title").css("color", "#15BAFE");
    $("#o-party-title").css("color", "#58AA66");
    $("#header-subtitle").text("Sea battle");


}

function applyDinoStyles() {
    isEnd = false;
    var x_dino = [
        "img/dino_set1/x/kentrosaurus.svg",
        "img/dino_set1/x/pterosaurus.svg",
        "img/dino_set1/x/spinosaurus.svg",
        "img/dino_set1/x/stegosaurus.svg",
        "img/dino_set1/x/tyrannosaurus-rex.svg",
        "img/dino_set1/x/velociraptor.svg"

    ];
    var o_dino = [
        "img/dino_set1/o/allosaurus.svg",
        "img/dino_set1/o/brontosaurus.svg",
        "img/dino_set1/o/diplodocus.svg",
        "img/dino_set1/o/ouranosaurus.svg",
        "img/dino_set1/o/styracosaurus.svg",
        "img/dino_set1/o/triceratops.svg"
    ];
    currentX = x_dino;
    currentO = o_dino;
    currentEdition = "dino";
    $("body").css("background-image", "url(img/bg-dino.jpg)");
    $("body").css("color", "#000");
    $("#global-links, #edition-switch").css("background-color", "#000");
    $("#edition-switch").html('<img class="edition-icon" src="img/sea_logo.svg">');
    $("#edition-switch").prop('onclick', null).off('click');
    $("#edition-switch").on('click', resetAll(function () {
        showGameMenu();
        applySeaStyles();
        showIconsToChoose();
    }));
    //    $("#global-links a").css("color", "#000");
    $(".footer, a").css("color", "black");
    $("a").hover(function () {
        $(this).css("color", "black");
    });
    $("#global-links a").css("color", "white");
    $("#global-links a").hover(function () {
        $(this).css("color", "white");
    });

    $("#x-party-title").css("color", "#79B585");
    $("#o-party-title").css("color", "#C98C51");
    $("#header-subtitle").text("Dino battle");

}

function playSymbol() {
    if (computerTurn) {
        return;
    }

    if (isEnd) {
        clearCells();
        return;
    }

    $(this).html('<img class="cell-img" src="{icon}">'.replace("{icon}", game.getPlayer1Icon()));
    var pos = $(this).attr("id");
    $("#" + pos).addClass("filled-cell");
    board[pos] = game.getPlayer1Icon();

    var winner = getWinner();
    if (winner) {
        saveResult(winner);
        isEnd = true;
    } else if (isTie()) {
        isEnd = true;
    } else {
        playComputer();
    }

}

function playComputer() {
    computerTurn = true;
    setTimeout(function () {

        if (isEnd) {
            return;
        }

        var rand = chooseComputerMove();
        $("#" + rand).html('<img src="{icon}">'.replace("{icon}", game.getPlayer2Icon()));
        $("#" + rand).addClass("filled-cell");
        board[rand] = game.getPlayer2Icon();

        var winner = getWinner();
        if (winner) {
            saveResult(winner);
            isEnd = true;
        } else if (isTie()) {
            isEnd = true;
        }
        computerTurn = false;
    }, 500);
}

function chooseComputerMove() {
    var clearBoard = board.reduce(function (prev, curr, i) {
        if (curr === 0) {
            prev.push(i);
        }

        return prev;
    }, []);
    var humanMoves = board.reduce(function (prev, curr, i) {
        if (curr === game.getPlayer1Icon()) {
            prev.push(i);
        }
        return prev;
    }, []);

    var computerMoves = board.reduce(function (prev, curr, i) {
        if (curr === game.getPlayer2Icon()) {
            prev.push(i);
        }
        return prev;
    }, []);


    var index;
    var corners = [0, 2, 6, 8];
    var sides = [1, 3, 5, 7];

    if (clearBoard.length === 9) {
        // you move first, go to the corner
        index = 2;
    } else if (humanMoves.length === 1 && computerMoves.length === 0) {
        if (corners.indexOf(humanMoves[0]) >= 0) {
            // go to the middle
            index = 4;
        } else if (humanMoves[0] === 1 || humanMoves[0] === 3 || humanMoves[0] === 4) {
            index = 0;
        } else if (humanMoves[0] === 5) {
            index = 2;
        } else if (humanMoves[0] === 7) {
            index = 6;
        } else {
            console.log("Using clear board to define the computer move. Please check the algorithm.")
            index = clearBoard[Math.floor(Math.random() * clearBoard.length)];
        }
    } else if (humanMoves.length === 1 && computerMoves.length === 1) {
        if (humanMoves[0] === 4 || humanMoves[0] === 0 || humanMoves[0] === 8) {
            index = 6;
        } else if (humanMoves[0] === 6) {
            index = 8;
        } else if (humanMoves[0] === 3 || humanMoves[0] === 7) {
            index = 4;
        } else if (humanMoves[0] === 1) {
            index = 5;
        } else if (humanMoves[0] === 5) {
            index = 1;
        } else {
            console.log("Using clear board to define the computer move. Please check the algorithm.")
            index = clearBoard[Math.floor(Math.random() * clearBoard.length)];
        }
    } else if (humanMoves.length >= 2 && computerMoves.length >= 1) {

        winConditions.forEach(function (winCondition) {
            if (index) {
                return;
            }

            var humanCount = 0;
            var computerCount = 0;
            winCondition.forEach(function (winElement) {
                if (humanMoves.indexOf(winElement) >= 0) {
                    humanCount++;
                }

                if (computerMoves.indexOf(winElement) >= 0) {
                    computerCount++;
                }
            });

            if (computerCount === 2 && humanCount === 0) {
                index = winCondition.filter(function (winElement) {
                    return computerMoves.indexOf(winElement) === -1;
                })[0];
            }
        });

        if (!index) {
            winConditions.forEach(function (winCondition) {
                if (index) {
                    return;
                }
                var humanCount = 0;
                var computerCount = 0;
                winCondition.forEach(function (winElement) {
                    if (humanMoves.indexOf(winElement) >= 0) {
                        humanCount++;
                    }

                    if (computerMoves.indexOf(winElement) >= 0) {
                        computerCount++;
                    }
                });

                if (humanCount === 2 && computerCount === 0) {
                    index = winCondition.filter(function (winElement) {
                        return humanMoves.indexOf(winElement) === -1;
                    })[0];
                }

            });
        }

        if (!index) {
            winConditions.forEach(function (winCondition) {
                if (index) {
                    return;
                }
                var humanCount = 0;
                var computerCount = 0;
                winCondition.forEach(function (winElement) {
                    if (humanMoves.indexOf(winElement) >= 0) {
                        humanCount++;
                    }

                    if (computerMoves.indexOf(winElement) >= 0) {
                        computerCount++;
                    }
                });

                if (computerCount === 1 && humanCount === 0) {
                    index = winCondition.filter(function (winElement) {
                        return computerMoves.indexOf(winElement) === -1;
                    })[0];
                }

            });
        }

        if (!index) {
            console.log("Using clear board to define the computer move. Please check the algorithm.")
            index = clearBoard[Math.floor(Math.random() * clearBoard.length)];
        }

    } else {
        console.log("Using clear board to define the computer move. Please check the algorithm.")
        index = clearBoard[Math.floor(Math.random() * clearBoard.length)];
    }


    return index;
}

function saveResult(winner) {
    var playerIndex = winner === icons[0] ? 0 : 1;
    result[playerIndex] += 1;
    showResult();

    var win = {
        "playerImg": winner,
        "gameResult": "win",
        "edition": currentEdition
    };
    var looser = winner === icons[0] ? icons[1] : icons[0];
    var loose = {
        "playerImg": looser,
        "gameResult": "loose",
        "edition": currentEdition
    }
    $.post("/tictactoe/addGame", JSON.stringify(win), "json");
    $.post("/tictactoe/addGame", JSON.stringify(loose), "json");

}

function showResult() {
    $("#player1-score").text(result[0]);
    $("#player2-score").text(result[1]);
}

function getWinner() {
    var winner;

    winConditions.some(function (condition) {
        if (isLineCrossed(condition)) {
            $("#" + condition[0]).css("background-color", "white");
            $("#" + condition[1]).css("background-color", "white");
            $("#" + condition[2]).css("background-color", "white");
            $("#" + condition[0]).effect("pulsate", {}, 1000, function () {
                $("#" + condition[0]).removeAttr("style");
            });
            $("#" + condition[1]).effect("pulsate", {}, 1000, function () {
                $("#" + condition[1]).removeAttr("style");
            });
            $("#" + condition[2]).effect("pulsate", {}, 1000, function () {
                $("#" + condition[2]).removeAttr("style");
                $("#end-game-popup").show("fade", {}, "slow", function () {
                    $("#game-board tr td").removeClass("filled-cell");
                });
            });
            winner = board[condition[0]];
            return true;
        }
    });

    return winner;
}

function isTie() {
    var tie = true;
    for (var i = 0; i < board.length; i++) {
        if (board[i] === 0) {
            tie = false;
            break;
        }
    }

    if (tie) {
        $("#game-board").css("background-color", "white");
        $("#game-board").effect("pulsate", {}, 1000, function () {
            $("#game-board").removeAttr("style");
            $("#game-board tr td").removeClass("filled-cell");
            $("#end-game-popup").show("fade", {}, "slow", function () {});
        });

        var tie1 = {
            "playerImg": icons[0],
            "gameResult": "tie",
            "edition": currentEdition
        };
        var tie2 = {
            "playerImg": icons[1],
            "gameResult": "tie",
            "edition": currentEdition
        }

        $.post("/tictactoe/addGame", JSON.stringify(tie1), "json");
        $.post("/tictactoe/addGame", JSON.stringify(tie2), "json");

    }
    return tie;
}

function isLineCrossed(condition) {
    return board[condition[0]] !== 0 && board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]];
}

function savePlayerIcon(callback) {

    return function () {
        var player1Icon = $(this).attr("src");
        var player2Icon;
        if (player1Icon.indexOf('/x/') >= 0) {
            player2Icon = currentO[Math.floor(Math.random() * currentO.length)];
            icons.push(player1Icon, player2Icon);
        } else {
            player2Icon = currentX[Math.floor(Math.random() * currentX.length)];
            icons.push(player2Icon, player1Icon);
        }
        game.setPlayer1Icon(player1Icon);
        game.setPlayer2Icon(player2Icon);

        callback();
    }
}

function resetAll(callback) {
    return function () {
        clearResult();
        clearCells();

        callback();
    }
}

function clearResult() {
    result = [0, 0];
    icons = [];
    $("#player1-score").text(0);
    $("#player2-score").text(0);
    isEnd = false;
}

function clearCells() {
    $("#game-board tr td").text("");
    $("#game-board tr td").removeClass("filled-cell");
    $("#game-board tr td").removeClass("winning-cell");
    $("#end-game-popup").hide("fade", {}, "slow", function () {});
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (isEnd) {
        isEnd = false;
        if (game.getPlayer1Icon() === icons[1]) {
            playComputer();
        }
    }
}

function showGameBoard() {
    clearCells();

    $(".header").hide("fade", {}, "slow", function () {});

    $("#game-menu").hide("fade", {}, "slow", function () {
        $("#reset-btn").show("fade", {}, "slow", function () {});
        $("#results").show("fade", {}, "slow", function () {});
        $("#game-board").show("fade", {}, "slow", function () {
            if (game.getPlayer1Icon() === icons[1]) {
                setPlayerNames("Computer", "Human");
                playComputer();
            } else {
                setPlayerNames("Human", "Computer");
            }

        });
    });
}

function setPlayerNames(player1, player2) {
    $("#player1-name").text(player1);
    $("#player2-name").text(player2);
}

function showGameMenu() {
    $("#reset-btn").hide("fade", {}, "slow", function () {});
    $("#end-game-popup").hide("fade", {}, "slow", function () {});
    $("#results").hide("fade", {}, "slow", function () {
        setPlayerNames("", "");
    });
    $("#game-board").hide("fade", {}, "slow", function () {
        $("#game-menu").show("fade", {}, "slow");
    });
}

function showIconsToChoose() {
    $("#x-party-icons").html("");
    $("#o-party-icons").html("");
    currentX.forEach(function (e) {
        $("#x-party-icons").append("<img class='x-icon player-icon' src='" + e + "'>");
    });

    currentO.forEach(function (e) {
        $("#o-party-icons").append("<img class='o-icon player-icon' src='" + e + "'>");
    });
    $(".player-icon").on("click", savePlayerIcon(showGameBoard));
}
