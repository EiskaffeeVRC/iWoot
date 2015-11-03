// Name and Version
var NAME = "iWoot";
var VERSION = "v1.0.0";

// Identifiers for the HTML parts
var wootButton;
var mehButton;
var iWootGuiButton;
var autoWootButton;
var noChatLimitButton;
var customLookButton;
var terminateButton;
var commandBox;

// Extra things
var autoWootInteval;

API = {
	chatLog: function(String){Dubtrack.room.chat._messagesEl.append("<li style='font-size: 0.75em'><b>" + String + "</b></li>");}, //MikuPlugin
	sendChat: function(String){
		$("#chat-txt-message").val(String);
		Dubtrack.room.chat.sendMessage();
	}, // MikuPlugin
	setVolume: function(Value){Dubtrack.playerController.setVolume(Value);}
};

// Main things
IWoot = {
	iWoot: NAME + " " + VERSION,
	log: function(String){console.log(String);},
	isAutoWoot: true,
	isNoChatLimit: true,
	isGUIHidden: true,
	isCustomTheme: true,
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
	CYAN: "#00FFFF"
};

// The 'kill' switch
function terminateIWoot() {
	IWoot.isAutoWoot = false;
	IWoot.isNoChatLimit = false;
	IWoot.isCustomTheme = false;
	IWoot.isGUIHidden = false;
	document.getElementById("chat-txt-message").maxLength = 140;
	commandBox.removeEventListener("keydown", commandListener);
	iWootGuiButton.remove();
	clearInterval(autoWootInterval);
	resetDefaultLook();
	API.chatLog("iWoot has been terminated! All features are no longer active.");
}

// Whats a plugin without a GUI?
function loadGUI() {
	var mainGUIStyle = "#iwoot-gui-main{font-size:0.75em;text-align:center;cursor:pointer;background-color:" + Color.BLACK + ";color:" + Color.CYAN + ";padding:5px;border-radius:5px;border:2px solid gray;}";
	var autoWootStyle = "#iwoot-autowoot{color:" + Color.GREEN + ";}";
	var noChatLimitStyle = "#iwoot-chatlimit{color:" + Color.GREEN + "}";
	var customLookStyle = "#iwoot-customlook{color:" + Color.GREEN + "}";
	
	var mainGUIStyles = "<style>" + mainGUIStyle + autoWootStyle + noChatLimitStyle + customLookStyle + "</style>";
		
	$("body").append(mainGUIStyles);
	
	$(".main-menu").append('<li><div id="iwoot-gui-main" ><span id="iwoot-gui-options">[iWoot Tools]</span></div></li>');
	$("#iwoot-gui-main").append('<div id="iwoot-gui"></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-autowoot" class="iwoot-toggle">AutoWoot</span></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-chatlimit" class="iwoot-toggle">No Chat Limit</span></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-customlook" class="iwoot-toggle">iWoot Custom Look</span></div>');
	$("#iwoot-gui").append('<div><span id="iwoot-terminate" class="iwoot-toggle">Terminate iWoot</span></div>');
	$("#iwoot-gui").append('<div><input id="iwoot-commandbox" class="iwoot-toggle" placeholder="Command Box (ex: /help)"></div>');
		
		$("#iwoot-gui").hide("fast");
		
		IWoot.log("GUI Contents Loaded!");
}

// No use in the GUI if it does nothing...
function loadListeners() {
	$("#iwoot-gui-options").click(function() {
		if(!IWoot.isGUIHidden == false) {
			$("#iwoot-gui").show(500);
			IWoot.isGUIHidden = false;
		} else {
			$("#iwoot-gui").hide("slow");
			IWoot.isGUIHidden = true;	
		}
	});
		
	$("#iwoot-autowoot").click(function() {
		if(!IWoot.isAutoWoot == true) {
			IWoot.isAutoWoot = true;
			autoWootButton.style.color = Color.GREEN;
			autoWoot();
		} else {
			IWoot.isAutoWoot = false;
			autoWootButton.style.color = Color.RED;
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
	
	$("#iwoot-customlook").click(function() {
		toggleTheme();
	});
	
	$("#iwoot-terminate").click(function() {
		terminateIWoot();
	});
	
	IWoot.log("GUI Listeners Loaded!");
}

function commandListener(event) {
	keyCode = event.keyCode;
	
	command = commandBox.value;
	
	if(keyCode == 13) {
		if(command.startsWith("/")) {
			if(command === "/help") {
				API.chatLog(IWoot.iWoot + " Commands:");
				API.chatLog("* /help - Displays this message");
				API.chatLog("* /volume {Value} - Sets the volume to {Value} (0-100)");
				API.chatLog("* /emojis - Links to a website that has available Emojis to use");
			}
			if(command.startsWith("/volume")) {
				var VOLUME = command.replace(" ", "").substring(7);
				API.setVolume(parseInt(command.substring(8)));
				API.chatLog("Volume set to: " + parseInt(command.substring(8)));
			}
			if(command === "/emojis") {
				API.chatLog("Emoji Cheat Sheet - <a href='http://www.emoji-cheat-sheet.com/' target='_blank'>(Click me)</a>");
			}
		}
		$("#iwoot-commandbox").val("");
		document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
	}
}

function autoWoot() {
	if(IWoot.isAutoWoot) {
		wootButton.click();
	}
}

function setCustomLook() {
	// Chat box
	document.getElementById("chat").style.border = "2px solid black";
	document.getElementById("chat").style.borderRadius = "5px";
	document.getElementById("chat").style.opacity = "0.8";
	
	// Bottom bar
	document.getElementById("player-controller").style.border = "2px solid black";
	document.getElementById("player-controller").style.opacity = "0.8";
}

function resetDefaultLook() {
	// Chat
	document.getElementById("chat").style.border = "0px solid black";
	document.getElementById("chat").style.borderRadius = "0px";
	document.getElementById("chat").style.opacity = "1.0";
	
	// Bottom bar
	document.getElementById("player-controller").style.border = "0px solid black";
	document.getElementById("player-controller").style.opacity = "1.0";
}

function toggleTheme() {
	if(!IWoot.isCustomTheme) {
		setCustomLook();
		customLookButton.style.color = Color.GREEN;
		IWoot.isCustomTheme = true;
	} else {
		resetDefaultLook();
		customLookButton.style.color = Color.RED;
		IWoot.isCustomTheme = false;
	}
}

// Its just easier for me sometimes...
function connectHTML() {
	wootButton = $(".icon-arrow-up");
	mehButton = $(".icon-arrow-down");
	iWootGuiButton = document.getElementById("iwoot-gui-main");
	autoWootButton = document.getElementById("iwoot-autowoot");
	noChatLimitButton = document.getElementById("iwoot-chatlimit");
	customLookButton = document.getElementById("iwoot-customlook");
	terminateButton = document.getElementById("iwoot-terminate");
	commandBox = document.getElementById("iwoot-commandbox");
	IWoot.log("HTML Variables connected to their HTML parts!");
}

// Its useless without this...
function startUp() {
	loadGUI();
	connectHTML();
	loadListeners();
	setCustomLook();
	autoWootInteval = setInterval(autoWoot, 100);
	document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
	commandBox.addEventListener("keydown", commandListener);
	API.chatLog(IWoot.iWoot + " Started!");
	API.chatLog("TIP: iWoot disables the chat limit of 140 characters! (Togglable)");
	document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
	IWoot.log(IWoot.iWoot + " Started!");
}

startUp();
