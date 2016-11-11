export default function reducer(state = { 
	loading : true,
}, action) {
	
	switch(action.type) {

		case "LOADED": {
			return {
				...state,
				loading : false,
			}
		}

		case "LOADING": {
			return {
				...state,
				loading : true,
			}
		}

		default: {
			return {...state}
		}
	}

	return state;
}