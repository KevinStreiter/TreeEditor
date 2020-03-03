import {INode} from "./iNode";

export abstract class NodeCreator {

    public abstract createNode(): INode;

    public draw(): string {
        const node = this.createNode();
        return node.draw();
    }
}