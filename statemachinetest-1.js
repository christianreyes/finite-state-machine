// Sample test file for the state machine class
// Implements a simple draggable div which changes color when pressed.
// modified to have two draggable divs at the same time

// Record the location where the div was clicked.
function record_down_location(e, attachedElement) {
    log("record down location: " + e.clientX + ", " + e.clientY);
    attachedElement.downX = e.clientX; // get the x and y of the mousedown
    attachedElement.downY = e.clientY; // store them

	position = $(attachedElement).position(); // get the left and top position
    attachedElement.origLeft = position.left; // and store those
    attachedElement.origTop = position.top; 
	
    attachedElement.style.backgroundColor = "rgba(255,0,0,.7)"; // make background color light red
	attachedElement.style.zIndex = 100;		// put the z-index high to ensure it is on top
}

// When the div is released, make its background dark color red again.
function letGo(attachedElement) {
    attachedElement.style.backgroundColor = "rgba(255,0,0,.5)";
	attachedElement.style.zIndex = 0; // make the z-index normal again
}

// Log that the div was dropped and change color
function do_drop(e, attachedElement) {
    log("do drop: " + e.clientX + ", " + e.clientY);
    letGo(attachedElement);
}

// When mouse moves outside of region, log this.
function move_out(e, attachedElement) {
    log("move out: " + e.clientX + ", " + e.clientY);
    letGo(attachedElement);
}

// Moves the icon when the mouse moves.
function move_icon(e, attachedElement) {
    log("move icon: " + e.clientX + ", " + e.clientY);
    attachedElement.style.left = (attachedElement.origLeft + (e.clientX - attachedElement.downX)) + "px";
    attachedElement.style.top = (attachedElement.origTop + (e.clientY - attachedElement.downY)) + "px";
}

// simple logging toggle. Annoying when console logging is on when not needed
// because it slows down the application if the console is in view
function log(message){
	var logging = false;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
    var myRedDiv = document.getElementById("myRedDiv");
	var myRedDiv2 = document.getElementById("myRedDiv2");
	
	var drag_and_drop = {
		states: [
		{
			name: "start",
			transitions: [
				{
					input: "mouseDown", 
					action: record_down_location,
					endState: "down"
				}]
		},
		{
			name: "down",
			transitions: [
				{
					input: "mouseUp",
					action: do_drop,
					endState: "start"
				},
				{
					input: "mouseMove",
					action: move_icon,
					endState: "down"
				},
				{
					input: "mouseOut",
					action: move_out,
					endState: "start"
				}
			]
		}
		]
	};

   
	// attach the two state machines to the two divs
	var stateMachineRed = new StateMachine(drag_and_drop, myRedDiv);
	var stateMachineRed2 = new StateMachine(drag_and_drop, myRedDiv2);
};
