const Promise = require('promise');
const path = require('path');
const childProcess = require('child_process');
const platform = require('os').platform();
const bin = './ngrok' + (platform === 'win32' ? '.exe' : '');

const getOptions = (options) => {
  let parsed = {};
  let opts = [];

  const proto = (options.proto) ? options.proto : 'http';
  const addr = (options.addr) ? options.addr : 80;

  if (options.auth) { parsed.auth = options.auth; }

  if (options.subdomain) { parsed.subdomain = options.subdomain; }

  if (options.hostname) { parsed.hostname = options.hostname; }

  if (options.authtoken) { parsed.authtoken = options.authtoken; }

  if (['us', 'eu', 'au', 'ap'].indexOf(options.region) === -1) {
    opts.region = 'us';
  }

  opts.push(proto);
  opts.push(addr);

  Object.keys(parsed).forEach(function(key) {
    opts.push(`-${key}=${parsed[key]}`);
  });

  opts.push('-log=stdout');
  opts.push('-log-level=debug');

  return opts;
};

const modSetNgrok = exports.modSetNgrok = (options) => {

  const app = require('electron').remote.app;
  let appPath = app.getAppPath();

  if (process.env.NODE_ENV === 'production') {
    appPath = appPath.replace('app.asar', 'app.asar.unpacked')
  }

  console.log('ngrok:options', appPath);

  const ngrokDir = path.resolve(appPath, 'node_modules', 'ngrok', 'bin');

  const opts = getOptions(options);

  let url = '';

  return new Promise((resolve, reject) => {

    const ngrok = childProcess.execFile(bin, opts, {cwd: ngrokDir});

    ngrok.stdout.on('data', (data) => {

      var NgrokOutputParser = require('./ngrok_output_parser');

      var parser = new NgrokOutputParser(data.toString());

      if (parser.sessionEstablished()) {
        url = parser.getUrl() || 'unknown';

        console.log('ngrok:sessionEstablished', url);
      }

      if (parser.heartbeatDetected()) {
        console.log('ngrok:heartbeatDetected', url);

        resolve(url);
      }

      if (parser.tooManyTunnelsOpen()) {
        console.log('ngrok:reject');
        reject();
      }

    });

    ngrok.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    ngrok.on('close', (code) => {
      console.log(`child process exited with code ${code}`);

      reject();
    });

  });
};
