# Metadata Wordcloud

Webapp for å forenkle og visualisere SPARQL-spørringer mot radioarkiv.
## Forutsetninger

Installere alle avhengigheter
```
$ yarn install
```

## Kjøre lokalt / utvikling

```
$ yarn build:dev
$ yarn start
```

## Produksjon

```
$ yarn build:prod
$ SPARQL_ENDPOINT=http://xxxxx  yarn start
```



## Deploy

Ingen byggserver satt opp

Bygg docker-image:

```
$ NPM_TOKEN=***** docker build -t plattform.azurecr.io/metadata/wordcloud:1 .
$ docker push plattform.azurecr.io/metadata/wordcloud:1
```

Husk ENV:
SPARQL_ENDPOINT=http://xxxxx
PORT=80

## Dokumentasjon

https://confluence.nrk.no/pages/viewpage.action?pageId=215352826

## Kontakt

anders.ween@nrk.no
