import React from 'react'
import ReactDOM from 'react-dom'
import Eos from 'eosjs'
import update from 'react-addons-update';
import { Panel } from 'react-bootstrap';
import AccountLookup from './account-lookup.jsx'
import AccountCreate from './account-create.jsx'
import ManageProxy from './manage-proxy.jsx'
import VoteGenereos from './vote-genereos.jsx'
import { ScatterConnect } from './scatter-client.jsx'




class Toolkit extends React.Component {
  constructor(props) {
    super(props)

  }


  render() {
    return (
      <div>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Scatter Integration</Panel.Title>
          </Panel.Heading>
          <Panel.Body><ScatterConnect/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Lookup Accounts</Panel.Title>
          </Panel.Heading>
          <Panel.Body><AccountLookup/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Create Account</Panel.Title>
          </Panel.Heading>
          <Panel.Body><AccountCreate/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Proxy Management</Panel.Title>
          </Panel.Heading>
          <Panel.Body><ManageProxy/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Vote</Panel.Title>
          </Panel.Heading>
          <Panel.Body><VoteGenereos/></Panel.Body>
        </Panel>
        <p style={{float: 'right'}}>Copywrite &copy; GenerEOS 2018 | <a href="https://www.genereos.io" target="new">Website</a> | <a href="https://github.com/genereos/eostoolkit" target="new">GitHub</a></p>
      </div>
    );
  }
}

ReactDOM.render(<Toolkit />, document.getElementById('app'));

module.hot.accept();
