import React from "react";
import ReactWordcloud from "react-wordcloud";

const options = {
	rotations: 0,
	fontFamily: "LFT Etica",
	enableOptimizations: true,
	fontSizes: [5, 80],
	padding: 2,
	colors: ['#00B9F2','#260859','#00AAAD','#004071','#857D78','#EC0080','#A5CD39','#FFD41A'],
	scale: 'log'
};
const size = [1000, 500];
class Wordcloud extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div>
				{this.props.words && (
					<ReactWordcloud
						options={options}
						size={size}
						words={this.props.words}
					/>
				)}
			</div>
		);
	}
}

export default Wordcloud;
