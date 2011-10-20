// Starter code for Project 3 of SSUI Web Lab
// author: Julia Schwarz

// Your task is to fill in the rest of this file with your state machine, and then save
// the file to statemachine.js.

function StateMachine(description, elementToAttach) {
	var sm = {
		current_state: description.states[0].name,		// first state in the list
		stateTable: descriptionToTable(description),	// convert the definition to table format
		updateState: function(e){
						
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
				transition.action(e, elementToAttach);
				this.current_state = transition.endState;
			}
		}
	};
	
	// Create event handlers for intercepting all the events targets in transitions
	// pass the event on to updateState
	
	var timer_created = { value: false };
	
	for(var s in description.states) {
		var state = description.states[s];
		
		for(var t in state.transitions) {
			var transition = state.transitions[t];
			addStateMachineEventListener(sm, elementToAttach, transition.input, timer_created);
		}	// all the event handlers point to updateState		
	}
	
	return sm;
}

function descriptionToTable(description){
	var table = {};
	
	for(var s in description.states){
		var state = description.states[s];
		
		if(typeof(table[state.name]) == "undefined"){
			table[state.name] = {};
		} 
	
		for(var t in state.transitions){
			var transition = state.transitions[t];
			
			table[state.name][transition.input.toLowerCase()] = {
				action: transition.action,
				endState: transition.endState
			};						
		}
			
	}
	
	return table;
}

function addStateMachineEventListener(sm, elementToAttach, transitionInput, timer_created){
	var matchData = transitionInput.match(/timerTick(\d+)Ms/);
	
	if(matchData == null){
		elementToAttach.addEventListener(transitionInput.toLowerCase(), function(e){ sm.updateState(e); }, false);
	} else {
		var ms = matchData[1];
		
		if(! timer_created.value){
			setInterval( function(){ sm.updateState(transitionInput.toLowerCase()); }, ms );
			timer_created.value = true;
		}
	}
}