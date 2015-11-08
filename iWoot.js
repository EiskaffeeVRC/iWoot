// Name and Version
var NAME = "iWoot";
var VERSION = "v1.0.0";

// Identifiers for the HTML parts
var wootButton;
var mehButton;
var iWootButton;
var iWootGui;
var autoDubUpButton;
var noChatLimitButton;
var commandBox;

String.prototype.replaceAll = function(token, newToken) {
	var str = this;
	var index = str.indexOf(token);
	
	while(index != -1) {
		str = str.replace(token, newToken);
		index = str.indexOf(token);
	}
return str;
};

API = {
	chatLog: function(String){Dubtrack.room.chat._messagesEl.append("<li id='chatlog'><b>" + String + "<b></li>");}, //MikuPlugin
	sendChat: function(String){
		$("#chat-txt-message").val(String);
		Dubtrack.room.chat.sendMessage();
	}, // MikuPlugin
	setVolume: function(Value){Dubtrack.playerController.setVolume(Value);},
	CHAT: "realtime:chat-message",
	ADVANCE: "realtime:room_playlist-update",
	on: function(Event, Function){Dubtrack.Events.bind(Event, Function);},
	off: function(Event, Function){Dubtrack.Events.unbind(Event, Function);}
};

// Main things
IWoot = {
	iWoot: NAME + " " + VERSION,
	log: function(String){console.log(String);},
	isAutoWoot: true,
	isNoChatLimit: true,
	isGUIHidden: true,
};

// Just easier for me to use this, plus it reminds me of Java's Color class
Color = {
	RED: "#FF0000",
	ORANGE: "#FF6600",
	YELLOW:	"#FFFF00",
	GREEN: "#00FF00",
	BLUE: "#0000FF",
	PURPLE: "#FF00FF",
	BLACK: "#000000",
	WHITE: "#FFFFFF",
	CYAN: "#00FFFF",
	GREEN_YELLOW: "#99CC00",
	DARK_PURPLE: "#660066"
};

// Whats a plugin without a GUI?
function loadGUI() {
	var mainGUIStyle = "#iwoot-gui-main{opacity:0.8;z-index:99999;display:none;position:fixed;width:300px;height:100%;text-align:left;background-color:" + Color.DARK_PURPLE + ";color:" + Color.CYAN + ";padding:0.5em;border-radius:5px;border:1px solid gray;}";
	var autoDubUpStyle = "#iwoot-autodubup{color:" + Color.GREEN + ";}";
	var noChatLimitStyle = "#iwoot-chatlimit{color:" + Color.GREEN + ";}";
	var commandBoxStyle = "#iwoot-commandbox{color:" + Color.GREEN + ";border:1px solid" + Color.GREEN + ";background:" + Color.BLACK + "}";
	var chatLogStyle = "#chatlog{font-size:0.75em;color:" + Color.GREEN_YELLOW + "}";
	var iWootToggleStyle = ".iwoot-toggle{cursor:pointer;font-weight:bold;}";
	
	var mainGUIStyles = "<style>" + mainGUIStyle + autoDubUpStyle + noChatLimitStyle + commandBoxStyle + chatLogStyle + iWootToggleStyle + "</style>";
		
	$("body").append(mainGUIStyles);
	
	$(".header-left-navigation").append('<a class="navigate room-active-link active-room" id="main-room-active-link"><span class="icon-chevron"></span><span class="room-name" id="iwoot-gui-options">iWoot</span></a>');
	$('<div id="iwoot-gui-main"></div>').insertBefore($("#main-section"));
	$("#iwoot-gui-main").append('<div style="font-size:0.75em;opacity:1.0;"><span id="iwoot-gui"></span></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-autodubup" class="iwoot-toggle">AutoDupUp</span></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-chatlimit" class="iwoot-toggle">No Chat Limit</span></div>');
	$("#iwoot-gui").append('<div><input id="iwoot-commandbox" class="iwoot-toggle" placeholder="Command Box (ex: /help)"></div>');
	$("#iwoot-gui").append('<div><b>iWoot v1.0.0 User Commands:</b></div>');
	$("#iwoot-gui").append('<div><b>/volume {VALUE} - Sets the volume to {VALUE} (0-100)</b></div>');
	$("#iwoot-gui").append('<div><b>/emojis - Sends a link to an "Emoji" list</b></div>');
	$("#iwoot-gui").append('<div><b>/share - Shares a link in chat to iWoot! <3</b></div>');
	$("#iwoot-gui").append('<div><h1 id="iwoot-currentDJ"></h1></div>')
		
	IWoot.log("GUI Contents Loaded!");
}

// No use in the GUI if it does nothing...
function loadListeners() {
	$("#iwoot-gui-options").click(function() {
		if(!IWoot.isGUIHidden == false) {
			$("#iwoot-gui-main").show(500);
			document.getElementById("iwoot-gui-main").style.display = "block";
			IWoot.isGUIHidden = false;
		} else {
			$("#iwoot-gui-main").hide("slow");
			IWoot.isGUIHidden = true;
		}
	});
		
	$("#iwoot-autodubup").click(function() {
		if(!IWoot.isAutoWoot == true) {
			IWoot.isAutoWoot = true;
			autoDubUpButton.style.color = Color.GREEN;
			autoDubUp();
		} else {
			IWoot.isAutoWoot = false;
			autoDubUpButton.style.color = Color.RED;
		}
	});
	
	$("#iwoot-chatlimit").click(function() {
		if(!IWoot.isNoChatLimit) {
			IWoot.isNoChatLimit = true;
			noChatLimitButton.style.color = Color.GREEN;
			document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
		} else {
			IWoot.isNoChatLimit = false;
			noChatLimitButton.style.color = Color.RED;
			document.getElementById("chat-txt-message").maxLength = 140;
		}
	});
	
	IWoot.log("GUI Listeners Loaded!");
}

function checkForEmotes() {
	// https://i.imgur.com/U8PrnfU.gif :hug:
	// ( ͡° ͜ʖ ͡°) :lennyface:
	
	var tempString = Dubtrack.room.chat._messagesEl[0].innerHTML;
	
	if(tempString.includes(":hug:")) {
		Dubtrack.room.chat._messagesEl[0].innerHTML = tempString.replaceAll(":hug:", '<img class="emoji" src="https://i.imgur.com/U8PrnfU.gif"></img>', true);
	}
	if(tempString.includes(":lennyface:")) {
		Dubtrack.room.chat._messagesEl[0].innerHTML = tempString.replaceAll(":lennyface:", '( ͡° ͜ʖ ͡°)', true);
	}
}

function commandListener(event) {
	keyCode = event.keyCode;
	
	command = commandBox.value;
	
	if(keyCode == 13) {
		if(command.startsWith("/")) {
			if(command.startsWith("/volume")) {
				var VOLUME = command.replace(" ", "").substring(7);
				API.setVolume(parseInt(command.substring(8)));
				Dubtrack.room.chat.chatSound.play();
			}
			if(command === "/emojis") {
				API.chatLog("Emoji Cheat Sheet - <a href='http://www.emoji-cheat-sheet.com/' target='_blank'>(Click me)</a>");
				Dubtrack.room.chat.chatSound.play();
			}
			if(command === "/share") {
				API.sendChat("Get iWoot here! http://xxskhxx.comoj.com/tools.php");
				Dubtrack.room.chat.chatSound.play();
			}
		}
		$("#iwoot-commandbox").val("");
	}
}

function autoDubUp() {
	if(IWoot.isAutoWoot) {
		wootButton.click();
	}
}

// Its just easier for me sometimes...
function connectHTML() {
	wootButton = $(".icon-arrow-up");
	mehButton = $(".icon-arrow-down");
	iWootButton = document.getElementById("iwoot-gui-options");
	iWootGui = document.getElementById("iwoot-gui-main");
	autoDubUpButton = document.getElementById("iwoot-autodubup");
	noChatLimitButton = document.getElementById("iwoot-chatlimit");
	commandBox = document.getElementById("iwoot-commandbox");
	IWoot.log("HTML Variables connected to their HTML parts!");
}

// Time to make use of the API.on() function...
function updateDJ() {
	var tempString = $(".currentDJSong")[0].innerHTML;
	var DJ = tempString.slice(0, tempString.length - 11);
	
	$("#iwoot-currentDJ").html("Current DJ: " + DJ);
}

// Might as well do something with it
function connectAPI() {
	API.on(API.CHAT, checkForEmotes);
	API.on(API.ADVANCE, autoDubUp);
	API.on(API.ADVANCE, updateDJ);
	
	IWoot.log("API Connected!");
}

// I need this for the terminate
function disconnectAPI() {
	API.off(API.CHAT, checkForEmotes);
	API.off(API.ADVANCE, autoDubUp);
	
	IWoot.log("API Disconnected!");
}

// Its useless without this...
function startUp() {
	loadGUI();
	connectHTML();
	connectAPI();
	loadListeners();
	updateDJ();
	document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
	commandBox.addEventListener("keydown", commandListener);
	API.chatLog(IWoot.iWoot + " Started!");
	document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
	IWoot.log(IWoot.iWoot + " Started!");
}

startUp();
