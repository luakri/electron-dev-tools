const Promise = require('promise');
const localtunnel = require('localtunnel');

const getOptions = (options) => {
  let opts = {};

  opts.port = (options.inputPort) ? options.inputPort : 80;

  if (options.inputLocalhost) {
    opts['local_host'] = options.inputLocalhost;
  }

  if (options.inputSubdomain) {
    opts.subdomain = options.inputSubdomain;
  }

  return opts;
};

const modSetLocalTunnel = exports.modSetLocalTunnel = (options) => {
  const opts = getOptions(options);

  console.log('localtunnel:options', opts);

  return new Promise(function(resolve, reject){

    localtunnel(opts.port, {}, function(error, tunnel){
      if (error) {
        reject(error);
      } else {
        resolve(tunnel);
      }
    });
  });
};
