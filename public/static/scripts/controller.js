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
    nodes = toJSON(nodes);
    let files = document.getElementById("fileList");
    files = toJSON(files);
    let links = document.getElementById("linkList");
    links = toJSON(links);
    let graph = d3.select('#graph');
    let size = [graph.attr("width"), graph.attr("height")];
    let data = JSON.stringify({ nodes: nodes, files: files, links: links, size: size });
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
function updateProjectNodes(data, fromDifferentProject = false, x = null, y = null, initialLoad = false, foreign_id = null) {
    let newCoordinates = false;
    let nodes = document.getElementById("nodes");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nodes.appendChild(document.importNode(new DOMParser()
            .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + node.outerHTML + '</svg>', 'application/xml').documentElement.firstChild, true));
        if (fromDifferentProject) {
            let rectCounter = null;
            if (initialLoad) {
                rectCounter = element["foreign_id"];
            }
            else {
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
            script_1.updateRectSize(x, y, rectCounter, foreignNode, foreignRect, false);
            foreignNode.select(`#circleBottomRight${rectCounter}`).remove();
            let foreignNodeDOM = document.getElementById(rectCounter.toString());
            if (initialLoad && element["connectors"] != null) {
                let connectors = toDOM(element["connectors"]);
                foreignNodeDOM.appendChild(document.importNode(new DOMParser()
                    .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + connectors.outerHTML + '</svg>', 'application/xml').documentElement.firstChild, true));
                let g = document.getElementById("connectors");
                if (g.hasChildNodes()) {
                    while (g.childNodes.length > 0) {
                        foreignNodeDOM.appendChild(g.childNodes[0]);
                    }
                }
                g.remove();
                script_1.updateRectSize(x, y, rectCounter, foreignNode, foreignRect, false);
            }
        }
    }
    script_1.initializeRectListeners();
    script_1.initializeCircleListeners();
    script_1.resetRectBorder();
}
exports.updateProjectNodes = updateProjectNodes;
function deleteForeignNode(element) {
    let foreign_id = element.attr("id");
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let url = '/treeEditor/foreignNodes/delete?foreign_id=' + foreign_id + '&project_id=' + project_id;
    fetch(url, {
        method: 'POST',
    });
}
exports.deleteForeignNode = deleteForeignNode;
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
        connectors.setAttribute("id", "connectors");
        element.selectAll("path").each(function () {
            connectors.appendChild(this.cloneNode(true));
        });
        element.selectAll(".lineCircle").each(function () {
            connectors.appendChild(this.cloneNode(true));
        });
        if (connectors.hasChildNodes()) {
            connectors = toJSON(connectors);
        }
        else {
            connectors = null;
        }
        let data = JSON.stringify({ foreign_id: foreign_id, project_id: project_id, x: x, y: y, connectors: connectors });
        return fetch(url, {
            method: 'POST',
            body: data
        });
    });
}
function saveForeignNode(data, fromDifferentProject, x, y) {
    let id = data[0]["node_id"];
    let project_id = document.getElementById("projectTitle").getAttribute("class");
    let newest_foreign_id = 1;
    let nodes = document.getElementById("nodes");
    let g = nodes.querySelectorAll("g");
    let idList = [];
    g.forEach(function (value) {
        let element = d3.select(value);
        let id = element.attr("id");
        idList.push(id);
    });
    if (idList.length != 0) {
        newest_foreign_id = Math.max.apply(Math, idList.map(function (o) { return o; })) + 1;
    }
    let url = '/treeEditor/foreignNode/save';
    let data_json = JSON.stringify({ foreign_id: newest_foreign_id, node_id: id, project_id: project_id, x: x, y: y });
    fetch(url, {
        method: 'POST',
        body: data_json
    })
        .then(handleErrors)
        .then(response => {
        updateProjectNodes(data, fromDifferentProject, x, y, false, newest_foreign_id);
        getProjectFiles(data[0]["node_id"]);
    })
        .catch((error) => {
        //do nothing
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
function handleErrors(response) {
    if (!response.ok)
        throw Error(response.statusText);
    return response;
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
    document.querySelectorAll(".fileBtn").forEach(item => {
        item.addEventListener('click', executeDeleteFileListListener);
    });
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
        li.appendChild(document.createTextNode(file.files[0].name));
        li.setAttribute("id", filename);
        li.insertAdjacentHTML('beforeend', `<a class="deleteBtn fileBtn"><i class="fa fa-times"></i></a>`);
        ul.appendChild(li);
        li.addEventListener("click", function () {
            getUploadedFile(filename);
        });
    }
    document.querySelectorAll(".fileBtn").forEach(item => {
        item.addEventListener('click', executeDeleteFileListListener);
    });
}
function executeDeleteFileListListener(event) {
    let id = deleteItemList(event);
    deleteFile(id);
}
function deleteItemList(event) {
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
exports.deleteItemList = deleteItemList;
