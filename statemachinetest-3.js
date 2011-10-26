var _title_container;

function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

function convertToTextbox(e, attachedElement){
	log("convertotextbox");
	
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
		e.returnValue = false;
		convertToSpan(e, attachedElement);
	}
}

function convertToSpan(e, attachedElement){
	log("convertospan");

	if( $(_title_container.textbox).val() == ""){
		$(_title_container.span).text($(_title_container.textbox).originalVal);
	} else {
		$(_title_container.span).text($('#textbox').val());
	}
	
	$(_title_container.span).css("display", "");
	$(_title_container.form_textbox).removeClass("visible_textbox");
	$(_title_container.form_textbox).addClass("hidden_textbox");
}

// Provides the state machine description and creates a new state machine attached to myDiv
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
	
	new StateMachine(change_textbox_definition, title_container);
};
