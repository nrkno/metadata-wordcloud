const axios = require("axios");
const _ = require("lodash");
import dotenv from "dotenv";
dotenv.config();
// get these from CONSTANTS
const parties = {
	'Q493685':'Sp',	
	'Q190219': 'Ap',
	'Q485665': 'Frp',
	'Q500190': 'V',
	'Q1512994': 'R',
	'Q488418': 'Sv',
	'Q586364': 'H'
}
const gender = {
 'http://schema.org/Male': 'Mann',
 'http://schema.org/Female': 'Kvinne'
}

const role = 'http://authority.nrk.no/role/V97'; // intervjuobjekt
const role_medvirkende= 'http://authority.nrk.no/role/N01'
function fetchData(URL) {
	return axios
	.get(URL, {headers: {'Accept': 'application/json'}})
	.then(function(response) {
		return {
			success: true,
			data: response.data
		};
	})
	.catch(function(error) {
		return { success: false };
	});
}

function mapContributors(contributors) {
	return contributors.map(c => {
		return {name: c.contact.title, capacity: c.capacity, uri: c.contact.resId.includes("authority") ?  c.contact.resId : null }
	})
}

function findContributors(events) {
	// parse events for a story and find all contributors with roleId representing intervjuObjekt
	let contribs=[];
	events.forEach(e => {
		if (e.contributors) {
			contribs = contribs.concat(e.contributors.filter(c => {
				return c.role.resId === role || c.role.resId === role_medvirkende
			}))
		}
		})
	return contribs;
} 

function getAge(bd) {
		const birthday = new Date(bd);
		var ageDifMs = Date.now() - birthday.getTime();
		var ageDate = new Date(ageDifMs); // miliseconds from epoch
		return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function setApiRoutes(backendServer) {
	backendServer.get("/api", (req, res) => {
		const url = `http://potion3.felles.ds.nrk.no/api/archive-search/?aired=${req.query.aired}&seriesTitle=${req.query.seriesTitle}`
		console.log('url', url);
		let contributors = [];
		let medvirkende = [];

fetchData(url).then(stories => {
	console.log('stories', stories.data.total);
	stories.data.items.forEach(story => {
		const contr_program = findContributors(story.mediaObject.events);
		contributors = contributors.concat(contr_program);
	})
	// contributors er nå alle intervjuobjekter fra ALLE stories
	// 
	const names = mapContributors(contributors)

	// Sortere ut unike contributors
	const uc = _.uniqBy(names, function (e) {
		return e.name;
	});
	console.log(uc.length);
	//console.log('navn', uc)
	// iterer unike contributors
	
	let arc = [] //autreg contributors 
	uc.forEach(c => {
		if (c.uri) {
			arc.push(c)
		} else {
			medvirkende.push(c)
		}
	}
	)
	console.log('medvirkende som ikke er i autreg:', medvirkende.length)
	const uris = arc.map(a => {
		return a.uri;
	})
	const promises = []
	
	arc.forEach((a) => {
		promises.push(new Promise((resolve, reject) => {
			axios
			.get(a.uri)
			.then((wiki) => {
				const graph = wiki.data['@graph'][0];
				const birthdate = graph['http://authority.nrk.no/datadictionary/dateOfBirth'] && graph['http://authority.nrk.no/datadictionary/dateOfBirth']['@value'] || 'null'
				const gender = graph['http://schema.org/gender'] && graph['http://schema.org/gender']['@id'] || 'null' 
				const wikilink = graph['http://www.w3.org/2000/01/rdf-schema#seeAlso'] && graph['http://www.w3.org/2000/01/rdf-schema#seeAlso']['@id'] || 'null'
				

				if (!wikilink) {
					medvirkende.push({
						capacity: a.capacity,
						name:a.name, 
						agent: a.uri,
						birthdate,
						gender,
						wikilink,
						age: getAge(birthdate)
					})
					resolve()
				} else {
					fetchData(wikilink).then(wdata => {
						if (wdata.data) {
							let party;
							const entity = Object.keys(wdata.data.entities);
							const claims = wdata.data.entities[entity[0]].claims;
							if (claims && claims.P102) {
								party = parties[claims.P102[0].mainsnak.datavalue.value.id]
							}
							medvirkende.push({
								capacity: a.capacity,
								name:a.name, 
								agent: a.uri,
								birthdate,
								gender,
								wikilink,
								age: getAge(birthdate),
								politicalParty: party || null
							})
							resolve()
						}
						
					})
				}
				
			})
		}))
	})
	Promise.all(promises)
	.then(() => {res.send(medvirkende)})
	.catch(() => {res.send('error')})
})
});
}
