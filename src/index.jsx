import React from 'react'
import ReactDOM from 'react-dom'
import Eos from 'eosjs'
import update from 'react-addons-update';
import { Panel } from 'react-bootstrap';
import AccountLookup from './account-lookup.jsx'





class Toolkit extends React.Component {
  constructor(props) {
    super(props)

  }


  render() {
    return (
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Lookup Accounts</Panel.Title>
          </Panel.Heading>
          <Panel.Body><AccountLookup/></Panel.Body>
        </Panel>
    );
  }
}

ReactDOM.render(<Toolkit />, document.getElementById('app'));

module.hot.accept();
