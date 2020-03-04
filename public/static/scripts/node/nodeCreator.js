"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeCreator {
    draw() {
        const node = this.createNode();
        return node.draw();
    }
}
exports.NodeCreator = NodeCreator;
