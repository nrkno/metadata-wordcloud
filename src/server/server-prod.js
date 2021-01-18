import "@babel/polyfill";
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import bodyParser from 'body-parser'
import config from '../../webpack.prod.config'
import setApiRoutes from './routes.js';
const { HealthCheck } = require('@nrk/healthcheck');

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, 'index.html'),
            compiler = webpack(config)

app.use(bodyParser.json())

app.use(express.static(DIST_DIR))

const health = new HealthCheck('wordcloud', {});

app.get('/health', (req, res) => {
  const report = health.report();
  if (report.status === 'failed') {
    res.status(500);
  } else {
    res.status(200);
  }
  res.send(health.report());
});

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

const PORT= process.env.PORT || 5000;

app.listen(PORT, () => {
      console.log("App listening on port " + PORT)
      setApiRoutes(app);
});