import React from 'react'
import update from 'react-addons-update';
import Eos from 'eosjs'
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table, Checkbox,Popover,OverlayTrigger } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class AccountCreate extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleCreator = this.handleCreator.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleNet = this.handleNet.bind(this);
    this.handleCpu = this.handleCpu.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);

    this.state = {
      loading: false,
      error: false,
      reason: '',
      success: '',
      name: '',
      creator: '',
      net: 0,
      cpu: 0,
      transfer: true,
      eos: null,
      scatter:null
    };


    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['creator']);
      }, 1000)



    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
      bindNameToState(this.setState.bind(this), ['creator']);
    }
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

  handleTransfer(e) {
    this.setState({ transfer: e.target.checked });
  }

  stakeBandwidth(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, reason:'', success:''});1
    this.state.eos.transaction(tr => {
      tr.delegatebw({
        from: this.state.creator,
        receiver: this.state.name,
        stake_net_quantity: this.state.net + ' EOS',
        stake_cpu_quantity: this.state.cpu + ' EOS',
        transfer: this.state.transfer ? 1 : 0
      })
    }).then((data) => {
      console.log(data.transaction_id);
      this.setState({loading:false, error:false, success: data.transaction_id});
    }).catch((e) => {
      let error = JSON.stringify(e);
      this.setState({loading:false, error:true});

      if(error.includes('Missing required accounts')) {
        this.setState({reason:'Incorrect scatter account - please review chain id, network, and account name.'});
      }
    });
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    const isSuccess = this.state.success;

    const contract = (
      <Popover id="popover-positioned-right" title="undelegatebw">
      <strong>Action - {'{ delegatebw }'}</strong><br/>
      <strong>Description</strong><br/>
      The intent of the {'{ delegatebw }'} action is to stake tokens for bandwidth and/or CPU and optionally transfer ownership.
<br/><br/>
      As an authorized party I {'{ signer }'} wish to stake {'{ stake_cpu_quantity }'} for CPU and {'{ stake_net_quantity }'} for bandwidth from the liquid tokens of {'{ from }'} for the use of delegatee {'{ to }'}.
<br/><br/>
      {'{if transfer }'}<br/>
      It is {'{ transfer }'} that I wish these tokens to become immediately owned by the delegatee.
<br/><br/>
      {'{/if}'}<br/>
      As signer I stipulate that, if I am not the beneficial owner of these tokens, I have proof that I’ve been authorized to take this action by their beneficial owner(s).</Popover>
    );

    const RenderStatus = () => {
      if(isError) {
        return (
          <Alert bsStyle="warning">
            <strong>Transaction failed. {this.state.reason}</strong>
          </Alert>
        );
      }

      if(isLoading) {
        return(<ProgressBar active now={100} label='Sending Transaction'/>);
      }

      if(isSuccess !== '') {
        return (
          <Alert bsStyle="success">
            <strong>Transaction sent. TxId: <a href={"https://eospark.com/MainNet/tx/" + isSuccess} target="new">{isSuccess}</a></strong>
          </Alert>
        );
      }
      return('');
    }

    return (
      <div>

        <Form>
          <FormGroup>
            <ControlLabel>Owner Account Name (Must be linked to your Scatter)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.creator}
              placeholder="Account Name that provides the stake"
              onChange={this.handleCreator}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Target Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name that will get staked (usually same as above)"
              onChange={this.handleName}
            />
            <FormControl.Feedback />
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
          <FormGroup>
            <ControlLabel>Transfer </ControlLabel>{' '}
            <Checkbox
              checked={this.state.transfer}
              onChange={this.handleTransfer}>Yes: Stake belongs to Target Account, No: Stake belongs to Owner
            </Checkbox>
          </FormGroup>
          <Button type="submit" onClick={this.stakeBandwidth.bind(this)}>Stake</Button>
          <OverlayTrigger trigger="click" placement="right" overlay={contract}>
            <Button bsStyle="warning">Read Contract</Button>
          </OverlayTrigger>
        </Form>
        <div style={{paddingTop: '2em'}}>
          <RenderStatus/>
        </div>

      </div>
    );
  }
}
module.hot.accept();
