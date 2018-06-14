import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table, OverlayTrigger,Popover } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class ManageProxy extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleRegProxy = this.handleRegProxy.bind(this);
    this.handleSetProxy = this.handleSetProxy.bind(this);
    this.handleSetName = this.handleSetName.bind(this);

    this.state = {
      loading: false,
      error: false,
      success: '',
      reason: '',
      regProxy: '',
      setProxy: '',
      setName: '',
      eos: null
    };


    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['regProxy', 'setName']);
      }, 1000)
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
      bindNameToState(this.setState.bind(this), ['regProxy', 'setName']);
    }
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
    this.setState({loading:true, error:false, success:''});
    this.state.eos.transaction(tr => {
      tr.regproxy({
        proxy: this.state.regProxy,
        isproxy: 1
      })
    }).then((data) => {
      console.log(data);
      this.resetForms();
      this.setState({loading:false, error:false, success: data.transaction_id});
    }).catch((e) => {
      let error = JSON.stringify(e);
      this.setState({loading:false, error:true});
      if(error.includes('Missing required accounts')) {
        this.setState({reason:'Incorrect scatter account - please review chain id, network, and account name.'});
      }
    });
  }

  setProxy(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, success:''});
    this.state.eos.transaction(tr => {
      tr.voteproducer({
        voter: this.state.setName,
        proxy: this.state.setProxy
      })
    }).then((data) => {
      console.log(data.transaction_id);
      this.resetForms();
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
      <Popover id="popover-positioned-left" title="voteproducer">
        <strong>Action - {'{ voteproducer }'}</strong><br/>
        <strong>Description</strong><br/>
        The intent of the {'{ voteproducer }'} action is to cast a valid vote for up to 30 BP candidates.
        <br/><br/>
        As an authorized party I {'{ signer }'} wish to vote on behalf of {'{ voter }'} in favor of the block producer candidates {'{ producers }'} with a voting weight equal to all tokens currently owned by {'{ voter }'} and staked for CPU or bandwidth.
        <br/><br/>
        If I am not the beneficial owner of these shares I stipulate I have proof that I’ve been authorized to vote these shares by their beneficial owner(s).
        <br/><br/>
        I stipulate I have not and will not accept anything of value in exchange for these votes, on penalty of confiscation of these tokens, and other penalties.
        <br/><br/>
        I acknowledge that using any system of automatic voting, re-voting, or vote refreshing, or allowing such a system to be used on my behalf or on behalf of another, is forbidden and doing so violates this contract.
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
              disabled
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.regProxy.bind(this)}>Become Proxy</Button>
        </Form>
        <Alert bsStyle="info"><span><strong>Set a Proxy:</strong> They will vote on your behalf.</span>
          <OverlayTrigger trigger="click" placement="left" overlay={contract}>
            <Button bsStyle="warning" style={{float:'right',marginTop:'-0.5em'}}>Read Contract</Button>
          </OverlayTrigger></Alert>
        <Form inline style={{paddingTop: '1em'}}>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Your Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.setName}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleSetName}
              style={{width: '70%'}}
              disabled
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
          <RenderStatus/>
        </div>
      </div>
    );
  }
}
module.hot.accept();
