export default function reducer(state = { 
	chat : [ ],
	username : null,
	roomName : 'GENERAL',
	onlineUsers : [ ],
}, action) {
	
	switch(action.type) {

		case "ADD_THREAD": {
			return {
				...state,
				chat : [...state.chat, action.payload],
			}
		}

		case "CURRENT_ONLINE_USERS": {
			return {
				...state,
				onlineUsers : action.payload,
			}
		}

		case "CURRENT_ROOMNAME": {
			return {
				...state,
				roomName : action.payload,
			}
		}
		
		case "SET_USERNAME": {
			return {
				...state,
				username : action.payload,
			}
		}

		// case "MARK_READ": {
		// 	return {
		// 		...state,
		// 		chat : [...state.chat.map(thread => { if (thread.room === action.payload) { thread.read = true } return thread }) ]
		// 	}
		// }
		
		default: {
			return {...state}
		}
	}

	return state;
}