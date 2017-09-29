import {CREATE_TUNNEL_SUCCESS, BEGIN_AJAX_CALL} from './actionTypes';
const {modSetLocalTunnel} = require('./module/local-tunnel')

export const setTunnelSuccess = (data) => {
  return {type: CREATE_TUNNEL_SUCCESS, data};
}

export const beginAjaxCall = () => {
  return {type: BEGIN_AJAX_CALL};
}

export const setLocalTunnel = (options) => {
  return dispatch => {
    dispatch(beginAjaxCall());
    return modSetLocalTunnel({...options}).then(data => {
      console.log('tunnel success', data);
      dispatch(setTunnelSuccess(data));
    }).catch(error => {
      throw(error);
    });
  };
}
