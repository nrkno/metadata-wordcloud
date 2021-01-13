import React from "react";
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<header className="org-bar org-bar--primary">
				<h1>Metadata Ordsky</h1>
			</header>
		);
	}
}

export default Header;
