$(document).ready(function () {
    showIconsToChoose();
    $(".player-icon").on("click", savePlayerIcon(showGameBoard));
    $("#reset-btn").on("click", resetAll(showGameMenu));
    $("#game-board tr td").on("click", playSymbol);

});

var x = [
    "img/x/dolphin.svg",
    "img/x/fish-4.svg",
    "img/x/hummerhead.svg",
    "img/x/medusa.svg",
    "img/x/octopus.svg",
    "img/x/seal.svg"

];
var o = [
    "img/o/eel.svg",
    "img/o/fish-5.svg",
    "img/o/fish-6.svg",
    "img/o/fish-7.svg",
    "img/o/swordfish.svg",
    "img/o/turtle.svg"
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

}

var game = new Game();

var isEnd = false;
var computerTurn = false;

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


        var clearBoard = board.reduce(function (prev, curr, i) {
            if (curr === 0) {
                prev.push(i);
            }

            return prev;
        }, []);

        var rand = clearBoard[Math.floor(Math.random() * clearBoard.length)];
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

function saveResult(winner) {
    var playerIndex = winner === icons[0] ? 0 : 1;
    result[playerIndex] += 1;
    showResult();

    var win = {
        "playerImg": winner,
        "gameResult": "win",
        "edition": "sea"
    };
    var looser = winner === icons[0] ? icons[1] : icons[0];
    var loose = {
        "playerImg": looser,
        "gameResult": "loose",
        "edition": "sea"
    }
    $.post("/tictactoe/addGame", JSON.stringify(win), "json");
    $.post("/tictactoe/addGame", JSON.stringify(loose), "json");

}

function showResult() {
    $("#player1-score").text(result[0]);
    $("#player2-score").text(result[1]);
}

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
            });
            winner = board[condition[0]];
            $("#game-board tr td").removeClass("filled-cell");
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
        });

        var tie1 = {
            "playerImg": icons[0],
            "gameResult": "tie",
            "edition": "sea"
        };
        var tie2 = {
            "playerImg": icons[1],
            "gameResult": "tie",
            "edition": "sea"
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
            player2Icon = o[Math.floor(Math.random() * o.length)];
            icons.push(player1Icon, player2Icon);
        } else {
            player2Icon = x[Math.floor(Math.random() * x.length)];
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
    $("#results").hide("fade", {}, "slow", function () {
        setPlayerNames("", "");
    });
    $("#game-board").hide("fade", {}, "slow", function () {
        $("#game-menu").show("fade", {}, "slow");
    });
}

function showIconsToChoose() {
    /* var iconsTemplate = '<img class="player-icon" src="{icon1}"> or <img class="player-icon" src="{icon2}">';
 iconsTemplate = iconsTemplate.replace("{icon1}", icons[0]).replace("{icon2}", icons[1]);*/

    x.forEach(function (e) {
        $("#x-party-icons").append("<img class='x-icon player-icon' src='" + e + "'>");
    });

    o.forEach(function (e) {
        $("#o-party-icons").append("<img class='o-icon player-icon' src='" + e + "'>");
    });


    //$("#icons").html(iconsTemplate);
}


function winAlert(winner) {

}

function tieAlert() {

}
