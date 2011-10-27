// Starter code for Project 3 of SSUI Web Lab
// author: Julia Schwarz

// Your task is to fill in the rest of this file with your state machine, and then save
// the file to statemachine.js.

function StateMachine(description, elementToAttach){
	this.current_state = description.states[0].name;		// first state in the list
	this.stateTable = this.descriptionToTable(description);	// convert the definition to table format
	this.inputs = {};
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
	log("update state: " + e);		
	// retrieve the transition for the current state with the input event that just occurred
	var transitions;
	var inputLookup;

	if( typeof(e) == "object") {
		inputLookup = e.type;
	} else {
		inputLookup = e;
	}
	
	transitions = this.stateTable[this.current_state][inputLookup];
	
	// execute the transition action and change the current state if there is a transition 
	// for the current state based on the the input event
	
	if(typeof(transitions) != "undefined"){
	
		var tlength = transitions.length;
		if(tlength == 1){
			var transition = transitions[0];
			if(typeof(transition) != "undefined"){
				transition.action(e, this.element);
				this.current_state = transition.endState;
			}
		
		} else {
		
			var probNum = Math.random();
			var totalProb = 0;
			for(var i = 0; i < tlength; i++){
				var transition = transitions[i];

				if(typeof(transition.probability) != "undefined"){
					totalProb += transition.probability;
					if(probNum <= totalProb){
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
	
	for(var s in description.states){
		var state = description.states[s];
		
		if(typeof(table[state.name]) == "undefined"){
			table[state.name] = {};
		} 
	
		for(var t in state.transitions){
			var transition = state.transitions[t];
			var input_name;
			
			if(this.standardEvent(transition.input)){
				input_name = this.standardEventLookup[transition.input];
			} else {
				input_name = transition.input;
			}
			
			var newTransition = {
				action: transition.action,
				endState: transition.endState,
				probability: transition.probability
			};
				
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
	if( typeof(this.inputs[transitionInput]) == "undefined" ){
		this.inputs[transitionInput] = transitionInput;
		if( this.standardEvent(transitionInput) ) {
			this.element.addEventListener(this.standardEventLookup[transitionInput], function(e){ this.stateMachine.updateState(e); }, true);
		} else {
			var matchData = transitionInput.match(/timerTick(\d+)Ms/);
			var ms = matchData[1];
		
			if(! timer_created.value){
				sm = this;
				setInterval( function(){ sm.updateState(transitionInput); }, ms );
				timer_created.value = true;
			}
		}
	}
};

StateMachine.prototype.standardEventLookup = {
	mouseDown: "mousedown",
	mouseUp: "mouseup",
	click: "click",
	mouseMove: "mousemove",
	mouseIn: "mouseover",
	mouseOut: "mouseout",
	keyPress: "keypress",
	doubleClick: "dblclick",
	onBlur: "blur"
};

StateMachine.prototype.standardEvent = function(transitionInput){
	return typeof(this.standardEventLookup[transitionInput]) != "undefined";
};
