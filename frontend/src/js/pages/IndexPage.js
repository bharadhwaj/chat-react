import React, { Component } from 'react'
import io from 'socket.io-client'
import store from '../store'

import Navbar from '../components/Navbar'
import ChatMessages from '../components/ChatMessages'
import ChatBox from '../components/ChatBox'

const socket = io('http://localhost:3000')
let sessionId = null

class Index extends Component {
	componentWillMount() {
		socket.on('connect', () => {
			socket.emit('server:connect')
			sessionId = socket.io.engine.id
			localStorage.setItem('username', sessionId)
			socket.emit('server:joinRoom', sessionId, { room : 'GENERAL', user: sessionId })

			socket.on('client:joinRoomSuccess', response => {
				console.log('Join Success :)', response)
			})

			socket.on('client:joinRoomFailure', response => {
				socket.emit('server:createRoom', sessionId, { room : 'GENERAL', user: sessionId })
			})

			socket.on('client:createRoomFailure', response => {
				socket.emit('server:joinRoom', sessionId, { room : 'GENERAL', user: sessionId })
				console.log('Create Failed :(', response)
			})

			socket.on('client:createRoomSuccess', response => {
				console.log('Create Success :)', response)
			})
			store.dispatch({ type : 'SET_USERNAME', payload : sessionId })
		})
	}

	render() {
		socket.on('connect', () => {
			socket.on('client:newMessage', data => {
				console.log("Got message", data.user, sessionId, data.message)
				store.dispatch({ type : 'ADD_THREAD', payload : data })
			})
		})
		return (
			<div>
				<Navbar/>
				<ChatMessages user={sessionId}/>
				<ChatBox user={sessionId}/>
			</div>
		)
		
	}
}

export default Index