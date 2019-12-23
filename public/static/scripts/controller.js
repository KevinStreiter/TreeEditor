"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = require("./script");
const d3 = require("./modules/d3");
let toJSON = require("./modules/toJSON.js");
let toDOM = require("./modules/toDOM.js");
function getUploadedFile(filename) {
    let url = '/treeEditor/files?filename=' + filename;
    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.blob())
        .then(function (blob) {
        url = URL.createObjectURL(blob);
        window.open(url);
    });
}
function deleteFile(filename) {
    let url = '/treeEditor/files/delete?filename=' + filename;
    fetch(url, {
        method: 'POST'
    });
}
function filterNodes() {
    let nodes = document.getElementById("nodes");
    let cloned_nodes = nodes.cloneNode(false);
    let children = nodes.querySelectorAll("g:not(.foreign)");
    children.forEach.call(children, function (item) {
        let cloned_item = item.cloneNode(true);
        cloned_nodes.appendChild(cloned_item);
    });
    return cloned_nodes;
}
function saveProject() {
    let project = document.getElementById("projectTitle");
    let projectName = project.innerHTML;
    let projectID = project.className;
    let url = '/treeEditor/save?projectName=' + projectName + '&projectID=' + projectID;
    let nodes = filterNodes();
    let nodes_json = toJSON(nodes);
    let files = document.getElementById("fileList");
    let files_json = toJSON(files);
    let graph = d3.select('#graph');
    let size = [graph.attr("width"), graph.attr("height")];
    let data = JSON.stringify({ nodes: nodes_json, files: files_json, size: size });
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
exports.saveProject = saveProject;
function saveProjectID(projectID) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.setAttribute("class", projectID);
    showSavePopup();
}
function showSavePopup() {
    let popup = document.getElementById("popup");
    popup.style.opacity = '50%';
    popup.style.display = "block";
    setTimeout(function () {
        popup.style.opacity = '0';
    }, 2000);
}
function updateProjectNodes(data, fromDifferentProject = false, x = null, y = null, foreign_id = null) {
    let newCoordinates = false;
    let nodes = document.getElementById("nodes");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nodes.appendChild(document.importNode(new DOMParser()
            .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + node.outerHTML + '</svg>', 'application/xml').documentElement.firstChild, true));
        if (fromDifferentProject) {
            if (foreign_id != null) {
                foreign_id = Object.values(foreign_id[0])[0];
            }
            else {
                foreign_id = element["foreign_id"];
            }
            let rectCounter = 1;
            d3.select("#nodes").selectAll("rect").each(function () {
                let id = +d3.select(this.parentNode).attr("id");
                if (id >= rectCounter) {
                    rectCounter = id + 1;
                }
            });
            if (x == null && y == null || newCoordinates) {
                x = element["x"];
                y = element["y"];
                newCoordinates = true;
            }
            let foreignNode = d3.select("#nodes>g:last-child")
                .attr("id", rectCounter)
                .attr("class", "foreign" + " " + element["node_id"] + " " + foreign_id);
            let foreignRect = foreignNode.select("rect")
                .attr("x", x)
                .attr("y", y);
            foreignNode.selectAll("path").remove();
            foreignNode.selectAll("circle.lineCircle").remove();
            foreignNode.selectAll("circle").each(function () {
                let element = d3.select(this);
                element.attr("id", element.attr("id").slice(0, -1).concat(rectCounter));
            });
            script_1.updateRectSize(x, y, rectCounter, foreignNode, foreignRect, false);
            foreignNode.select(`#circleBottomRight${rectCounter}`).remove();
            foreign_id = null;
        }
    }
    script_1.initializeRectListeners();
    script_1.initializeCircleListeners();
    script_1.resetRectBorder();
}
exports.updateProjectNodes = updateProjectNodes;
function updateForeignNodes() {
    let nodes = document.getElementById("nodes");
    let foreignNodes = nodes.querySelectorAll("g.foreign");
    let url = '/treeEditor/foreignNode/update';
    foreignNodes.forEach(function (value) {
        let element = d3.select(value);
        let foreign_id = element.attr("class");
        foreign_id = foreign_id.split(" ")[2];
        let x = element.select("rect").attr("x");
        let y = element.select("rect").attr("y");
        let data = JSON.stringify({ foreign_id: foreign_id, x: x, y: y });
        return fetch(url, {
            method: 'POST',
            body: data
        });
    });
}
function saveForeignNode(data, fromDifferentProject, x, y) {
    let id = data[0]["node_id"];
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let url = '/treeEditor/foreignNode/save';
    let data_json = JSON.stringify({ node_id: id, project_id: project_id, x: x, y: y });
    fetch(url, {
        method: 'POST',
        body: data_json
    }).then(response => response.json())
        .then(foreign_id => {
        updateProjectNodes(data, fromDifferentProject, x, y, foreign_id);
        getProjectFiles(data[0]["node_id"]);
    });
}
function getNode(id, fromDifferentProject, x, y) {
    let url = '/treeEditor/node?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
        if (data.length > 0 && fromDifferentProject) {
            saveForeignNode(data, fromDifferentProject, x, y);
        }
    });
}
exports.getNode = getNode;
function getForeignNodes(id) {
    let url = '/treeEditor/foreignNodes?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectNodes(data, true));
}
function getProjectNodes(id) {
    let url = '/treeEditor/nodes?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectNodes(data));
}
function updateProjectFiles(data) {
    let nav = document.getElementById("fileList");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nav.appendChild(document.importNode(node, true));
    }
    let items = nav.getElementsByTagName("li");
    for (let i = items.length; i--;) {
        items[i].addEventListener("click", function () {
            getUploadedFile(items[i].getAttribute("id"));
        });
    }
    initializeDeleteFileListListener();
}
function getProjectFiles(id) {
    let url = '/treeEditor/projectFiles?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectFiles(data));
}
function loadProject() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let name = urlParams.get('name');
    let width = urlParams.get('width');
    let height = urlParams.get('height');
    if (id != null && name != null) {
        updateProjectSize(width, height);
        updateProjectName(name, id);
        getProjectFiles(id);
        getProjectNodes(id);
        getForeignNodes(id);
    }
}
exports.loadProject = loadProject;
function updateProjectSize(width, height) {
    d3.select("#graph")
        .attr("width", width)
        .attr("height", height);
}
function updateProjectName(name, id) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.innerText = name;
    projectTitle.setAttribute("class", id);
}
function uploadFile() {
    let file_input = document.querySelector('[type=file]');
    let files = file_input.files;
    let name = files[0].name;
    if (name.substr(name.length - 3) == "pdf") {
        let formData = new FormData();
        formData.append('file', files[0]);
        let rectInfo = document.getElementById('rectInfo').innerHTML;
        let url = '/treeEditor/files/upload?rectInfo=' + rectInfo;
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.text())
            .then(function (data) {
            updateFileList(data);
            saveProject();
        });
    }
    else {
        alert("Only .pdf attachments are allowed");
    }
}
exports.uploadFile = uploadFile;
function updateFileList(filename) {
    let file = document.getElementById("fileChooser");
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    let isDuplicate = false;
    entries.each(function () {
        let str = this.textContent.slice(0, -1);
        if (str == file.files[0].name) {
            isDuplicate = true;
        }
    });
    if (!isDuplicate) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        li.appendChild(document.createTextNode(file.files[0].name));
        li.setAttribute("id", filename);
        span.setAttribute("class", "close");
        span.appendChild(document.createTextNode("x"));
        li.appendChild(span);
        ul.appendChild(li);
        initializeDeleteFileListListener();
        li.addEventListener("click", function () {
            getUploadedFile(filename);
        });
    }
}
function initializeDeleteFileListListener() {
    let btnList = document.getElementsByClassName("close");
    for (let i = 0; i < btnList.length; i++) {
        btnList[i].addEventListener("click", function (e) {
            let filename = this.parentElement.getAttribute("id");
            deleteFile(filename);
            this.parentElement.remove();
            saveProject();
            e.stopPropagation();
        });
    }
}
