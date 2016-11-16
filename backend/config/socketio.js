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
			var clients = io.sockets.adapter.rooms['GENERAL']
			if (clients) {
				var response = {
					status : 'SUCCESS',
					message : 'Join room request successful.',
					roomName : roomName,
					userName : userName,
				}
				console.log('CURRENT CLIENT REQUEST:',clients)
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
			var clients = io.sockets.adapter.rooms['GENERAL']
			if (clients) {
				var response = {
					status : 'FAILED',
					message : 'Room already exists . Please create a new room.',
					roomName : roomName,
					userName : userName,
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
			var client = Object.keys(io.sockets.adapter.rooms['GENERAL'])
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

		socket.on('server:disconnect', (session, data) => {
			console.log('DISCONNECT REQUEST')
			console.log(socket.room, socket.user)
			console.log('ROOMS', io.sockets.adapter.rooms)
			var userName = socket.user
			var roomName = socket.room
			socket.leave(userName)
			delete io.sockets.adapter.rooms[roomName][userName]
			var clients = io.sockets.adapter.rooms[roomName]
			console.log('ALL ROOMS',io.sockets.adapter.rooms)
			var client =  Object.keys(clients)
			socket.broadcast.to(roomName).emit('client:userLeft', client)
		})

	})

}