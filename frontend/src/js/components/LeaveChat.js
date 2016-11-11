import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		username : store.chatReducer.username,
	}
})
class LeaveChat extends Component {

	leaveChat() {
		console.log('INSIDE LEAVE CHAT')
		const { socket, username } = this.props
		socket.emit('server:disconnect', username, { room : 'GENERAL', user: username })
	}

	componentWillUnmount() {
		const { socket, username } = this.props
		socket.emit('server:disconnect', username, { room : 'GENERAL', user: username })
	}

	render() {		
		return (
			<div className="bottom-stick row">
				<button onClick={this.leaveChat.bind(this)} className="btn btn-large waves-effect waves-light">
					Leave Chat<i className="material-icons right">send</i>
				</button>
			</div>
		)
	}
}

export default LeaveChat