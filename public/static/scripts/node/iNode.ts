export interface INode {
    draw(event): any;
    getNodeType(): string;
    getNodeObject();
    initializeNodeListener();
    appendNodeObject(g, event);
    appendNodeObjectText(g);
    appendNodeIconAppendix(g, counter)
    appendNodeObjectCircles(g, counter);
}
