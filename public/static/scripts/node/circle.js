"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractNode_1 = require("./abstractNode");
class Circle extends abstractNode_1.AbstractNode {
    draw(event) {
        return super.draw(event);
    }
    getNodeType() {
        return "circle";
    }
}
exports.Circle = Circle;
