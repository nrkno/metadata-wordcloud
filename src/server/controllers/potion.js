const axios = require("axios");
const _ = require("lodash");
import { WIKI_PARTIES } from '../../client/constants'
import { getAge } from '../../client/utils'

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
		if (e.contributors && e.type === 'Internal') {
			contribs = contribs.concat(e.contributors.filter(c => {
				return c.role.resId === role || c.role.resId === role_medvirkende
			}))
		}
		})
	return contribs;
} 

const role = 'http://authority.nrk.no/role/V97'; // intervjuobjekt
const role_medvirkende= 'http://authority.nrk.no/role/N01'

export function getContributors(query, cb) {
	const url = `http://potion3.felles.ds.nrk.no/api/archive-search/?aired=${query.aired}&seriesTitle=${query.seriesTitle}`
	console.log('url', url);
	let contributors = [];
	let medvirkende = [];

fetchData(url).then(stories => {
	console.log('stories', stories.data.total);

	stories.data.items.forEach(story => {
		console.log(story.mediaObject.title);
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
	names.forEach(c => {
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
								party = WIKI_PARTIES[claims.P102[0].mainsnak.datavalue.value.id]
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
	.then(() => {return cb(medvirkende, null)})
	.catch(() => {return cb(null,error)})
})
}