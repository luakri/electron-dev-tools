import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import styles from './component.less';

const MenuRow = (props) => {
  return (
    <NavLink to={props.path} activeClassName="active" exact={true}>
      {props.label}
    </NavLink>
  )
}

const MenuTab = () => {
  return (
      <Settings />
  );
}

class Settings extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      isOpen: false
    };
  }

  handleChange(event) {
    const target = event.target;

    this.setState({
      isOpen: target.checked
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hasOwnProperty('router') && 
    nextProps.hasOwnProperty('router')) {

      if (this.props.router.location.pathname !== nextProps.router.location.pathname) {

        this.setState({
          isOpen: false
        });
      }
    }
  }

  render() {
    return (
      <div className="side-menu">

        <nav role="navigation">
          <div className="side-menu-toggle">
            <input type="checkbox" checked={this.state.isOpen} onChange={this.handleChange.bind(this)}/>

            <span></span>
            <span></span>
            <span></span>

            <ul className="side-menu-content">
              <li>
                <MenuRow path="/" label="Localtunnel" icon="home" />
              </li>
              <li>
                <MenuRow path="/ngrok" label="Ngrok" icon="chart-bar" />
              </li>
              <li className="version">Tunnel Utils ver.0.0.1</li>
            </ul>
          </div>
        </nav>

    </div>
    )
  }
}

const Settings_mapStateToProps = (state) => { return {
  router: state.router
}}

Settings = connect(Settings_mapStateToProps, null)(Settings);

export default MenuTab;
