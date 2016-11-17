import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		onlineUsers : store.chatReducer.onlineUsers,
		username : store.chatReducer.username,
	}
})
class OnlineUsers extends Component {
	
	createPrivateChat(roomName, userName) {
		const { socket } = this.props
		console.log('INSIDE CREATE PRIVATE CHAT', roomName, userName)
		socket.emit('server:createRoom', { room : roomName, user: userName })
		this.joinPrivateChat(roomName, userName)
	}

	joinPrivateChat(roomName, userName) {
		const { socket } = this.props
		console.log('INSIDE JOIN PRIVATE CHAT', roomName, userName)
		socket.emit('server:joinRoom', { room : roomName, user: userName })
	}

	privateChat(currentUser) {
		const { socket, username } = this.props
		const roomName = currentUser === 'GENERAL'
							? 'GENERAL'
							: username < currentUser 
								? username + '-' + currentUser
								: currentUser + '-' + username

		console.log('NEW ROOM NAME', roomName, currentUser, username)
		this.createPrivateChat(roomName, username)
		this.createPrivateChat(roomName, currentUser)
	}

	render() {
		const { onlineUsers } = this.props 
		console.log('ALL USERS', onlineUsers)
		const onlineList = onlineUsers.map((user, id) => <li onClick={() => this.privateChat(user)} key={id} className="collection-item">{user}</li>)
		return (
			<ul class="collection with-header">
				<li class="collection-header"><h5>Channels</h5></li>
				<li onClick={() => this.privateChat('GENERAL')} className="collection-item">GENERAL</li>
				<li class="collection-header"><h5>Online Users</h5></li>
				{onlineList}
			</ul>
		)
	}
}

export default OnlineUsers