import * as d3 from "./modules/d3";

export function insertLinkIcon() {
    let id = document.getElementById('rectInfo').innerHTML;
    let container = d3.select("#appendixContainer_"+id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");

    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let icon = foreign.select(".appendixLinkIcon");
            icon.node().classList.add("iconShow");
            icon.node().classList.remove("iconHide");
        }
    });
}

export function removeLinkIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let icon = container.select(".appendixLinkIcon");
    icon.node().classList.add("iconHide");
    icon.node().classList.remove("iconShow");
}

export function isLinkListEmpty(id): boolean {
    let empty = true;
    let list = d3.select("#linkList");
    list.selectAll("li").each(function () {
        let li = d3.select(this).attr("class");
        if (li == id) {
            empty = false;
            return;
        }
    });
    return empty;
}

export function insertFileIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");

    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let icon = foreign.select(".appendixFileIcon");
            icon.node().classList.add("iconShow");
            icon.node().classList.remove("iconHide");
        }
    });

}

export function removeFileIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let icon = container.select(".appendixFileIcon");
    icon.node().classList.add("iconHide");
    icon.node().classList.remove("iconShow");
}

export function isFileListEmpty(id): boolean {
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

export function processContentText() {
    let id = document.getElementById('rectInfo').innerHTML;
    isContentTextEmpty(id) ? removeContentTextIcon(id) : insertContentTextIcon(id);

}

function isContentTextEmpty(id) : boolean {
    let empty = false;
    let nodes = d3.select("#nodes");
    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let txt = element.select("text.contentText").text();
            if (txt === "") {
                empty = true;
                return;
            }
        }
    });
    return empty;
}

function insertContentTextIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let foreign = container.select(".foreignAppendix");
    let nodes = d3.select("#nodes");
    nodes.selectAll("g").each(function () {
        let element = d3.select(this);
        if (element.attr("id") == id) {
            let icon = foreign.select(".appendixContentTextIcon");
            icon.node().classList.add("iconShow");
            icon.node().classList.remove("iconHide");
        }
    });
}

function removeContentTextIcon(id) {
    let container = d3.select("#appendixContainer_"+id);
    let icon = container.select(".appendixContentTextIcon");
    icon.node().classList.add("iconHide");
    icon.node().classList.remove("iconShow");
}

