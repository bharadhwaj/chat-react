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
	}
})
class Index extends Component {
	componentWillMount() {
		socket.on('connect', () => {
			socket.emit('server:connect')
			sessionId = socket.io.engine.id
			localStorage.setItem('username', sessionId)
			this.props.dispatch({ type : 'SET_USERNAME', payload : sessionId })
			socket.emit('server:joinRoom', sessionId, { room : 'GENERAL', user: sessionId })

			socket.on('client:joinRoomSuccess', response => {
				console.log('Join Success :)', response)
				this.props.dispatch({ type : 'LOADED' })
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
				this.props.dispatch({ type : 'LOADED' })
			})

			socket.on('client:onlineUsers', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
				// this.props.dispatch({ type : 'LOADED' })
			})

			socket.on('client:userLeft', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
				// this.props.dispatch({ type : 'LOADED' })
			})
			
			window.addEventListener('beforeunload', event => {
				event.preventDefault()
				socket.emit('server:disconnect', sessionId, { room : 'GENERAL', user: sessionId })
			})


		})
	}


	render() {
		socket.on('connect', () => {
			socket.on('client:newMessage', data => {
				console.log("Got message", data.user, sessionId, data.message)
				this.props.dispatch({ type : 'ADD_THREAD', payload : data })
			})
			socket.on('client:onlineUsers', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
				// this.props.dispatch({ type : 'LOADED' })
			})

			socket.on('client:userLeft', response => {
				this.props.dispatch({ type : 'CURRENT_ONLINE_USERS', payload : response })
				// this.props.dispatch({ type : 'LOADED' })
			})
		})
		return (
			(this.props.loading) 
				? 	<div className="preloader-wrapper big active">
						<PreLoader color="blue"/>
						<PreLoader color="red"/>
						<PreLoader color="yellow"/>
						<PreLoader color="green"/>
					</div>
				:	<div>
						<Navbar/>
						<div className="row">
							<div className="col s9">
								<ChatMessages/>
								<ChatBox/>
							</div>
							<div className="col s3">
								<OnlineUsers/>
								<LeaveChat socket={socket}/>
							</div>
						</div>
					</div>
		)
	}
}

export default Index