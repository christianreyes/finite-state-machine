// Sample test file for the state machine class
// Implements rubber-banding drawing.

// Record the location where the div was clicked.
function create_p1(e, attachedElement) {
	log("create p1");
	
	// create the initial line. P2=P1. offset is exactly where mouse is pointing
	var line = new Line({
		startX: e.offsetX,
		startY: e.offsetY,
		endX: e.offsetX,
		endY: e.offsetY,
		lineWidth: 2
	});
	
	// give feedback to the user as to what is happening
	attachedElement.style.cursor = "crosshair";
	
	// add the line to the canvas and draw it.
	attachedElement.doodle.children = [line];
	cavas_clear(attachedElement);
	attachedElement.doodle.draw();
}

// When the div is released, make its background color red again.
function create_p2(e, attachedElement) {
	log("create_p2");
		
	// if there is a line, move P2 to where the mouse is
	if(attachedElement.doodle.children.length > 0){
		// grab the line
		var line = attachedElement.doodle.children[0];
		
		// move endpoints to exactly where the mouse pointer is pointing to
		line.endX = e.offsetX;
		line.endY = e.offsetY;
		
		// clear the canvas and draw again
		cavas_clear(attachedElement);
		attachedElement.doodle.draw();
	}
}

// change cursor back to default and then draw p2 as normal
function change_cursor_create_p2(e, attachedElement){
	attachedElement.style.cursor = "default";
	create_p2(e,attachedElement);
}

// clear the canvas
function cavas_clear(canvas){
	canvas.doodle.context.clearRect(0,0,canvas.width,canvas.height);
}

// simple logging function
function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to canvas
window.onload = function() {
	//get the canvas
	var canvas = document.getElementById("myCanvas");
	
	// create a doodle
	var doodle = new Doodle(canvas);
	
	// SM definition
	var _rubber_band_definition = {
		states: [
		{
			name: "start",
			transitions: [
				{
					input: "click", 
					action: create_p1,
					endState: "move"
				}]
		},
		{
			name: "move",
			transitions: [
				{
					input: "mouseMove",
					action: create_p2,
					endState: "move"
				},
				{
					input: "click",
					action: change_cursor_create_p2,
					endState: "start"
				}
			]
		}
		]
	};
	
	// create state machine
	new StateMachine(_rubber_band_definition, canvas);
};
