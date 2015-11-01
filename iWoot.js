// Name and Version
var NAME = "iWoot";
var VERSION = "v1.0.0";

// Identifiers for the HTML parts
var wootButton;
var mehButton;
var iWootGuiButton;
var autoWootButton;
var noChatLimitButton;
var terminateButton;

// Extra things
var autoWootInteval;

// Main things
IWoot = {
	iWoot: NAME + " " + VERSION,
	log: function(String){console.log(String);},
	sendChat: function(String){
		$("#chat-txt-message").val(String);
		Dubtrack.room.chat.sendMessage();
	},
	chatLog: function(String){Dubtrack.room.chat._messagesEl.append("<li>" + String + "</li>");},
	isAutoWoot: true,
	isNoChatLimit: true,
	isGUIHidden: true
};

// Just easier for me, dont judge.
HTMLDefaultColor = {
	RED: "#FF0000",
	ORANGE: "#FF6600",
	YELLOW:	"#FFFF00",
	GREEN: "#00FF00",
	BLUE: "#0000FF",
	PURPLE: "#FF00FF",
	BLACK: "#000000",
	WHITE: "#FFFFFF"
};

// The 'kill' switch
function terminateIWoot() {
	IWoot.isAutoWoot = false;
	iWootGuiButton.remove();
	IWoot.chatLog("iWoot has been terminated! All features are no longer active.");
}

// Whats a plugin without a GUI?
function loadGUI() {
		var mainGUIStyle = "#iwoot-gui-main{text-align:center;cursor:pointer;background-color:#000000;color:#00FFFF;padding:5px;border-radius:10px;border:2px solid gray;}";
		var autoWootStyle = "#iwoot-autowoot{color:#00FF00;}";
		var noChatLimitStyle = "#iwoot-chatlimit{color:#00FF00}";
		
		var mainGUIStyles = "<style>" + mainGUIStyle + autoWootStyle + noChatLimitStyle + "</style>";
		
		$("body").append(mainGUIStyles);
		
		$(".main-menu").append('<li><div id="iwoot-gui-main" ><span id="iwoot-gui-options">[iWoot Tools]</span></div></li>');
		$("#iwoot-gui-main").append('<div id="iwoot-gui"></div>');
		$("#iwoot-gui").append('<div><span id="iwoot-autowoot" class="iwoot-toggle">AutoWoot</span></div>');
		$("#iwoot-gui").append('<div><span id="iwoot-chatlimit" class="iwoot-toggle">No Chat Limit</span></div>');
		$("#iwoot-gui").append('<div><span id="iwoot-terminate" class="iwoot-toggle">Terminate iWoot</span></div>');
		
		$("#iwoot-gui").hide("fast");
		
		IWoot.log("GUI Contents Loaded!");
}

// No use in the GUI if it does nothing...
function loadListeners() {
	$("#iwoot-gui-options").click(function() {
		if(IWoot.isGUIHidden == false) {
			$("#iwoot-gui").hide("fast");
			IWoot.isGUIHidden = true;
		} else {
			$("#iwoot-gui").show(250);
			IWoot.isGUIHidden = false;
		}
	});
		
	$("#iwoot-autowoot").click(function() {
		if(IWoot.isAutoWoot == true) {
			IWoot.isAutoWoot = false;
			autoWootButton.style.color = HTMLDefaultColor.RED;
		} else {
			IWoot.isAutoWoot = true;
			autoWootButton.style.color = HTMLDefaultColor.GREEN;
			autoWoot();
		}
	});
	
	$("#iwoot-chatlimit").click(function() {
		if(IWoot.isNoChatLimit == true) {
			IWoot.isNoChatLimit = false;
			noChatLimitButton.style.color = HTMLDefaultColor.RED;
			document.getElementById("chat-txt-message").maxLength = 140;
		} else {
			IWoot.isNoChatLimit = true;
			noChatLimitButton.style.color = HTMLDefaultColor.GREEN;
			document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
		}
	});
	
	$("#iwoot-terminate").click(function() {
		terminateIWoot();
	});
	
	IWoot.log("GUI Listeners Loaded!");
}

function autoWoot() {
	if(IWoot.isAutoWoot) {
		wootButton.click();
	}
}

// Its just easier for me sometimes...
function connectHTML() {
	wootButton = $(".icon-arrow-up");
	mehButton = $(".icon-arrow-down");
	iWootGuiButton = document.getElementById("iwoot-gui-main");
	autoWootButton = document.getElementById("iwoot-autowoot");
	noChatLimitButton = document.getElementById("iwoot-chatlimit");
	terminateButton = document.getElementById("iwoot-terminate");
	IWoot.log("HTML Variables connected to their HTML parts!");
}

// Its useless without this...
function startUp() {
	loadGUI();
	connectHTML();
	loadListeners();
	autoWootInteval = setInterval(autoWoot, 0);
	document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
	IWoot.chatLog(IWoot.iWoot + " Started!");
	IWoot.chatLog("TIP: iWoot disables the chat limit of 140 characters! (Togglable)");
	IWoot.log(IWoot.iWoot + " Started!");
}

startUp();
