window.onload = function () {
    var canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        width = canvas.width = window.innerWidth;
    var treeCenter = width / 2;

    // Create tree data from a simple array.
    var tree = this.parse([[[0], [0], [0]], [[[[2],[2]]], [1]]]);
    
    // Draw the tree.
    tree.draw(context, treeCenter, 100, 30, 40);

    // Redraw tree if window size changed.
    window.onresize = function () {
        canvas.height = window.innerHeight;
        tree.draw(context, treeCenter, 100, radius, 40);
    };
}

// Creates a TreeNode structure from the given array.
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
