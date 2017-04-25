
// A Painter application that uses MQTT to distribute draw events
// to all other devices running this app.

//Object that holds application data and functions.
var app = {};

var host = 'broker.mqttdashboard.com';
var port = 8000;
var user = 'anon';
var password = 'ymous';

app.connected = false;
app.ready = false;
app.uuid;
app.userName;


app.initialize = function(name){
	console.log("initalize running");
	app.userName = name;
	app.uuid = name + "-" + Math.random().toString(36).slice(2);
	console.log("User id: " + app.uuid);
	app.onReady();



}

app.onReady = function() {
	console.log("Running onReady");
	if (!app.ready) {
		//app.color = app.generateColor(device.uuid); // Generate  our own color from UUID
		app.pubTopic = 'appication/msg3/' + app.uuid; // We publish to our own device topic
		app.subTopic = 'appication/msg3/+'; // We subscribe to all devices using "+" wildcard
		app.setUpChat();
		app.setupConnection();
		app.ready = true;



	}
}

app.setUpChat = function(){
	//Send a retian message to notify new subscribier 
	var msg = "";
	var sendButton = document.getElementById("msgButton");
	sendButton.addEventListener("click", function(){
		msg = document.getElementById("msgText").value;
		if(msg != ""){
			var finalMsg = JSON.stringify({from: app.userName, message: msg});
			app.publish(finalMsg);
			document.getElementById("msgText").value = "";
		}
	});
}
// Simple function to generate a color from the device UUI
/*
app.generateColor = function(uuid) {
	var code = parseInt(uuid.split('-')[0], 16)
	var blue = (code >> 16) & 31;
	var green = (code >> 21) & 31;
	var red = (code >> 27) & 31;
	return "rgb(" + (red << 3) + "," + (green << 3) + "," + (blue << 3) + ")"
}

app.initialize = function() {
	document.addEventListener(
		'deviceready',
		app.onReady,
		false);
}

app.onReady = function() {
	if (!app.ready) {
		app.color = app.generateColor(device.uuid); // Generate  our own color from UUID
		app.pubTopic = '/paint/' + device.uuid + '/evt'; // We publish to our own device topic
		app.subTopic = '/paint/+/evt'; // We subscribe to all devices using "+" wildcard
		app.setupCanvas();
		app.setupConnection();
		app.ready = true;
	}
}

app.setupCanvas = function() {
	app.canvas = document.getElementById("canvas");
	app.ctx = app.canvas.getContext('2d');
	var left, top;
	{
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var curElement = canvas;
		do {
			totalOffsetX += curElement.offsetLeft;
			totalOffsetY += curElement.offsetTop;
		} while (curElement = curElement.offsetParent)
		app.left = totalOffsetX;
		app.top = totalOffsetY;
	}
	
	// We want to remember the beginning of the touch as app.pos
	canvas.addEventListener("touchstart", function(event) {
		// Found the following hack to make sure some
		// Androids produce continuous touchmove events.
		if (navigator.userAgent.match(/Android/i)) {
			event.preventDefault();
		}
		var t = event.touches[0];
		var x = Math.floor(t.clientX) - app.left;
		var y = Math.floor(t.clientY) - app.top;
		app.pos = {x:x, y:y};
	});
	
	// Then we publish a line from-to with our color and remember our app.pos
	canvas.addEventListener("touchmove", function(event) {
		var t = event.touches[0];
		var x = Math.floor(t.clientX) - app.left;
		var y = Math.floor(t.clientY) - app.top;
		if (app.connected) {
			var msg = JSON.stringify({from: app.pos, to: {x:x, y:y}, color: app.color})
			app.publish(msg);
		}
		app.pos = {x:x, y:y};
	});
}
*/



app.setupConnection = function() {
	var willMsg = document.getElementById("willText").value;

	
	app.status("Connecting to " + host + ":" + port + " as " + app.uuid);
	app.client = new Paho.MQTT.Client(host, port, app.uuid);
	app.client.onConnectionLost = app.onConnectionLost;
	app.client.onMessageArrived = app.onMessageArrived;
	console.log(app.client);
	if(willMsg != " "){
		willMsg = app.userName + " disconnected!";
		
	}
	console.log(willMsg);
		var finalWill = new Paho.MQTT.Message(JSON.stringify({from: app.userName, message: willMsg}));
		finalWill.destinationName = app.pubTopic;
		var options = {
		  	useSSL: false,
		    onSuccess: app.onConnect,
		    onFailure: app.onConnectFailure,
		    willMessage: finalWill
		}
	app.client.connect(options);
}

app.retainPublish = function(message) {
	pubMessage = new Paho.MQTT.Message(message);
	pubMessage.destinationName = app.pubTopic;
	pubMessage.retained = true;
	app.client.send(pubMessage);
};

app.publish = function(message) {
	pubMessage = new Paho.MQTT.Message(message);
	pubMessage.destinationName = app.pubTopic;
	app.client.send(pubMessage);
};

app.subscribe = function() {
	app.client.subscribe(app.subTopic);
	console.log("Subscribed: " + app.subTopic);
}

app.unsubscribe = function() {
	app.client.unsubscribe(app.subTopic);
	console.log("Unsubscribed: " + app.subTopic);
}

app.onMessageArrived = function(message) {
	var o = JSON.parse(message.payloadString);
	console.log(o);
	var chatLogs = document.getElementById("chatlogs");
	var obj = document.createElement('div');
	if(app.userName == o.from){
		obj.className = "chat self";
	}else{
		obj.className = "chat other";
	}

	obj.innerHTML = '<p class="chat-message">' + o.message + '</p>';
	chatLogs.appendChild(obj);
}

app.onConnect = function(context) {
	app.subscribe();
	app.status("Connected!");
	app.connected = true;
	//var retainMsg = JSON.stringify({from: app.userName, message: app.userName + " is conencted"});;
	//app.retainPublish(retainMsg);
}

app.onConnectFailure = function(e){
  console.log("Failed to connect: " + JSON.stringify(e));
}

app.onConnectionLost = function(responseObject) {
	//app.retainPublish(new Byte[0]);
	app.status("Connection lost!");
	console.log("Connection lost: "+responseObject.errorMessage);
	app.connected = false;
}

app.status = function(s) {
	console.log(s);
	var info = document.getElementById("info");
	info.innerHTML = s;
}

//app.initialize();
