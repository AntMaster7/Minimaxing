class TreeNode {
    constructor(value) {
        this._children = new Array();
        this._value = value;
        this._width = 0;
        this._k = 0;
    }

    get text() {
        return this._value;
    }

    get value() {
        return this._value;
    }

    set value(n) {
        this._value = n;
    }

    hasChildren() {
        return this._children.length > 0;
    }

    addChild(child) {
        this._children.push(child);
        return child;
    }

    addChildren(children) {
        this._children.push(...children);
        return this;
    }

    /**
     * Parses an array in the form of [[[2], [2]], [1]] and creates a tree object.
     * 
     *        ()
     *       /  \
     *      ()  (1)
     *     /  \
     *   (2)  (2)
     * 
     * @param {*} array - The array to parse.
     */
    static parse(array) {
        var root = new TreeNode(0);
        for (let index = 0; index < array.length; index++) {
            let child = array[index];
            if (child.length == 1 && !Array.isArray(child[0])) {
                root.addChild(new TreeNode(child[0]));
            } else {
                root.addChild(TreeNode.parse(child));
            }
        }
        return root;
    }
}

class TreeRenderer {
    /**
     * Initializes the TreeRenderer instance.
     * 
     * @param {*} canvas - The canvas to render on.
     * @param {*} radius - The radius of a node.
     * @param {number} space - The minimum horizontal space between two nodes.  
     */
    constructor(canvas, radius, space) {
        this._canvas = canvas;
        this._radius = radius;
        this._space = space;
    }

    /**
     * Measures the total witdh of the given tree. Useful for determining 
     * the x coordinate of the tree before actually rendering.
     * 
     * @param {*} tree - The tree to measure.
     */
    measureWidth(tree) {
        let width = 0;

        if (tree._children.length) {
            for (let child of tree._children) {
                width += this.measureWidth(child) + this._space;
            }
        } else {
            width = 2 * this._radius + this._space; // base case
        }

        width -= this._space; // fix for right margin
        return width;
    }

    /**
     * Renders the given tree at the specified position.
     * 
     * @param {*} tree - The tree to render.
     * @param {*} x - The left position of the tree.
     * @param {*} y - The top position of the tree.
     */
    render(tree, x, y) {
        const context2d = this._canvas.getContext("2d");
        this._render(context2d, tree, x, y, this._radius, this._space);
    }

    _render(ctx, node, x, y, r, s) {
        let cx = x; // some kind of vertical scan line
        let cy = y + 3 * r; // y-coordinate for children

        let directChildrenPositions = [];

        // draw children
        for (let index = 0; index < node._children.length; index++) {
            // draw current child and update the position for the next child
            let result = this._render(ctx, node._children[index], cx, cy, r, s);
            cx += result[0];
            if (index < node._children.length - 1 /* not last */) {
                cx += s;
            }

            directChildrenPositions.push(result[1]);

            /* some vector math to clip line
            var vx = TreeNode.hack.x - n;
            var vy = TreeNode.hack.y - y;
            var length = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
            var lambda = (length - r) / length;
            vx *= lambda;
            vy *= lambda;
            */

            // canvasUtils.line(ctx, n, y, n + vx, y + vy);
        }

        // total width used by all children
        let totalWidthChildren = cx - x;

        // special case for nodes without siblings
        if (totalWidthChildren === 0) {
            totalWidthChildren = 2 * r;
        }

        // get position horizontally centered above its children for node
        let absoluteCenterX = x + (totalWidthChildren / 2);

        // draw edges from node to its children
        let childPosition = null;
        while ((childPosition = directChildrenPositions.pop())) {
            canvasUtils.line(ctx, absoluteCenterX, y, childPosition[0], childPosition[1]);
        }

        this._renderNode(ctx, node, absoluteCenterX, y, r);
        return [totalWidthChildren, [absoluteCenterX, y]];
    }

    // renders node
    _renderNode(ctx, node, x, y, r) {
        canvasUtils.circle(ctx, x, y, r, "#abc");
        canvasUtils.text(ctx, node.text, x, y, "20px Georgia");
    }
}