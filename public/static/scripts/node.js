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
const PDFJS = require('./modules/pdfjs-dist/build/pdf.js');
const d3 = __importStar(require("./modules/d3"));
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
                yield createCanvas(id).then(value => createThumbnail(path, value));
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
    let counter = 1;
    let current_g = d3.select("#canvas_container_" + id);
    if (current_g.empty()) {
        d3.select("#nodes").selectAll("g").each(function () {
            let current = d3.select(this);
            if (current.attr("id") == id) {
                current_g = current.append("g").attr("id", "canvas_container_" + id)
                    .attr('xmlns', 'http://www.w3.org/1999/xhtml');
            }
        });
    }
    else {
        counter = d3.select(`#canvas_container_${id}>foreignObject:last-child`).select("canvas").attr("id").split("_", 2)[1];
        counter++;
    }
    let current_rect = d3.select(current_g.node().parentNode).select("rect");
    let foreigner = current_g.append("foreignObject")
        .attr("width", 150)
        .attr("height", 200)
        .attr("x", +current_rect.attr("x") + ((counter - 1) * 150) + (counter * 10));
    foreigner.append("xhtml:canvas")
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .attr("id", "canvas_" + counter)
        .attr("class", "canvas");
    return new Promise((resolve) => {
        setTimeout(() => resolve(counter), 500);
    });
}
function createThumbnail(path, id) {
    return __awaiter(this, void 0, void 0, function* () {
        PDFJS.GlobalWorkerOptions.workerSrc = '/static/scripts/modules/pdfjs-dist/build/pdf.worker.js';
        const loadingTask = PDFJS.getDocument(path);
        const pdf = yield loadingTask.promise;
        const page = yield pdf.getPage(1);
        const scale = 0.1;
        const resolution = 10;
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.getElementById("canvas_" + id);
        const context = canvas.getContext("2d");
        canvas.height = resolution * viewport.height;
        canvas.width = resolution * viewport.width;
        canvas.style.height = viewport.height.toString() + 'px';
        canvas.style.width = viewport.width.toString() + 'px';
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: [resolution, 0, 0, resolution, 0, 0] // force it bigger size
        };
        yield page.render(renderContext).promise;
    });
}
