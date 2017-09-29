import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from 'electron-json-config';
import { Prompt } from 'react-router-dom';
import * as deepEqual from 'deep-equal';
import cn from 'classname';

import { TextInput, SelectBox, resetUID } from '../inputs.js';
import { actions } from './component.js';


const LocalTunnel = () => {

  const onClick = function(event) {
      if (event &&
        event.hasOwnProperty('nativeEvent')) {
        const url = event.nativeEvent.target.href;
        require('electron').shell.openExternal(url)
      }
      event.preventDefault();
  };

  return (
    <div>
      <Settings />
    </div>
  );
}

const Settings_mapStateToProps = (state) => { return {
  ...state.LocalTunnel
} }
const Settings_mapDispatchToProps = (dispatch) => { return {
  saveSettings: (settings) => {
    config.set('LocalTunnel.inputPort', settings.inputPort);
    config.set('LocalTunnel.inputLocalhost', settings.inputLocalhost);
    config.set('LocalTunnel.inputSubdomain', settings.inputSubdomain);
    dispatch( actions.saveSettings(settings) );
  },
  setLocalTunnel: settings => dispatch(actions.setLocalTunnel(settings))
} }
class Settings extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      inputPort: props.inputPort,
      inputLocalhost: props.inputLocalhost,
      inputSubdomain: props.inputSubdomain,
      instanceTunnel: props.instanceTunnel,
      connecting: false,
      connected: false,
      error: false,
      tunnelUrl: ''
    };
    this.originalState = this.state;

    resetUID();
  }

  reset = () => {
    this.setState( this.originalState );
  }

  redirect(data){
    this.setState({connecting: false, error: false, connected: true});

    const instance = this.props.instanceTunnel;

    if (instance &&
      instance.hasOwnProperty('url')) {

      this.setState({tunnelUrl: instance.url});

      require('electron').shell.openExternal(instance.url)
    }
  }

  save = () => {
    if (this.state.connecting) {
      return;
    }

    this.originalState = this.state;
    this.props.saveSettings( this.state );

    this.setState({connecting: true});

    this.props.setLocalTunnel(this.state)
    .then(() => this.redirect())
    .catch(error => {
      console.log('error');

      this.setState({connecting: false, error: true});
    });
  }

  getStatusLabel() {
    let result = 'Connect';

    if (this.state.connected) {
      result = 'Connected';
    } else if (this.state.connecting){
      result = 'Connecting';
    } else if (this.state.error){
      result = 'Error! Try again.';
    }

    return result;
  }
  render() {
    return (
      <div className="box">
        <Prompt
          when={ !deepEqual( this.state, this.originalState ) }
          message="You have unsaved changes in your form. Are you sure you wish to leave?"
        />

        <header className="toolbar toolbar-header app-toolbar">
          <h1 className="title">Localtunnel</h1>
        </header>

        <div className="box-content">

          <div className="padded">
            <TextInput label="Port" placeholder="Host port eg 8080" value={this.state.inputPort} onChange={ (value) => { this.setState({inputPort: value}); } } />
            <TextInput label="Localhost proxy" placeholder="Localhost proxy eg local.dev" value={this.state.inputLocalhost} onChange={ (value) => { this.setState({inputLocalhost: value}); } } />
            <TextInput label="Subdomain" placeholder="Named subdomain" value={this.state.inputSubdomain} onChange={ (value) => { this.setState({inputSubdomain: value}); } } />
            {this.state.connected ?
              <TextInput label="Tunnel URL" value={this.state.tunnelUrl} disabled />
            : null}
          </div>

        </div>

        <footer className="toolbar toolbar-footer">
          <div className="toolbar-actions">
            <button 
              className={cn(
                  ['btn btn-large btn-primary pull-right',
                  {'btn-warning': this.state.connecting},
                  {'btn-negative': this.state.error},
                  {'btn-positive': this.state.connected}])} 
              onClick={this.save}>
              {this.getStatusLabel()}
            </button>
          </div>
        </footer>
      </div>
    );
  }
}
Settings = connect(Settings_mapStateToProps, Settings_mapDispatchToProps)(Settings);

export default LocalTunnel;
