import React from 'react'
import ReactDOM from 'react-dom'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table } from 'react-bootstrap';
import { EosClient } from './scatter-client.jsx';

export default class ManageProxy extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleRegProxy = this.handleRegProxy.bind(this);
    this.handleSetProxy = this.handleSetProxy.bind(this);
    this.handleSetName = this.handleSetName.bind(this);

    this.state = {
      loading: false,
      error: false,
      regProxy: '',
      setProxy: '',
      setName: '',
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});
    })
  }

  handleRegProxy(e) {
    this.setState({ regProxy: e.target.value });
  }

  handleSetProxy(e) {
    this.setState({ setProxy: e.target.value });
  }

  handleSetName(e) {
    this.setState({ setName: e.target.value });
  }

  resetForms() {
    this.setState({
      regProxy: '',
      setProxy: '',
      setName: '',
    });
  }

  regProxy(e) {
    e.preventDefault();
    this.setState({loading:true, error:false});
    this.state.eos.transaction(tr => {
      tr.regproxy({
        proxy: this.state.regProxy,
        isproxy: 1
      })
    }).then((data) => {
      console.log(data);
      this.setState({loading:false, error:false});
      this.resetForms();
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    });
  }

  setProxy(e) {
    e.preventDefault();
    this.setState({loading:true, error:false});
    this.state.eos.transaction(tr => {
      tr.voteproducer({
        voter: this.state.setName,
        proxy: this.state.setProxy
      })
    }).then((data) => {
      console.log(data);
      this.setState({loading:false, error:false});
      this.resetForms();
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
        <Alert bsStyle="info"><strong>Register as Proxy:</strong> You will vote on behalf of others.</Alert>
        <Form inline style={{paddingTop: '1em', paddingBottom: '1em'}}>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Your Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.regProxy}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleRegProxy}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.regProxy.bind(this)}>Become Proxy</Button>
        </Form>
        <Alert bsStyle="info"><strong>Set a Proxy:</strong> They will vote on your behalf.</Alert>
        <Form inline style={{paddingTop: '1em'}}>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Your Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.setName}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleSetName}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}<br/><br/>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Proxy Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.setProxy}
              placeholder="Account Name"
              onChange={this.handleSetProxy}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.setProxy.bind(this)}>Set Proxy</Button>
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
