const PDFJS = require('./modules/pdfjs-dist/pdf.js');
import * as d3 from "./modules/d3";

export function initializeNodeContent(id) {
    selectFilesByNode(id);
}

function selectFilesByNode(id) {
    let ul = document.getElementById("fileList");
    let entries = d3.select("#fileList").selectAll("li");
    entries.each(async function () {
        let current = d3.select(this);
        let fileName = current.attr("id");
        if (fileName.split("_", 2)[0] == id) {
            let path = await getUploadedFile(fileName);
            await createCanvas(id);
            await createThumbnail(path);
        }
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
        })
}

function createCanvas(id) {
    let node_svg = d3.select("#graphContainer").append("svg")
        .attr("width", 50)
        .attr("height", 50);
    let canvas = node_svg.append('canvas')
    console.log(canvas)
}


async function createThumbnail(path) {
    const loadingTask = PDFJS.getDocument(path);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const scale = 0.5;
    const viewport = page.getViewport({scale:scale});

    const canvas = <HTMLCanvasElement> document.getElementById("pdf");
    const context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext).promise;
}
