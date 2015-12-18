var isIWootRunning;
if(!isIWootRunning) {
	if (typeof Array.prototype.indexOf !== "function") {
	    Array.prototype.indexOf = function (item) {
	        for(var i = 0; i < this.length; i++) {
	            if (this[i] === item) {
	                return i;
	            }
	        }
	        return -1;
	    };
	};
	if(typeof String.prototype.replaceAll !== "function") {
		String.prototype.replaceAll = function(oldString, newString) {
			var theStr = this;
			var index = theStr.indexOf(oldString);
			while(index != -1) {
				theStr = theStr.replace(oldString, newString);
				index = theStr.indexOf(oldString);
			}
			return theStr;
		};
	};
	// Plug.DJ Ported API for Dubtrack.FM
	API = {
		getDJ: function() {
			return Dubtrack.room.player.activeSong.attributes.user.attributes.username;
		},
		getMedia: function() {
			return Dubtrack.room.player.activeSong.attributes.songInfo.name;
		},
		getRole: function(User) {
			if(User.attributes.roleid != null) {
				var type = User.attributes.roleid.type.toLowerCase();
				switch(type) {
				case "dj":
					return "DJ";
					break;
				case "vip":
					return "VIP";
					break;
				case "mod":
					return "Moderator";
					break;
				case "manager":
					return "Manager";
					break;
				case "co-owner":
					return "Co-Owner (or Owner)";
					break;
				}
			} else {
				return "Role not found! (Most likely means default user)";
			}
		},
		chatLog: function(msg) {
			Dubtrack.room.chat._messagesEl.append("<li class='chat-system-loading system-error'>" + msg + "</li>");
			document.getElementsByClassName("chat-main")[0].scrollIntoView(false);
		},
		sendChat: function(msg) {
			$("#chat-txt-message").text(msg);
			Dubtrack.room.chat.sendMessage();
		},
		setVolume: function(value) {
			Dubtrack.playerController.setVolume(value);
		},
		CHAT: "realtime:chat-message",
		ADVANCE: "realtime:room_playlist-update",
		USER_JOIN: "realtime:user-join",
		USER_LEAVE: "realtime:user-leave",
		on: function(theEvent, theFunc) {
			Dubtrack.Events.bind(theEvent, theFunc);
		},
		off: function(theEvent, theFunc) {
			Dubtrack.Events.unbind(theEvent, theFunc);
		}
	};
	// Main things
	IWoot = {
		iWoot: "iWoot v1.0.0",
		Tools: {
			lookForUser: function(username) {
				var found = false;
				for(var i = 0; i < Dubtrack.room.users.collection.length; i++) {
					if(username.toLowerCase() == Dubtrack.room.users.collection.at(i).attributes._user.username.toLowerCase()) {
						found = true;
					}
				}
				if(found) {
					return true;
				} else {
					return false;
				}
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
		var tempString = $(".chat-main").html();
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
			$(".dubup").click();
		}
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
		connectAPI();
		loadListeners();
		autoDubUp();
		$("#chat-txt-message").attr("maxlength", "99999999999999999999");
		isIWootRunning = true;
		API.chatLog(IWoot.iWoot + " Started!");
		IWoot.Tools.log(IWoot.iWoot + " Started!");
	}
	startUp();
} else {
	Dubtrack.helpers.displayError("Error!", "iWoot is already running!");
}
