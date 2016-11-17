import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'

@connect((store) => {
	return {
		chatMessages : store.chatReducer.chat,
		username : store.chatReducer.username,
		roomName : store.chatReducer.roomName,
	}
})
class ChatBox extends Component {

	componentWillMount() {
		this.setState({ message: '' })
	}

	emitMessage(event) {
		event.preventDefault()
		const { message } = this.state
		const { socket, username, roomName } = this.props
		if (message.trim()) {
			console.log('Got From Text Box', username, this.state.message)
			socket.emit('server:newMessage', { message : message, user : username ,room : roomName })
			this.setState({ message: '' })
		}
	}

	handleTextChange(event) {
		this.setState({ message: event.target.value })
	}

	render() {
		console.log('THIS PROPS:   ', this.props)
		return (
			<form>
				<div className="col s11 input-field">
					<label className="left-align" for="todoText">Enter your message</label>
					<input value={this.state.message} id="todoText" type="text" className="validate" onChange={this.handleTextChange.bind(this)}/>
				</div>
				<div className="col s1">
					<button class="btn btn-floating btn-large waves-effect waves-light" type="submit" onClick={this.emitMessage.bind(this)}>
					<i class="material-icons right">send</i>
					</button>
				</div>
			</form>
		)
	}
}

export default ChatBox
