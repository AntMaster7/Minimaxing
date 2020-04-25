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

    // draws the entire tree
    draw(ctx, x, y, r, s) {
        this._measure(r, s);
        var leftmost = x - (this._width / 2);
        this._render(ctx, leftmost, y, r, s, true);
    }

    _measure(r, s) {
        this._width = 0;
        if (this._children.length > 0) {
            for (let i = 0; i < this._children.length; i++) {
                this._width += (this._children[i]._measure(r, s) + s);
            }
        } else {
            this._width = 2 * r + s;
        }
        this._width -= s;


        var mid = this._width / 2;
        var accu = 0;
        for (const child of this._children) {
            accu += child._width;
            if (accu > mid) {
                this._offset = accu - mid
            }
        }

        return this._width;
    }

    // counts total children for each node
    _eval() {
        if (this._children.length > 0) {
            this._k = 0;
            for (const child of this._children) {
                this._k += child._eval();
            }
        } else {
            this._k = 1;
        }
        return this._k;
    }

    static hack = { x: 0, y: 0 };

    _render(ctx, x, y, r, s) {
        // show AABB (needs to know the trees height)
        // this._rect(ctx, x - 2, y - r - 2, this._width + 4, height * 3 * r - r + 4);

        var cx = x;
        var cy = y + 3 * r;

        var n = x + this._width / 2;

        for (let index = 0; index < this._children.length; index++) {
            // draw children
            cx = this._children[index]._render(ctx, cx, cy, r, s);
            if (index < this._children.length - 1 /* not last */) {
                cx += s;
            }

            // some vector math to clip line
            var vx = TreeNode.hack.x - n;
            var vy = TreeNode.hack.y - y;
            var length = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
            var lambda = (length - r) / length;
            vx *= lambda;
            vy *= lambda;

            canvasUtils.line(ctx, n, y, n + vx, y + vy);
        }


        // render current node
        this._renderNode(ctx, n, y, r);

        TreeNode.hack.x = n;
        TreeNode.hack.y = y;

        return x + this._width;
    }

    // renders node
    _renderNode(ctx, x, y, r) {
        canvasUtils.circle(ctx, x, y, r, "#abc");
        canvasUtils.text(ctx, this.text, x, y, "20px Georgia");
    }
}