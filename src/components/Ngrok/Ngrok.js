import React, { Component } from 'react';
import { connect } from 'react-redux';
import config from 'electron-json-config';
import { Prompt } from 'react-router-dom';
import * as deepEqual from 'deep-equal';
import cn from 'classname';

import { TextInput, SelectBox, resetUID } from '../inputs.js';
import { actions } from './component.js';

const Ngrok = () => {

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
  ...state.Ngrok
} }
const Settings_mapDispatchToProps = (dispatch) => { return {
  saveSettings: (settings) => {
    config.set('Ngrok.proto', settings.proto);
    config.set('Ngrok.addr', settings.addr);
    config.set('Ngrok.auth', settings.auth);
    config.set('Ngrok.subdomain', settings.subdomain);
    config.set('Ngrok.hostname', settings.hostname);
    config.set('Ngrok.authtoken', settings.authtoken);
    config.set('Ngrok.region', settings.region);

    dispatch( actions.saveSettings(settings) );
  },
  setNgrok: settings => dispatch(actions.setNgrok(settings))
} }
class Settings extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      proto: props.proto,
      addr: props.addr,
      auth: props.auth,
      subdomain: props.subdomain,
      authtoken: props.authtoken,
      region: props.region,
      instanceNgrok: props.instanceNgrok,
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

  redirect(url){
    this.setState({connecting: false, error: false, connected: true});

    const instance = this.props.instanceNgrok;

    this.setState({tunnelUrl: '11'});

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

    this.props.setNgrok(this.state)
    .then(() => this.redirect())
    .catch(error => {

      console.log('error', error);

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
          <h1 className="title">Ngrok</h1>
        </header>

        <div className="box-content">

          <div className="padded">
            <TextInput label="Port" placeholder="Host port eg 8080" value={this.state.addr} onChange={ (value) => { this.setState({addr: value}); } } />
            <SelectBox label="Protocol" value={this.state.proto} onChange={ (value) => { this.setState({proto: value}); } } options={[
              {value: "http", label: "http"},
              {value: "tcp", label: "tcp"},
              {value: "tls", label: "tls"}
            ]} />
            <TextInput label="Auth Token" placeholder="Ngrok Auth token" value={this.state.authtoken} onChange={ (value) => { this.setState({authtoken: value}); } } />
            <TextInput label="Basic Auth" placeholder="user:pwd (requires authtoken)" value={this.state.auth} onChange={ (value) => { this.setState({auth: value}); } } />
            <TextInput label="Subdomain" placeholder="Named subdomain (requires paid plan)" value={this.state.subdomain} onChange={ (value) => { this.setState({subdomain: value}); } } />
            <TextInput label="Hostname" placeholder="Hostname" value={this.state.hostname} onChange={ (value) => { this.setState({hostname: value}); } } />
            <SelectBox label="Region" value={this.state.region} onChange={ (value) => { this.setState({region: value}); } } options={[
              {value: "us", label: "us"},
              {value: "eu", label: "eu"},
              {value: "au", label: "au"},
              {value: "ap", label: "ap"}
            ]} />
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

export default Ngrok;
