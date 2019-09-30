"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("./modules/d3.js");
window.onload = function () {
    var rect;
    var deltaX;
    var deltaY;
    var svg = d3.select("#graph")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);
    var drag = d3.drag()
        .on("start", dragstart)
        .on("drag", dragmove);
    function mousedown() {
        var event = d3.mouse(this);
        rect = svg.append("rect")
            .attr("x", event[0])
            .attr("y", event[1])
            .attr("rx", 20)
            .attr("ry", 20)
            .attr('height', 0)
            .attr('width', 0)
            .attr("stroke", "#7b9eb4")
            .attr("stroke-width", 4)
            .attr("fill", "#aaa9ad")
            .call(drag);
        svg.on("mousemove", mousemove);
    }
    function mousemove() {
        var event = d3.mouse(this);
        rect.attr("width", Math.max(0, event[0] - +rect.attr("x")))
            .attr("height", Math.max(0, event[1] - +rect.attr("y")));
    }
    function dragstart() {
        var current = d3.select(this);
        deltaX = current.attr("x") - d3.event.x;
        deltaY = current.attr("y") - d3.event.y;
    }
    function dragmove() {
        if (d3.event.sourceEvent.altKey) {
            d3.select(this)
                .attr("x", d3.event.x + deltaX)
                .attr("y", d3.event.y + deltaY);
        }
    }
    function mouseup() {
        svg.on("mousemove", null);
    }
};
