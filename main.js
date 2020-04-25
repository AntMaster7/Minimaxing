function getBestMove(board, maxDepth) {
    [score, move] = minimax(board, board.currentPlayer(), maxDepth, 0);
    return move;
}

function minimax(board, player, maxDepth, currentDepth) {
    // check if we're done recursing
    if (board.isGameOver() || currentDepth == maxDepth) {
        return [board.evaluate(player), null]
    }

    // otherwise bubble up values from below
    var bestScore;
    if (board.currentPlayer() == player) {
        bestScore = Number.NEGATIVE_INFINITY;
    } else {
        bestScore = Number.POSITIVE_INFINITY;
    }

    var bestMove;
    for (const move of board.getMoves()) {
        var newBoard = board.makeMove(move);

        // recurse
        [currentScore, currentMove] = minimax(newBoard, player, maxDepth, currentDepth + 1);

        // update the best score
        if (board.currentPlayer() == player) {
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestMove = move;
            }
        } else {
            if (currentScore < bestScore) {
                bestScore = currentScore;
                bestMove = move;
            }
        }
    }

    board._state.value = bestMove.value;
    return [bestScore, bestMove];
}

window.onload = function () {
    function keydownHandler(e) {
        if (e.keyCode == 13 && waitingForEnter) {
            console.log("enter");
        }
    }

    if (document.addEventListener) {
        document.addEventListener('keydown', keydownHandler, false);
    }
    else if (document.attachEvent) {
        document.attachEvent('onkeydown', keydownHandler);
    }

    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    var root = this.parse([[[0], [0], [0]], [[[[2],[2]]], [1]]]);

    var radius = 30;
    var x = width / 2;
    root.draw(context, x, 100, radius, 40);

    window.onresize = function () {
        canvas.height = window.innerHeight;
        root.draw(context, x, 100, radius, 40);
    };
}

function parse(tree) {
    var root = new TreeNode(0);
    for (let index = 0; index < tree.length; index++) {
        let child = tree[index];
        if (child.length == 1 && !Array.isArray(child[0])) {
            root.addChild(new TreeNode(child[0]));
        } else {
            root.addChild(parse(child));
        }
    }
    return root;
}
