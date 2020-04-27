window.onload = function () {
    let canvas = document.getElementById("canvas"),
        width = canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize our tree renderer.
    const renderer = new TreeRenderer(canvas, 30, 40);

    // Create a tree object from a simple array.
    let tree = TreeNode.parse([[[0], [0], [0]], [[[[2], [2]]], [1]]]);

    // Compute tree center position.
    let treeWidth = renderer.measureWidth(tree);
    let x = width / 2,
        xOffset = -(treeWidth / 2);

    let y = 100;

    index(tree);

    // Render the tree. 
    renderer.render(tree, x + xOffset, y);

    let stack = [];
    let visited = new Set();

    function index(node) {
        let index = 1;
        let stack = [];
        let visited = new Set();
        stack.push(node);
        while (current = stack.pop()) {
            if (!visited.has(current)) {
                for (child of current.children) {
                    stack.push(child);
                }
                visited.add(current);
                current._explored = false;
                current._visited = false;
                current.value = current._key = index++;
            }
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
                index(tree);
                renderer.render(tree, x + xOffset, y);
                return;
            }

            let stepThrough = true;

            while (stepThrough) {
                let current = stack[stack.length - 1];
                if (!visited.has(current._key)) {
                    console.log("explore: " + current._key);
                    current._explored = true;
                    stepThrough = false;
                    for (child of current.children) {
                        console.log("push: " + child._key);
                        stack.push(child);
                    }
                    visited.add(current._key);
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


