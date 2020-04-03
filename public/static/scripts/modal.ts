import * as d3 from "./modules/d3";

export function openModalWindow(element) {
    let titleText = <HTMLInputElement>document.getElementById("modalTitle");
    let contentText = <HTMLInputElement>document.getElementById("modalContent");
    titleText.innerHTML = element.select("text.titleText").text();
    contentText.innerHTML = element.select("text.contentText").text();
    let modal = document.getElementById("modal");
    let span = <HTMLAnchorElement> document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}



