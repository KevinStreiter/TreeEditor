import {deleteItemList, saveProject} from "./controller";
import {insertLinkIcon, isLinkListEmpty, removeLinkIcon} from "./icon";
import * as d3 from "./modules/d3";
let toDOM = require("./modules/toDOM.js");

export function processLinkItem() {
    let name = <HTMLInputElement> document.getElementById("linkName");
    let url = <HTMLInputElement> document.getElementById("linkVal");
    if (validURL(url.value) && name.value != '') {
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
        insertLinkIcon();

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
    let nodeId = document.getElementById('rectInfo').innerHTML;
    let linkId = deleteItemList(event);
    let linkInfo = document.getElementById('linkInfo');
    if (linkId == linkInfo.innerHTML) {
        linkInfo.innerHTML = "";
    }
    if (isLinkListEmpty(nodeId)) {
        removeLinkIcon(nodeId);
    }
    saveProject();
}

export function resetLinkBorderColor() {
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

function updateProjectLinks(data) {
    let nav = document.getElementById("linkList");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nav.appendChild(document.importNode(node, true));
    }

    let items = nav.getElementsByTagName("li");
    for (let i = items.length; i--;) {
        items[i].addEventListener("click", updateLinkDisplay);
    }
    document.querySelectorAll(".deleteLinkBtn").forEach(item => {
        item.addEventListener('click', executeDeleteLinkListListener);
    });
}

export function getProjectLinks(id) {
    let url = '/treeEditor/projectLinks?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectLinks(data));
}

