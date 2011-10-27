// Sample test file for the state machine class
// Implements a simple draggable div which changes color when pressed.

function poll_activity_low(e, attachedElement){
	poll_activity(e, attachedElement, "low");
}

function poll_activity_medium(e, attachedElement){
	poll_activity(e, attachedElement, "medium")
}

function poll_activity_high(e, attachedElement){
	poll_activity(e, attachedElement, "high")
}

function poll_activity(e, attachedElement, level){
	log("poll activity: " + level);
}

function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
	var activity = document.getElementById("activity");
	
	var activity_definition = {
		states: [
		{
			name: "start",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: poll_activity_low,
					endState: "low",
					probability: .5
				},
				{
					input: "timerTick1000Ms", 
					action: poll_activity_medium,
					endState: "medium",
					probability: .25
				},
				{
					input: "timerTick1000Ms", 
					action: poll_activity_high,
					endState: "high",
					probability: .25
				}]
		},
		{
			name: "low",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: poll_activity_low,
					endState: "start"
				}]
		},
		{
			name: "medium",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: poll_activity_medium,
					endState: "start"
				}]
		},
		{
			name: "high",
			transitions: [
				{
					input: "timerTick1000Ms", 
					action: poll_activity_high,
					endState: "start"
				}]
		}
		]
	};
   
	new StateMachine(activity_definition, activity);
};
