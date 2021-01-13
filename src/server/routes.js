const axios = require("axios");
const _ = require("lodash");
import { getTags, getPeople } from "./controllers/sparql";

export default function setApiRoutes(backendServer) {
	backendServer.get("/api/tags", (req, res) => {
		getTags(req.query, function (records, error) {
			if (error) {
				res.send(error);
			} else {
				res.send(records);
			}
		});
	});
	backendServer.get("/api/people", (req, res) => {
		getPeople(req.query, function (records, error) {
			if (error) {
				res.send(error);
			} else {
				res.send(records);
			}
		});
	});
}
