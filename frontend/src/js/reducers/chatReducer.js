export default function reducer(state = { 
	chat : [ ],
	username : null,
	onlineUsers : [ ]
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

		case "SET_USERNAME": {
			return {
				...state,
				username : action.payload,
			}
		}

		default: {
			return {...state}
		}
	}

	return state;
}