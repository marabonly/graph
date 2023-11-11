const drawing = new Drawing();

let dragInProgress = false;

window.onload = function () {
	drawing.init();
	drawing.updateSize();

	drawing.canvas.onwheel = zoom;
	drawing.canvas.onmousedown = ActivateDrag;
	drawing.canvas.onmousemove = DoDrag;
	drawing.canvas.onmouseup = CancelDrag;
	drawing.canvas.onmouseout = CancelDrag;

	drawing.draw();
};

window.onresize = function () {
	drawing.updateSize();

	drawing.draw();
};

function zoom(event) {
	event.preventDefault();

	let scale;

	if (event.deltaY > 0) {
		scale = 2;
	} else {
		scale = 0.5;
	}

	// mouse position within canvas

	let rectangle = event.target.getBoundingClientRect();
	let x = event.clientX - rectangle.left;
	let y = event.clientY - rectangle.top;

	drawing.zoom(x, y, scale);
	drawing.draw();
};

function ActivateDrag(event) {
	dragInProgress = true;
	canvas.style.cursor = "move";
};

function DoDrag(event) {
	if (dragInProgress === false) return;

	event.preventDefault();

	drawing.moveFocus(event.movementX, event.movementY);
	drawing.draw();
};

function CancelDrag(event) {
	dragInProgress = false;
	canvas.style.cursor = "default";
};
