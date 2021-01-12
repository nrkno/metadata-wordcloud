import React from "react";
import axios from "axios";
import OrigoSuggest from "@nrk/origo-suggest/jsx";
import People from "./people";
import Wordcloud from "./wordcloud";

let suggest;
class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			from: "2020-01-01",
			to: "2021-01-01",
			series: "Dagsnytt 18",
			words: [],
		};
	}
	componentDidMount() {
		suggest = document.getElementById("series-suggest")
	}

	suggestSeries = (event) => {
		if (event.target !== suggest) return
		const body = event.detail.responseJSON || {}
		const items = [].concat(body || [])
		console.log('items', items);
		suggest.innerHTML = `${items.length ? items.slice(0, 10)
			.map((item) => { return `<button>${item}</button>` })
			.join('') : '<button>Ingen resultater</button>'}`
	}
	getTagsData = () => {
		axios
			.get(
				`/api/wordcloud/tags?title=${this.state.series}&from=${this.state.from}&to=${this.state.to}`
			)
			.then(
				function (res) {
					console.log(res.data);
					this.setState({ data: [], words: res.data });
				}.bind(this)
			);
	};
	getPeopleData = () => {
		axios
			.get(
				`/api/wordcloud/people?title=${this.state.series}&from=${this.state.from}&to=${this.state.to}`
			)
			.then(
				function (res) {
					console.log(res.data);
					this.setState({ data: [], words: res.data });
				}.bind(this)
			);
	};
	getData = () => {
		axios
			.get(`/api/?seriesTitle=${this.state.series}&aired=${this.state.from}`)
			.then(
				function (res) {
					console.log(res.data);
					this.setState({ data: res.data, words: [] });
				}.bind(this)
			);
	};

	handleChange = (ev) => {
		this.setState({ [ev.target.name]: ev.target.value });
	};

	render() {
		return (
			<div className="org-grid">
				<div className="org-3of12">
					<label>
						Serietittel:
						<input
							className="org-input"
							name="series"
							onBlur={this.handleChange}
							defaultValue={this.state.series}
							type="text"
						></input>
						<OrigoSuggest
							id='series-suggest'
							onSuggestAjax={this.suggestSeries}
							type="ajax"
							ajax="http://potion3.felles.ds.nrk.no/api/search/series-titles?seriesTitle={{value}}&size=10"
						/>
					</label>
				</div>
				<div className="org-2of12">
					<label>Fra dato: ("Tall" bruker kun denne)</label>
					<input
						className="org-input"
						name="from"
						onBlur={this.handleChange}
						defaultValue={this.state.from}
						type="date"
					></input>
				</div>
				<div className="org-2of12">
					<label>
						Til dato:
						<input
							className="org-input"
							name="to"
							onBlur={this.handleChange}
							defaultValue={this.state.to}
							type="date"
						></input>
					</label>
				</div>
				<div className="org-5of12">
					<button
						onClick={this.getPeopleData}
						className="org-button org-button--primary"
					>
						Ordsky personer
					</button>
					<button
						onClick={this.getTagsData}
						className="org-button org-button--primary"
					>
						Ordsky emner
					</button>
					<button
						onClick={this.getData}
						className="org-button org-button--primary"
					>
						Tall
					</button>
				</div>
				<div className="org-grid">
					<People data={this.state.data} />
					<Wordcloud words={this.state.words} />
				</div>
			</div>
		);
	}
}

export default Search;
