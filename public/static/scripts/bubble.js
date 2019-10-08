"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bubble {
    constructor(rowCounter, x, y, maxRadius) {
        this.radius = Math.floor(Math.random() * (maxRadius - 1) + 5);
        this.id = rowCounter;
        this._x = x;
        this._y = y;
        this._vx = (Math.random() * 2 + 1) * Math.cos(Math.random() * 360 * Math.PI / 180);
        this._vy = (Math.random() * 2 + 1) * Math.sin(Math.random() * 360 * Math.PI / 180);
    }
    get x() {
        return this._x;
    }
    set x(value) {
        this._x = value;
    }
    get y() {
        return this._y;
    }
    set y(value) {
        this._y = value;
    }
    get vx() {
        return this._vx;
    }
    set vx(value) {
        this._vx = value;
    }
    get vy() {
        return this._vy;
    }
    set vy(value) {
        this._vy = value;
    }
}
exports.Bubble = Bubble;
