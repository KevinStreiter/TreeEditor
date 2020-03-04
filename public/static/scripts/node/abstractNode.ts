import {INode} from "./iNode";
import * as d3 from "../modules/d3";
import {initializeRectListeners} from "../graph";

export abstract class AbstractNode implements INode{
    x: number;
    y: number;
    draw(event): any {

        let rectCounter = 1;
        let svg = d3.select("#graph");
        svg.selectAll("rect").each(function () {
            let id = +d3.select(this.parentNode).attr("id");
            if (id >= rectCounter) {
                rectCounter = id + 1;
            }
        });

        let g = d3.select("#nodes").append("g")
            .attr("id", rectCounter);

        let rect = g.append("rect")
            .attr("x", event[0] + 5)
            .attr("y", event[1] + 5)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr('height', 0)
            .attr('width', 0)
            .attr("fill", "#f8f8f8")
            .attr("class", "rect");

        initializeRectListeners();

        g.append("text")
            .attr("x", +rect.attr("x") + 10)
            .attr("y", +rect.attr("y") + 20)
            .attr("font-weight", 20)
            .attr("class", "titleText")
            .style('font-size', 22)
            .text();

        g.append("text")
            .attr("x", +rect.attr("x") + 10)
            .attr("y", +rect.attr("y") + 40)
            .attr("class", "contentText")
            .text();

        g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"))
            .attr("r", 5)
            .attr("id", "circleTop" + rectCounter)
            .attr("class", "circle");


        g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")))
            .attr("r", 5)
            .attr("id", "circleBottom" + rectCounter)
            .attr("class", "circle");

        g.append("circle")
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("id", "circleLeft" + rectCounter)
            .attr("class", "circle");

        g.append("circle")
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("id", "circleRight" + rectCounter)
            .attr("class", "circle");
        return rect;
    }

    getNodeType() {}
}