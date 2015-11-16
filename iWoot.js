var isIWootRunning;

if(!isIWootRunning) {
	// Name and Version
	var NAME = "iWoot";
	var VERSION = "v1.0.0";

	// Identifiers for the HTML parts
	var wootButton;
	var iWootButton;
	var iWootGui;
	var autoDubUpButton;
	var noChatLimitButton;
	var userJoinLeaveButton;

	String.prototype.replaceAll = function(token, newToken) {
		var str = this;
		var index = str.indexOf(token);
	
		while(index != -1) {
			str = str.replace(token, newToken);
			index = str.indexOf(token);
		}
	return str;
	};

	// Plug.DJ Ported API for Dubtrack.FM
	API = {
		getDJ: function() {
			var tempString=$(".currentDJSong")[0].innerHTML;
			var DJ=tempString.slice(0,tempString.length-11);
			return DJ;
		},
		chatLog: function(String){
			Dubtrack.room.chat._messagesEl.append("<li class='chat-system-loading system-error'>" + String + "</li>");
			document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
		}, //MikuPlugin
		sendChat: function(String){
			$("#chat-txt-message").val(String);
			Dubtrack.room.chat.sendMessage();
		}, // MikuPlugin
		setVolume: function(Value){
			Dubtrack.playerController.setVolume(Value);
		},
		CHAT: "realtime:chat-message",
		ADVANCE: "realtime:room_playlist-update",
		USER_JOIN: "realtime:user-join",
		USER_LEAVE: "realtime:user-leave",
		on: function(Event, Function){
			Dubtrack.Events.bind(Event, Function);
		},
		off: function(Event, Function){
			Dubtrack.Events.unbind(Event, Function);
		}
	};

	// Main things
	IWoot = {
		iWoot: NAME + " " + VERSION,
		Tools: {
			lookForUser: function(String) {
				var found = false;
				for(var i = 0; i < $(".username").length; i++) {
					if(String.toLowerCase() == $(".username")[i].innerHTML.toLowerCase()) {
						found = true;
					}
				}
				if(found) {
					return true;
				} else {
				return false;
				}
			},
			getUsers: function() {
				var users = "";
				for(var i = 0; i < $(".username").length; i++) {
					if(!users.includes($(".username")[i].innerHTML) && $(".username")[i].innerHTML != undefined) {
						users += "@" + $(".username")[i].innerHTML + " ";
					}
				}
				return users;
			},
		log: function(String){console.log(String);}
		},
		isAutoWoot: true,
		isNoChatLimit: true,
		isUserJoinLeave: true,
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
		var mainGUIStyle = "#iwoot-gui-main{opacity:0.8;z-index:99999;display:none;position:fixed;width:300px;height:100%;text-align:center;background-color:" + Color.DARK_PURPLE + ";color:" + Color.CYAN + ";border:1px solid gray;}";
		var autoDubUpStyle = "#iwoot-autodubup{color:" + Color.GREEN + ";}";
		var noChatLimitStyle = "#iwoot-chatlimit{color:" + Color.GREEN + ";}";
		var userJoinLeaveStyle = "#iwoot-userjoinleave{color:" + Color.GREEN + ";}";
		var iWootToggleStyle = ".iwoot-toggle{cursor:pointer;font-weight:bold;font-size:15px;}";
	
		var mainGUIStyles = "<style>" + mainGUIStyle + autoDubUpStyle + noChatLimitStyle + userJoinLeaveStyle + iWootToggleStyle + "</style>";
		
		$("body").append(mainGUIStyles);
	
		$(".header-left-navigation").append('<a class="navigate room-active-link active-room" id="main-room-active-link"><span class="icon-chevron"></span><span class="room-name" id="iwoot-gui-options">iWoot</span></a>');
		$('<div id="iwoot-gui-main"></div>').insertBefore($("#main-section"));
		$("#iwoot-gui-main").append('<div style="font-size:0.75em;opacity:1.0;"><span id="iwoot-gui"></span></div>');
		$("#iwoot-gui").append('<hr></hr><h1><b>iWoot</b></h1><hr></hr>');
		$("#iwoot-gui").append('<div><span id="iwoot-autodubup" class="iwoot-toggle">AutoDupUp</span></div>');
		$("#iwoot-gui").append('<div><span id="iwoot-chatlimit" class="iwoot-toggle">No Chat Limit</span></div>');
		$("#iwoot-gui").append('<div><span id="iwoot-userjoinleave" class="iwoot-toggle">User Join/Leave Chat Alerts</span></div>');
	
		IWoot.Tools.log("GUI Contents Loaded!");
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
		
		$("#iwoot-userjoinleave").click(function() {
			if(!IWoot.isUserJoinLeave) {
				IWoot.isUserJoinLeave = true;
				userJoinLeaveButton.style.color = Color.GREEN;
			} else {
				IWoot.isUserJoinLeave = false;
				userJoinLeaveButton.style.color = Color.RED;
			}
		});
	
		IWoot.Tools.log("GUI Listeners Loaded!");
	}

	function checkForEmotes() {
		// https://i.imgur.com/U8PrnfU.gif :hug:
		// ( ͡° ͜ʖ ͡°) :lennyface:
		// https://i.imgur.com/L5eZObb.gif :fangirling:
	
		var tempString = Dubtrack.room.chat._messagesEl[0].innerHTML;
	
		if(tempString.includes(":hug:")) {
		Dubtrack.room.chat._messagesEl[0].innerHTML = tempString.replaceAll(":hug:", '<img class="emoji" src="https://i.imgur.com/U8PrnfU.gif"></img>');
		}
		if(tempString.includes(":lennyface:")) {
		Dubtrack.room.chat._messagesEl[0].innerHTML = tempString.replaceAll(":lennyface:", '( ͡° ͜ʖ ͡°)');
		}
		if(tempString.includes(":fangirling:")) {
			Dubtrack.room.chat._messagesEl[0].innerHTML = tempString.replaceAll(":fangirling:", '<img class="emoji" src="https://i.imgur.com/L5eZObb.gif"></img>');
		}
	}

	function userJoinMsg(data) {
		if(IWoot.isUserJoinLeave) {
				API.chatLog("@" + data.user.username + " has joined the room");
		}
	}

	function userLeaveMsg(data) {
		if(IWoot.isUserJoinLeave) {
				API.chatLog("@" + data.user.username + " has left the room");
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
		iWootButton = document.getElementById("iwoot-gui-options");
		iWootGui = document.getElementById("iwoot-gui-main");
		autoDubUpButton = document.getElementById("iwoot-autodubup");
		noChatLimitButton = document.getElementById("iwoot-chatlimit");
		userJoinLeaveButton = document.getElementById("iwoot-userjoinleave");
		IWoot.Tools.log("HTML Variables connected to their HTML parts!");
	}

	// Might as well do something with it
	function connectAPI() {
		API.on(API.CHAT, checkForEmotes);
		API.on(API.ADVANCE, autoDubUp);
		API.on(API.USER_JOIN, userJoinMsg);
		API.on(API.USER_LEAVE, userLeaveMsg);
	
		IWoot.Tools.log("API Connected!");
	}

	// Its useless without this...
	function startUp() {
		loadGUI();
		connectHTML();
		connectAPI();
		loadListeners();
		autoDubUp();
		document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
		// *Special* code for Apple mobile users (iPod, iPhone, iPad)
		var minimizeBar = document.createElement("meta");
		minimizeBar.name = "apple-mobile-web-app-capable";
		minimizeBar.content = "yes";
		document.getElementsByTagName("head")[0].appendChild(minimizeBar);
		isIWootRunning = true;
		API.chatLog(IWoot.iWoot + " Started!");
		IWoot.Tools.log(IWoot.iWoot + " Started!");

	}

	startUp();
} else {
	Dubtrack.helpers.displayError("Error!", "iWoot is already running!");
}
