module.exports = (app, server) => {

	var clientArray = [ ]
	var io = require('socket.io').listen(server)
	global.io = io
	
	io.on('connection', socket => {
		socket.on('server:connect', () => {
			console.log('CONNECTION : Client joined.')
		})

		socket.on('server:joinRoom', (session, data) => {
			var roomName = data.room
			var userName = data.user
			console.log('JOIN ROOM REQUEST: User', userName, 'asked to join Room :', roomName, 'with Session ID:',session)
			var client = io.sockets.adapter.rooms[roomName]
			console.log('CURRENT CLIENT :',client)
			if (client) {
				socket.room = roomName
				socket.user = userName
				clientArray.push(userName)
				socket.join(roomName)
				var response = {
					status : 'SUCCESS',
					message : 'Joined room successfully.',
					roomName : roomName,
					userName : userName,
					onlineUsers : clientArray,
				}
				socket.emit('client:joinRoomSuccess', response)
			} else {
				var response = {
					status : 'FAILED',
					message : 'Room doesn\'t exists. Please create a room first.'
				}
				socket.emit('client:joinRoomFailure', response)
			}
		})

		socket.on('server:createRoom', (session, data) => {
			var roomName = data.room
			var userName = data.user
			console.log('CREATE ROOM REQUEST: User', userName, 'created new Room :', roomName, 'with Session ID:',session)
			var client = io.sockets.adapter.rooms[roomName]
			if (client) {
				var response = {
					status : 'FAILED',
					message : 'Room already exists . Please create a new room.'
				}
				socket.emit('client:createRoomFailure', response)
			} else {
				socket.room = roomName
				socket.user = userName
				clientArray.push(userName)
				socket.join(roomName)
				var response = {
					status : 'SUCCESS',
					message : 'Room created successfully.',
					roomName : roomName,
					userName : userName,
					onlineUsers : clientArray
				}
				socket.emit('client:createRoomSuccess', response)
			}
		})

		socket.on('server:newMessage', (session, data) => {
			var roomName = data.room
			console.log(data.user, ':', data.message ,'ON', data.room)
			console.log("Room message", roomName)
			socket.broadcast.to(roomName).emit('client:newMessage', data)
		})

		socket.on('server:disconnect', function (session, data) {
			console.log('DISCONNECT REQUEST')
			console.log(socket.room, socket.user)
			var userName = data.user
			var roomName = data.room
			if(userName && roomName)
				delete io.sockets.adapter.rooms[roomName][userName]
			clientArray = clientArray.filter(user => user !== userName)
			socket.broadcast.to(roomName).emit('client:userLeft', clientArray)
		})

		socket.on('drawLine', function(data, session ) {
			if(socket.room) {
				var room=socket.room;
				console.log('Room Name is '+room)
				socket.broadcast.to(room).emit('drawLine',data);
			} else {
				var error="Unauthorized access.";
				socket.emit('displayerror',error);
			}
		})
	});

}