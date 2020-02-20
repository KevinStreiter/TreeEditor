import {loadProject} from "./controller";
import {initializeGraph} from "./graph";
import * as d3 from "./modules/d3";
import {defineGrid} from "./grid";
import {initializeNodeContent} from "./node";

window.onload = async () => {
    initializeGraph(getMargin());
    await loadProject();
    defineGrid(getMargin());
    hideGrid();
    removeAllListeners();
    initializeRectZooming(getMargin());
};

function getMargin () {
    return {top: 3, right: 2, bottom: 2, left: 2};
}

function hideGrid() {
    d3.select("#grid").style("visibility", "hidden");
}

function removeAllListeners() {
    d3.select("#graph")
        .on("mousedown", null)
        .on("mouseup", null)
        .on("mouseleave", null);

    let drag = d3.drag()
        .on("start", null)
        .on("drag", null);

    d3.selectAll("g")
        .call(drag);

    d3.selectAll("rect")
        .on("click", null)
        .on("dblclick", null)
        .on("mouseover", null)
        .on("mouseout", null)
        .call(drag);

    d3.selectAll("circle")
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null)
        .call(drag);
}

function initializeRectZooming(margin) {
    let graph = document.getElementById('GraphContainer'),
        boundaries = graph.getBoundingClientRect(),
        width = boundaries.width - margin.left - margin.right,
        height = boundaries.height - margin.top - margin.bottom;

    let nodes = d3.select("#nodes");
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    d3.select("#graph").on("click", reset);

    nodes.call(zoom);
    nodes.selectAll("g").select("rect").on("click", clicked);

    function zoomed() {
        const {transform} = d3.event;
        nodes.attr("transform", transform);
        nodes.attr("stroke-width", 1 / transform.k);
    }

    function reset() {
        nodes.transition().duration(1500).call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(nodes.node()).invert([width / 2, height / 2])
        );
    }

    function clicked() {
        let rect = d3.select(this);
        let parent = d3.select(this.parentNode);
        const [x, y] = [+rect.attr("x"), +rect.attr("y")];
        const [rectHeight, rectWidth] = [+rect.attr("height"), +rect.attr("width")];
        d3.event.stopPropagation();
        nodes.transition().duration(1500).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(20, 0.9 / Math.max(rectHeight / height, rectWidth / width)))
                .translate(-(x + rectWidth / 2), -(y + rectHeight / 2)),
            d3.mouse(nodes.node())
        );
        initializeNodeContent(+parent.attr("id"));
    }
}