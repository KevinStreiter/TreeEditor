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
let toDOM = require("./modules/toDOM.js");
const d3 = __importStar(require("./modules/d3"));
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
    document.querySelectorAll(".deleteFileBtn").forEach(item => {
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
exports.getProjectFiles = getProjectFiles;
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
        insertFileIcon(rectInfo);
        controller_1.saveProject();
    });
}
exports.uploadFile = uploadFile;
function updateFileList(filename) {
    let file = document.getElementById("fileChooser");
    let name = file.files[0].name;
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    let isDuplicate = false;
    entries.each(function () {
        let str = this.textContent.slice(0, -1);
        if (str == name) {
            isDuplicate = true;
        }
    });
    if (!isDuplicate) {
        if (name.length > 20) {
            name = name.substring(0, 20) + '...';
        }
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(name));
        li.setAttribute("id", filename);
        li.insertAdjacentHTML('beforeend', `<a class="deleteFileBtn"><i class="fa fa-times"></i></a>`);
        ul.appendChild(li);
        li.addEventListener("click", function () {
            getUploadedFile(filename);
        });
    }
    document.querySelectorAll(".deleteFileBtn").forEach(item => {
        item.addEventListener('click', executeDeleteFileListListener);
    });
}
function insertFileIcon(id) {
    let container = d3.select("#appendixContainer_" + id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");
    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let rect = element.select("rect");
            foreign
                .attr("x", +rect.attr("x") + 10)
                .attr("y", +rect.attr("y") + +rect.attr("height") - 25);
            let icon = foreign.select(".appendixFileIcon");
            icon.node().classList.add("iconShow");
            icon.node().classList.remove("iconHide");
        }
    });
}
function removeFileIcon(id) {
    let container = d3.select("#appendixContainer_" + id);
    let icon = container.select(".appendixFileIcon");
    icon.node().classList.add("iconHide");
    icon.node().classList.remove("iconShow");
}
function isFileListEmpty(id) {
    let empty = true;
    let list = d3.select("#fileList");
    list.selectAll("li").each(function () {
        let li = d3.select(this).attr("id");
        if (li.split("_", 2)[0] == id) {
            empty = false;
            return;
        }
    });
    return empty;
}
function executeDeleteFileListListener(event) {
    let nodeId = document.getElementById('rectInfo').innerHTML;
    let fileId = controller_1.deleteItemList(event);
    if (isFileListEmpty(nodeId)) {
        removeFileIcon(nodeId);
    }
    deleteFile(fileId);
}
