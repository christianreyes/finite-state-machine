// Sample test file for the state machine class
// Implements a CPU activity monitor using a probabalistic state machine

// simulate low usage
function poll_activity_low(e, attachedElement){
	poll_activity(e, attachedElement, "low");
}

// simulate medium usage
function poll_activity_medium(e, attachedElement){
	poll_activity(e, attachedElement, "medium")
}

// simulate high usage
function poll_activity_high(e, attachedElement){
	poll_activity(e, attachedElement, "high")
}

// set random usage within bounds set by level. Update graph
function poll_activity(e, attachedElement, level){
	log("poll activity: " + level);
	
	var activity_level;
	switch(level){
		case "low":
			activity_level = Math.random() * .3
			break;
		case "medium":
			activity_level = .3 + Math.random() * .6
			break;
		case "high":
			activity_level = .9 + Math.random() * .1
			break;
	}
	
	// update graph
	$("#graph").css("height", Math.floor(activity_level * 155) + "px"); 
	$("#percent").text(Math.floor(activity_level * 100) + "%");
}

// simple logging function
function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
	var activity = document.getElementById("activity");
	
	// probabalistic finite state machine definition
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
   
	// create the StateMachine
	new StateMachine(activity_definition, activity);
};
