import {INode} from "./iNode";

export class Rect implements INode {
    x: number;
    y: number;
    public draw(): string {
        return "rect";
    }
}