import React from 'react'
import ReactDOM from 'react-dom'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table } from 'react-bootstrap';
import { EosClient } from './scatter-client.jsx';

export default class VoteGenereos extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSetName = this.handleSetName.bind(this);

    this.state = {
      loading: false,
      error: false,
      setName: '',
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});
    })
  }

  handleSetName(e) {
    this.setState({ setName: e.target.value });
  }

  vote(e) {
    e.preventDefault();
    this.setState({loading:true, error:false});
    this.state.eos.transaction(tr => {
      tr.voteproducer({
        voter: this.state.setName,
        proxy: "",
        producers: ['aus1genereos'],
      })
    }).then((data) => {
      console.log(data);
      this.setState({loading:false, error:false});
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    });
  }



  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    return (
      <div>
        <Alert bsStyle="info"><strong>A vote for GenerEOS is a vote for Charity</strong></Alert>
        <p>If you wish to vote for a full set of 30 block producers we encourage you to use <a href="http://eosportal.io" target="new">EOS Portal</a>.<br/>
        However, if you would like to support us directly please use this form.<br/>
        You can read about our charitiable goals on our <a href="https://steemit.com/eos/@genereos/eos-vote-for-the-community-vote-for-charity" target="new">steemit article</a>.</p>
        <Form inline style={{paddingTop: '1em', paddingBottom: '1em'}}>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Your Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.setName}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleSetName}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.vote.bind(this)}>Vote for GenerEOS</Button>
        </Form>
        <div style={{paddingTop: '2em'}}>
          {isError ? (
            <Alert bsStyle="warning">
              <strong>Transaction failed.</strong>
            </Alert>
          ) : (
            isLoading ? (
              <ProgressBar active now={100} label='Querying Network'/>
            ) : (
              <div/>
            )
          )}
        </div>
      </div>
    );
  }
}
module.hot.accept();
