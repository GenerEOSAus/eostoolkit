import React from 'react'
import update from 'react-addons-update';
import Eos from 'eosjs'
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table, Checkbox,Popover,OverlayTrigger } from 'react-bootstrap';
import { EosClient } from '../scatter-client.jsx';

export default class AccountCreate extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleOwner = this.handleOwner.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.handleCreator = this.handleCreator.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleNet = this.handleNet.bind(this);
    this.handleCpu = this.handleCpu.bind(this);
    this.handleRam = this.handleRam.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);

    this.state = {
      loading: false,
      error: false,
      reason: '',
      owner: '',
      active: '',
      name: '',
      creator: '',
      net: 0.1,
      cpu: 0.1,
      ram: 8192,
      transfer: true,
      eos: null
    };


    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
    }
  }

  getNameValidation() {
    const name = this.state.name;
    let regEx = new RegExp("^([a-z1-5]){12,}$");
    if (name.length == 12 && regEx.test(name)) return 'success'
    else return 'error';
    return null;
  }

  handleActive(e) {
    this.setState({ active: e.target.value });
  }

  handleOwner(e) {
    this.setState({ owner: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleCreator(e) {
    this.setState({ creator: e.target.value });
  }

  handleNet(e) {
    this.setState({ net: e.target.value });
  }

  handleCpu(e) {
    this.setState({ cpu: e.target.value });
  }

  handleRam(e) {
    this.setState({ ram: e.target.value });
  }

  handleTransfer(e) {
    this.setState({ transfer: e.target.checked });
  }

  resetForm() {
    this.setState({
      owner: '',
      active: '',
      name: '',
      creator: '',
      net: 0.1,
      cpu: 0.1,
      ram: 8192,
      transfer: true,
    });
  }

  createAccount(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, reason:''});1
    this.state.eos.transaction(tr => {
      tr.newaccount({
        creator: this.state.creator,
        name: this.state.name,
        owner: this.state.owner,
        active: this.state.active
      })
      tr.buyrambytes({
        payer: this.state.creator,
        receiver: this.state.name,
        bytes: Number(this.state.ram)
      })
      tr.delegatebw({
        from: this.state.creator,
        receiver: this.state.name,
        stake_net_quantity: this.state.net + ' EOS',
        stake_cpu_quantity: this.state.cpu + ' EOS',
        transfer: this.state.transfer ? 1 : 0
      })
    }).then((data) => {
      console.log(data.transaction_id);
      this.setState({loading:false, error:false});
      this.resetForm();
    }).catch((e) => {
      let error = JSON.stringify(e);
      this.setState({loading:false, error:true});

      if(error.includes('name is already taken')) {
        this.setState({reason:'Someone already owns that name.'});
      } else if(error.includes('Missing required accounts')) {
        this.setState({reason:'Incorrect scatter account - please review chain id, network, and account name.'});
      }
    });
  }




  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;

    const contract = (
      <Popover id="popover-positioned-right" title="newaccount">
      <strong>Action</strong> - {'{ newaccount }'}<br/>
      <strong>Description</strong><br/>
      The {'{ newaccount }'} action creates a new account.<br/>
      <br/>
      As an authorized party I {'{ signer }'} wish to exercise the authority of {'{ creator }'} to create a new account on this system named {'{ name }'} such that the new account's owner public key shall be {'{ owner }'} and the active public key shall be {'{ active }'}.

      </Popover>
    );

    return (
      <div>

        <Form>
          <FormGroup>
            <ControlLabel>Creator Name (Must be linked to your Scatter)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.creator}
              placeholder="Account Name that will create the new Account"
              onChange={this.handleCreator}
            />
          </FormGroup>
          <FormGroup validationState={this.getNameValidation()}>
            <ControlLabel>Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name (12 characters using a-z and 1-5 only)"
              onChange={this.handleName}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Owner Key</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.owner}
              placeholder="Public key that will own the account"
              onChange={this.handleOwner}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Active Key</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.active}
              placeholder="Public key for most transactions. Can be same as owner."
              onChange={this.handleActive}
            />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>NET Stake (in EOS)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.net}
              placeholder="How much EOS to stake for NET"
              onChange={this.handleNet}
            />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>CPU Stake (in EOS)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.cpu}
              placeholder="How much EOS to stake for CPU"
              onChange={this.handleCpu}
            />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>RAM (in bytes)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.ram}
              placeholder="How much RAM to purchase for account"
              onChange={this.handleRam}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Transfer </ControlLabel>{' '}
            <Checkbox
              checked={this.state.transfer}
              onChange={this.handleTransfer}>Yes: Stake belongs to new Account, No: Stake belongs to Creator
            </Checkbox>
          </FormGroup>
          <Button type="submit" onClick={this.createAccount.bind(this)}>Create</Button>
          <OverlayTrigger trigger="click" placement="right" overlay={contract}>
            <Button bsStyle="warning">Read Contract</Button>
          </OverlayTrigger>
        </Form>
        <div style={{paddingTop: '2em'}}>
          {isError ? (
            <Alert bsStyle="warning">
              <strong>Transaction failed. {this.state.reason}</strong>
            </Alert>
          ) : (
            isLoading ? (
              <ProgressBar active now={100} label='Sending Transaction'/>
            ) : (<div/>)
          )}
        </div>

      </div>
    );
  }
}
module.hot.accept();
