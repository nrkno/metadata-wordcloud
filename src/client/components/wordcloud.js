import React from "react";
import ReactWordcloud from "react-wordcloud";

const options = {
	rotations: 0,
	fontFamily: "LFT Etica",
	fontWeight: "bold",
	rotationAngles: [-90, 0],
};
const size = [600, 400];
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
