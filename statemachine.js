// Starter code for Project 3 of SSUI Web Lab
// author: Julia Schwarz

// Your task is to fill in the rest of this file with your state machine, and then save
// the file to statemachine.js.

function StateMachine(description, elementToAttach){
	this.current_state = description.states[0].name;		// first state in the list
	this.stateTable = this.descriptionToTable(description);	// convert the definition to table format
	this.element = elementToAttach;
	this.element.stateMachine = this;

	var timer_created = { value: false };
	
	for(var s in description.states) {
		var state = description.states[s];
		
		for(var t in state.transitions) {
			var transition = state.transitions[t];
			this.addStateMachineEventListener(transition.input, timer_created);
		}	// all the event handlers point to updateState		
	}
}

StateMachine.prototype.updateState = function(e){		
	//console.log("update state: " + e.type);		
	// retrieve the transition for the current state with the input event that just occurred
	var transition;
	
	if( typeof(e) == "object") {
		transition = this.stateTable[this.current_state][e.type]; 
	} else {
		transition = this.stateTable[this.current_state][e]; 
	}
	
	// execute the transition action and change the current state if there is a transition 
	// for the current state based on the the input event
	if(typeof(transition) != "undefined"){
		transition.action(e, this.element);
		this.current_state = transition.endState;
	}
};

StateMachine.prototype.descriptionToTable = function(description){
	var table = {};
	
	for(var s in description.states){
		var state = description.states[s];
		
		if(typeof(table[state.name]) == "undefined"){
			table[state.name] = {};
		} 
	
		for(var t in state.transitions){
			var transition = state.transitions[t];
			
			table[state.name][this.standardEventLookup[transition.input]] = {
				action: transition.action,
				endState: transition.endState
			};						
		}
			
	}
	
	return table;
};

StateMachine.prototype.addStateMachineEventListener = function(transitionInput, timer_created){	
	if( this.standardEvent(transitionInput) ) {
		this.element.addEventListener(this.standardEventLookup[transitionInput], function(e){ this.stateMachine.updateState(e); }, false);
	} else {
		var matchData = transitionInput.match(/timerTick(\d+)Ms/);
		var ms = matchData[1];
		
		if(! timer_created.value){
			sm = this;
			setInterval( function(){ sm.updateState(transitionInput.toLowerCase()); }, ms );
			timer_created.value = true;
		}
	}
};

StateMachine.prototype.standardEventLookup = {
	mouseDown: "mousedown",
	mouseUp: "mouseup",
	click: "click",
	mouseMove: "mousemove",
	mouseIn: "mousein",
	mouseOut: "mouseout",
	keyPress: "keypressdown",
	doubleClick: "dblclick"
};

StateMachine.prototype.standardEvent = function(transitionInput){
	return typeof(this.standardEventLookup[transitionInput]) != "undefined";
};
