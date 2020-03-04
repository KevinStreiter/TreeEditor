import {INode} from "./iNode";
import {AbstractNode} from "./abstractNode";

export class Circle extends AbstractNode{
    draw(event): any {
        return super.draw(event);
    }

    getNodeType(): string {
        return "circle";
    }
}