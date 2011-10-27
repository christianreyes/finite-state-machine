// Sample test file for the state machine class
// Implements a simple draggable div which changes color when pressed.

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
	
	$("#folder_title").text($("#icon1 > span").text());
	$('#folder').css("display", "inline-block");
	
	if(typeof($('#folder').stateMachine) == "undefined"){
		new StateMachine(_folder_definition, folder);
	}
}

function open_canvas(e, attachedElement) {
	log("open_canvas");
	
	var folder = document.createElement("canvas");
	folder.id = "canvas";
	$(folder).addClass("canvas");
	$(folder).addClass("hover_border");
	
	$('body').append(folder);
	new StateMachine(_folder_definition, folder);
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
   
	//var smDoubleClick = new StateMachine(open_folder_definition, folder);
	new StateMachine(_folder_icon_definition, folder_icon);
	new StateMachine(_draw_icon_definition, draw_icon);
	
};
