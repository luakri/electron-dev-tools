const path = require('path');
const url = require('url');

const dev = (process.env.NODE_ENV === 'development');

const getAppUrl = exports.getAppUrl = () => {
  // and load the index.html of the app.
  let appUrl;
  if (dev && process.argv.indexOf('--noDevServer') === -1 ) {
    appUrl = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    appUrl = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, '../', 'dist', 'index.html'),
      slashes: true
    });
  }

  return appUrl;
};