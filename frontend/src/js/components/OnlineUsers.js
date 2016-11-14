import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		onlineUsers : store.chatReducer.onlineUsers,
		username : store.chatReducer.username,
	}
})
class OnlineUsers extends Component {
	createPrivateChat(currentUser) {
		const { socket, username, sessionId } = this.props
		const roomName =  username < currentUser 
							? username + '-' + currentUser
							: currentUser + '-' + username
		console.log('NEW ROOM NAME', roomName)
		socket.emit('server:createRoom', sessionId, { room : roomName, user: username })
		socket.emit('server:joinRoom', sessionId, { room : roomName, user: username })
		socket.emit('server:joinRoom', currentUser, { room : roomName, user: currentUser })

		socket.on('client:createRoomFailure', response => {
			socket.emit('server:joinRoom', currentUser, { room : roomName, user: currentUser })
		})

		socket.on('client:joinRoomSuccess', response => {
			this.props.dispatch({ type : 'CURRENT_ROOMNAME', payload : response.roomName })
		})
	}
	render() {
		const { onlineUsers } = this.props 
		console.log('ALL USERS', onlineUsers)
		const onlineList = onlineUsers.map((user, id) => <li onClick={() => this.createPrivateChat(user)} key={id} className="collection-item">{user}</li>)
		return (
			<ul class="collection with-header">
				<li class="collection-header"><h5>Online Users</h5></li>
				{onlineList}
			</ul>
		)
	}
}

export default OnlineUsers