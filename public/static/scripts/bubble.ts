export class Bubble {
    readonly radius: number;
    readonly id: number;
    private _x: number;
    private _y: number;
    private _vx: number;
    private _vy: number;

    public constructor(rowCounter:number, x: number, y: number, maxRadius:number) {
        this.radius = Math.floor(Math.random() * (maxRadius - 1) + 5);
        this.id = rowCounter;
        this._x = x;
        this._y = y;
        this._vx =  (Math.random() * 2 + 1) * Math.cos(Math.random() * 360 * Math.PI / 180);
        this._vy =  (Math.random() * 2 + 1) * Math.sin(Math.random() * 360 * Math.PI / 180);
   }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    get vx(): number {
        return this._vx;
    }

    set vx(value: number) {
        this._vx = value;
    }

    get vy(): number {
        return this._vy;
    }

    set vy(value: number) {
        this._vy = value;
    }
}
