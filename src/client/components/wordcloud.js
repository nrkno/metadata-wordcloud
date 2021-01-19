import React from "react";
import ReactWordcloud from "react-wordcloud";

let options = {
	rotations: 0,
	fontFamily: "LFT Etica",
	enableOptimizations: true,
	fontSizes: [5, 80],
	padding: 2,
	colors: ['#00B9F2','#260859','#00AAAD','#004071','#857D78','#EC0080','#A5CD39','#FFD41A'],
	scale: 'log'
};
let size = [1000, 500];
class Wordcloud extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.words && this.props.words.length > 1500) {
			options.fontSizes = [7, 70]
			size = [1400, 600];
		} else {
			size = [1000, 500];
			options.fontSizes = [5, 80]
		}
		return (
			<div>
				{this.props.words && (
					<ReactWordcloud
						options={options}
						size={size}
						words={this.props.words}
					/>
				)}

			{this.props.words && 
			<p>Antall ord: {this.props.words.length}</p>
			}
			</div>
		);
	}
}

export default Wordcloud;
