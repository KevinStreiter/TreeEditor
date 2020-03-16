"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("../modules/d3"));
class AbstractNode {
    draw(event) {
        let nodeType = this.getNodeType();
        let svg = d3.select("#graph");
        let nodes = svg.select("#nodes");
        let g = nodes.append("g");
        let counter = 1;
        nodes.selectAll("*").each(function () {
            let id = +d3.select(this).attr("id");
            if (id >= counter) {
                counter = id + 1;
            }
        });
        g.attr("id", counter);
        this.appendNodeObject(g, event);
        this.appendNodeObjectText(g);
        this.appendNodeIconAppendix(g, counter);
        this.appendNodeObjectCircles(g, counter);
        this.initializeNodeListener();
    }
    getNodeType() {
        return "node";
    }
    appendNodeObject(g, event) { }
    ;
    appendNodeObjectText(g) { }
    ;
    appendNodeIconAppendix(g, counter) { }
    ;
    appendNodeObjectCircles(g, counter) { }
    ;
    initializeNodeListener() { }
    ;
    getNodeObject() { }
    ;
}
exports.AbstractNode = AbstractNode;
