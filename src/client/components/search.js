import React from "react";
import axios from "axios";
import OrigoSuggest from "@nrk/origo-suggest/jsx";
import Wordcloud from "./wordcloud";

let suggest;
class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			from: null,
			to: null,
			series: "Dagsnytt 18",
			words: [],
			disabled: false,
			nohits: false
		};
	}
	componentDidMount() {
		const today = new Date();
		today.setDate(today.getDate() - 1);
		const from = new Date();
		from.setDate(from.getDate() - 365);
		const shortdateTo = today.toISOString().substring(0, 10);
		const shortdateFrom = from.toISOString().substring(0, 10);
		this.setState({ from: shortdateFrom, to: shortdateTo });
		suggest = document.getElementById("series-suggest");
	}

	suggestSeries = (event) => {
		if (event.target !== suggest) return;
		const body = event.detail.responseJSON || {};
		const items = [].concat(body || []);
		suggest.innerHTML = `${
			items.length
				? items
						.slice(0, 10)
						.map((item) => {
							return `<button>${item}</button>`;
						})
						.join("")
				: "<button>Ingen resultater</button>"
		}`;
	};
	getTagsData = () => {
		this.setState({ disabled: true, words: [] });
		axios
			.get(
				`/api/tags?title=${this.state.series}&from=${this.state.from}&to=${this.state.to}`
			)
			.then(
				function (res) {
					this.setState({ disabled: false, data: [], words: res.data,  nohits: res.data.length === 0 });
				}.bind(this)
			);
	};
	getPeopleData = () => {
		this.setState({ disabled: true, words: [] });
		axios
			.get(
				`/api/people?title=${this.state.series}&from=${this.state.from}&to=${this.state.to}`
			)
			.then(
				function (res) {
					
					this.setState({ disabled: false, words: res.data, nohits: res.data.length === 0 });
				}.bind(this)
			);
	};

	handleChange = (ev) => {
		let disabled = false
		const key = ev.target.name;
		const value = ev.target.value
		if (key === 'series' && !value) {
			disabled = true;
		}
		if (key === 'from' && value > this.state.to ) {
			disabled = true;
		}
		if (key === 'to' && value < this.state.from ) {
			disabled = true;
		}


		this.setState({ disabled: disabled, [key]: value });
	};

	render() {
		return (
			<div className="org-grid">
				<div className="org-3of12">
					<label>
						Serietittel (fra Radioarkivet)
						<input
							className="org-input"
							name="series"
							onBlur={this.handleChange}
							defaultValue={this.state.series}
							type="text"
						></input>
						<OrigoSuggest
							id="series-suggest"
							onSuggestAjax={this.suggestSeries}
							type="ajax"
							ajax="http://potion3.felles.ds.nrk.no/api/search/series-titles?seriesTitle={{value}}&size=10"
						/>
					</label>
				</div>
				<div className="org-2of12">
					<label>Fra dato</label>
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
						Til dato
						<input
							className="org-input"
							name="to"
							onBlur={this.handleChange}
							defaultValue={this.state.to}
							type="date"
						></input>
					</label>
				</div>
				<div className="org-5of12" style={{paddingTop: '23px'}}>
					<button
						onClick={this.getPeopleData}
						className="org-button org-button--primary"
						disabled={this.state.disabled}
					>
						Intervjuobjekter
					</button>
					<button
						onClick={this.getTagsData}
						className="org-button org-button--primary"
						disabled={this.state.disabled}
					>
						Emneord
					</button>
				</div>
				<div className="org-grid">
					{this.state.loading && (
						<div className="org-spinner" style={{ height: "120px" }}></div>
					)}
					{this.state.nohits &&
					<p className='message'>Beklager! Fant ingenting. Sjekk i <a href="http://radioarkivet/">Radioarkivet</a> om det er lagt inn data for denne perioden.</p>
					} 
					{this.state.words.length > 1 && (
						<Wordcloud words={this.state.words} />
					)}
				</div>
			</div>
		);
	}
}

export default Search;
