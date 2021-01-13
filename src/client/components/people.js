import React from "react";
import Chart from "./chart";
import { OrgAuthority } from "@nrk/origo/jsx";
import OrigoHovercard from "@nrk/origo-hovercard/jsx";
import {sortData} from '../utils';
import {GENDERS} from '../constants'

let statdata = {
	labels: ["Menn", "Kvinner"],
	datasets: [
		{
			label: "Kjønnsfordeling blant gjester",
			fill: false,
			lineTension: 0.1,
			data: [],
			backgroundColor: ["red", "blue"],
		},
	],
};

let partydata = {
	labels: ["R", "Sv", "Ap", "Sp", "MDG", "Krf", "V", "H", "Frp", "Andre"],
	datasets: [
		{
			label: "Partioppslutning",
			fill: false,
			lineTension: 0.1,
			data: [],
			backgroundColor: [
				"#990014",
				"#d94abf",
				"#e51c30",
				"#a6cd39",
				"#3f8706",
				"#f0b619",
				"#26b38b",
				"#00b8f1",
				"#005899",
				"8c8c8c",
			],
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
			const d = sortData(this.props.data)
			statdata.datasets[0].data = [d.male, d.female];
			partydata.datasets[0].data = Object.values(d.politicalParties);
			this.setState({
				total: d.total,
				age: d.age,
				female: d.female,
				male: d.male,
				gendertotal: d.gendertotal,
				political: d.political,
				politicalParties: d.politicalParties,
			});
		}
	}

	render() {
		return (
			<div className="org-grid">
				{this.state.total > 1 && (
					<div className="org-grid">
						<div className="org-6of12">
							<div className="statbox">
								<p className="statheader">Totalt</p>
								<p className="statvalue">{this.state.total}</p>
							</div>
							<div className="statbox">
								<p className="statheader">Menn</p>
								<p className="statvalue">
									{parseInt((this.state.male / this.state.gendertotal) * 100)}%
								</p>
							</div>
							<div className="statbox">
								<p className="statheader">Kvinner</p>
								<p className="statvalue">
									{parseInt((this.state.female / this.state.gendertotal) * 100)}
									%
								</p>
							</div>
							<div className="statbox">
								<p className="statheader">Alder</p>
								<p className="statvalue">{this.state.age}</p>
							</div>
							<div className="statbox">
								<p className="statheader">Politisk</p>
								<p className="statvalue">
									{parseInt((this.state.political / this.state.total) * 100)}%
								</p>
							</div>
						</div>
						<div className="org-6of12">
							<Chart stats={statdata} parties={partydata} />
						</div>
					</div>
				)}

				{this.props.data.length > 1 && (
					<div>
						<hr />
						<table className="org-table">
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
											{p.agent && (
												<OrigoHovercard agent={p.agent.split("/").pop()}>
													{p.name}
												</OrigoHovercard>
											)}
											{!p.agent && p.name}
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
				)}
			</div>
		);
	}
}

export default People;
