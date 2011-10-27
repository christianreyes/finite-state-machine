// Sample test file for the state machine class
// Implements a set of street lights changing

// change the color when the timer ticks
function changeColor(e, attachedElement) {
	var north = document.getElementById("north");  
	var south = document.getElementById("south");  
	var east = document.getElementById("east");  
	var west = document.getElementById("west");  
	
	if(north.style.backgroundColor == "red"){
		north.style.backgroundColor = "green";
		south.style.backgroundColor = "green";
		east.style.backgroundColor = "red";
		west.style.backgroundColor = "red";
	} else {
		north.style.backgroundColor = "red";
		south.style.backgroundColor = "red";
		east.style.backgroundColor = "green";
		west.style.backgroundColor = "green";
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
    var container = document.getElementById("light_container");    
	
	var sampleDescription = {
		states: [
		{
			name: "north_south_green",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: changeColor,
					endState: "east_west_green"
				}]
		},
		{
			name: "east_west_green",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: changeColor,
					endState: "north_south_green"
				}]
		}
		]
	};

	// create the state machine
	var stateMachineRed = new StateMachine(sampleDescription, container);
};
