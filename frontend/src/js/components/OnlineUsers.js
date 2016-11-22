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

	componentWillMount() {
		const { roomName } = this.props 
	}
	
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
	
	getRoomName(currentUser) {
		const { username } = this.props
		return currentUser === 'GENERAL'
							? 'GENERAL'
							: username < currentUser 
								? username + '-' + currentUser
								: currentUser + '-' + username

	}

	privateChat(currentUser) {

		const { socket, username, roomName } = this.props
		const newRoomName = this.getRoomName(currentUser) 
		console.log('NEW ROOM NAME', newRoomName, currentUser, username)
		this.createPrivateChat(newRoomName, username)
		this.askToJoinPrivateChat(newRoomName, currentUser)
		this.props.dispatch({ type : 'MARK_READ', payload : roomName})
	}

	render() {
		
		let unreadMessage = [ ]
		const { onlineUsers, chat, username, roomName } = this.props 

		for (let thread of chat) {
			console.log('THREAD ROOMS: ', thread)
			if (!unreadMessage[thread.room]) {
				unreadMessage[thread.room] = 0
			}
			if (thread.read === false && thread.user !== username && thread.room !== roomName) {
				unreadMessage[thread.room] += 1
			}
		}

		console.log('ALL USERS', onlineUsers, unreadMessage)
		const onlineList = onlineUsers
							.filter(user => user !== username)
							.map((user, id) => <a style={{ cursor : 'pointer' }} onClick={() => this.privateChat(user)} key={id} className="collection-item">{user}{unreadMessage[this.getRoomName(user)] ? <span class="new badge">{unreadMessage[this.getRoomName(user)]}</span> : null}</a>)
		return (
			<div class="collection with-header">
				<div class="collection-header"><h5>Channels</h5></div>
				<a style={{ cursor : 'pointer' }} onClick={() => this.privateChat('GENERAL')} className="collection-item">GENERAL{unreadMessage['GENERAL'] ? <span class="new badge">{unreadMessage['GENERAL']}</span> : null}</a>
				<div class="collection-header"><h5>Online Users</h5></div>
				{onlineList}
			</div>
		)
	}
}

export default OnlineUsers