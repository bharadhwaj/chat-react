import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		chatMessages : store.chatReducer.chat,
		roomName : store.chatReducer.roomName,
		username : store.chatReducer.username,
	}
})
class ChatMessages extends Component {
	render() {
		
		const { chatMessages, username, roomName } = this.props
		const chatThreads = chatMessages.filter(thread => thread.room === roomName)
		.map((thread, id) =>
			thread.user === username
				? <li className="collection-item right-align" key={id}>{thread.message} : <b> Me </b></li>
				: <li className="collection-item" key={id}><b>Him</b> : {thread.message}</li>
		)
		console.log('CHAT THREADS -- EMPTY ARRAY', chatThreads, username)
		return (
			<div className="row">
				<div className="col s12">
					<center> {roomName} </center>
					<ul className="collection">
						{chatThreads}
					</ul>
				</div>
			</div>
		)
	}
}

export default ChatMessages
