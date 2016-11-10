import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

import store from './store'

import Index from './pages/IndexPage'

ReactDOM.render(
	<Provider store={store}>
		<Router history={hashHistory}>
			<Route path="/" component={Index}>
			</Route>
		</Router>
	</Provider>,
	document.getElementById('main')
)