import * as d3 from "./modules/d3";

let target;

function showMenu(x, y){
    let menu = <HTMLInputElement> document.querySelector('.menu');
    if (target.tagName == "rect" || target.tagName == "line") {
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.classList.add('show-menu');
    }
    else {
        menu.classList.remove('show-menu');
    }
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

            element.selectAll("line").each(function () {
                let line = d3.select(this);
                if (line.attr("class").search(node.parentNode.id) != -1) {
                    line.remove()
                }

            })

        });
    }

    else if (node.nodeName == "line") {
        target.remove()
    }
}