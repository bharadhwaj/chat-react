module.exports = (app, server) => {

	var clientArray = [ ]
	var io = require('socket.io').listen(server)
	global.io = io
	
	io.on('connection', socket => {
		socket.on('server:connect', () => {
			console.log('CONNECTION : Client joined.')
		})

		socket.on('server:joinRoomRequest', (session, data) => {
			var roomName = data.room
			var userName = data.user
			console.log('JOIN ROOM REQUEST: User', userName, 'asked to join Room :', roomName, 'with Session ID:',session)
			var clients = io.sockets.adapter.rooms[roomName]
			if (clients) {
				var response = {
					status : 'SUCCESS',
					message : 'Join room request successful.',
				}
				console.log('CURRENT CLIENT :',clients)
				socket.emit('client:joinRoomRequestSuccess', response)
			} else {
				console.log('JOIN FAILED')
				var response = {
					status : 'FAILED',
					message : 'Room doesn\'t exists. Please create a room first.'
				}
				socket.emit('client:joinRoomRequestFailure', response)
			}
		})

		socket.on('server:createRoom', (session, data) => {
			var roomName = data.room
			var userName = data.user
			console.log('CREATE ROOM REQUEST: User', userName, 'created new Room :', roomName, 'with Session ID:',session)
			var clients = io.sockets.adapter.rooms[roomName]
			if (clients) {
				var response = {
					status : 'FAILED',
					message : 'Room already exists . Please create a new room.'
				}
				socket.emit('client:createRoomFailure', response)
			} else {
				var response = {
					status : 'SUCCESS',
					message : 'Room created successfully.',
				}
				socket.emit('client:createRoomSuccess', response)
			}
		})

		socket.on('server:joinRoom', (session, data) => {
			var roomName = data.room
			var userName = data.user
			socket.room = roomName
			socket.user = userName
			socket.join(roomName)
			var client = Object.keys(io.sockets.adapter.rooms[roomName])
			var response = {
				status : 'SUCCESS',
				message : 'Joined room successfully.',
				roomName : roomName,
				userName : userName,
				onlineUsers : client,
			}
			console.log('CURRENT CLIENT :',client)
			socket.emit('client:joinRoomSuccess', response)
			socket.broadcast.to(roomName).emit('client:userJoined', client)
			
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
			console.log('ROOOOOOMS', io.sockets.adapter.rooms)
			var userName = data.user
			var roomName = data.room
			socket.leave(userName)
			var clients = io.sockets.adapter.rooms[roomName]
			console.log('DICTIONARY CLIENT',clients)
			var client =  Object.keys(clients)
			socket.broadcast.to(roomName).emit('client:userLeft', client)
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