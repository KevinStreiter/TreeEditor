import {resetRectBorder, initializeRectListeners, initializeCircleListeners} from "./script";
import * as d3 from "./modules/d3";
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
            window.open(url)
        })
}

function deleteFile(filename) {
    let url = '/treeEditor/files/delete?filename=' + filename;
    fetch(url, {
        method: 'POST'
    })
}

export function saveProject() {
    let project = document.getElementById("projectTitle");
    let projectName = project.innerHTML;
    let projectID = project.className;
    let url = '/treeEditor/save?projectName=' + projectName + '&projectID=' + projectID;
    let nodes = document.getElementById("nodes");
    let nodes_json = toJSON(nodes);
    let files = document.getElementById("fileList");
    let files_json = toJSON(files);
    let data = JSON.stringify({nodes: nodes_json, files: files_json});

    fetch(url, {
        method: 'POST',
        body: data
    })
        .then(response => response.json())
        .then(data => saveProjectID(data));
}

function saveProjectID(projectID) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.setAttribute("class", projectID);
    showSavePopup();
}

function showSavePopup() {
    let popup = document.getElementById("popup");
    popup.style.opacity = '50%';
    popup.style.display = "block";
    setTimeout(function() {
        popup.style.opacity = '0';
    },2000);
}

export function updateProjectNodes(data) {
    let svg = document.getElementById("nodes");
    for (let element of data) {
        let node = toDOM(element["element"]);
        svg.appendChild(document.importNode(new DOMParser()
            .parseFromString('<svg xmlns="http://www.w3.org/2000/svg">' + node.outerHTML + '</svg>',
                'application/xml').documentElement.firstChild, true));
    }
    initializeRectListeners();
    initializeCircleListeners();
    resetRectBorder();
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
            getUploadedFile(items[i].getAttribute("id"))
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

export function loadProject() {
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    let name = urlParams.get('name');
    if (id != null && name != null) {
        updateProjectName(name, id);
        getProjectFiles(id);
        getProjectNodes(id);
    }
}

function updateProjectName(name, id) {
    let projectTitle = document.getElementById("projectTitle");
    projectTitle.innerText = name;
    projectTitle.setAttribute("class", id);
}


export function uploadFile() {
    let file_input = <HTMLInputElement>document.querySelector('[type=file]');
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
        alert("Only .pdf attachments are allowed")
    }
}

function updateFileList(filename) {
    let file = <HTMLInputElement>document.getElementById("fileChooser");
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    let isDuplicate: boolean = false;
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
            getUploadedFile(filename)
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