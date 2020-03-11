"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const graph_1 = require("./graph");
const d3 = __importStar(require("./modules/d3"));
const grid_1 = require("./grid");
const node_1 = require("./node");
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    graph_1.initializeGraph(getMargin());
    yield controller_1.loadProject();
    grid_1.defineGrid(getMargin());
    hideGrid();
    removeAllListeners();
    initializeRectZooming(getMargin());
});
function getMargin() {
    return { top: 3, right: 2, bottom: 2, left: 2 };
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
    let graph = document.getElementById('GraphContainer'), boundaries = graph.getBoundingClientRect(), width = boundaries.width - margin.left - margin.right, height = boundaries.height - margin.top - margin.bottom;
    let nodes = d3.select("#nodes");
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);
    d3.select("#graph").on("click", reset);
    nodes.call(zoom);
    nodes.selectAll("g").select("rect").on("click", clicked);
    function zoomed() {
        const { transform } = d3.event;
        nodes.attr("transform", transform);
        nodes.attr("stroke-width", 1 / transform.k);
    }
    function reset() {
        nodes.transition().duration(1500).call(zoom.transform, d3.zoomIdentity, d3.zoomTransform(nodes.node()).invert([width / 2, height / 2]));
    }
    function clicked() {
        let rect = d3.select(this);
        let parent = d3.select(this.parentNode);
        const [x, y] = [+rect.attr("x"), +rect.attr("y")];
        const [rectHeight, rectWidth] = [+rect.attr("height"), +rect.attr("width")];
        d3.event.stopPropagation();
        nodes.transition().duration(1500).call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(Math.min(20, 0.9 / Math.max(rectHeight / height, rectWidth / width)))
            .translate(-(x + rectWidth / 2), -(y + rectHeight / 2)), d3.mouse(nodes.node()));
        node_1.initializeNodeContent(+parent.attr("id"));
    }
}
