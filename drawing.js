class Drawing {
    constructor() {
        this.bottomPane = null;
        this.canvas = null;
        this.context = null;

        this.focusX = 0;
        this.focusY = 0;
        this.scale = 1;

        this.displayWidth = 500;
        this.displayHeight = 500;

        this.function = (x) => x * x;
    }

    init() {
        this.bottomPane = document.getElementById("bottomPane");
        this.canvas = document.getElementById("canvas");
        this.context = this.canvas.getContext("2d");

        const radio_x2 = document.getElementById('radio_x2');
        const radio_x3 = document.getElementById('radio_x3');
        const radio_sin = document.getElementById('radio_sin');
        const radio_cos = document.getElementById('radio_cos');
        const radio_tg = document.getElementById('radio_tg');

        radio_x2.onclick = () => {
            this.function = (x) => x * x;
            this.draw();
        };

        radio_x3.onclick = () => {
            this.function = (x) => x * x * x;
            this.draw();
        };

        radio_sin.onclick = () => {
            this.function = (x) => Math.sin(x);
            this.draw();
        };

        radio_cos.onclick = () => {
            this.function = (x) => Math.cos(x);
            this.draw();
        };

        radio_tg.onclick = () => {
            this.function = (x) => Math.tan(x);
            this.draw();
        };
    }

    updateSize() {
        this.displayWidth = this.bottomPane.getBoundingClientRect().width;
        this.displayHeight = this.bottomPane.getBoundingClientRect().height;

        this.canvas.style.width = this.displayWidth + 'px';
        this.canvas.style.height = this.displayHeight + 'px';

        this.canvas.width = this.displayWidth;
        this.canvas.height = this.displayHeight;
    }

    #transformMMtoPixels_X(x) {
        return (x - this.focusX) * this.scale + this.displayWidth / 2.0;
    }

    #transformMMtoPixels_Y(y) {
        return (-y + this.focusY) * this.scale + this.displayHeight / 2.0;
    }

    #transformPixelsToMM_X(x) {
        return (x - this.displayWidth / 2.0) / this.scale + this.focusX;
    }

    #transformPixelsToMM_Y(y) {
        return (-y + this.displayHeight / 2.0) / this.scale + this.focusY;
    }

    #transformPixelsToMM_DX(dx) {
        return dx / this.scale;
    }

    #transformPixelsToMM_DY(dy) {
        return -dy / this.scale;
    }

    moveFocus(dx, dy) {
        this.focusX -= this.#transformPixelsToMM_DX(dx);
        this.focusY -= this.#transformPixelsToMM_DY(dy);
    }

    zoom(x, y, scale) {
        let xBeforeZoom = this.#transformPixelsToMM_X(x);
        let yBeforeZoom = this.#transformPixelsToMM_Y(y);

        this.scale *= scale;
        this.scale = Math.min(Math.max(0.01, this.scale), 100);

        let xAfterZoom = this.#transformPixelsToMM_X(x);
        let yAfterZoom = this.#transformPixelsToMM_Y(y);

        this.focusX -= (xAfterZoom - xBeforeZoom) * 1.2;
        this.focusY -= (yAfterZoom - yBeforeZoom) * 1.2;
    }

    // --------------
    //   primitives
    // --------------

    moveTo(x1, y1) {
        this.context.moveTo(
            this.#transformMMtoPixels_X(x1),
            this.#transformMMtoPixels_Y(y1)
        );
    }

    lineTo(x1, y1) {
        this.context.lineTo(
            this.#transformMMtoPixels_X(x1),
            this.#transformMMtoPixels_Y(y1)
        );
    }

    // --------------
    // basic methods
    // --------------

    drawLine(x1, y1, x2, y2) {
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
    }

    /*
    drawArc(x1, y1, x2, y2, rad, dir) {
        arc(0, 0, 50, 0, 2 * Math.PI);
    }
    */

    drawCircle(x, y, rad) {
        // TO DO: remove context from this method
        this.context.arc(x, y, rad, 0, 2 * Math.PI);
    }

    // --------------
    // draw
    // --------------

    draw() {
        this.context.clearRect(0, 0, this.displayWidth, this.displayHeight);

        this.drawFunction();
        this.drawCoordinateSystem();
    }

    drawFunction() {
        this.context.lineWidth = 2;
        this.context.strokeStyle = "blue";
        this.context.beginPath();

        let minX = this.focusX - this.#transformPixelsToMM_DX(this.displayWidth / 2.0);
        let maxX = this.focusX + this.#transformPixelsToMM_DX(this.displayWidth / 2.0);
        let step = (maxX - minX) / this.displayWidth;

        let x = minX;
        this.moveTo(x, this.function(x));

        for (x = minX + step; x < maxX; x += step) {
            this.lineTo(x, this.function(x));
        }

        this.context.stroke();
    }

    drawCoordinateSystem() {
        this.context.lineWidth = 1;
        this.context.strokeStyle = "black";
        this.context.beginPath();

        this.moveTo(0, this.focusY - this.#transformPixelsToMM_DY(this.displayHeight / 2.0));
        this.lineTo(0, this.focusY + this.#transformPixelsToMM_DY(this.displayHeight / 2.0));

        this.moveTo(this.focusX - this.#transformPixelsToMM_DX(this.displayWidth / 2.0), 0);
        this.lineTo(this.focusX + this.#transformPixelsToMM_DX(this.displayWidth / 2.0), 0);

        this.context.stroke();
    }
}