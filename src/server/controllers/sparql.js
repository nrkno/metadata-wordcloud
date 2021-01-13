const SparqlClient = require("sparql-http-client");

const endpointUrl = process.env.SPARQL_ENDPOINT //"http://malxradioarkivdb01:8890/sparql";

function buildTagsQuery(title, from, to) {
	return `
 PREFIX ebuccdm: <http://www.ebu.ch/metadata/ontologies/ebuccdm#> 
 PREFIX nrkdatadictionary: <http://authority.nrk.no/datadictionary/>
 PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
 prefix nrkdataordbok: <http://gluon.nrk.no/dataordbok.xml#>
 PREFIX dcterms: <http://purl.org/dc/terms/>
 PREFIX digasclass: <http://id.nrk.no/2013/digas/class/> 
 PREFIX radioarkiv: <http://id.nrk.no/2014/arkiv/ontology#>
 PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
 
 SELECT ?emne (COUNT(?emne) as ?antall)
 where {
       ?program a nrkdataordbok:programme;
                         dcterms:title ?programtittel;
                         dcterms:subject ?emne .
       
       FILTER ((REGEX(?programtittel, "${title}", "i")))
 
       ?transmission ebuccdm:playsOut ?program .
       OPTIONAL {
             ?transmission nrkdataordbok:reprise ?reprise .
       }
 
       ?transmission nrkdataordbok:transmissionDate ?sendedato .
 
       FILTER (!bound(?reprise))
       FILTER (?sendedato >= "${from}T00:00:00+02:00"^^xsd:dateTime)
       FILTER (?sendedato < "${to}T00:00:00+02:00"^^xsd:dateTime)
 }
 group by ?emne
 order by ?emne
 `;
}

function buildPeopleQuery(title, from, to) {
	return `
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX ebuccdm: <http://www.ebu.ch/metadata/ontologies/ebuccdm#> 
      PREFIX nrkdatadictionary: <http://authority.nrk.no/datadictionary/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      prefix nrkdataordbok: <http://gluon.nrk.no/dataordbok.xml#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX digasclass: <http://id.nrk.no/2013/digas/class/> 
      PREFIX radioarkiv: <http://id.nrk.no/2014/arkiv/ontology#>
      PREFIX nrkrole: <http://authority.nrk.no/role/>
      SELECT distinct ?navn (COUNT(DISTINCT ?contributor) as ?antall)
      where {
          ?record radioarkiv:describes ?program ;
          a radioarkiv:Record .
        
               ?program dcterms:title ?programtittel .
          FILTER ((REGEX(?programtittel, "${title}", "i")))
          ?transmission ebuccdm:playsOut ?program .
        
              ?transmission nrkdataordbok:transmissionDate ?sendedato .
              
              FILTER (?sendedato >= "${from}T00:00:00+02:00"^^xsd:dateTime)
              FILTER (?sendedato < "${to}T00:00:00+02:00"^^xsd:dateTime)
      
              {
          ?program ebuccdm:hasContributor ?contributor .
          ?contributor nrkdataordbok:name ?navn ;
          ebuccdm:hasRole  ?rolle .
                FILTER (?rolle != <http://authority.nrk.no/role/V490>) #ikke redigerer
                FILTER (?rolle != <http://authority.nrk.no/role/V90>) #ikke produsent
                FILTER (?rolle != <http://authority.nrk.no/role/V491>) #ikke produksjonsleder
                     FILTER (?rolle != <http://authority.nrk.no/role/V808>) #ikke ensemble
                FILTER (?rolle != <http://authority.nrk.no/role/V34>) #ikke komponist
                FILTER (?rolle != <http://authority.nrk.no/role/V809>) #ikke band
                     FILTER (?rolle != <http://authority.nrk.no/role/V35>) #ikke utøver
                   FILTER (?rolle != <http://authority.nrk.no/role/N04>) #ikke omtalt
                FILTER (?rolle != <http://authority.nrk.no/role/V40>) #ikke programleder
                FILTER (?rolle != <http://authority.nrk.no/role/V31>) #ikke vaktsjef
                FILTER (?rolle != <http://authority.nrk.no/role/V721>) #ikke nyhetsoppleser
                FILTER (?rolle != <http://authority.nrk.no/role/V36>) #ikke reporter
                FILTER (?rolle != <http://authority.nrk.no/role/N20>) #ikke prosjektleder
                FILTER (?rolle != <http://authority.nrk.no/role/N02>) #ikke bidragsyter
                FILTER (?rolle != <http://authority.nrk.no/role/V493>) #ikke researcher 
                FILTER (?rolle != <http://authority.nrk.no/role/V718>) #ikke lyddesigner
                FILTER (?rolle != <http://authority.nrk.no/role/V719>) #ikke arrangør
                FILTER (?rolle != <http://authority.nrk.no/role/V49>) #ikke lydtekniker
                FILTER (?rolle != <http://authority.nrk.no/role/N321>) #ikke anmelder
                FILTER (?rolle != <http://authority.nrk.no/role/V482>) #ikke journalist
                FILTER (?rolle != <http://authority.nrk.no/role/V84>) #ikke intervjuer
        }
        }
      GROUP BY ?navn ?antall
      ORDER BY ?navn
 `;
}
export async function getTags(q, cb) {
	const client = new SparqlClient({ endpointUrl });
	const stream = await client.query.select(
		buildTagsQuery(q.title, q.from, q.to)
	);
	let tags = [];
	stream
		.on("data", (row) => {
			let emne;
			Object.entries(row).forEach(([key, value]) => {
				if (key === "emne") {
					emne = value.value;
				}
				if (key === "antall") {
					tags.push({ text: emne, value: value.value });
				}
			});
		})
		.on("end", () => {
			return cb(tags, null);
		})
		.on("error", function (err) {
			return cb(null, err);
		});
}

export async function getPeople(q, cb) {
	const client = new SparqlClient({ endpointUrl });
	const stream = await client.query.select(
		buildPeopleQuery(q.title, q.from, q.to)
	);
	let people = [];
	stream
		.on("data", (row) => {
			let navn;
			Object.entries(row).forEach(([key, value]) => {
				if (key === "navn") {
					navn = value.value;
				}
				if (key === "antall") {
					people.push({ text: navn, value: value.value });
				}
			});
		})
		.on("end", () => {
			return cb(people, null);
		})
		.on("error", function (err) {
			return cb(null, err);
		});
}
