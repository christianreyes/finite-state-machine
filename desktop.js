// Sample test file for the state machine class
// Implements a simple draggable div which changes color when pressed.

// Record the location where the div was clicked.
function record_down_location(e, attachedElement) {
    attachedElement.downX = e.clientX;
    attachedElement.downY = e.clientY;
    attachedElement.origLeft = parseInt(attachedElement.style.left) || 0;
    attachedElement.origTop = parseInt(attachedElement.style.top) || 0;
	$(attachedElement).toggleClass("hover_border");
	$(attachedElement).toggleClass("dragging");
}

// When the div is released, make its background color red again.
function letGo(attachedElement) {
	$(attachedElement).toggleClass("hover_border");
  	$(attachedElement).toggleClass("dragging");
}

// Log that the div was dropped and change color
function do_drop(e, attachedElement) {
    letGo(attachedElement);
}

// When mouse moves outside of region, log this.
function move_out(e, attachedElement) {
    letGo(attachedElement);
}

// Moves the icon when the mouse moves.
function move_icon(e, attachedElement) {
    attachedElement.style.left = (attachedElement.origLeft + (e.clientX - attachedElement.downX)) + "px";
    attachedElement.style.top = (attachedElement.origTop + (e.clientY - attachedElement.downY)) + "px";
}


// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
    var folder = document.getElementById("folder");
	
	var drag = {
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

   

	var smIcon = new StateMachine(drag, folder);
};
