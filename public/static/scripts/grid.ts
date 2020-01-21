import * as d3 from "./modules/d3";

let svg, xTickDistance, yTickDistance, boundaries: ClientRect, width, height, graphMargin;

export function defineGrid(margin) {
    graphMargin = margin;
    let graph = document.getElementById('graph');
    svg = d3.select("#graph");
    boundaries = graph.getBoundingClientRect();
    width = boundaries.width - margin.left - margin.right;
    height = boundaries.height - margin.top - margin.bottom;

    let gridSize = 20;
    let tickAmountX = (width - margin.right) / gridSize;
    let tickAmountY = (height - margin.top) / gridSize;

    let grid = svg.append("g")
        .attr("id", "grid")
        .attr("pointer-events", "none");

    let xScale = d3.scaleLinear()
        .range([0, width - margin.right]);

    let xGridLines = d3.axisBottom()
        .tickFormat("")
        .ticks(tickAmountX)
        .tickSize(height - margin.top)
        .scale(xScale);

    grid.append("g")
        .attr("class", "xGridLines")
        .call(xGridLines);

    let yScale = d3.scaleLinear()
        .range([0, height - margin.top] );

    let yGridLines = d3.axisRight()
        .tickFormat("")
        .ticks(tickAmountY)
        .tickSize(width - margin.right)
        .scale(yScale);

    grid.append("g")
        .attr("class", "yGridLines")
        .call(yGridLines);

    d3.selectAll("path.domain").remove();

    let tickArr = yScale.ticks(tickAmountY);
    yTickDistance = yScale(tickArr[tickArr.length - 1]) - yScale(tickArr[tickArr.length - 2]);
    tickArr = xScale.ticks(tickAmountX);
    xTickDistance = xScale(tickArr[tickArr.length - 1]) - xScale(tickArr[tickArr.length - 2]);
}

function appendXGridLine() {
    let newChild = getLastGridLineAndPos('g.xGridLines');
    newChild[0].attr("transform", "translate(" + (+newChild[1][0] + xTickDistance) + "," + 0 + ")");
    d3.select('g.xGridLines').node().append(newChild[0].node());

    d3.select("g.yGridLines").selectAll("line").each(function () {
        let line = d3.select(this);
        line.attr("x2", +line.attr("x2") + xTickDistance)
    });
}

function appendYGridLine() {
    let newChild = getLastGridLineAndPos('g.yGridLines');
    newChild[0].attr("transform", "translate(" + 0 + "," + (+newChild[1][1] + yTickDistance) + ")");
    d3.select('g.yGridLines').node().append(newChild[0].node());

    d3.select("g.xGridLines").selectAll("line").each(function () {
        let line = d3.select(this);
        line.attr("y2", +line.attr("y2") + yTickDistance)
    });
}

function getLastGridLineAndPos(selector) {
    let child = null;
    d3.select(selector).each(function () {
        child = this.lastChild;
    });
    let newChild = clone(child);
    let position = newChild.attr("transform");
    return [newChild, position.substring(position.indexOf("(") + 1, position.indexOf(")")).split(",")];
}

function getGridLinePos (selector) {
    let coordinate = selector.attr("transform");
    return coordinate.substring(coordinate.indexOf("(")+1, coordinate.indexOf(")")).split(",");
}

function clone(selector) {
    let node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
}

function checkBoundaries(element) {
    if (elementIsNearBottomBoundary(element)) {
        svg.attr("height", +svg.attr("height") + yTickDistance);
        height += yTickDistance;
        appendYGridLine()

    }
    if (elementIsNearRightBoundary(element)) {
        svg.attr("width", +svg.attr("width") + xTickDistance);
        width += xTickDistance;
        appendXGridLine();
    }
}

function elementIsNearBottomBoundary(element) :Boolean {
    return Math.abs(svg.attr("height") - (+element.attr("y") + +element.attr("height"))) <= yTickDistance;
}

function elementIsNearRightBoundary(element) : Boolean {
    return Math.abs(svg.attr("width") - (+element.attr("x") + +element.attr("width"))) <= xTickDistance;
}

export function alignRectWithGrid(current, newXCoordinate, newYCoordinate, borderMove) {
    checkBoundaries(current);
    if (borderMove) {
        current
            .attr("width", newXCoordinate)
            .attr("height", newYCoordinate);
    }

    else {
        let gridXCoordinate = newXCoordinate;
        let gridYCoordinate = newYCoordinate;
        let coordDifference = 1000;

        d3.select('g.xGridLines').selectAll(".tick").each(function () {
            let coordinate = getGridLinePos(d3.select(this));
            let tempCoordDifference = Math.abs(newXCoordinate - coordinate[0]);
            if (tempCoordDifference < coordDifference && (+current.attr("width") + +coordinate[0]) <= (width + graphMargin.left)) {
                coordDifference = tempCoordDifference;
                gridXCoordinate = coordinate[0];
            }
        });

        coordDifference = 1000;

        d3.select('g.yGridLines').selectAll(".tick").each(function () {
            let coordinate = getGridLinePos(d3.select(this));
            let tempCoordDifference = Math.abs(newYCoordinate - coordinate[1]);
            if (tempCoordDifference < coordDifference && (+current.attr("height") + +coordinate[1]) <= (height + graphMargin.top)) {
                coordDifference = tempCoordDifference;
                gridYCoordinate = coordinate[1];
            }
        });
        current
            .attr("x", gridXCoordinate)
            .attr("y", gridYCoordinate);
    }
}