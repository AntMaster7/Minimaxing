class TreeNode {
    constructor(value) {
        this._children = new Array();
        this._value = value;
        this._width = 0;
    }

    get value() {
        return this._value;
    }

    set value(n) {
        this._value = n;
    }

    addChild(child) {
        this._children.push(child);
        return child;
    }

    // draws the entire tree
    draw(ctx, x, y, r, s){
        this._measure(r, s);
        this._render(ctx, x, y, r, s);
    }

    // renders tree assuming the tree has been measured
    _render(ctx, x, y, r, s) {
        // x-coordinate for children
        var cx = x - (this._width / 2) + r;
        // y-coordinate for children
        var cy = y + 3 * r;

        for (let index = 0; index < this._children.length; index++) {
            // draw connector
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(cx, cy);
            ctx.lineWidth = 4;
            ctx.stroke();

            // draw children
            this._children[index]._render(ctx, cx, cy, r, s);
            cx += this._children[index]._width + s;
        }

        // render current node
        this._renderNode(ctx, x, y, r, s);
    }

    // measures the required width for each child
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
        return this._width;
    }

    // renders node
    _renderNode(ctx, x, y, r) {
        // draw circle
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#abc";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();

        // draw text inside circle
        ctx.font = "20px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.fillText(this._width, x, y);
    }
}