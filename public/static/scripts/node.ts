const PDFJS = require('./modules/pdfjs-dist/build/pdf.js');
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
                current_g = current.append("g").attr("id", "canvas_container_" + id)
                    .attr('xmlns', 'http://www.w3.org/1999/xhtml');
            }
        });
    } else {
        counter = d3.select(`#canvas_container_${id}>foreignObject:last-child`).select("canvas").attr("id").split("_",2)[1];
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
        setTimeout(() => resolve(counter), 500)
    });
}

async function createThumbnail(path, id) {
    PDFJS.GlobalWorkerOptions.workerSrc = '/static/scripts/modules/pdfjs-dist/build/pdf.worker.js';
    const loadingTask = PDFJS.getDocument(path);
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const scale = 0.1;
    const resolution = 10;
    const viewport = page.getViewport({scale:scale});
    const canvas = <HTMLCanvasElement> document.getElementById("canvas_"+id);
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
    await page.render(renderContext).promise;
}
