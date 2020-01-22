import * as d3 from "./modules/d3";
import {getNode, saveProject, deleteForeignNode, deleteForeignConnector} from "./controller";
let toDOM = require("./modules/toDOM.js");

let target, event;
document.addEventListener('contextmenu', onContextMenu, false);

function showMenu(x, y){
    d3.selectAll(".submenu").remove();
    let menu = <HTMLInputElement> document.querySelector('.menu');
    let delEntry = document.getElementById('menu-delete-btn');
    menu.classList.add('show-menu');
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    if (target.tagName == "rect" || target.tagName == "path") {
        delEntry.style.display = 'inherit';

    }
    else if (target.tagName == "svg") {
        delEntry.style.display = 'none';
        getProjects();
    }
    else {
        hideMenu();
    }
}

function getProjects() {
    let url = '/treeEditor/projectsAndNodes';
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectMenu(data));
}

function updateProjectMenu(data) {
    let menu = <HTMLInputElement> document.querySelector('.menu');
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let tempId = null;
    for (let item of data) {
        let node = toDOM(item["element"]);
        let nodeText = node.getElementsByClassName("titleText")[0].innerHTML;
        if (nodeText == "") {
            nodeText = item["node_id"];
        }
        if (tempId != item["project_id"] && project_id != item["project_id"]) {
            menu.insertAdjacentHTML('beforeend', `<li class="menu-item submenu" id="${item["project_id"]}">\n` +
                `<button type="button" class="menu-btn"> <i class="fa fa-folder-open"></i>` +
                `<span class="menu-text">${item["name"]}</span> </button>\n` +
                `<menu class="menu"><li class="menu-item" id="${item["node_id"]}">\n`+
                `<button type="button" class="menu-btn"><i class="fa fa-link"></i>`+
                `<span class="menu-text">${nodeText}</span></button>\n</li></menu>`);
            tempId = item["project_id"]
        }
        else if (tempId != null) {
                let submenu = document.getElementById(`${item["project_id"]}`);
                if (submenu != null) {
                    let submenuEntry = <HTMLInputElement> submenu.querySelector('.menu');
                    submenuEntry.insertAdjacentHTML('beforeend', `<li class="menu-item" id="${item["node_id"]}">\n` +
                        `<button type="button" class="menu-btn" "${item["node_id"]}"><i class="fa fa-link"></i>`+
                        `<span class="menu-text">${nodeText}</span></button>\n</li>`)
                }
        }
    }
    if (tempId == null) {
        hideMenu();
    }
}

function hideMenu(){
    let menu = <HTMLInputElement> document.querySelector('.menu');
    menu.classList.remove('show-menu');
}

async function onContextMenu(e){
    e.preventDefault();
    await saveProject();
    event = e;
    target = e.target;
    showMenu(e.pageX, e.pageY);
    document.addEventListener('click', onClick, false);
}

function onClick(e){
    if (e.target.innerText == "Delete" || e.target.parentNode.innerText == "Delete") {
        removeNode(target);
    }
    else {
        let nodeId = e.target.parentNode.id;
        if (nodeId == "") {
            nodeId = e.target.parentNode.parentNode.id;
        }
        let graph = document.getElementById('GraphContainer').getBoundingClientRect();
        getNode(nodeId, true, event.pageX, event.pageY - graph.top);
    }
    hideMenu();
    document.removeEventListener('click', onClick);
}

function removeNode(node) {
    if (node.nodeName == "rect") {
        d3.selectAll("g").each(function () {
            let element = d3.select(this);
            if (element.attr("id") == node.parentNode.id) {
                deleteForeignNode(element);
                element.remove();
            }
            if (element.attr("id") != "grid" && element.attr("id") != null) {
                element.selectAll("path").each(function () {
                    let line = d3.select(this);
                    if (line.attr("class").search(node.parentNode.id) != -1) {
                        deleteForeignConnector(element, line);
                        line.remove()
                    }
                });
                element.selectAll("circle").each(function () {
                    let circle = d3.select(this);
                    if (circle.attr("class").search(node.parentNode.id) != -1) {
                        circle.remove()
                    }
                })
            }
        });
    }

    else if (node.nodeName == "path") {
        let parent = d3.select(node.parentNode);
        let classes = d3.select(target).attr("class").split(" ");
        parent.select("circle." + classes[0] + "." + classes[1]).remove();
        target.remove();

    }
}