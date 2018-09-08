'use strict';

const Fs = require('fs');
const Path = require('path');
const Glue = require('glue');
const cluster = require('cluster');
const Config = require('./config');

const manifest = {
  server: Config.server,
  register: Config.register
};
const opts = {
  relativeTo: Path.join(__dirname)
};

global.Boom = require('boom');
global._ = require('lodash');

function onRequest(request, h) {
  /*
		Here you can intercept the request object
	*/
  return h.continue;
}

function onPreResponse(request, h) {
  /*
		Here you can intercept the response object
	*/

  const response = request.response;
  if (response.isBoom && response.output.statusCode === 404) {
    return h.file('index.html');
  }

  return h.continue;
}(async function() {

  try {
    if (cluster.isMaster && process.env.NODE_ENV === 'production') {
      console.log(`Master ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < 2; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      const server = await Glue.compose(manifest, opts);
      await server.initialize();

      server.ext('onRequest', onRequest);
      server.ext('onPreResponse', onPreResponse);

      await server.start();
      server.log(['info'], `Server is listening on ${server.info.uri}`);
    }
  } catch (e) {
    console.log(e);
  }
})();
