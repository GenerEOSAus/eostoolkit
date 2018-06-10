import React from 'react'
import ReactDOM from 'react-dom'
import Eos from 'eosjs'
import update from 'react-addons-update';
import { Panel } from 'react-bootstrap';
import AccountLookup from './account-lookup.jsx'
import AccountCreate from './account-create.jsx'
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
      </div>
    );
  }
}

ReactDOM.render(<Toolkit />, document.getElementById('app'));

module.hot.accept();
