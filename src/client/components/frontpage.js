import React from "react";
import Header from './header'
import Search from './search'


class Frontpage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="org-root">
				<Header/>
				<Search/>
			</div>
		);
	}
}

export default Frontpage;
