"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodeCreator_1 = require("./nodeCreator");
const circle_1 = require("./circle");
class ConcreteCircleCreator extends nodeCreator_1.NodeCreator {
    createNode() {
        return new circle_1.Circle();
    }
}
exports.ConcreteCircleCreator = ConcreteCircleCreator;
