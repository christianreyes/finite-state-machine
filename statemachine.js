/*
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
Title:			Project 3: Finite State Machines
Author : 		Christian Reyes 
Description:    statemachine.js the core implementation of a FSM
Course:         05-433D SSUI Web Lab
Created : 		15 Oct 2011
Modified : 		26 Oct 2011
- - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

function StateMachine(description, elementToAttach){
	this.current_state = description.states[0].name;		// first state in the list
	this.stateTable = this.descriptionToTable(description);	// convert the definition to table format
	this.inputs = {};										// map out the inputs to transitions
	this.element = elementToAttach;							// store which element it is attached to
	this.element.stateMachine = this;						// store this statemachine in the attached element

	var timer_created = { value: false };					// value set to true when time is created to avoid
															// duplicate timers
	
	// for each transition (in each state) add a state machine event lister
	
	for(var s in description.states) {
		var state = description.states[s];
		
		for(var t in state.transitions) {
			var transition = state.transitions[t];
			this.addStateMachineEventListener(transition.input, timer_created);
		}	// all the event handlers point to updateState for interception	
	}
}

StateMachine.prototype.updateState = function(e){		
	log("update state: " + e.type);		
	// retrieve the transition for the current state with the input event that just occurred
	var transitions;
	var inputLookup;

	// if e is an actual event, we store the event type. Otherwise we just store e as a string
	if( typeof(e) == "object") {
		inputLookup = e.type;
	} else {
		inputLookup = e;
	}
	
	// find the transitions for the current state and input (multiple transitions can 
	// have same input due to probabalistic finite state machine implementation)
	
	transitions = this.stateTable[this.current_state][inputLookup];
	
	// proceed if there is a transition for the combo of state and input event
	
	if(typeof(transitions) != "undefined"){
		
		// store length of transitions for speed increase
		var tlength = transitions.length;
		if(tlength == 1){
			// if only one transition for that input, execute it then change current state
			var transition = transitions[0];
			if(typeof(transition) != "undefined"){
				transition.action(e, this.element);
				this.current_state = transition.endState;
			}
		
		} else {
			// multiple transitions for same input. probabalistic implementation.
			// randomly pick which transition to execute based on probability then change current state
			
			var probNum = Math.random();
			var totalProb = 0;
			for(var i = 0; i < tlength; i++){
				var transition = transitions[i];

				if(typeof(transition.probability) != "undefined"){
					
					// keep adding the probabilities until the sum is greater than the "random" number
					totalProb += transition.probability;
					if(probNum <= totalProb){
						// "randomly" determined. Execute this transition.
						transition.action(e, this.element);
						this.current_state = transition.endState;
						break;
					} 
				}
			}
		
		}
	}
};

StateMachine.prototype.descriptionToTable = function(description){
	var table = {};
	
	// for every transition in every state, map it to the state table.
	// state table has current state as a dimension and input as a dimension
	// inside each cell is an array of the transitions for the combination of
	// state and input. each transition has action, endState, and probability (will
	// be undefined if no probability is needed)
	
	for(var s in description.states){
		var state = description.states[s];
		
		if(typeof(table[state.name]) == "undefined"){
			table[state.name] = {};
		} 
	
		for(var t in state.transitions){
			var transition = state.transitions[t];
			var input_name;
			
			// lookup how the event is stored if "standard event"
			if(this.standardEvent(transition.input)){
				input_name = this.standardEventLookup[transition.input];
			} else {
				input_name = transition.input;
			}
			
			// prep transition to be stored
			var newTransition = {
				action: transition.action,
				endState: transition.endState,
				probability: transition.probability
			};
			
			// store the transition. make array if doesn't exist. Push if it does.	
			if( typeof(table[state.name][input_name]) == "undefined"){
				table[state.name][input_name] = [newTransition];
			} else {
				table[state.name][input_name].push(newTransition);
			}						
		}
			
	}
	
	return table;
};

StateMachine.prototype.addStateMachineEventListener = function(transitionInput, timer_created){	
	// if the input already has been processed and has an eventlistener. Do not proceed.
	if( typeof(this.inputs[transitionInput]) == "undefined" ){
		// mark the input as having an eventlistener
		this.inputs[transitionInput] = transitionInput;
		if( this.standardEvent(transitionInput) ) {
			// point the eventlistener for the input to the statemachine updateState function for interception.
			this.element.addEventListener(this.standardEventLookup[transitionInput], function(e){ this.stateMachine.updateState(e); }, true);
		} else {
			// parse out the Ms from the timer input using regular expressions
			var matchData = transitionInput.match(/timerTick(\d+)Ms/);
			var ms = matchData[1];
		
			if(! timer_created.value){
				sm = this;
				// create a timer that runs in the background and calls the statemachine's updatestate
				setInterval( function(){ sm.updateState(transitionInput); }, ms );
				timer_created.value = true;
			}
		}
	}
};

// "standard DOM events"
StateMachine.prototype.standardEventLookup = {
	mouseDown: "mousedown",		// mouse has pressed on element
	mouseUp: "mouseup",			// mouse has been released on element
	click: "click",				// mouse has been pressed and released on element
	mouseMove: "mousemove",		// mouse has moved over element
	mouseIn: "mouseover",		// mouse has come over an element FROM a different one
	mouseOut: "mouseout",		// mouse has left the element
	keyPress: "keypress",		// key was pressed 
	doubleClick: "dblclick",	// mouse has doubleclicked on element
	onBlur: "blur"				// element has lost focus
};

// boolean. return if the input is a "standard" event
StateMachine.prototype.standardEvent = function(transitionInput){
	return typeof(this.standardEventLookup[transitionInput]) != "undefined";
};
