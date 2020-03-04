"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeCreator_1 = require("./nodeCreator");
const rect_1 = require("./rect");
class ConcreteRectCreator extends nodeCreator_1.NodeCreator {
    createNode() {
        return new rect_1.Rect();
    }
}
exports.ConcreteRectCreator = ConcreteRectCreator;
