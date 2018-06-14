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

    this.state = {
      loading: false,
      error: false,
      reason: '',
      success: '',
      name: '',
      creator: '',
      net: 0,
      cpu: 0,
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

  unstakeBandwidth(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, reason:'', success:''});1
    this.state.eos.transaction(tr => {
      tr.undelegatebw({
        from: this.state.creator,
        receiver: this.state.name,
        unstake_net_quantity: this.state.net + ' EOS',
        unstake_cpu_quantity: this.state.cpu + ' EOS',
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
      <strong>Action - {'{ undelegatebw }'}</strong><br/>
      <strong>Description</strong><br/>
      The intent of the {'{ undelegatebw }'} action is to unstake tokens from CPU and/or bandwidth.
      <br/><br/>
      As an authorized party I {'{ signer }'} wish to unstake {'{ unstake_cpu_quantity }'} from CPU and {'{ unstake_net_quantity }'} from bandwidth from the tokens owned by {'{ from }'} previously delegated for the use of delegatee {'{ to }'}.
      <br/><br/>
      If I as signer am not the beneficial owner of these tokens I stipulate I have proof that I’ve been authorized to take this action by their beneficial owner(s).
      </Popover>
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
        <Alert bsStyle="warning"><strong>Important notice!</strong> Unstaking takes three days. After this time has passed you can use "withdraw" below.</Alert>
        <Alert bsStyle="danger"><strong>Your vote goes away!</strong> After unstaking your vote no longer has weight. Please keep this in mind - Please stake and vote!</Alert>
        <Form>
          <FormGroup>
            <ControlLabel>Creator Name (Must be linked to your Scatter)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.creator}
              placeholder="Account Name that owns the stake"
              onChange={this.handleCreator}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name that is staked (usually same as above)"
              onChange={this.handleName}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>NET Unstake (in EOS)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.net}
              placeholder="How much EOS to stake for NET"
              onChange={this.handleNet}
            />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>CPU Unstake (in EOS)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.cpu}
              placeholder="How much EOS to stake for CPU"
              onChange={this.handleCpu}
            />
          </FormGroup>
          <Button type="submit" onClick={this.unstakeBandwidth.bind(this)}>Unstake</Button>
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
