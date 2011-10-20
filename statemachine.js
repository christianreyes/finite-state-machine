// Starter code for Project 3 of SSUI Web Lab
// author: Julia Schwarz

// Your task is to fill in the rest of this file with your state machine, and then save
// the file to statemachine.js.

function StateMachine(description, elementToAttach) {
		
	var sm = {
		current_state: description.states[0].name,
		updateState: function(e){
			for(var i=0; i<description.states.length;i++){
				var state = description.states[i];
				
				if(this.current_state == state.name){
					for(var j=0;j<state.transitions.length;j++){
						var transition = state.transitions[j];
						
						// example: event type of mousedown event is "mousedown"
						if(e.type == transition.input.toLowerCase()){
							transition.action(e, elementToAttach);
							this.current_state = transition.endState;
						}						
					}
					
				}
			}
		}
	};
	
	// Create event handlers for intercepting all the events targets in transitions
	// pass the event on to evalState
	
	for(var i=0;i<description.states.length;i++){
		var state = description.states[i];
		for(var j=0;j<state.transitions.length;j++){
			var transition = state.transitions[j];
			elementToAttach.addEventListener(transition.input.toLowerCase(), function(e){ sm.updateState(e); }, false);
		}
	}
	
	return sm;
}

function StateMachineTable(description, elementToAttach) {
	var sm = {
		current_state: description.states[0].name,		// first state in the list
		stateTable: descriptionToTable(description),	// convert the definition to table format
		updateState: function(e){
			// retrieve the transition for the current state with the input event that just occurred
			var transition = this.stateTable[this.current_state][e.type]; 
			
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
	
	for(var s in description.states) {
		var state = description.states[s];
		
		for(var t in state.transitions) {
			var transition = state.transitions[t];
							
			elementToAttach.addEventListener(transition.input.toLowerCase(), function(e){ sm.updateState(e); }, false);
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