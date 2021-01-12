import React from "react";
import Header from './header'
import Search from './search'
import Wordcloud from './wordcloud'

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
				
			<Wordcloud />
			</div>
		);
	}
}

export default Frontpage;
