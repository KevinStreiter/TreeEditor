"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("./modules/d3.js");
window.onload = function () {
    var g;
    var rect;
    var circle;
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
        g = svg.append("g")
            .call(drag);
        rect = g.append("rect")
            .attr("x", event[0])
            .attr("y", event[1])
            .attr("rx", 20)
            .attr("ry", 20)
            .attr('height', 0)
            .attr('width', 0)
            .attr("stroke", "#7b9eb4")
            .attr("stroke-width", 4)
            .attr("fill", "#aaa9ad")
            .call(drag)
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "pointer");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        });
        circle = g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"))
            .attr("r", 5)
            .attr("fill", "grey");
        svg.on("mousemove", mousemove);
    }
    function mousemove() {
        var event = d3.mouse(this);
        rect.attr("width", Math.max(0, event[0] - +rect.attr("x")))
            .attr("height", Math.max(0, event[1] - +rect.attr("y")));
        circle
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"));
    }
    function dragstart() {
        var current = d3.select(this);
        deltaX = current.attr("x") - d3.event.x;
        deltaY = current.attr("y") - d3.event.y;
    }
    function dragmove() {
        d3.select(this)
            .attr("x", d3.event.x + deltaX)
            .attr("y", d3.event.y + deltaY);
        var circle = d3.select(this.parentNode).select("circle");
        circle
            .attr("cx", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
            .attr("cy", (d3.event.y + deltaY));
    }
    function mouseup() {
        svg.on("mousemove", null);
    }
};
