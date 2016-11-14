import React, { Component } from 'react'

class Navbar extends Component {

	render() {		
		return (
			<div className="row">
				<nav className="teal">
					<div className="nav-wrapper teal">
						<span className="brand-logo center">
							<h4>Chat App</h4>
						</span>
					</div>
				</nav>
			</div>
		)
	}
}

export default Navbar