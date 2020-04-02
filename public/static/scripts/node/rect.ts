import {AbstractNode} from "./abstractNode";
import {initializeRectListeners} from "../graph";

export class Rect extends AbstractNode {
    nodeObject: any;

    public draw(event): any {
        return super.draw(event);
    }

    getNodeType(): string {
        return "rect";
    }

    getNodeObject() {
        return this.nodeObject;
    }

    appendNodeObject(g, event) {
        this.nodeObject = g.append(this.getNodeType())
            .attr("x", event[0] + 5)
            .attr("y", event[1] + 5)
            .attr('height', 0)
            .attr('width', 0)
            .attr("fill", "#f8f8f8")
            .attr("class", this.getNodeType());
    }

    appendNodeObjectText(g) {
        g.append("text")
            .attr("x", +this.nodeObject.attr("x") + 10)
            .attr("y", +this.nodeObject.attr("y") + 20)
            .attr("font-weight", 20)
            .attr("class", "titleText")
            .style('font-size', 22)
            .text();

        g.append("text")
            .attr("x", +this.nodeObject.attr("x") + 10)
            .attr("y", +this.nodeObject.attr("y") + 40)
            .attr("class", "contentText")
            .text();
    }

    appendNodeIconAppendix(g, counter) {

        let appendixContainer = g.append("g")
            .attr("id", "appendixContainer_" + counter)
            .attr("class", "appendixIcons")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml');

        let foreignObject = appendixContainer.append("foreignObject")
            .attr("width", 50)
            .attr("height", 15)
            .attr("class", "foreignAppendix");

        let span = foreignObject.append("xhtml:span")
            .attr("class", "iconSpan");

        let fileIcon = span.append("xhtml:a")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("class", "appendixFileIcon iconHide");

        fileIcon.append("xhtml:i")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("class", "fa fa-paperclip");

        let linkIcon = span.append("xhtml:a")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("class", "appendixLinkIcon iconHide");

        linkIcon.append("xhtml:i")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("class", "fa fa-external-link");
    }

    appendNodeObjectCircles(g, counter) {
        g.append("circle")
            .attr("cx", +this.nodeObject.attr("cx"))
            .attr("cy", +this.nodeObject.attr("cy") + +this.nodeObject.attr("r"))
            .attr("r", 5)
            .attr("id", "circleTop" + counter)
            .attr("class", "circle");

        g.append("circle")
            .attr("cx", +this.nodeObject.attr("cx") + +this.nodeObject.attr("r"))
            .attr("cy", +this.nodeObject.attr("cy") - +this.nodeObject.attr("r"))
            .attr("r", 5)
            .attr("id", "circleBottom" + counter)
            .attr("class", "circle");

        g.append("circle")
            .attr("cx", +this.nodeObject.attr("cx") - +this.nodeObject.attr("r"))
            .attr("cy", +this.nodeObject.attr("cy"))
            .attr("r", 5)
            .attr("id", "circleLeft" + counter)
            .attr("class", "circle");

        g.append("circle")
            .attr("cx", +this.nodeObject.attr("cx") + +this.nodeObject.attr("r"))
            .attr("cy", +this.nodeObject.attr("cy"))
            .attr("r", 5)
            .attr("id", "circleRight" + counter)
            .attr("class", "circle");
    }

    initializeNodeListener() {
        initializeRectListeners();
    }
}