import {INode} from "./iNode";

export abstract class NodeCreator {
    protected abstract createNode(): INode;
}