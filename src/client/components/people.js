import React from "react";
import Chart from "./chart";
import { OrgAuthority } from "@nrk/origo/jsx";

const GENDERS = {
	'http://schema.org/Female': 'Kvinne',
	'http://schema.org/Male': 'Mann'
}


let statdata = {
	labels: ["Menn", "Kvinner"],
	datasets: [
		{
			label: "Kjønnsfordeling blant gjester",
			fill: false,
			lineTension: 0.1,
			data: ["23", "77"],
			backgroundColor: ["red", "blue", "green", "blue", "red", "blue"],
		},
	],
};

class People extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidUpdate(prevProps) {
		if (this.props != prevProps) {
			const total = this.props.data.length;
			let male = 0;
			let female = 0;
			let political = 0;
			this.props.data.forEach((p) => {
				if (p.politicalParty) {
					political++;
				}
				if (p.gender === "http://schema.org/Male") {
					male++;
				}
				if (p.gender === "http://schema.org/Female") {
					female++;
				}
			});
			const gendertotal = male + female;
			statdata.datasets[0].data = [male, female];
			this.setState({
				total: total,
				female: female,
				male: male,
				gendertotal: gendertotal,
				political: political,
			});
		}
	}

	render() {
		return (
			<div className="org-grid">
				{this.state.total > 1 && (
					<div className="org-grid">
						<div className="org-8of12">
							<div className="statbox">
								<p>Totalt: {this.state.total}</p>
							</div>
							<div className="statbox">
								<p>
									Menn:{" "}
									{parseInt((this.state.male / this.state.gendertotal) * 100)}%
								</p>
							</div>
							<div className="statbox">
								<p>
									Kvinner:
									{parseInt((this.state.female / this.state.gendertotal) * 100)}
									%
								</p>
							</div>
							<div className="statbox">
								<p>
									Politisk:{" "}
									{parseInt((this.state.political / this.state.total) * 100)}%
								</p>
							</div>
						</div>
						<div className="org-4of12">
							<Chart stats={statdata} />
						</div>
					</div>
				)}
				<hr />
				<div>
					<table class="org-table">
						<thead>
							<tr>
								<th>Person</th>
								<th>Tittel</th>
								<th>Kjønn</th>
								<th>Alder</th>
								<th>Parti</th>

							</tr>
						</thead>
						<tbody>
						{this.props.data.map((p, idx) => (
							<tr key={`${idx}`}>
								<td>
									{p.name} {p.agent ? <OrgAuthority/> : ''}
								</td>
								<td>{p.capacity}</td>
								<td>{GENDERS[p.gender]}</td>
								<td>{p.age}</td>
								<td>{p.politicalParty}</td>
								</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default People;
