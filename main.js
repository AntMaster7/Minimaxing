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

    // Render the tree. 
    renderer.render(tree, x + xOffset, y);

    // Redraw tree if window size changed.
    window.onresize = function () {
        // Resize our canvas.
        canvas.height = window.innerHeight;
        let width = canvas.width = window.innerWidth;

        // Compute new tree center position.
        let treeWidth = renderer.measureWidth(tree);
        let x = width / 2,
            xOffset = -(treeWidth / 2);

        // Render the tree again.
        renderer.render(tree, x + xOffset, y);
    };
}


