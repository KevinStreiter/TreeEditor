import * as d3 from "./modules/d3";
import {resetListeners, resetRectBorder} from "./graph";
import {clearLinkInputFields, resetLinkBorderColor} from "./links";

export function openNav() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let id = parent.attr("id");
    document.getElementById("sidebar").style.width = "335px";
    document.getElementById('rectInfo').innerHTML = id;
    let titleText = <HTMLInputElement>document.getElementById("titleText");
    let contentText = <HTMLInputElement>document.getElementById("contentText");
    let colorPicker = <HTMLInputElement>document.getElementById("colorPicker");
    d3.select("#colorPickerBtn").style("background", current.attr("fill"));
    titleText.value = parent.select("text.titleText").text();
    contentText.value = parent.select("text.contentText").text();
    colorPicker.value = current.attr("fill");
    clearLinkInputFields();
    listFiles(id);
    listLinks(id);
    resetLinkBorderColor();
    resetRectBorder();
    resetListeners();

    d3.select(this)
        .style("stroke", "red")
        .on("dblclick", closeNav);

    d3.select(".closebtn").on("click", function () {
        closeNav();
    });
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById('rectInfo').innerHTML = "";
    let titleText = <HTMLInputElement>document.getElementById("titleText");
    let contentText = <HTMLInputElement>document.getElementById("contentText");
    titleText.value = "";
    contentText.value = "";
    clearLinkInputFields();
    resetLinkBorderColor();
    resetRectBorder();
    resetListeners();
}

function listFiles(id) {
    let entries = d3.select("#fileList").selectAll("li");
    entries.each(function () {
        let li = d3.select(this);
        if (li.attr("id").slice(0,1) == id) {
            li.style("display",'inherit');
        }
        else {
            li.style("display",'none');
        }
    });
}

function listLinks(id) {
    let entries = d3.select("#linkList").selectAll("li");
    entries.each(function () {
        let li = d3.select(this);
        if (li.attr("class") == id) {
            li.style("display",'inherit');
        }
        else {
            li.style("display",'none');
        }
    });
}

export function transformNodeObject() {
    let isEnabled = d3.select("#circleSwitchInput").property('checked');
    let id = document.getElementById('rectInfo').innerHTML;
    let nodes = d3.select("#nodes");
    nodes.selectAll("rect").each(function () {
        if (d3.select(this.parentNode).attr("id") == id) {
            isEnabled ? transformRectToCircle(d3.select(this)) : transformCircleToRect(d3.select(this));
        }
    });
}

function transformRectToCircle(element) {
    element
        .attr("rx", +element.attr("x") / 2)
        .attr("ry", +element.attr("y") / 2)
}

function transformCircleToRect(element) {
    element
        .attr("rx", 2)
        .attr("ry", 2)
}