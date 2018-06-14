import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,OverlayTrigger,Popover } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class VoteGenereos extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleSetName = this.handleSetName.bind(this);

    this.state = {
      loading: false,
      error: false,
      success: '',
      setName: '',
      eos: null
    };


    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['setName']);
      }, 1000)
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
    }
  }

  handleSetName(e) {
    this.setState({ setName: e.target.value });
  }

  vote(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, success: ''});
    this.state.eos.transaction(tr => {
      tr.voteproducer({
        voter: this.state.setName,
        proxy: "",
        producers: ['aus1genereos'],
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
            <strong>Transaction sent. TxId: {isSuccess}</strong>
          </Alert>
        );
      }
      return('');
    }

    return (
      <div>
        <Alert bsStyle="info"><strong>A vote for GenerEOS is a vote for Charity</strong>
        <OverlayTrigger trigger="click" placement="left" overlay={contract}>
          <Button bsStyle="warning" style={{float:'right',marginTop:'-0.5em'}}>Read Contract</Button>
        </OverlayTrigger></Alert>
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
              disabled
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.vote.bind(this)}>Vote for GenerEOS</Button>
        </Form>
        <div style={{paddingTop: '2em'}}>
          <RenderStatus/>
        </div>
      </div>
    );
  }
}
module.hot.accept();
