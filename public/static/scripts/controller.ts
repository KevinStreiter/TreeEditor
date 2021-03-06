import {
    resetRectBorder,
    initializeRectListeners,
    initializeCircleListeners,
    updateRectSize,
    updateUploadIconPosition
} from "./graph";
import {getProjectFiles} from "./files";
import {getProjectLinks} from "./links";
import * as d3 from "./modules/d3";
import {ConcreteRectCreator} from "./node/concreteRectCreator";
import {openModalWindow} from "./modal";
let toJSON = require("./modules/toJSON.js");
let toDOM = require("./modules/toDOM.js");

export function preventEnterInput(e) {
    let projectTitle = document.getElementById('projectTitle');
    if (e.key === 'Enter') {
        projectTitle.contentEditable = 'false';
        projectTitle.contentEditable = 'true';
    } else {
        if (projectTitle.textContent.length > 70) {
            e.preventDefault();
        }
    }
}

export function saveProject() {
    let project = document.getElementById("projectTitle");
    let projectName = project.innerHTML;
    let projectID = project.className;
    let url = '/treeEditor/save?projectName=' + projectName + '&projectID=' + projectID;
    let nodes = filterNodes();
    nodes = toJSON(nodes);
    let files = document.getElementById("fileList");
    files = toJSON(files);
    let links = document.getElementById("linkList");
    links = toJSON(links);
    let graph = d3.select('#graph');
    let size = [graph.attr("width"), graph.attr("height")];
    let data = JSON.stringify({nodes: nodes, files: files, links: links, size: size});

    return fetch(url, {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then(data => {
            saveProjectID(data);
            updateForeignNodes();
        });
}

function saveProjectID(projectID) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.setAttribute("class", projectID);
    showSavePopup();
}

function filterNodes() {
    let nodes = document.getElementById("nodes");
    let cloned_nodes = nodes.cloneNode(false);
    let children = nodes.querySelectorAll("g:not(.foreign):not(.appendixIcons)");
    children.forEach.call(children, function(item) {
        let cloned_item = item.cloneNode(true);
        cloned_nodes.appendChild(cloned_item);
    });
    return cloned_nodes
}

function showSavePopup() {
    let popup = document.getElementById("popup");
    popup.style.opacity = '50%';
    popup.style.display = "block";
    setTimeout(function() {
        popup.style.opacity = '0';
    },1500);
}

export async function loadProject() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let name = urlParams.get('name');
    let width = urlParams.get('width');
    let height = urlParams.get('height');
    if (id != null && name != null) {
        updateProjectSize(width, height);
        updateProjectName(name, id);
        getProjectFiles(id);
        getProjectLinks(id);
        getProjectNodes(id);
        getForeignNodes(id);
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve("loaded"), 500)
    });
}

function getForeignNodes(id) {
    let url = '/treeEditor/foreignNodes?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectNodes(data, true, null, null, true));
}

function getProjectNodes(id) {
    let url = '/treeEditor/nodes?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectNodes(data));
}

export function updateProjectNodes(data, fromDifferentProject: Boolean = false, x = null, y = null,
                                   initialLoad: Boolean = false, foreign_id = null) {
    let newCoordinates = false;
    let nodes = document.getElementById("nodes");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nodes.appendChild(document.importNode(new DOMParser()
            .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + node.outerHTML + '</svg>',
                'application/xml').documentElement.firstChild, true));

        if (fromDifferentProject) {
            let rectCounter = null;
            if (initialLoad) {
                rectCounter = element["foreign_id"];
            } else {
                rectCounter = foreign_id;
            }
            if (x == null && y == null || newCoordinates) {
                x = element["x"];
                y = element["y"];
                newCoordinates = true;
            }

            let foreignNode = d3.select("#nodes>g:last-child")
                .attr("id", rectCounter)
                .attr("class", "foreign" + " " + element["node_id"]);
            let foreignRect = foreignNode.select("rect")
                .attr("x", x)
                .attr("y", y);

            foreignNode.selectAll("path").remove();
            foreignNode.selectAll("circle.lineCircle").remove();
            foreignNode.selectAll("circle").each(function () {
                let element = d3.select(this);
                element.attr("id", element.attr("id").slice(0, -1).concat(rectCounter));
            });
            insertForeignNodeDescription(foreignNode, foreignRect, element);
            foreignNode.select(`#circleBottomRight${rectCounter}`).remove();
            let foreignNodeDOM = document.getElementById(rectCounter.toString());

            if (initialLoad && element["connectors"] != null) {
                let connectors = toDOM(element["connectors"]);
                foreignNodeDOM.appendChild(document.importNode(new DOMParser()
                    .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + connectors.outerHTML + '</svg>',
                        'application/xml').documentElement.firstChild, true));
                let g = document.getElementById("connectors");

                if (g.hasChildNodes()) {
                    while (g.childNodes.length > 0) {
                        foreignNodeDOM.appendChild(g.childNodes[0]);
                    }
                }
                g.remove();
            }
            updateRectSize(x,  y, rectCounter, foreignNode, foreignRect, false);
        }
    updateUploadIcons();
    }
    initializeRectListeners();
    initializeCircleListeners();
    resetRectBorder();
}

function updateUploadIcons() {
    let g = d3.select("#nodes>g:last-child");
    let rect = g.select("rect");
    let fileIconClassName = ".appendixFileIcon";
    let linkIconClassName = ".appendixLinkIcon";
    let linkContentTextClassName = ".appendixContentTextIcon";
    let fileIcon = g.select(fileIconClassName);
    let linkIcon = g.select(linkIconClassName);
    let contentTextIcon = g.select(linkContentTextClassName);
    g.selectAll(".appendixIcons").remove();
    const rectNode = new ConcreteRectCreator().createNode();
    rectNode.appendNodeIconAppendix(g, g.attr("id"));
    toggleUploadIconDisplay(g, fileIcon, fileIconClassName);
    toggleUploadIconDisplay(g, linkIcon, linkIconClassName);
    toggleUploadIconDisplay(g, contentTextIcon, linkContentTextClassName);
    updateUploadIconPosition(g, rect);
}

function toggleUploadIconDisplay(parent, element, className) {
    if (element.node().classList.contains("iconShow")) {
        parent.select(className).node().classList.add("iconShow");
        parent.select(className).node().classList.remove("iconHide");
        if (className == ".appendixContentTextIcon") {
            parent.select(className).on("click", function() {
                openModalWindow(parent)
            });
        }
    }
}

function insertForeignNodeDescription(foreignNode, foreignRect, element) {
    let project_id = element['node_id'].split("_",2)[0];
    let url = '/treeEditor/projectName?id=' + project_id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            foreignNode.append("text")
                .attr("x", +foreignRect.attr("x"))
                .attr("y", +foreignRect.attr("y") + 9)
                .attr("font-weight", 9)
                .attr("class", "descriptionText")
                .style('font-size', 9)
                .text(data[0]["name"]);
        });
}

export function deleteForeignNode(element) {
    let foreign_id = element.attr("id");
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let url = '/treeEditor/foreignNodes/delete?foreign_id=' + foreign_id + '&project_id=' + project_id;
    fetch(url, {
        method: 'POST',
    })
}

export function deleteForeignConnector(element, connector) {
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let parent = d3.select(connector.node().parentNode);
    if (parent.attr("class") != null) {
        let url = '/treeEditor/foreignNodes/Connectors/reset?foreign_id=' + parent.attr("id") + '&project_id=' + project_id;
        fetch(url, {
            method: 'POST',
        }).then(response => saveProject());
    }
}

function updateForeignNodes() {
    let nodes = document.getElementById("nodes");
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let foreignNodes = nodes.querySelectorAll("g.foreign");
    let url = '/treeEditor/foreignNode/update';

    foreignNodes.forEach(function (value) {
        let element = d3.select(value);
        let foreign_id = element.attr("id");
        let x = element.select("rect").attr("x");
        let y = element.select("rect").attr("y");
        let connectors = document.createElement('g');
        connectors.setAttribute("id","connectors");
        element.selectAll("path").each(function () {
            connectors.appendChild(this.cloneNode(true));
        });

        element.selectAll(".lineCircle").each(function () {
            connectors.appendChild(this.cloneNode(true));
        });
        if (connectors.hasChildNodes()) {
            connectors = toJSON(connectors);
        } else {
            connectors = null;
        }

        let data = JSON.stringify({foreign_id: foreign_id, project_id: project_id, x: x, y: y, connectors: connectors});

        return fetch(url, {
            method: 'POST',
            body: data
        })
    });
}

function saveForeignNode(data, fromDifferentProject, x, y) {
    let id = data[0]["node_id"];
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let  newest_foreign_id = 1;
    let nodes = document.getElementById("nodes");
    let g = nodes.querySelectorAll("g:not(.appendixIcons)");
    let idList = [];
    g.forEach(function (value) {
        let element = d3.select(value);
        let id = element.attr("id");
        idList.push(id);
    });
    if (idList.length != 0) {
        newest_foreign_id = Math.max.apply(Math, idList.map(function(o) { return o; })) + 1;
    }
    let url = '/treeEditor/foreignNode/save';
    let data_json = JSON.stringify({foreign_id: newest_foreign_id, node_id: id, project_id: project_id, x: x, y: y});

    fetch(url, {
        method: 'POST',
        body: data_json
    })
        .then(handleErrors)
        .then(response => {
            updateProjectNodes(data, fromDifferentProject, x, y, false, newest_foreign_id);
            getProjectFiles(data[0]["node_id"]);
            getProjectLinks(data[0]["node_id"]);
            })
        .catch((error) => {
            //do nothing
    });
}

export function getNode(id, fromDifferentProject: Boolean, x, y) {
    let url = '/treeEditor/node?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            if(data.length > 0 && fromDifferentProject) {
                saveForeignNode(data, fromDifferentProject, x, y)
            }
        });
}

function handleErrors(response) {
    if (!response.ok) throw Error(response.statusText);
    return response;
}

function updateProjectSize(width, height) {
    d3.select("#graph")
        .attr("width", width)
        .attr("height", height)
}

function updateProjectName(name, id) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.innerText = name;
    projectTitle.setAttribute("class", id);
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
    return id;
}