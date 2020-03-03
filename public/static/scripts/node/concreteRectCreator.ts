import {NodeCreator} from "./nodeCreator";
import {INode} from "./iNode";
import {Rect} from "./rect";

export class ConcreteRectCreator extends NodeCreator {
    public createNode(): INode {
        return new Rect();
    }
}