const mongoose = require("mongoose");

//initializing mongodb
var mongoDB = "mongodb://127.0.0.1/position";
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
const { Position } = defineSchemas();
const fields = "name geometry";

export function countEntries(cb) {
	Position.countDocuments(function (err, count) {
		return cb(count);
	});
}
export function savePosition(positionData, cb) {
	Position.create(positionData, function (err, result) {
		console.log("err", err);
		return cb(result);
	});
}

export function getPositionFromCoordinates(lat, lon, distance, cb) {
	Position.find(
		{
			geometry: {
				$geoWithin: { $centerSphere: [[lat, lon], distance / 3963.2] },
			},
		},
		function (err, data) {
			console.log("data", data);
			return cb(data);
		}
	);
}
export function getEntryByName(name, cb) {
	Position.findOne({ name: name }, function (err, data) {
		console.log("data", data);
		return cb(data);
	});
}

export function getEntryById(id, cb) {
  console.log('id', id);
	Position.findOne({ _id: id }, function (err, data) {
    console.log('data', data);
		return cb(data);
	});
}

function defineSchemas() {
	//Define schemas
	const Schema = mongoose.Schema;
	const lineSchema = new mongoose.Schema({
		type: {
			type: String,
			enum: ["LineString"],
			required: true,
		},
		coordinates: {
			type: [[[Number]]], // Array of arrays of arrays of numbers
			required: true,
		},
	});

	const PositionSchema = new Schema({
		name: String,
		geometry: lineSchema,
	});

	return {
		Position: mongoose.model("Position", PositionSchema),
	};
}
