import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../store'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

@connect((store) => {
	return {
		chatMessages : store.chatReducer.chat,
		username : store.chatReducer.username,
	}
})
class ChatBox extends Component {

	componentWillMount() {
		this.setState({ message: '' })
	}

	createTodo(event) {
		event.preventDefault()
		if (this.state.message.trim()) {
			console.log('Got From Text Box',this.props.username, this.state.message)
			socket.emit('server:newMessage', this.props.username, { message : this.state.message, user : this.props.username ,room : 'room1' })
			this.setState({ message: '' })
		}
	}

	handleTextChange(event) {
		this.setState({ message: event.target.value })
	}

	render() {
		console.log('THIS PROPS:   ', this.props)
		return (
			<div className="row chat-card card-content">
				<form>
					<div className="col s11 input-field">
						<label className="left-align" for="todoText">Enter your message</label>
						<input value={this.state.message} id="todoText" type="text" className="validate" onChange={this.handleTextChange.bind(this)}/>
					</div>
					<div className="col s1">
						<button class="btn btn-floating btn-large waves-effect waves-light" type="submit" onClick={this.createTodo.bind(this)}>
						<i class="material-icons right">send</i>
						</button>
					</div>
				</form>
			</div>
		)
	}
}

export default ChatBox
