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
function saveProject() {
    let project = document.getElementById("projectTitle");
    let projectName = project.innerHTML;
    let projectID = project.className;
    let url = '/treeEditor/save?projectName=' + projectName + '&projectID=' + projectID;
    let nodes = document.getElementById("nodes");
    let nodes_json = toJSON(nodes);
    let files = document.getElementById("fileList");
    let files_json = toJSON(files);
    let data = JSON.stringify({ nodes: nodes_json, files: files_json });
    fetch(url, {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then(data => saveProjectID(data));
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
function updateProjectNodes(data, fromDifferentProject = false, event = null) {
    let nodes = document.getElementById("nodes");
    for (let element of data) {
        let node = toDOM(element["element"]);
        nodes.appendChild(document.importNode(new DOMParser()
            .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + node.outerHTML + '</svg>', 'application/xml').documentElement.firstChild, true));
        if (fromDifferentProject) {
            let rectCounter = 1;
            d3.select("#nodes").selectAll("rect").each(function () {
                let id = +d3.select(this.parentNode).attr("id");
                if (id >= rectCounter) {
                    rectCounter = id + 1;
                }
            });
            let foreignNode = d3.select("#nodes>g:last-child").attr("id", rectCounter);
            foreignNode.select("rect")
                .attr("x", event.pageX)
                .attr("y", event.pageY);
            foreignNode.selectAll("path").remove();
            foreignNode.selectAll("circle.lineCircle").remove();
            foreignNode.selectAll("circle").each(function () {
                let element = d3.select(this);
                element.attr("id", element.attr("id").slice(0, -1).concat(rectCounter));
            });
            script_1.updateRectSize(event.pageX, event.pageY, rectCounter, foreignNode, foreignNode.select("rect"), false);
        }
    }
    script_1.initializeRectListeners();
    script_1.initializeCircleListeners();
    script_1.resetRectBorder();
}
exports.updateProjectNodes = updateProjectNodes;
function getNode(id, fromDifferentProject, event) {
    let url = '/treeEditor/node?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
        updateProjectNodes(data, fromDifferentProject, event);
        getProjectFiles(data[0]["node_id"]);
    });
}
exports.getNode = getNode;
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
    if (id != null && name != null) {
        updateProjectName(name, id);
        getProjectFiles(id);
        getProjectNodes(id);
    }
}
exports.loadProject = loadProject;
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
