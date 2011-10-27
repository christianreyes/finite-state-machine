/*
Interaction of double clicking a folder / icon's label to rename. 
New name (limited to 14 characters) is finalized when user clicks 
outside the icon or presses enter. StateMachine is "attached" to multiple
elements by being attached to a div serving as a container. Events bubble 
up from inside the container to the StateMachine attached.
*/

var _title_container;

function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// called to convert the span to a editable textbox
function convertToTextbox(e, attachedElement){
	log("convertotextbox");
	
	// grab the information from the span and put it in textbox
	// reveal the textbox
	$(_title_container.textbox).val($('#title').text());
	$(_title_container.textbox).originalVal = $('#title').text();
	$(_title_container.span).css("display", "none");
	$(_title_container.form_textbox).removeClass("hidden_textbox");
	$(_title_container.form_textbox).addClass("visible_textbox");
	$(_title_container.textbox).focus();
	
}

function detectEnter(e, attachedElement){
	log("changeWidth");
	
	// enter key was pressed
	if(e.keyCode == 13){
		// stop the enter key from continuing
		e.returnValue = false;
		// convert to span as expected
		convertToSpan(e, attachedElement);
	}
}

function convertToSpan(e, attachedElement){
	log("convertospan");

	// do not allow a blank to be saved for the name
	if( $(_title_container.textbox).val() == ""){
		$(_title_container.span).text($(_title_container.textbox).originalVal);
	} else {
		$(_title_container.span).text($('#textbox').val());
	}

	// toggle visibility
	$(_title_container.span).css("display", "");
	$(_title_container.form_textbox).removeClass("visible_textbox");
	$(_title_container.form_textbox).addClass("hidden_textbox");
}

// Provides the state machine description and creates a new state machine attached to icon
window.onload = function() {
	_title_container = document.getElementById("title_container");
	_title_container.span = document.getElementById("title");
	_title_container.form_textbox = document.getElementById("form_textbox");
	_title_container.textbox = document.getElementById("textbox");
	
	var change_textbox_definition = {
		states: [
		{
			name: "start",
			transitions: [
				{
					input: "doubleClick", 
					action: convertToTextbox,
					endState: "textbox"
				}]
		},
		{
			name: "textbox",
			transitions: [
				{
					input: "keyPress",
					action: detectEnter,
					endState: "textbox"
				},
				{
					input: "onBlur",
					action: convertToSpan,
					endState: "start"
				}
			]
		}
		]
	};
	
	// make the StateMachine
	new StateMachine(change_textbox_definition, title_container);
};
