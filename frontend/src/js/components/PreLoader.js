import React, { Component } from 'react'

class PreLoader extends Component {

	render() {		
		const classValue = 'spinner-layer spinner-'+this.props.color
		return (
			<div className={classValue}>
				<div className="circle-clipper left">
					<div className="circle"></div>
				</div>
				<div className="gap-patch">
					<div className="circle"></div>
				</div>
				<div className="circle-clipper right">
					<div className="circle"></div>
				</div>
			</div>
		)
	}
}

export default PreLoader