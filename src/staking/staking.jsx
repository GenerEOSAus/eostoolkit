import React from 'react'
import { Panel } from 'react-bootstrap';
import AccountLookup from '../tools/account-lookup.jsx'
import UndeletegateBandwidth from './unstake-bandwidth.jsx'
import DeletegateBandwidth from './stake-bandwidth.jsx'
export default class Staking extends React.Component {
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
            <Panel.Title componentClass="h3">Undelegate Bandwidth (Unstake)</Panel.Title>
          </Panel.Heading>
          <Panel.Body><UndeletegateBandwidth/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Delegate Bandwidth (Stake)</Panel.Title>
          </Panel.Heading>
          <Panel.Body><DeletegateBandwidth/></Panel.Body>
        </Panel>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Withdraw (after Unstake period)</Panel.Title>
          </Panel.Heading>
          <Panel.Body>Coming soon...</Panel.Body>
        </Panel>
      </div>
    );
  }
}
