
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

    return [bestScore, bestMove];
}

window.onload = function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight;

    var root = new TreeNode(100);

    var childa = root.addChild(new TreeNode(50));
    childa.addChild(new TreeNode(30));
    childa.addChild(new TreeNode(40));
    var childb = root.addChild(new TreeNode(20));

    var radius = 30;
    var x = width / 2;
    root.draw(context, x, 100, radius, 40);
}
