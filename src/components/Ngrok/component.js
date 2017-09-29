import config from 'electron-json-config';
import {CREATE_TUNNEL_SUCCESS, BEGIN_AJAX_CALL} from './actionTypes';
import {setNgrok} from './actions';

// Init reduxHelper
import reduxHelper from '../../utils/reduxHelper.js';
const reduxUtil = reduxHelper('LocalTunnel');

// Include component
import component from './Ngrok.js';

// Action Definitions
const SAVE_SETTINGS = reduxUtil.defineAction('SAVE_SETTINGS');

// Initial State
const initialState = {
  // get this from config file (second parameter is the default value if not found)
  proto: config.get('Ngrok.proto', 'http'),
  addr: config.get('Ngrok.addr', ''),
  auth: config.get('Ngrok.auth', ''),
  subdomain: config.get('Ngrok.subdomain', ''),
  hostname: config.get('Ngrok.hostname', ''),
  authtoken: config.get('Ngrok.authtoken', ''),
  region: config.get('Ngrok.region', 'us'),
  connecting: config.get('Ngrok.connecting', false),
  instanceNgrok: config.get('Ngrok.instanceNgrok', {}),
};

// Make Actions
const actions = {
  saveSettings: reduxUtil.createAction(SAVE_SETTINGS),
  setNgrok
};

// Make reducer
const reducer = reduxUtil.createReducer({
  [SAVE_SETTINGS]: function(state, action) {
    let newState = { ...state, ...action.payload };
    return newState;
  },
  [CREATE_TUNNEL_SUCCESS]: function(state, action) {
    const newState = {}
    Object.assign(newState, state, {instanceNgrok: {url: action.data}});
    return newState;
  }
}, initialState);

// Export
export {
  component,
  actions,
  reducer
};
