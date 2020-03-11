"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const grid_1 = require("./grid");
const links_1 = require("./links");
const files_1 = require("./files");
const navbar_1 = require("./navbar");
const controller_1 = require("./controller");
const graph_1 = require("./graph");
const d3 = __importStar(require("./modules/d3"));
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    graph_1.initializeGraph(getMargin());
    initializePageListeners();
    controller_1.loadProject();
    grid_1.defineGrid(getMargin());
});
function getMargin() {
    return { top: 3, right: 2, bottom: 2, left: 2 };
}
function initializePageListeners() {
    let projectTitle = document.getElementById('projectTitle');
    projectTitle.addEventListener('keypress', controller_1.preventEnterInput);
    projectTitle.addEventListener('click', function (e) {
        projectTitle.contentEditable = 'true';
    });
    d3.select("#titleText").on("input", function () {
        graph_1.updateRectText(this);
    });
    d3.select("#contentText").on("input", function () {
        graph_1.updateRectText(this);
    });
    d3.select("#circleSwitch").on("input", function () {
        navbar_1.transformNodeObject();
    });
    d3.select("#linkSaveBtn").on("click", function () {
        links_1.processLinkItem();
    });
    d3.select("#linkClearBtn").on("click", function () {
        links_1.clearLinkInputFields();
    });
    d3.select("#colorPickerBtn").on("click", function () {
        document.getElementById("colorPicker").click();
    });
    d3.select("#colorPicker").on("input", function () {
        graph_1.updateRectColor(this);
    });
    d3.select("#fileChooserBtn").on("click", function () {
        document.getElementById("fileChooser").click();
    });
    d3.select("#fileChooser").on("input", function () {
        files_1.uploadFile();
    });
    d3.select("#saveButton").on("click", function () {
        controller_1.saveProject();
    });
}
