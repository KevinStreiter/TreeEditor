import * as d3 from "./modules/d3";

let target;

function showMenu(x, y){
    let menu = <HTMLInputElement> document.querySelector('.menu');
    let delEntry = document.getElementById('menu-delete-btn');
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    if (target.tagName == "rect" || target.tagName == "path") {
        delEntry.style.display = 'inherit';
        menu.classList.add('show-menu');
    }
    else if (target.tagName == "svg") {
        delEntry.style.display = 'none';
        getProjects();
    }
    else {
        menu.classList.remove('show-menu');
    }
}

function getProjects() {
    let url = '/treeEditor/projects';
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => updateProjectMenu(data));
}

function updateProjectMenu(data) {
    console.log(data);
}

function hideMenu(){
    let menu = <HTMLInputElement> document.querySelector('.menu');
    menu.classList.remove('show-menu');
}

function onContextMenu(e){
    e.preventDefault();
    target = e.target;
    showMenu(e.pageX, e.pageY);
    document.addEventListener('click', onClick, false);
}

function onClick(e){
    if (e.target.innerText == "Delete" || e.target.parentNode.innerText == "Delete") {
        removeNode(target);
    }
    hideMenu();
    document.removeEventListener('click', onClick);
}

document.addEventListener('contextmenu', onContextMenu, false);

function removeNode(node) {

    if (node.nodeName == "rect") {
        d3.selectAll("g").each(function () {
            let element = d3.select(this);
            if (element.attr("id") == node.parentNode.id) {
                element.remove()
            }
            if (element.attr("id") != "grid" && element.attr("id") != null) {
                element.selectAll("path").each(function () {
                    let line = d3.select(this);
                    if (line.attr("class").search(node.parentNode.id) != -1) {
                        line.remove()
                    }
                });
                element.selectAll("circle").each(function () {
                    let circle = d3.select(this);
                    if (circle.attr("class").search(node.parentNode.id) != -1) {
                        circle.remove()
                    }
                })
            }
        });
    }

    else if (node.nodeName == "path") {
        let parent = d3.select(node.parentNode);
        let classes = d3.select(target).attr("class").split(" ");
        parent.select("circle." + classes[0] + "." + classes[1]).remove();
        target.remove();

    }
}