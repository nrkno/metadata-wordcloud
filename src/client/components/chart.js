import { takeRightWhile } from "lodash";
import React from "react";
import { Pie } from 'react-chartjs-2';



class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div>
                        <Pie data={this.props.stats} />
			</div>
		);
	}
}

export default Chart;