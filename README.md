### Electron GUI for localtunnel and ngrok
Electron starter kit forked from https://github.com/pbarbiero/enhanced-electron-react-boilerplate

### To get started:
* Run `npm install`

##### Development
* Run `npm run dev` to start webpack-dev-server
* In another terminal window run `npm run testDev` to start electron

##### Production
_You have two options, an automatic build or two manual steps_

###### One Shot
* Run `npm run package` to have webpack compile your application into `dist/bundle.js` and `dist/index.html`, and then an electron-packager run will be triggered for the current platform/arch, outputting to `builds/`

###### Manual
_Recommendation: Update the "postpackage" script call in package.json to specify parameters as you choose and use the `npm run package` command instead of running these steps manually_
* Run `npm run build` to have webpack compile and output your bundle to `dist/bundle.js`
* Then you can call electron-packager directly with any commands you choose
* Run `npm run package-mac` to compile to distribution mac
* Run `npm run package-win` to compile to distribution windows(Needs to run in a Windows VM, due to ngrok dependencies in shell and executable scripts)
* Run `npm run package-linus` - not tested 

If you want to test the production build (In case you think Babili might be breaking something) after running `npm run build` you can then call `npm run testProd`. This will cause electron to load off of the `dist/` build instead of looking for the webpack-dev-server instance.

### Scaffold Utility
This project comes with a basic scaffold utility (built on inquirer) to quickly add new components to the application. It lets you create both stateful and stateless components, and you also have the option of spinning up Redux boilerplate to integrate them initially to the redux store with a dummy action that you should swap out immediately. Its written in pure node `fs` calls to be cross platform.
* Run `npm run scaffold`
* Fill out the prompts
* Profit!


