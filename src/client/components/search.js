import React from "react";
import axios from "axios";
import People from './people'

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
                  data: []
		};
      }
      getData = () => {
		axios.get(`/api/?seriesTitle=${this.state.series}&aired=${this.state.aired}`).then(
			function (res) {
				console.log(res.data);
				this.setState({ data: res.data });
			}.bind(this)
		);
      }

      handleChange = (ev) => {
		this.setState({ [ev.target.name]: ev.target.value });
      };
      
	render() {
		return (
			<div className='org-grid'>
                        <div className='org-5of12'>
                              <input className='org-input' name='series' onBlur={this.handleChange} type='text'></input>
                        </div>
                        <div className='org-5of12'>
                              <input className='org-input' name='aired' onBlur={this.handleChange} type='date'></input>
                        </div>
                        <div className='org-2of12'>
                              <button onClick={this.getData} className='org-button org-button--primary'>Oppdater</button>
                        </div>
                        <div className="org-grid">
					<People data={this.state.data}/>
				</div>
			</div>
		);
	}
}

export default Search;