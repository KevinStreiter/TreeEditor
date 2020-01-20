import * as d3 from "./modules/d3";
import {resetListeners, resetRectBorder} from "./script";
import {saveProject} from "./controller";

export function openNav() {
    let current = d3.select(this);
    let parent = d3.select(this.parentNode);
    let id = parent.attr("id");
    resetListeners();
    document.getElementById("sidebar").style.width = "335px";
    document.getElementById('rectInfo').innerHTML = id;
    let titleText = <HTMLInputElement>document.getElementById("titleText");
    let contentText = <HTMLInputElement>document.getElementById("contentText");
    let colorPicker = <HTMLInputElement>document.getElementById("colorPicker");
    d3.select("#colorPickerBtn").style("background", current.attr("fill"));
    titleText.value = parent.select("text.titleText").text();
    contentText.value = parent.select("text.contentText").text();
    colorPicker.value = current.attr("fill");


    listFiles(id);

    resetRectBorder();
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

export function processLinkItem() {
    let name = <HTMLInputElement> document.getElementById("linkName");
    let url = <HTMLInputElement> document.getElementById("linkVal");
    if (validURL(url.value)) {
        updateLinkList(name.value, url.value)
        saveProject();
    }
}

function validURL(str) {
    let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return pattern.test(str);
}

function updateLinkList(name, url) {
    let id = document.getElementById('rectInfo').innerHTML;
    let ul = document.getElementById("linkList");
    let entries = d3.select("#linkList").selectAll("li");
    let isDuplicate: boolean = false;
    entries.each(function () {
        if (this.textContent == name) {
            isDuplicate = true;
        }
    });
    if (!isDuplicate) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(name));
        li.setAttribute("class", id);
        li.insertAdjacentHTML('beforeend',`<a class="deleteBtn"><i class="fa fa-times"></i></a>`);
        li.insertAdjacentHTML('beforeend',`<a href=${url} target="_blank" class="linkBtn"><i class="fa fa-external-link"></i></a>`);
        ul.appendChild(li);
    }
}

function appendLinkItem() {

}