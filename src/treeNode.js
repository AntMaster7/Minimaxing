function isNullOrUndefined(value){
    return value === undefined || value === null;
}

export default class TreeNode {
    constructor(value) {
        this._children = new Array();
        this._value = value;
        this._key = 0;
        this._explored = false;
        this._visited = false;
    }

    get text() {
        return isNullOrUndefined(this._value) ? '' : this._value;
    }

    get value() {
        return this._value;
    }

    set value(n) {
        this._value = n;
    }

    get children() {
        return this._children;
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
        var root = new TreeNode();
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

    static traverse(node, visitor) {
        let stack = [];
        let explored = new Set();
        let current;
        stack.push(node);
        while (current = stack[stack.length - 1]) {
            if (!explored.has(current)) {
                for (let child of current.children) {
                    stack.push(child);
                }
                explored.add(current);
            } else {
                visitor(stack.pop());
            }
        }
    }
}