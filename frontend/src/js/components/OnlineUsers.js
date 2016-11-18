import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		onlineUsers : store.chatReducer.onlineUsers,
		username : store.chatReducer.username,
		roomName : store.chatReducer.roomName,
		chat : store.chatReducer.chat
	}
})
class OnlineUsers extends Component {
	
	createPrivateChat(roomName, userName) {
		const { socket } = this.props
		console.log('INSIDE CREATE PRIVATE CHAT', roomName, userName)
		socket.emit('server:createRoom', { room : roomName, user: userName })
	}

	askToJoinPrivateChat(roomName, userName) {
		const { socket } = this.props
		console.log('INSIDE JOIN PRIVATE CHAT', roomName, userName)
		socket.emit('server:askToJoinRoom', { room : roomName, user: userName })
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
		this.askToJoinPrivateChat(roomName, currentUser)
	}

	render() {
		this.props.dispatch({ type : 'MARK_READ', payload : roomName})
		
		let unreadMessage = [ ]
		const { onlineUsers, chat, roomName } = this.props 
		for (let thread of chat) {
			if (!unreadMessage[thread.room]) {
				unreadMessage[thread.room] = 0
			}
			if (thread.read === false ) {
				unreadMessage[thread.room] += 1
			}
		}

		console.log('ALL USERS', onlineUsers, unreadMessage)
		const onlineList = onlineUsers.map((user, id) => <a style={{ cursor : 'pointer' }} onClick={() => this.privateChat(user)} key={id} className="collection-item">{user}<span class="new badge">1</span></a>)
		return (
			<div class="collection with-header">
				<div class="collection-header"><h5>Channels</h5></div>
				<a style={{ cursor : 'pointer' }} onClick={() => this.privateChat('GENERAL')} className="collection-item">GENERAL{unreadMessage['GENERAL'] && <span class="new badge">{unreadMessage['GENERAL']}</span>}</a>
				<div class="collection-header"><h5>Online Users</h5></div>
				{onlineList}
			</div>
		)
	}
}

export default OnlineUsers