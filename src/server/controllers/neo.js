const neo4j = require("neo4j");
const db = new neo4j.GraphDatabase("http://neo4j:password@localhost:7474");

export function createUniverse(body, cb) {
	const query = `MATCH (p {uri: '${body.uri}'}) CREATE (p)-[r:PART_OF]->(u:Universe {name: '${body.title}', url:'${body.url}' }) RETURN p,r,u`;
      console.log('query', query);
      db.cypher(
		{
			query: query,
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getUniverseFromNode(uri, cb) {
	// MATCH (p {uri: 'http://authority.nrk.no/agent/9dd07d8e-3820-4765-b438-9b1136517fe1'})-[r:PART_OF]-(u:Universe) MATCH (a:Article)-[]-(u) MATCH (v:Videoclip)-[]-(u) RETURN u,a,v
	const query = `MATCH (p {uri: '${uri}'})-[r:PART_OF]-(u:Universe) RETURN u`;
	console.log('query', query);
	db.cypher(
		{
			query: query,
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getRelations(cb) {
	db.cypher(
		{
			query: "MATCH ()-[r]-() RETURN DISTINCT type(r) AS r",
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getPersons(cb) {
	db.cypher(
		{
			query: "MATCH (n:Person) RETURN n",
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getRoles(cb) {
	db.cypher(
		{
			query: "MATCH (n:Role) RETURN n",
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getLocations(cb) {
	db.cypher(
		{
			query: "MATCH (n:Location) RETURN n",
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}

export function getEvents(cb) {
	db.cypher(
		{
			query: "MATCH (n:Event) RETURN n",
		},
		function (err, results) {
			if (err) throw err;
			return cb(results);
		}
	);
}
export function getRelationsFromRole(uri, cb) {
	console.log('role');
	// MATCH (p:Location)-[rel]-(d) MATCH (p:Location {uri: "https://stadnamn.nrk.no/api/location/2-4140704"}) RETURN p, rel, d
	db.cypher(
		{
			query: `MATCH (p)<-[rel]-(d) MATCH (p:Role {uri: "${uri}"}) RETURN p, rel, d`,
		},
		function (err, results) {
			console.log(results);
			console.log("error", err);
			if (err) throw err;
			return cb(
				results.map((r) => {
					const p = { type: r.p.labels[0], properties: r.p.properties };
					const rel = r.rel.type;
					const role = { type: r.d.labels[0], properties: r.d.properties };
					return { p, rel, role };
				})
			);
		}
	);
}
export function getRelationsFromCorporation(uri, cb) {
	db.cypher(
		{
			query: `MATCH (p)-[rel]->(d) MATCH (p:Corporation {uri: "${uri}"}) RETURN p, rel, d`,
		},
		function (err, results) {
			console.log(results);
			if (err) throw err;
			return cb(
				results.map((r) => {
					const p = { type: r.p.labels[0], properties: r.p.properties };
					const rel = r.rel.type;
					const role = { type: r.d.labels[0], properties: r.d.properties };
					return { p, rel, role };
				})
			);
		}
	);
}
export function getRelationsFromLocation(uri, cb) {
	db.cypher(
		{
			query: `MATCH (p)-[rel]->(d) MATCH (p:Location {uri: "${uri}"}) RETURN p, rel, d`,
		},
		function (err, results) {
			console.log(results);
			console.log("error", err);
			if (err) throw err;
			return cb(
				results.map((r) => {
					const p = { type: r.p.labels[0], properties: r.p.properties };
					const rel = r.rel.type;
					const role = { type: r.d.labels[0], properties: r.d.properties };
					return { p, rel, role };
				})
			);
		}
	);
}
export function getRelationsFromAgent(uri, cb) {
	// MATCH (p:Person)-[rel]-(d) MATCH (p:Person {uri: "http://authority.nrk.no/agent/9dd07d8e-3820-4765-b438-9b1136517fe1"}) RETURN p, rel, d
	db.cypher(
		{
			query: `MATCH (p)-[rel]->(d) MATCH (p:Person {uri: "${uri}"}) RETURN p, rel, d`,
		},
		function (err, results) {
			if (err) throw err;
			return cb(
				results.map((r) => {
					const p = { type: r.p.labels[0], properties: r.p.properties };
					const rel = r.rel.type;
					const role = { type: r.d.labels[0], properties: r.d.properties };
					return { p, rel, role };
				})
			);
		}
	);
}
