// Sample test file for the state machine class
// Implements a simple draggable div which changes color when pressed.

var _title_container;
var _doodle;

var _rubber_band_definition = {
	states: [
	{
		name: "start",
		transitions: [
			{
				input: "click", 
				action: create_p1,
				endState: "move"
			}]
	},
	{
		name: "move",
		transitions: [
			{
				input: "mouseMove",
				action: create_p2,
				endState: "move"
			},
			{
				input: "click",
				action: change_cursor_create_p2,
				endState: "start"
			}
		]
	}
	]
};

var _folder_icon_definition = {
	states: [
	{
		name: "start",
		transitions: [
			{
				input: "mouseDown", 
				action: record_down_location,
				endState: "down"
			},
			{
				input: "doubleClick", 
				action: open_folder,
				endState: "start"
			}]
	},
	{
		name: "down",
		transitions: [
			{
				input: "mouseUp",
				action: do_drop,
				endState: "start"
			},
			{
				input: "mouseMove",
				action: move_item,
				endState: "down"
			},
			{
				input: "mouseOut",
				action: move_out,
				endState: "start"
			}
		]
	}
	]
};

var _draw_icon_definition = {
	states: [
	{
		name: "start",
		transitions: [
			{
				input: "mouseDown", 
				action: record_down_location,
				endState: "down"
			},
			{
				input: "doubleClick", 
				action: open_canvas,
				endState: "start"
			}]
	},
	{
		name: "down",
		transitions: [
			{
				input: "mouseUp",
				action: do_drop,
				endState: "start"
			},
			{
				input: "mouseMove",
				action: move_item,
				endState: "down"
			},
			{
				input: "mouseOut",
				action: move_out,
				endState: "start"
			}
		]
	}
	]
};

var _folder_definition = {
	states: [
	{
		name: "start",
		transitions: [
			{
				input: "mouseDown", 
				action: record_down_location,
				endState: "down"
			},
			{
				input: "doubleClick", 
				action: hide_folder,
				endState: "start"
			}
			]
	},
	{
		name: "down",
		transitions: [
			
			{
				input: "mouseUp",
				action: do_drop,
				endState: "start"
			},
			{
				input: "mouseMove",
				action: move_item,
				endState: "down"
			},
			{
				input: "mouseOut",
				action: move_out,
				endState: "start"
			}
		]
	}
	]
};

// Record the location where the div was clicked.
function record_down_location(e, attachedElement) {
	log("record down");
    attachedElement.downX = e.clientX;
    attachedElement.downY = e.clientY;
	
	position = $(attachedElement).position();
    attachedElement.origLeft = position.left;
    attachedElement.origTop = position.top;
	$(attachedElement).toggleClass("hover_border");
	$(attachedElement).toggleClass("dragging");
}

// When the div is released, make its background color red again.
function letGo(attachedElement) {
	log("let go");
	$(attachedElement).toggleClass("hover_border");
  	$(attachedElement).toggleClass("dragging");
}

// Log that the div was dropped and change color
function do_drop(e, attachedElement) {
	log("do_drop");
    letGo(attachedElement);
}

function copy_folder(e, attachedElement) {
	log("copying " + e.relatedTarget);
	if(!$(e.relatedTarget).is("html")){
		$(e.relatedTarget).remove();
	}
}

function prompt(e,attachedElement){
	log("just draggeed into");
}

// When mouse moves outside of region, log this.
function move_out(e, attachedElement) {
	log("move_out");
    letGo(attachedElement);
}

// Moves the icon when the mouse moves.
function move_item(e, attachedElement) {
	attachedElement.style.left = (attachedElement.origLeft + (e.clientX - attachedElement.downX)) + "px";
    attachedElement.style.top = (attachedElement.origTop + (e.clientY - attachedElement.downY)) + "px";
}

function hide_folder(e, attachedElement){
	$('#folder').css("display", "none");
	
}

// 
function open_folder(e, attachedElement) {
	log("open_folder");
	
	var folder = document.getElementById("folder");
	
	$('#folder').css("display", "inline-block");
	
	if(typeof($('#folder').stateMachine) == "undefined"){
		new StateMachine(_folder_definition, folder);
	}
}

function open_canvas(e, attachedElement) {
	log("open_canvas");
	
	var window = document.getElementById("window");
	
	$('#window').css("display", "inline-block");
	
	if(typeof($('#window').stateMachine) == "undefined"){
		new StateMachine(_rubber_band_definition, window);
	}
}

// called to convert the span to a editable textbox
function convertToTextbox(e, attachedElement){
	log("convertotextbox");
	e.stopPropagation();
	
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

function create_p1(e, attachedElement) {
	log("create p1");
	
	// create the initial line. P2=P1. offset is exactly where mouse is pointing
	var line = new Line({
		startX: e.offsetX,
		startY: e.offsetY,
		endX: e.offsetX,
		endY: e.offsetY,
		lineWidth: 2
	});
	
	// give feedback to the user as to what is happening
	attachedElement.style.cursor = "crosshair";
	
	// add the line to the canvas and draw it.
	_doodle.children = [line];
	cavas_clear(attachedElement);
	_doodle.draw();
}

// When the div is released, make its background color red again.
function create_p2(e, attachedElement) {
	log("create_p2");
		
	// if there is a line, move P2 to where the mouse is
	if(_doodle.children.length > 0){
		// grab the line
		var line = _doodle.children[0];
		
		// move endpoints to exactly where the mouse pointer is pointing to
		line.endX = e.offsetX;
		line.endY = e.offsetY;
		
		// clear the canvas and draw again
		cavas_clear(attachedElement);
		_doodle.draw();
	}
}

// change cursor back to default and then draw p2 as normal
function change_cursor_create_p2(e, attachedElement){
	attachedElement.style.cursor = "default";
	create_p2(e,attachedElement);
}

// clear the canvas
function cavas_clear(canvas){
	_doodle.context.clearRect(0,0,560,360);
}

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

function log(message){
	var logging = true;
	if(logging){
		console.log(message);
	}
}

// Provides the state machine description and creates a new state machine attached to myDiv
window.onload = function() {
	var folder_icon = document.getElementById("icon1");
	var draw_icon = document.getElementById("icon2");
   
	//get the canvas
	var canvas = document.getElementById("myCanvas");
	
	// create a doodle
	_doodle = new Doodle(canvas);

	//var smDoubleClick = new StateMachine(open_folder_definition, folder);
	new StateMachine(_folder_icon_definition, folder_icon);
	new StateMachine(_draw_icon_definition, draw_icon);
	
	
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
