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
            .attr("id", "appendix_container_" + counter)
            .attr("class", "appendixIcons")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml');

        let foreignObject = appendixContainer.append("foreignObject")
            .attr("width", 40)
            .attr("height", 40);

        let fileIcon = foreignObject.append("xhtml:a")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("id", "appendix_file_icon" + counter);

        fileIcon.append("xhtml:i")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("class", "fa fa-paperclip");

        let linkIcon = foreignObject.append("xhtml:a")
            .attr('xmlns', 'http://www.w3.org/1999/xhtml')
            .attr("id", "appendix_link_icon" + counter);

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