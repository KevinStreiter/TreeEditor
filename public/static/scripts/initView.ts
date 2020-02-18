import {loadProject} from "./controller";
import {initializeGraph} from "./graph";
import * as d3 from "./modules/d3";

window.onload = async () => {
    initializeGraph(getMargin());
    await loadProject();
    removeAllListeners();
};

function getMargin () {
    return {top: 3, right: 2, bottom: 2, left: 2};
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
