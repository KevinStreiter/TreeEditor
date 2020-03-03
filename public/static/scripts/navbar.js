"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const d3 = __importStar(require("./modules/d3"));
const graph_1 = require("./graph");
const links_1 = require("./links");
function openNav() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let id = parent.attr("id");
    document.getElementById("sidebar").style.width = "335px";
    document.getElementById('rectInfo').innerHTML = id;
    let titleText = document.getElementById("titleText");
    let contentText = document.getElementById("contentText");
    let colorPicker = document.getElementById("colorPicker");
    d3.select("#colorPickerBtn").style("background", current.attr("fill"));
    titleText.value = parent.select("text.titleText").text();
    contentText.value = parent.select("text.contentText").text();
    colorPicker.value = current.attr("fill");
    links_1.clearLinkInputFields();
    listFiles(id);
    listLinks(id);
    links_1.resetLinkBorderColor();
    graph_1.resetRectBorder();
    graph_1.resetListeners();
    d3.select(this)
        .style("stroke", "red")
        .on("dblclick", closeNav);
    d3.select(".closebtn").on("click", function () {
        closeNav();
    });
}
exports.openNav = openNav;
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById('rectInfo').innerHTML = "";
    let titleText = document.getElementById("titleText");
    let contentText = document.getElementById("contentText");
    titleText.value = "";
    contentText.value = "";
    links_1.clearLinkInputFields();
    links_1.resetLinkBorderColor();
    graph_1.resetRectBorder();
    graph_1.resetListeners();
}
function listFiles(id) {
    let entries = d3.select("#fileList").selectAll("li");
    entries.each(function () {
        let li = d3.select(this);
        if (li.attr("id").slice(0, 1) == id) {
            li.style("display", 'inherit');
        }
        else {
            li.style("display", 'none');
        }
    });
}
function listLinks(id) {
    let entries = d3.select("#linkList").selectAll("li");
    entries.each(function () {
        let li = d3.select(this);
        if (li.attr("class") == id) {
            li.style("display", 'inherit');
        }
        else {
            li.style("display", 'none');
        }
    });
}
