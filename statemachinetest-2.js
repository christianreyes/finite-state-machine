// Sample test file for the state machine class
// Implements rubber-banding drawing.

// Record the location where the div was clicked.
function create_p1(e, attachedElement) {
	e.stopPropagation();
	
	log("create p1");
	
	var line = new Line({
		startX: e.offsetX,
		startY: e.offsetY,
		endX: e.offsetX,
		endY: e.offsetY,
		lineWidth: 2
	});
	
	attachedElement.style.cursor = "crosshair";
	
	attachedElement.doodle.children = [line];
	clear(attachedElement);
	attachedElement.doodle.draw();
}

// When the div is released, make its background color red again.
function create_p2(e, attachedElement) {
	log("create_p2");
	
	e.stopPropagation();
	
	if(attachedElement.doodle.children.length > 0){
		var line = attachedElement.doodle.children[0];
		
		line.endX = e.offsetX;
		line.endY = e.offsetY;
		
		clear(attachedElement);
		attachedElement.doodle.draw();
	}
}

function change_cursor_create_p2(e, attachedElement){
	attachedElement.style.cursor = "default";
	create_p2(e,attachedElement);
}

function clear(canvas){
	canvas.doodle.context.clearRect(0,0,canvas.width,canvas.height);
}

function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
	var canvas = document.getElementById("myCanvas");
	
	var doodle = new Doodle(canvas);
	
	doodle.draw();
	
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
	
	new StateMachine(_rubber_band_definition, canvas);
};
