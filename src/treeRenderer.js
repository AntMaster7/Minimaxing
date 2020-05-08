import TreeNode from "./treeNode.js";

export default class TreeRenderer {
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
        this._selected = null;
        this._rendered = false;

        let that = this;
        this._canvas.addEventListener('click', function (event) {
            let position = canvasUtils.getCursorPosition(that._canvas, event);

            let previousSelected = that._selected;
            that._selected = that._hittest(position);
            if (previousSelected != that._selected) {
                that.refresh();
            }
        });
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
            for (let child of tree.children) {
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
        this._tree = tree;
        this._layout(this._tree, x, y, this._radius, this._space);
        this.refresh();
    }

    /**
     * Redraws the tree to update its visual state like selection or texts.
     * Note that refresh does not draw any new nodes. Call render instead 
     * if you modified the tree's structure. 
     */
    refresh() {
        if (isNullOrUndefined(this._tree)) {
            console.error("No tree. Use render method first to set a tree.");
        }
        this._render();
    }

    /**
     * Recursively creates a _position and _parent property on each node. The position {x, y}
     * contains the absoult center of a node relative to the canvas. 
     * The parent is used later on to draw a line between each child and its parent.
     * 
     * @param {} node The root node.
     * @param {*} x The x-coordinate left of the tree's bounding box.
     * @param {*} y The y-coordinate top of the tree's bounding box.
     */
    _layout(node, x, y) {
        let cx = x; // some kind of vertical scan line
        let cy = y + 3 * this._radius; // y-coordinate for children

        // layout children
        for (let index = 0; index < node.children.length; index++) {
            let child = node.children[index];
            child._parent = node;
            cx += this._layout(child, cx, cy, node);
            if (index < node._children.length - 1 /* not last */) {
                cx += this._space;
            }
        }

        // total width used by all children
        let totalWidthChildren = cx - x;
        if (totalWidthChildren === 0) {
            // special case for nodes without siblings
            totalWidthChildren = 2 * this._radius;
        }

        // get position horizontally centered above its children for node
        let xC = x + (totalWidthChildren / 2);
        node._position = { x: xC, y: y };

        return totalWidthChildren;
    }

    _render() {
        const context2d = this._canvas.getContext("2d");

        context2d.clearRect(0, 0, canvas.width, canvas.height);

        let that = this;
        TreeNode.traverse(this._tree, (node) => {
            if (node._parent) {
                that._connectNodes(context2d, node, node._parent);
            }
            that._renderNode(context2d, node);
        });

        this._rendered = true;
    }

    _connectNodes(ctx, node1, node2) {
        canvasUtils.line(ctx,
            node1._position.x, node1._position.y,
            node2._position.x, node2._position.y
        );
    }

    // renders node
    _renderNode(ctx, node) {
        let color, strokeStyle;
        let x = node._position.x,
            y = node._position.y;

        // Determine node color
        if (node._visited) {
            color = "#74f285";
        } else if (node._explored) {
            color = "#e39d34";
        } else {
            color = "#abc";
        }

        // Determine border color
        if (this._selected == node) {
            strokeStyle = "#f00";
        } else {
            strokeStyle = "#000";
        }

        // Draw node
        canvasUtils.circle(ctx, x, y, this._radius, color, strokeStyle);

        // Draw text inside node
        canvasUtils.text(ctx, node.text, x, y, "20px Georgia");

        // Check for annotation
        if (node.annotation) {
            // Display annotation north-east of node
            const dx = Math.sin(Math.PI / 4) * (this._radius + 2 /* border */);
            const dy = -Math.cos(Math.PI / 4) * (this._radius - 12 /* text height */);

            // Draw annotation
            canvasUtils.text(ctx, node.annotation, x + dx, y + dy, "12px Arial", "black", "start");
        }
    }

    /**
     * Checks if the given position is within a node.
     * 
     * @param {*} position - The position {x, y} to check.
     * @returns Returns a node or null. 
     */
    _hittest(position) {
        let r = this._radius;
        return TreeNode.find(this._tree, (node) => {
            if (isNullOrUndefined(node._position)) {
                return false;
            }

            let x = node._position.x - position.x;
            let y = node._position.y - position.y;

            // Checks if the position is within the radius of the current node
            return Math.pow(x, 2) + Math.pow(y, 2) < Math.pow(r, 2);
        })
    }
}