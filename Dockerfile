FROM plattform.azurecr.io/vp/docker-node:node12
ARG NPM_TOKEN
RUN echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' >> /root/.npmrc
WORKDIR /app
COPY package.json package-lock.json README.md /build/
ADD . /app/
RUN npm ci --no-progress --loglevel error
RUN npm prune --production
EXPOSE 5000
CMD [ "node", "build/server.js" ]
