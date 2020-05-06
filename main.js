import TreeNode from './treeNode.js';
import TreeRenderer from './treeRenderer.js';

window.onload = function () {
    let canvas = document.getElementById("canvas"),
        width = canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize our tree renderer.
    const renderer = new TreeRenderer(canvas, 30, 40);

    // Create a tree object from a simple array.
    let tree = TreeNode.parse([[[0], [0], [0]], [[[[2], [2]]], [1]]]);
	
	// Add unique key to each node
	let key = 0;
    TreeNode.traverse(tree, (node) => node.value = key++);

    // Compute tree center position.
    let treeWidth = renderer.measureWidth(tree);
    let x = width / 2,
        xOffset = -(treeWidth / 2);
    let y = 100;

    // Render the tree. 
    renderer.render(tree, x + xOffset, y);

    let stack = [];
	stack.push(tree);
    let visited = new Set();

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
                    console.log("visit: " + current._key);
                    current._visited = true;
                    renderer.render(tree, x + xOffset, y);
                }
            }
        }
    });

    // Redraw tree if window size changed.
    window.onresize = function () {
        // Resize our canvas.
        canvas.height = window.innerHeight;
        let width = canvas.width = window.innerWidth;

        // Update new tree center position.
        treeWidth = renderer.measureWidth(tree);
        x = width / 2;
        xOffset = -(treeWidth / 2);

        // Render the tree again.
        renderer.render(tree, x + xOffset, y);
    };
}


