import React, { Component } from 'react'
import { connect } from 'react-redux'

@connect((store) => {
	return {
		onlineUsers : store.chatReducer.onlineUsers,
	}
})
class OnlineUsers extends Component {
	render() {
		const { onlineUsers } = this.props 
		console.log('ALL USERS', onlineUsers)
		const onlineList = onlineUsers.map((user, id) => <a href="" key={id} className="collection-item">{user}</a>)
		return (
			<ul class="collection with-header">
				<li class="collection-header"><h5>Online Users</h5></li>
				{onlineList}
			</ul>
		)
	}
}

export default OnlineUsers