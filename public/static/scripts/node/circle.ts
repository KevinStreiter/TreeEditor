import {INode} from "./iNode";

export class Circle implements INode {
    x: number;
    y: number;
    public draw(): string {
        return "circle";
    }
}