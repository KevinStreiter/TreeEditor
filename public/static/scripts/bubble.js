"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Bubble = /** @class */ (function () {
    function Bubble(rowCounter, x, y, maxRadius) {
        this.radius = Math.floor(Math.random() * (maxRadius - 1) + 5);
        this.id = rowCounter;
        this._x = x;
        this._y = y;
        this._vx = (Math.random() * 2 + 1) * Math.cos(Math.random() * 360 * Math.PI / 180);
        this._vy = (Math.random() * 2 + 1) * Math.sin(Math.random() * 360 * Math.PI / 180);
    }
    Object.defineProperty(Bubble.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bubble.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bubble.prototype, "vx", {
        get: function () {
            return this._vx;
        },
        set: function (value) {
            this._vx = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bubble.prototype, "vy", {
        get: function () {
            return this._vy;
        },
        set: function (value) {
            this._vy = value;
        },
        enumerable: true,
        configurable: true
    });
    return Bubble;
}());
exports.Bubble = Bubble;
