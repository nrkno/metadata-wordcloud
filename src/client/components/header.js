import React from "react";
import { OrgNew } from '@nrk/origo/jsx' 

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<header className='org-bar org-bar--primary'>
                       <OrgNew/> Statistikk
			</header>
		);
	}
}

export default Header;