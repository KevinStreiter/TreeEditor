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
Object.defineProperty(exports, "__esModule", { value: true });
const PDFJS = require('./modules/pdfjs-dist/pdf.js');
const d3 = require("./modules/d3");
function initializeNodeContent(id) {
    selectFilesByNode(id);
}
exports.initializeNodeContent = initializeNodeContent;
function selectFilesByNode(id) {
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    entries.each(function () {
        return __awaiter(this, void 0, void 0, function* () {
            let current = d3.select(this);
            let fileName = current.attr("id");
            if (fileName.split("_", 2)[0] == id) {
                let path = yield getUploadedFile(fileName);
                yield createCanvas(id);
                yield createThumbnail(path);
            }
        });
    });
}
function getUploadedFile(filename) {
    let url = '/treeEditor/files?filename=' + filename;
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.blob())
        .then(function (blob) {
        return URL.createObjectURL(blob);
    });
}
function createCanvas(id) {
    let node_svg = d3.select("#graphContainer").append("svg")
        .attr("width", 50)
        .attr("height", 50);
    let canvas = node_svg.append('canvas');
    console.log(canvas);
}
function createThumbnail(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const loadingTask = PDFJS.getDocument(path);
        const pdf = yield loadingTask.promise;
        const page = yield pdf.getPage(1);
        const scale = 0.5;
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.getElementById("pdf");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        yield page.render(renderContext).promise;
    });
}
