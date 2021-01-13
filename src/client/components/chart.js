import { takeRightWhile } from "lodash";
import React from "react";
import { Pie, Bar } from "react-chartjs-2";

class Chart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				<div style={{ height: "200px", width: "300px" }}>
					<Pie data={this.props.stats} />
				</div>
				<div style={{ height: "230px", width: "475px" }}>
					<Bar data={this.props.parties} />
				</div>
			</div>
		);
	}
}

export default Chart;
