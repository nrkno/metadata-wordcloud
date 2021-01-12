const axios = require("axios");
const _ = require("lodash");
import dotenv from "dotenv";
import { getTags, getPeople } from "./controllers/sparql";
import { getContributors } from "./controllers/potion";
dotenv.config();

export default function setApiRoutes(backendServer) {
	backendServer.get("/api/wordcloud/tags", (req, res) => {
		getTags(req.query, function (records, error) {
			if (error) {
				res.send(error);
			} else {
				res.send(records);
			}
		});
	});
	backendServer.get("/api/wordcloud/people", (req, res) => {
		getPeople(req.query, function (records, error) {
			if (error) {
				res.send(error);
			} else {
				res.send(records);
			}
		});
	});
	backendServer.get("/api", (req, res) => {
		getContributors(req.query, function (records, error) {
			if (error) {
				res.send(error);
			} else {
				res.send(records);
			}
		});
	});
}
