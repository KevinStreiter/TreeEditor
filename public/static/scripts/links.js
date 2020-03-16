"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
const d3 = __importStar(require("./modules/d3"));
let toDOM = require("./modules/toDOM.js");
function processLinkItem() {
    let name = document.getElementById("linkName");
    let url = document.getElementById("linkVal");
    if (validURL(url.value)) {
        updateLinkList(name.value, url.value);
        controller_1.saveProject();
    }
}
exports.processLinkItem = processLinkItem;
function validURL(str) {
    let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    return pattern.test(str);
}
function updateLinkList(name, url) {
    let linkId = document.getElementById("linkInfo").innerHTML;
    if (linkId == "") {
        insertNewLinkItem(name, url);
        insertLinkIcon();
    }
    else {
        updateLinkItem(name, url, linkId);
    }
}
function insertNewLinkItem(name, url) {
    let ul = document.getElementById("linkList");
    let id = document.getElementById('rectInfo').innerHTML;
    let entries = d3.select("#linkList").selectAll("li");
    let isDuplicate = false;
    let counter = 0;
    entries.each(function () {
        let linkID = d3.select(this).attr("id").split("_", 2)[1];
        if (+linkID >= counter) {
            counter = +linkID;
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
        li.insertAdjacentHTML('beforeend', `<a class="deleteLinkBtn"><i class="fa fa-times"></i></a>`);
        li.insertAdjacentHTML('beforeend', `<a href=${url} target="_blank" class="linkBtn"><i class="fa fa-external-link"></i></a>`);
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
function executeDeleteLinkListListener(event) {
    let id = controller_1.deleteItemList(event);
    let linkInfo = document.getElementById('linkInfo');
    if (id == linkInfo.innerHTML) {
        linkInfo.innerHTML = "";
    }
}
exports.executeDeleteLinkListListener = executeDeleteLinkListListener;
function resetLinkBorderColor() {
    d3.select("#linkList").selectAll("li").each(function () {
        let element = d3.select(this);
        element.style("border", "1px solid #ddd");
    });
}
exports.resetLinkBorderColor = resetLinkBorderColor;
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
function updateLinkDisplay(event) {
    if (event.target.nodeName == "LI") {
        resetLinkBorderColor();
        let element = event.target;
        let name = document.getElementById("linkName");
        let link = document.getElementById("linkVal");
        name.value = element.innerText;
        link.value = element.querySelector(".linkBtn").href;
        document.getElementById('linkInfo').innerHTML = element.id;
        document.getElementById(element.id).style.borderColor = "red";
    }
}
exports.updateLinkDisplay = updateLinkDisplay;
function clearLinkInputFields() {
    resetLinkBorderColor();
    document.getElementById('linkInfo').innerHTML = "";
    let linkName = document.getElementById('linkName');
    let linkVal = document.getElementById('linkVal');
    linkName.value = "";
    linkVal.value = "";
}
exports.clearLinkInputFields = clearLinkInputFields;
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
function getProjectLinks(id) {
    let url = '/treeEditor/projectLinks?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectLinks(data));
}
exports.getProjectLinks = getProjectLinks;
function insertLinkIcon() {
    let id = document.getElementById('rectInfo').innerHTML;
    let container = d3.select("#appendixContainer_" + id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");
    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let rect = element.select("rect");
            foreign
                .attr("x", +rect.attr("x") + 10)
                .attr("y", +rect.attr("y") + +rect.attr("height") - 50);
            foreign.select(".appendixLinkIcon")
                .style("display", 'inherit');
        }
    });
}
