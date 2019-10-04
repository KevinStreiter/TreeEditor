"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("./modules/d3.js");
window.onload = function () {
    var g;
    var rect;
    var circleTop;
    var circleBottom;
    var circleLeft;
    var circleRight;
    var line;
    var deltaX;
    var deltaY;
    var rectCounter = 0;
    var svg = d3.select("#graph")
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);
    var drag = d3.drag()
        .on("start", dragstart)
        .on("drag", dragmove);
    function mousedown() {
        var event = d3.mouse(this);
        g = svg.append("g")
            .attr("id", rectCounter)
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
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "pointer");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(drag);
        circleTop = g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"))
            .attr("r", 5)
            .attr("id", "circleTop" + rectCounter)
            .attr("fill", "grey");
        circleBottom = g.append("circle")
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")))
            .attr("r", 5)
            .attr("id", "circleBottom" + rectCounter)
            .attr("fill", "grey");
        circleLeft = g.append("circle")
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("id", "circleLeft" + rectCounter)
            .attr("fill", "grey");
        circleRight = g.append("circle")
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)))
            .attr("r", 5)
            .attr("id", "circleRight" + rectCounter)
            .attr("fill", "grey");
        d3.selectAll("circle")
            .on('mouseover', function () {
            d3.select(this)
                .attr("r", 10);
        })
            .on('mouseout', function () {
            d3.select(this)
                .attr("r", 5);
        })
            .on("click", drawLine)
            .call(drag);
        svg.on("mousemove", mousemove);
        rectCounter++;
    }
    function mousemove() {
        var parent = d3.select(this.parentNode);
        var event = d3.mouse(this);
        rect.attr("width", Math.max(0, event[0] - +rect.attr("x")))
            .attr("height", Math.max(0, event[1] - +rect.attr("y")));
        circleTop
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"));
        circleBottom
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")));
        circleLeft
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
        circleRight
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
    }
    function dragstart() {
        var current = d3.select(this);
        var tagName = current.node().tagName;
        if (tagName === "rect") {
            deltaX = current.attr("x") - d3.event.x;
            deltaY = current.attr("y") - d3.event.y;
        }
    }
    function dragmove() {
        var current = d3.select(this);
        var tagName = current.node().tagName;
        if (tagName === "rect") {
            current
                .attr("x", d3.event.x + deltaX)
                .attr("y", d3.event.y + deltaY);
            var parent_1 = d3.select(this.parentNode);
            var counter = parent_1.attr("id");
            d3.select("#circleTop" + counter)
                .attr("cx", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("cy", (d3.event.y + deltaY));
            d3.select("#circleBottom" + counter)
                .attr("cx", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("cy", (d3.event.y + deltaY) + +d3.select(this).attr("height"));
            d3.select("#circleLeft" + counter)
                .attr("cx", (d3.event.x + deltaX))
                .attr("cy", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
            d3.select("#circleRight" + counter)
                .attr("cx", (d3.event.x + deltaX) + +d3.select(this).attr("width"))
                .attr("cy", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
            d3.selectAll("line.circleTop" + counter)
                .attr("x1", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("y1", d3.event.y + deltaY);
            d3.selectAll("line.circleBottom" + counter)
                .attr("x1", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("y1", (d3.event.y + deltaY) + +d3.select(this).attr("height"));
            d3.selectAll("line.circleLeft" + counter)
                .attr("x1", (d3.event.x + deltaX))
                .attr("y1", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
            d3.selectAll("line.circleRight" + counter)
                .attr("x1", (d3.event.x + deltaX) + +d3.select(this).attr("width"))
                .attr("y1", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
            d3.selectAll("line.circleTop" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("y2", d3.event.y + deltaY);
            d3.selectAll("line.circleBottom" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + (+d3.select(this).attr("width") / 2))
                .attr("y2", (d3.event.y + deltaY) + +d3.select(this).attr("height"));
            d3.selectAll("line.circleLeft" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX))
                .attr("y2", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
            d3.selectAll("line.circleRight" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + +d3.select(this).attr("width"))
                .attr("y2", (d3.event.y + deltaY) + (+d3.select(this).attr("height") / 2));
        }
    }
    function mouseup() {
        svg.on("mousemove", null);
    }
    function drawLine() {
        var current = d3.select(this);
        var parent = d3.select(this.parentNode);
        var cx = current.attr("cx");
        var cy = current.attr("cy");
        line = parent.append("line");
        line.attr("x1", cx)
            .attr("y1", cy)
            .attr("x2", cx)
            .attr("y2", cy)
            .attr("stroke", "grey")
            .attr("stroke-width", 3)
            .attr("class", current.attr("id"));
        svg.on("mousemove", moveLine);
    }
    function removeLine() {
        line.remove();
        resetListeners();
    }
    function resetListeners() {
        svg
            .on("mousemove", null)
            .on("mousedown", mousedown)
            .on("mouseup", mouseup);
        d3.selectAll("circle")
            .raise()
            .on("click", drawLine);
    }
    function moveLine() {
        var event = d3.mouse(this);
        line.attr("x2", event[0] - 5)
            .attr("y2", event[1] - 5);
        svg
            .on("mousedown", null)
            .on("mouseup", null)
            .on("dblclick", removeLine);
        d3.selectAll("circle")
            .raise()
            .on("click", combineRect);
    }
    function combineRect() {
        var current = d3.select(this);
        var parent = d3.select(this.parentNode);
        var x1 = line.attr("x1");
        var y1 = line.attr("y1");
        var sameRect = false;
        parent.selectAll("circle").each(function () {
            var cx = d3.select(this).attr("cx");
            var cy = d3.select(this).attr("cy");
            if (x1 == cx && y1 == cy) {
                sameRect = true;
            }
        });
        if (!sameRect) {
            line
                .attr("x2", current.attr("cx"))
                .attr("y2", current.attr("cy"))
                .attr("class", line.attr("class") + " " + current.attr("id") + "Connector");
            resetListeners();
        }
    }
};
