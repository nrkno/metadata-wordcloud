import React from "react"
import {OrgInfo} from '@nrk/origo/jsx'
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<header className="org-bar org-bar--primary">
				<h1>Ordsky</h1>
				<p><a target="_blank" className='org-button' href="https://confluence.nrk.no/pages/viewpage.action?pageId=215352826"><OrgInfo/></a> fra Metadatateam</p>
			</header>
		);
	}
}

export default Header;
