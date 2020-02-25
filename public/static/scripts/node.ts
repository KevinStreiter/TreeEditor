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
            await createCanvas(id).then(value => createThumbnail(path, value));
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
    let counter = 1;
    let current_g = d3.select("#canvas_container_"+id);
    if (current_g.empty()) {
        d3.select("#nodes").selectAll("g").each(function () {
            let current = d3.select(this);
            if (current.attr("id") == id) {
                current_g = current.append("g").attr("id", "canvas_container_" + id);
            }
        });
    } else {
        counter = d3.select(`#canvas_container_${id}>foreignObject:last-child`).select("canvas").attr("id").split("_",2)[1];
        counter++;
    }
    let foreigner = current_g.append("foreignObject");
    foreigner.append("xhtml:canvas")
        .attr('xmlns', 'http://www.w3.org/1999/xhtml')
        .attr("id", "canvas_" + counter)
        .attr("class", "canvas");

    return new Promise((resolve) => {
        setTimeout(() => resolve(counter), 500)
    });
}

async function createThumbnail(path, id) {
    const loadingTask = PDFJS.getDocument(path);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = 0.5;
    const viewport = page.getViewport({scale:scale});
    const canvas = <HTMLCanvasElement> document.getElementById("canvas_"+id);
    const context = canvas.getContext("2d")
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    await page.render(renderContext).promise;
}
