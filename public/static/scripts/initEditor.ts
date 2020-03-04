import {defineGrid} from "./grid";
import {clearLinkInputFields, processLinkItem} from "./links";
import {uploadFile} from "./files";
import {loadProject, preventEnterInput, saveProject} from "./controller";
import {initializeGraph, updateRectColor, updateRectText} from "./graph";
import * as d3 from "./modules/d3";

window.onload = async () => {
    initializeGraph(getMargin());
    initializePageListeners();
    loadProject();
    defineGrid(getMargin());
};

function getMargin () {
    return {top: 3, right: 2, bottom: 2, left: 2};
}

function initializePageListeners() {
    let projectTitle = document.getElementById('projectTitle');
    projectTitle.addEventListener('keypress', preventEnterInput);

    projectTitle.addEventListener('click', function (e) {
        projectTitle.contentEditable = 'true';
    });

    d3.select("#titleText").on("input", function () {
        updateRectText(this)
    });
    d3.select("#contentText").on("input", function () {
        updateRectText(this)
    });

    d3.select("#linkSaveBtn").on("click", function () {
        processLinkItem();
    });

    d3.select("#linkClearBtn").on("click", function () {
        clearLinkInputFields();
    });

    d3.select("#colorPickerBtn").on("click", function () {
        document.getElementById("colorPicker").click();
    });

    d3.select("#colorPicker").on("input", function () {
        updateRectColor(this);
    });

    d3.select("#fileChooserBtn").on("click", function () {
        document.getElementById("fileChooser").click();
    });

    d3.select("#fileChooser").on("input", function () {
        uploadFile()
    });

    d3.select("#saveButton").on("click", function () {
        saveProject();
    });
}