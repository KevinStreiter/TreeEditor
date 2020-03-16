import {INode} from "./iNode";
import * as d3 from "../modules/d3";

export abstract class AbstractNode implements INode {
    x: number;
    y: number;

    draw(event): any {
        let nodeType: string = this.getNodeType();
        let svg = d3.select("#graph");
        let nodes = svg.select("#nodes");
        let g = nodes.append("g");
        let counter: number = 1;
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

    getNodeType(): string {
        return "node";
    }

    appendNodeObject(g, event) {};

    appendNodeObjectText(g) {};

    appendNodeIconAppendix(g, counter) {};

    appendNodeObjectCircles(g, counter) {};

    initializeNodeListener() {};

    getNodeObject() {};
}
