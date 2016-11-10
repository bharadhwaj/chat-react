export default function reducer(state = { 
	chat : [ ],
	username : null,
}, action) {
	
	switch(action.type) {

		case "ADD_THREAD": {
			return {
				...state,
				chat : [action.payload, ...state.chat],
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