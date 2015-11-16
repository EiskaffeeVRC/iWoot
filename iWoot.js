var isIBotRunning;

if(!isIBotRunning) {
	// Name and Version
	var NAME = "iBot";
	var VERSION = "v1.0.0";

	// Plug.DJ Ported API for Dubtrack.FM
	API = {
		getDJ: function() {
			var tempString=$(".currentDJSong")[0].innerHTML;
			var DJ=tempString.slice(0,tempString.length-11);
			return DJ;
		},
		getMedia: function() {
			return $(".currentSong").text();
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

	// Custom stuff
	IBot = {
		iBot: NAME + " " + VERSION,
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
			}
		}
	};

	function userJoinMsg(data) {
		API.sendChat(":wave: Welcome/Welcome back to the room @" + data.user.username + "! :wave:");
	}

	function userLeaveMsg() {
		API.sendChat(":wave: Goodbye @" + data.user.username + "! :wave:");
	}

	function commandHandler(data) {
		var msg = data.message;
	
		if(msg.startsWith("!")) {
			if(msg === "!help") {
				API.sendChat(IBot.iBot + " user commands: help, cookie @{User}, dj, song, list, autodubup");
			}
			if(msg.startsWith("!cookie")) {
				var UN = msg.substring(9);
				if(UN != "") {
					if(IBot.Tools.lookForUser(UN)) {
						API.sendChat(":cookie: *hands @" + UN + " a cookie, a note on it reads 'With love, from @" + data.user.username + "'* :cookie:");
					} else {
						API.sendChat(":x: User not found! :x:");
					}
				} else {
					API.sendChat(":cookie: *hands you a cookie (for @" + data.user.username + ")* :cookie:");
				}
			}
			if(msg === "!dj") {
				API.sendChat("Current DJ: @" + API.getDJ() + "!");
			}
			if(msg == "!song") {
				API.sendChat("Current Song: " + API.getMedia() + "!");
			}
			if(msg === "!list") {
				API.sendChat("Users 'found': " + IBot.Tools.getUsers());
			}
			if(msg === "!autodubup") {
				API.sendChat("Recommended Dubtrack.FM Extensions: iWoot (same creator as me, iBot), MikuPlugin (made by @rubychan), and/or DubX (made by multiple developers)");
			}
		}
	}

	function nextSongMsg() {
		API.sendChat(":musical_note: Now playing: " + API.getMedia() + "! DJ: " + API.getDJ() + ":musical_note:");
	}

	function connectAPI() {
		API.on(API.CHAT, commandHandler);
		API.on(API.USER_JOIN, userJoinMsg);
		API.on(API.USER_LEAVE, userLeaveMsg);
		API.on(API.ADVANCE, nextSongMsg);
	}

	// Just like iWoot, CONNECT EVERYTHING!
	function startUp() {
		connectAPI();
		document.getElementById("chat-txt-message").maxLength = 99999999999999999999;
		// *Special* code for Apple mobile users (iPod, iPhone, iPad)
		var minimizeBar = document.createElement("meta");
		minimizeBar.name = "apple-mobile-web-app-capable";
		minimizeBar.content = "yes";
		document.getElementsByTagName("head")[0].appendChild(minimizeBar);
		isIBotRunning = true;
		API.sendChat(IBot.iBot + " Started!");
	}

	startUp();
} else {
	Dubtrack.helpers.displayError("Error!", "iBot is already running!");
}
