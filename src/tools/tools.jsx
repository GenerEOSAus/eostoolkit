import React from 'react'
import { Panel } from 'react-bootstrap';
import AccountLookup from './account-lookup.jsx'
import AccountCreate from './account-create.jsx'
import ManageProxy from './manage-proxy.jsx'
import VoteGenereos from './vote-genereos.jsx'

export default class Tools extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}
