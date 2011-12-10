// first version of state machine

var _current_state = "";

function StateMachine(description, elementToAttach) {
	var sm = {
		description: description,
		elementToAttach: elementToAttach,
		evalState: function(e){
			for(var i=0; i<description.states.length;i++){
				var state = description[i];
				
				if(_current_state == state.name){
					for(var j=0;j<state.transitions.length;j++){
						var transition = state.transitions[j];
						
						if(triggerEvent.type == transition.input){
							transition.action(e, elementToAttach);
							
							_current_state = transition.endState;
						}						
					}
					
				}
			}
		}
	};
	
	for(var i=0;i<description.states.length;i++){
		var state = description[i];
		for(var j=0;j<state.transitions.length;i++){
			var transition = state.transitions[j];
			elementToAttach.addEventListener(transition.input.toLowerCase(), sm.evalState, false);
		}
	}
	
	return sm;
}


