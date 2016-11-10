var socket = io.connect("http://localhost:3000");
// var socket = io.connect("https://piction.herokuapp.com");

var createroom= function(){
	var username=$('#cusername').val();
	// localstorage.setItem('username',username);
	var roomname=$('#croomname').val();
	var sessionId = socket.io.engineid;
	localStorage.setItem('username',username);
	socket.emit("checkforroomtocreate", sessionId, {room:roomname,user:username});
}
var joinroom= function(){
	var username=$('#username').val();
	// localstorage.setItem('username',username);
	var roomname=$('#roomname').val();
	localStorage.setItem('username',username);
	var sessionId = socket.io.engineid;
	socket.emit("checkforroomtojoin", sessionId, {room:roomname,user:username});
}

socket.on('connect', function(){
			// firing back the connect event to the server
			// and sending the nickname for the connected client

			var sessionId = socket.io.engineid;
			socket.emit("connectman",sessionId);
			console.log("Connected");

			socket.on('changeurl',function(roomname)
			{
				var currentUrl = window.location.href;
				window.location=currentUrl+'room/'+roomname;
			});

			socket.on('displayerror',function(error)
			{
				$('#errorstring').html(error);
				$('#error').modal('show');

			});

});

$(document).ready(function() {
	console.log($(window).height());
	$(".jumbotron").height($(window).height());
});