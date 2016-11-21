module.exports = (app, server) => {

	var io = require('socket.io').listen(server)
	global.io = io
	var allUserArray = [ ]
	io.on('connection', socket => {
		socket.on('server:connect', () => {
			console.log('CONNECTION : Client joined.')
		})

		socket.on('server:joinRoomRequest', data => {
			var roomName = data.room
			var userName = data.user
			console.log('JOIN ROOM REQUEST: User', userName, 'asked to join Room :', roomName)
			var clients = io.sockets.adapter.rooms[roomName]
			if (clients) {
				var response = {
					status : 'SUCCESS',
					message : 'Join room request successful.',
					roomName : roomName,
					userName : userName,
				}
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

		socket.on('server:askToJoinRoom', data => {
			console.log('ASK TO JOIN REQUEST: ', data)
			io.sockets.in('GENERAL').emit('client:askToJoinRoom', data)
		})

		socket.on('server:createRoom', data => {
			var roomName = data.room
			var userName = data.user
			var clients = io.sockets.adapter.rooms[roomName]
			var response = { }
			if (clients) {
				response = {
					status : 'FAILED',
					message : 'Room already exists . Please create a new room.',
					roomName : roomName,
					userName : userName,
				}
				console.log('CREATE ROOM REQUEST: User', userName, 'failed to create Room :', roomName)
			} else {
				response = {
					status : 'SUCCESS',
					message : 'Room created successfully.',
					roomName : roomName,
					userName : userName,
				}
				console.log('CREATE ROOM REQUEST: User', userName, 'created new Room :', roomName)
			}
			socket.emit('client:createRoomResponse', response)

		})

		socket.on('server:joinRoom', data => {
			var roomName = data.room
			var userName = data.user
			socket.room = roomName
			socket.user = userName
			socket.join(roomName)
			var allUserArray = Object.keys(io.sockets.adapter.rooms['GENERAL'])
			var client = Object.keys(io.sockets.adapter.rooms[roomName])
			var response = {
				status : 'SUCCESS',
				message : 'Joined room successfully.',
				roomName : roomName,
				userName : userName,
				onlineUsers : allUserArray,
				inviteJoin : data.inviteJoin,
			}
			console.log('CURRENT CLIENT ON',roomName,':',client)
			socket.emit('client:joinRoomSuccess', response)
			socket.broadcast.to(roomName).emit('client:userJoined', allUserArray)
			
		})

		socket.on('server:newMessage',  data => {
			var roomName = data.room
			data.read = false
			console.log(data.user, ':', data.message ,'ON', data.room)
			console.log("Room message", roomName)
			io.sockets.in(roomName).emit('client:newMessage', data)
		})

		socket.on('server:disconnect', data => {
			console.log('DISCONNECT REQUEST')
			console.log(socket.room, socket.user)
			console.log('ROOMS', io.sockets.adapter.rooms)
			socket.user = data.user
			socket.room = data.room
			socket.leave(data.room)
			if(io.sockets.adapter.rooms['GENERAL']) {
				allUserArray =  Object.keys(io.sockets.adapter.rooms['GENERAL'])
				io.sockets.in(data.room).emit('client:userLeft', allUserArray)
			} else {
				io.sockets.in(data.room).emit('client:userLeft', [ ])
			}
		})

	})

}