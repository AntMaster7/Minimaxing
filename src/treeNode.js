export default class TreeNode {
    constructor(value) {
        this._children = [];
        this._value = value;
        this._key = 0;
        this._annotation = null;
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

    set annotation(a) {
        this._annotation = a;
    }

    get annotation() {
        return this._annotation;
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
     * Parses an array in the form of [[[2], [2]], [1]] and creates an entire tree.
     * 
     *        ()
     *       /  \
     *      ()  (1)
     *     /  \
     *   (2)  (2)
     * 
     * @param {Array} array - The array to parse.
     * @returns Returns the root node of the tree.
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

    /**
     * Visits each node in a right order traversal.
     * 
     * @param {TreeNode} node - The root node of the tree. 
     * @param {*} visitor - A visit function with a node parameter.
     */
    static traverse(node, visitor) {
        let stack = [];
        let explored = new Set();
        let current;
        let depth = 0;
        stack.push([node, depth]);
        while (current = stack[stack.length - 1]) {
            if (!explored.has(current)) {
                for (let child of current[0].children) {
                    stack.push([child, current[1] + 1]);
                }
                explored.add(current);
            } else {
                visitor(...stack.pop());
            }
        }
    }

    /**
     * Returns the first node that matches the given predicate using 
     * a simple binary search algorithm. Returns null if no match was found.
     * 
     * @param {TreeNode} node - The root node of the tree.
     * @param {*} predicate - The predicate to check if a node matches.
     */
    static find(node, predicate) {
        if (predicate(node)) {
            return node;
        } else if (node.children.length) {
            let found = null;
            for (let child of node.children) {
                found = TreeNode.find(child, predicate);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    }
}