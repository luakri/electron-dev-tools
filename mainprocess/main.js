// Dependencies
const {app, BrowserWindow, Menu} = require('electron');

const {getWindowSize} = require('./get-window-size');
const {getAppUrl} = require('./get-app-url');

const applicationMenu = require('./application-menu');

const dev = (process.env.NODE_ENV === 'development');

const windows = new Set();

const createWindow = exports.createWindow = () => {
  // Get the window size.
  const windowSize = getWindowSize();

  // Create the browser window.
  let newWindow = new BrowserWindow({
    width: windowSize.vWidth,
    height: windowSize.vHeight,
    maxWidth: windowSize.vWidth,
    maxHeight: windowSize.vHeight,
    minWidth: windowSize.vWidth,
    minHeight: windowSize.vHeight,
    maximizable: false,
    minimizable: true,
    show: false
  });
  windows.add(newWindow);

  // Get app start url
  const appUrl = getAppUrl()
  newWindow.loadURL(appUrl);

  // Don't show until we are ready and loaded
  newWindow.once('ready-to-show', () => {
    newWindow.show();
    // Open the DevTools automatically if developing
    if (dev) {
      newWindow.webContents.openDevTools();
    }
  });

  // Emitted when the window is closed.
  newWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows.delete(newWindow);
    newWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {

  Menu.setApplicationMenu(applicationMenu);

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  //if (mainWindow === null) {
    createWindow();
  //}
});