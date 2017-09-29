import config from 'electron-json-config';
import {CREATE_TUNNEL_SUCCESS, BEGIN_AJAX_CALL} from './actionTypes';
import {setLocalTunnel} from './actions';

// Init reduxHelper
import reduxHelper from '../../utils/reduxHelper.js';
const reduxUtil = reduxHelper('LocalTunnel');

// Include component
import component from './LocalTunnel.js';

// Action Definitions
const SAVE_SETTINGS = reduxUtil.defineAction('SAVE_SETTINGS');

// Initial State
const initialState = {
  // get this from config file (second parameter is the default value if not found)
  inputPort: config.get('LocalTunnel.inputPort', ''),
  inputLocalhost: config.get('LocalTunnel.inputLocalhost', ''),
  inputSubdomain: config.get('LocalTunnel.inputSubdomain', ''),
  connecting: config.get('LocalTunnel.connecting', false),
  instanceTunnel: config.get('LocalTunnel.instanceTunnel', {}),
};

// Make Actions
const actions = {
  saveSettings: reduxUtil.createAction(SAVE_SETTINGS),
  setLocalTunnel
};

// Make reducer
const reducer = reduxUtil.createReducer({
  [SAVE_SETTINGS]: function(state, action) {
    let newState = { ...state, ...action.payload };
    return newState;
  },
  [CREATE_TUNNEL_SUCCESS]: function(state, action) {
    const newState = {}
    Object.assign(newState, state, {instanceTunnel: action.data});
    return newState;
  }
}, initialState);

// Export
export {
  component,
  actions,
  reducer
};
