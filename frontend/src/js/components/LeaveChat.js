import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		roomName : store.chatReducer.roomName,
		username : store.chatReducer.username,
	}
})
class LeaveChat extends Component {

	leaveChat() {
		console.log('INSIDE LEAVE CHAT')
		const { socket, sessionId, username, roomName } = this.props
		socket.emit('server:disconnect', sessionId, { room : roomName, user: username })
		console.log('SENT DISCONNECT REQUEST')
	}
	render() {		
		return (
			<div style={{ marginBottom : 10 }} class="fixed-action-btn vertical click-to-toggle">
				<a class="btn-floating btn-large teal">
					<i class="material-icons">menu</i>
				</a>
				<ul>
					<li><a onClick={this.leaveChat.bind(this)} class="btn-floating red"><i class="material-icons">exit_to_app</i></a></li>
				</ul>
 			</div>
		)
	}
}

export default LeaveChat