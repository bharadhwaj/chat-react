import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		chatMessages : store.chatReducer.chat,
		username : store.chatReducer.username,
	}
})
class ChatMessages extends Component {
	render() {
		const { chatMessages, username } = this.props

		const chatThreads = chatMessages.map((thread, id) =>
			thread.user === username
				? <li className="collection-item right-align" key={id}>{thread.message} : <b> Me </b></li>
				: <li className="collection-item" key={id}><b>Him</b> : {thread.message}</li>
		)
		console.log('CHAT THREADS', chatThreads, username)
		return (
			<div className="row">
				<div className="col s12">
					<ul className="collection">
						{chatThreads}
					</ul>
				</div>
			</div>
		)
	}
}

export default ChatMessages
