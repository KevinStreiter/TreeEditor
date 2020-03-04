"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstractNode_1 = require("./abstractNode");
class Rect extends abstractNode_1.AbstractNode {
    draw(event) {
        return super.draw(event);
    }
    getNodeType() {
        return "rect";
    }
}
exports.Rect = Rect;
