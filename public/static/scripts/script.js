"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = require("./modules/d3.js");
window.onload = () => {
    let g;
    let rect;
    let circleTop;
    let circleBottom;
    let circleBottomRight;
    let circleLeft;
    let circleRight;
    let line;
    let deltaX;
    let deltaY;
    let deltaXBorder;
    let deltaYBorder;
    let width;
    let height;
    let rectCounter = 0;
    let svg = d3.select("#graph")
        .on("mousedown", mousedown)
        .on("mouseup", mouseUp);
    let dragRect = d3.drag()
        .on("start", dragStart)
        .on("drag", dragMove);
    let dragBorder = d3.drag()
        .on("start", dragStartBorder)
        .on("drag", dragMoveBorder);
    function mousedown() {
        let event = d3.mouse(this);
        g = svg.append("g")
            .attr("id", rectCounter)
            .call(dragRect);
        rect = g.append("rect")
            .attr("x", event[0] + 5)
            .attr("y", event[1] + 5)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr('height', 0)
            .attr('width', 0)
            .attr("fill", "#aaa9ad")
            .style("stroke-width", 5)
            .style("stroke", "#7b9eb4")
            .attr("class", "rect")
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "grabbing");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(dragRect);
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
        circleBottomRight = g.append("circle")
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height"))))
            .attr("r", 4)
            .attr("id", "circleBottomRight" + rectCounter)
            .attr("fill", "#7b9eb4")
            .on("mouseover", function () {
            d3.select(this)
                .style("cursor", "se-resize");
        })
            .on("mouseout", function () {
            d3.select(this)
                .style("cursor", "default");
        })
            .call(dragBorder);
        d3.selectAll(`#circleRight${rectCounter}, #circleLeft${rectCounter}, #circleTop${rectCounter}, #circleBottom${rectCounter}`)
            .on('mouseover', function () {
            d3.select(this)
                .attr("r", 10)
                .style("cursor", "crosshair");
        })
            .on('mouseout', function () {
            d3.select(this)
                .attr("r", 5)
                .style("cursor", "crosshair");
        })
            .on("click", drawLine);
        svg.on("mousemove", mouseMove);
        rectCounter++;
    }
    function mouseMove() {
        console.log("mouseMove");
        let event = d3.mouse(this);
        rect.attr("width", Math.max(0, event[0] - +rect.attr("x")))
            .attr("height", Math.max(0, event[1] - +rect.attr("y")));
        circleTop
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", +rect.attr("y"));
        circleBottom
            .attr("cx", (+rect.attr("x") + (+rect.attr("width") / 2)))
            .attr("cy", (+rect.attr("y") + +rect.attr("height")));
        circleBottomRight
            .attr("cx", (+rect.attr("x") + (+rect.attr("width")) - 2))
            .attr("cy", (+rect.attr("y") + +rect.attr("height") - 2));
        circleLeft
            .attr("cx", +rect.attr("x"))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
        circleRight
            .attr("cx", (+rect.attr("x") + +rect.attr("width")))
            .attr("cy", (+rect.attr("y") + (+rect.attr("height") / 2)));
    }
    function dragStart() {
        let current = d3.select(this);
        let tagName = current.node().tagName;
        if (tagName === "rect") {
            deltaX = current.attr("x") - d3.event.x;
            deltaY = current.attr("y") - d3.event.y;
        }
    }
    function dragMove() {
        let current = d3.select(this);
        let parent = d3.select(this.parentNode);
        let counter = parent.attr("id");
        let tagName = current.node().tagName;
        if (tagName === "rect") {
            current
                .attr("x", d3.event.x + deltaX)
                .attr("y", d3.event.y + deltaY);
            d3.select("#circleTop" + counter)
                .attr("cx", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("cy", (d3.event.y + deltaY));
            d3.select("#circleBottom" + counter)
                .attr("cx", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("cy", (d3.event.y + deltaY) + +current.attr("height"));
            d3.select("#circleBottomRight" + counter)
                .attr("cx", (d3.event.x + deltaX) + (+current.attr("width")) - 2)
                .attr("cy", (d3.event.y + deltaY) + +current.attr("height") - 2);
            d3.select("#circleLeft" + counter)
                .attr("cx", (d3.event.x + deltaX))
                .attr("cy", (d3.event.y + deltaY) + (+current.attr("height") / 2));
            d3.select("#circleRight" + counter)
                .attr("cx", (d3.event.x + deltaX) + +current.attr("width"))
                .attr("cy", (d3.event.y + deltaY) + (+current.attr("height") / 2));
            d3.selectAll("line.circleTop" + counter)
                .attr("x1", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("y1", d3.event.y + deltaY);
            d3.selectAll("line.circleBottom" + counter)
                .attr("x1", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("y1", (d3.event.y + deltaY) + +current.attr("height"));
            d3.selectAll("line.circleLeft" + counter)
                .attr("x1", (d3.event.x + deltaX))
                .attr("y1", (d3.event.y + deltaY) + (+current.attr("height") / 2));
            d3.selectAll("line.circleRight" + counter)
                .attr("x1", (d3.event.x + deltaX) + +current.attr("width"))
                .attr("y1", (d3.event.y + deltaY) + (+current.attr("height") / 2));
            d3.selectAll("line.circleTop" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("y2", d3.event.y + deltaY);
            d3.selectAll("line.circleBottom" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + (+current.attr("width") / 2))
                .attr("y2", (d3.event.y + deltaY) + +current.attr("height"));
            d3.selectAll("line.circleLeft" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX))
                .attr("y2", (d3.event.y + deltaY) + (+current.attr("height") / 2));
            d3.selectAll("line.circleRight" + counter + "Connector")
                .attr("x2", (d3.event.x + deltaX) + +current.attr("width"))
                .attr("y2", (d3.event.y + deltaY) + (+current.attr("height") / 2));
        }
    }
    function dragStartBorder() {
        let parent = d3.select(this.parentNode);
        let current = parent.select("rect");
        let tagName = current.node().tagName;
        if (tagName === "rect") {
            deltaXBorder = d3.event.x;
            deltaYBorder = d3.event.y;
            deltaX = current.attr("x") - d3.event.x;
            deltaY = current.attr("y") - d3.event.y;
            width = +current.attr("width");
            height = +current.attr("height");
        }
    }
    function dragMoveBorder() {
        let parent = d3.select(this.parentNode);
        let counter = parent.attr("id");
        let current = parent.select("rect");
        let tagName = current.node().tagName;
        if (tagName === "rect") {
            current
                .attr("width", width + (d3.event.x - deltaXBorder))
                .attr("height", height + (d3.event.y - deltaYBorder));
            d3.select("#circleTop" + counter)
                .attr("cx", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("cy", +current.attr("y"));
            d3.select("#circleBottom" + counter)
                .attr("cx", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("cy", (+current.attr("y") + +current.attr("height")));
            d3.select("#circleBottomRight" + counter)
                .attr("cx", (+current.attr("x") + (+current.attr("width")) - 2))
                .attr("cy", (+current.attr("y") + +current.attr("height") - 2));
            d3.select("#circleLeft" + counter)
                .attr("cx", +current.attr("x"))
                .attr("cy", (+current.attr("y") + (+current.attr("height") / 2)));
            d3.select("#circleRight" + counter)
                .attr("cx", (+current.attr("x") + +current.attr("width")))
                .attr("cy", (+current.attr("y") + (+current.attr("height") / 2)));
            d3.selectAll("line.circleTop" + counter)
                .attr("cx", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("cy", +current.attr("y"));
            d3.selectAll("line.circleBottom" + counter)
                .attr("x1", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("y1", (+current.attr("y") + +current.attr("height")));
            d3.selectAll("line.circleLeft" + counter)
                .attr("x1", +current.attr("x"))
                .attr("y1", (+current.attr("y") + (+current.attr("height") / 2)));
            d3.selectAll("line.circleRight" + counter)
                .attr("x1", (+current.attr("x") + +current.attr("width")))
                .attr("y1", (+current.attr("y") + (+current.attr("height") / 2)));
            d3.selectAll("line.circleTop" + counter + "Connector")
                .attr("x2", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("y2", +current.attr("y"));
            d3.selectAll("line.circleBottom" + counter + "Connector")
                .attr("x2", (+current.attr("x") + (+current.attr("width") / 2)))
                .attr("y2", (+current.attr("y") + +current.attr("height")));
            d3.selectAll("line.circleLeft" + counter + "Connector")
                .attr("x2", +current.attr("x"))
                .attr("y2", (+current.attr("y") + (+current.attr("height") / 2)));
            d3.selectAll("line.circleRight" + counter + "Connector")
                .attr("x2", (+current.attr("x") + +current.attr("width")))
                .attr("y2", (+current.attr("y") + (+current.attr("height") / 2)));
        }
    }
    function mouseUp() {
        svg.on("mousemove", null);
        let parent = rect.select(function () { return this.parentNode; });
        let width = +rect.attr("width");
        let height = +rect.attr("height");
        let surface = width * height;
        if (surface < 2000) {
            parent.remove();
        }
    }
    function drawLine() {
        let current = d3.select(this);
        let parent = d3.select(this.parentNode);
        let cx = current.attr("cx");
        let cy = current.attr("cy");
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
            .on("mouseup", mouseUp);
        d3.selectAll("circle")
            .raise()
            .on("click", drawLine);
        for (let i = 0; i < rectCounter; i++) {
            d3.select(`#circleBottomRight${i}`)
                .on("click", null);
        }
    }
    function moveLine() {
        let event = d3.mouse(this);
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
        let current = d3.select(this);
        let parent = d3.select(this.parentNode);
        let x1 = line.attr("x1");
        let y1 = line.attr("y1");
        let sameRect = false;
        parent.selectAll("circle").each(function () {
            let cx = d3.select(this).attr("cx");
            let cy = d3.select(this).attr("cy");
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
