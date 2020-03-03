import {NodeCreator} from "./nodeCreator";
import {INode} from "./iNode";
import {Circle} from "./circle";

export class ConcreteCircleCreator extends NodeCreator {
    public createNode(): INode {
        return new Circle();
    }
}