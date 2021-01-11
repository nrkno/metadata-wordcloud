import React from 'react'
import Chart from './chart'

let statdata = {
	labels: ['Menn', 'Kvinner'],
	datasets: [
	  {
	    label: 'Kjønnsfordeling blant gjester',
	    fill: false,
	    lineTension: 0.1,
	    data: ['23', '77'],
	    backgroundColor: ["red", "blue", "green", "blue", "red", "blue"]
	  }
	]
    };

class People extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
      }
      componentDidUpdate(prevProps) {
            console.log('pre',prevProps)
            if (this.props != prevProps) {
                  console.log('endret')

            const total = this.props.data.length;
            let male = 0;
            let female = 0;
            let political = 0;
            this.props.data.forEach(p => {
                  if (p.politicalParty) {political ++}
                  if (p.gender === 'http://schema.org/Male') {male ++} else {female ++}
            });
            statdata.datasets[0].data = [male, female];
            console.log('statdata', statdata);
            this.setState({total: total, female: female, male: male, political: political })
            } 
      } 

	render() {
		return (
			<div className='org-grid'>
                        <div>
                              <div className='org-6of12'>
                                    <p>Total: {this.state.total}</p>
                                    <p>Menn: {this.state.male} {parseInt(this.state.male/this.state.total*100)}%</p>
                                    <p>Kvinner: {this.state.female}  {parseInt(this.state.female/this.state.total*100)}%</p>
                                    <p>Politisk: {this.state.political}  {parseInt(this.state.political/this.state.total*100)}%</p>
                              </div>
                              <div className='org-6of12'>
                                    <Chart stats={statdata}/>
                              </div>
                        </div>
                       	{this.props.data.map((p,idx) => (
                        <div key={idx}>
                              <h4>{p.name} ({p.age})</h4>
                              <p>{p.capacity}</p>
                              <p>{p.politicalParty}</p>
                        </div>
				))}
			</div>
		);
	}
}

export default People;