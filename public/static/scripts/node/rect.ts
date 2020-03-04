import {INode} from "./iNode";
import * as d3 from "../modules/d3.js"
import {AbstractNode} from "./abstractNode";

export class Rect extends AbstractNode{
    public draw(event): any {
        return super.draw(event);
    }

    getNodeType(): string {
        return "rect";
    }
}