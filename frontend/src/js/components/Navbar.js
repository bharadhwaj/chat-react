import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		username : store.chatReducer.username,
	}
})
class Navbar extends Component {

	leaveChat() {
		console.log('INSIDE LEAVE CHAT')
		const { socket, username } = this.props
		socket.emit('server:disconnect', username, { room : 'GENERAL', user: username })
	}

	render() {		
		return (
			<div className="row">
				<nav className="teal">
					<div className="nav-wrapper teal">
						<span className="brand-logo center">
							<h4>Chat App</h4>
						</span>
					</div>
				</nav>
			</div>
		)
	}
}

export default Navbar