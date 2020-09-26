import TreeNode from './treeNode.js';
import TreeRenderer from './treeRenderer.js';

window.onload = function () {
    let canvas = document.getElementById("canvas"),
        width = canvas.width = 800;
    canvas.height = window.innerHeight - 2;

    // Initialize our tree renderer.
    const renderer = new TreeRenderer(canvas, 20, 10);



    let sliceAndSplice = (arr) => arr.length > 1 ? [sliceAndSplice(arr.slice(0, arr.length / 2)), sliceAndSplice(arr.slice(arr.length / 2, arr.length))] : [arr[0]];
    let data = sliceAndSplice([10, 11, 9, 12, 14, [15, 13], 14, 5, 2, 4, 1, 3, 22, 20, 21]);

    // Create a tree object from a simple array.
    let tree = TreeNode.parse(data);

    // Compute tree center position.
    let treeWidth = renderer.measureWidth(tree);
    let x = width / 2,
        xOffset = -(treeWidth / 2);
    let y = 100;

    // Render the tree. 
    renderer.render(tree, x + xOffset, y);

    function negamax(node, alpha, beta) {
        /**
         * Die Idee von Negamax ist, das Vorzeichen der Werte auf jeder neuen
         * Stufe so zu alternieren, dass jeder Spieler zum Ziel hat, seine Werte
         * zu maximieren.
         */
        node._explored = true;
        if (node.children.length) {
            for (let child of node.children) {
                // We only care about something better than alpha.
                alpha = Math.max(-negamax(child, -beta, -alpha), alpha);
                // Check if preceding player has a better alternative.
                if (alpha >= beta) {
                    break;
                }
            }
            return (node.value = alpha);
        } else {
            return node.value;
        }
    }

    negamax(tree, -100, +100);
    renderer.refresh();

    let stack = [];
    stack.push(tree);
    let visited = new Set();

    function visit(node) {
        if (node.children.length > 1) {
            node.value = node.children.map(a => a.value).reduce((a, b) => Math.max(-a, -b));
        } else if (node.children.length) {
            node.value = -node.children[0].value;
        }
    }

    window.addEventListener("keypress", event => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        if (event.code === "KeyS") {
            if (stack.length === 0) {
                console.log("reset");
                stack.push(tree);
                visited.clear();
                TreeNode.traverse(tree, (node) => node._explored = node._visited = false);
                renderer.render(tree, x + xOffset, y);
                return;
            }

            let stepThrough = true;

            while (stepThrough) {
                let current = stack[stack.length - 1];
                if (!visited.has(current)) {
                    console.log("explore: " + current._key);
                    current._explored = true;
                    stepThrough = false;
                    for (let child of current.children) {
                        console.log("push: " + child._key);
                        stack.push(child);
                    }
                    visited.add(current);
                    renderer.render(tree, x + xOffset, y);
                } else {
                    stepThrough = false;
                    current = stack.pop();

                    visit(current);

                    current._visited = true;
                    renderer.render(tree, x + xOffset, y);
                }
            }
        }
    });

    // Redraw tree if window size changed.
    window.onresize = function () {
        // Resize our canvas.
        canvas.height = window.innerHeight - 2;

        // Update new tree center position.
        treeWidth = renderer.measureWidth(tree);
        x = width / 2;
        xOffset = -(treeWidth / 2);

        // Render the tree again.
        renderer.render(tree, x + xOffset, y);
    };
}


