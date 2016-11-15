import React, { Component } from 'react'
import io from 'socket.io-client'
import { connect } from 'react-redux'

import PreLoader from '../components/PreLoader'
import Navbar from '../components/Navbar'
import ChatMessages from '../components/ChatMessages'
import ChatBox from '../components/ChatBox'
import OnlineUsers from '../components/OnlineUsers'
import LeaveChat from '../components/LeaveChat'

const socket = io('http://localhost:3000')
let sessionId = null

@connect((store) => {
	return {
		loading : store.pageReducer.loading,
		roomName : store.chatReducer.roomName,
	}
})
class Index extends Component {
	componentWillMount() {
		const { roomName } = this.props
		socket.on('connect', () => {
			socket.emit('server:connect')
			sessionId = socket.io.engine.id
			localStorage.setItem('username', sessionId)
			this.props.dispatch({ type : 'SET_USERNAME', payload : sessionId })
			socket.emit('server:joinRoomRequest', sessionId, { room : roomName, user: sessionId })

			socket.on('client:joinRoomRequestSuccess', response => {
				console.log('JOIN REQUEST SUCCESS')
				socket.emit('server:joinRoom', sessionId, { room : roomName, user: sessionId })
			})

			socket.on('client:joinRoomSuccess', response => {
				console.log('Join Success :)', response)
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response.onlineUsers })
				this.props.dispatch({ type : 'CURRENT_ROOMNAME', payload : response.roomName })
				this.props.dispatch({ type : 'LOADED' })
			})

			socket.on('client:joinRoomRequestFailure', response => {
				socket.emit('server:createRoom', sessionId, { room : roomName, user: sessionId })
			})

			socket.on('client:createRoomFailure', response => {
				socket.emit('server:joinRoom', sessionId, { room : roomName, user: sessionId })
				console.log('Create Failed :(', response)
			})

			socket.on('client:createRoomSuccess', response => {
				socket.emit('server:joinRoom', sessionId, { room : roomName, user: sessionId })
			})

			socket.on('client:userJoined', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
			})

			socket.on('client:userLeft', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
			})
			
			window.addEventListener('beforeunload', event => {
				event.preventDefault()
				socket.emit('server:disconnect', sessionId, { room : roomName, user: sessionId })
			})

		})
	}


	render() {
		socket.on('connect', () => {
			socket.on('client:newMessage', data => {
				console.log("Got message", data.user, sessionId, data.message)
				this.props.dispatch({ type : 'ADD_THREAD', payload : data })
			})
		})
		console.log('CURRENT ROOM : ', this.props.roomName)
		return (
			(this.props.loading) 
				? 	<div className="loader-class preloader-wrapper big active">
						<PreLoader color="blue"/>
						<PreLoader color="red"/>
						<PreLoader color="yellow"/>
						<PreLoader color="green"/>
					</div>
				:	<div>
						<Navbar socket={socket}/>
						<div className="row">
							<div className="card-panel col s9">
								<ChatMessages/>
							</div>
							<div className="col s3">
								<OnlineUsers socket={socket} sessionId={sessionId}/>
							</div>
						</div>
						<div className="bottom-stick row card-panel teal lighten-5">
							<div className="col m11">
								<ChatBox/>
							</div>
							<div className="col m1">
								<LeaveChat socket={socket}/>
							</div>
						</div>
					</div>
		)
	}
}

export default Index