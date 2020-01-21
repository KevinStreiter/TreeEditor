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
    clearLinkInputFields();
    listFiles(id);
    listLinks(id);
    resetLinkBorderColor();
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

export function processLinkItem() {
    let name = <HTMLInputElement> document.getElementById("linkName");
    let url = <HTMLInputElement> document.getElementById("linkVal");
    if (validURL(url.value)) {
        updateLinkList(name.value, url.value);
        saveProject();
    }
}

function validURL(str) {
    let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return pattern.test(str);
}

function updateLinkList(name, url) {
    let linkId = document.getElementById("linkInfo").innerHTML;
    if (linkId == "") {
        insertNewLinkItem(name, url);
    } else {
        updateLinkItem(name, url, linkId);
    }
}

function insertNewLinkItem(name, url) {
    let ul = document.getElementById("linkList");
    let id = document.getElementById('rectInfo').innerHTML;
    let entries = d3.select("#linkList").selectAll("li");
    let isDuplicate: boolean = false;
    let counter = 0;
    entries.each(function () {
        let linkID = d3.select(this).attr("id").split("_", 2)[1];
        if (+linkID >= counter) {
            counter = +linkID
        }
        if (this.textContent == name) {
            isDuplicate = true;
        }
    });
    counter += 1;
    if (!isDuplicate) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(name));
        li.setAttribute("class", id);
        li.setAttribute("id", "Link_" + counter.toString());
        li.insertAdjacentHTML('beforeend',`<a class="deleteLinkBtn"><i class="fa fa-times"></i></a>`);
        li.insertAdjacentHTML('beforeend',`<a href=${url} target="_blank" class="linkBtn"><i class="fa fa-external-link"></i></a>`);
        ul.appendChild(li);
        li.addEventListener("click", updateLinkDisplay);
    }
    initializeDeleteLinkItemListener();
}

function initializeDeleteLinkItemListener() {
    document.querySelectorAll(".deleteLinkBtn").forEach(item => {
        item.addEventListener('click', executeDeleteLinkListListener);
    });
}

export function executeDeleteLinkListListener(event) {
    let id = deleteItemList(event);
    let linkInfo = document.getElementById('linkInfo');
    if (id == linkInfo.innerHTML) {
        linkInfo.innerHTML = "";
    }
}

function resetLinkBorderColor() {
    d3.select("#linkList").selectAll("li").each(function () {
        let element = d3.select(this);
        element.style("border", "1px solid #ddd");
    })
}

function updateLinkItem(name, url, linkId) {
    let element = document.getElementById(linkId);

    d3.select("#linkList").selectAll("li").each(function () {
        let element = d3.select(this);
        if (linkId == element.attr("id")) {

        let children = [];
        element.selectAll("a").each(function () {
            let child = d3.select(this);
            if (child.attr("class") == "linkBtn") {
                child.attr("href", url);
            }
            children.push(child.node().cloneNode(true));
        });
        element.text(name);
        element.node().insertAdjacentElement('beforeend', children[0]);
        element.node().insertAdjacentElement('beforeend', children[1]);
        }
    });
    initializeDeleteLinkItemListener();
}

export function updateLinkDisplay(event) {
    if (event.target.nodeName == "LI") {
        resetLinkBorderColor();
        let element = event.target;
        let name = <HTMLInputElement>document.getElementById("linkName");
        let link = <HTMLInputElement>document.getElementById("linkVal");
        name.value = element.innerText;
        link.value = element.querySelector(".linkBtn").href;
        document.getElementById('linkInfo').innerHTML = element.id;
        document.getElementById(element.id).style.borderColor = "red"
    }
}

export function clearLinkInputFields() {
    resetLinkBorderColor();
    document.getElementById('linkInfo').innerHTML = "";
    let linkName = <HTMLInputElement> document.getElementById('linkName');
    let linkVal = <HTMLInputElement> document.getElementById('linkVal');
    linkName.value = "";
    linkVal.value = "";
}

export function deleteItemList (event) {
    let parent = event.target.parentNode;
    let id = parent.id;
    if (id == "") {
        parent = parent.parentNode;
        id = parent.id;
    }
    parent.remove();
    event.stopPropagation();
    saveProject();
    return id;
}