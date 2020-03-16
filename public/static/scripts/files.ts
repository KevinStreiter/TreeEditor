import {deleteItemList, saveProject} from "./controller";
let toDOM = require("./modules/toDOM.js");
import * as d3 from "./modules/d3";


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
    document.querySelectorAll(".deleteFileBtn").forEach(item => {
        item.addEventListener('click', executeDeleteFileListListener);
    });
}

export function getProjectFiles(id) {
    let url = '/treeEditor/projectFiles?id=' + id;
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectFiles(data));
}

export function uploadFile() {
    let file_input = <HTMLInputElement>document.querySelector('[type=file]');
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
            saveProject();
        });
}

function updateFileList(filename) {
    let file = <HTMLInputElement>document.getElementById("fileChooser");
    let name = file.files[0].name;
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    let isDuplicate: boolean = false;
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
        li.insertAdjacentHTML('beforeend',`<a class="deleteFileBtn"><i class="fa fa-times"></i></a>`);
        ul.appendChild(li);

        li.addEventListener("click", function () {
            getUploadedFile(filename)
        });
    }
    document.querySelectorAll(".deleteFileBtn").forEach(item => {
        item.addEventListener('click', executeDeleteFileListListener);
    });
}

function insertFileIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");

    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let rect = element.select("rect");
            foreign
                .attr("x", +rect.attr("x") + 10)
                .attr("y", +rect.attr("y") + +rect.attr("height") - 25);
            foreign.select(".appendixFileIcon")
                .style("display",'inherit');
        }
    });
}

function executeDeleteFileListListener(event) {
    let id = deleteItemList(event);
    deleteFile(id);
}