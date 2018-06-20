import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,Label } from 'react-bootstrap';
import EosClient from './eos-client.jsx';

export default class Unlock extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.eosClient = EosClient();

    this.state = {
      total_vote: 0,
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      var stake = {
        json: true,
        scope: "eosio",
        code: "eosio",
        table: "global",
        limit: 500
      }

      this.eosClient.getTableRows(stake).then((table)=>{
        this.setState({total_vote: table.rows[0].total_activated_stake})
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div><strong>Check out the new <a href="https://eostoolkit.io">eostoolkit.io.</a></strong> Better interface, Transfers, and Permission changing</div>
    );
  }
}
module.hot.accept();
