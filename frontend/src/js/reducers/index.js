import { combineReducers } from 'redux'

import pageReducer from './pageReducer'
import chatReducer from './chatReducer'

export default combineReducers({ 
	pageReducer,
	chatReducer,
})