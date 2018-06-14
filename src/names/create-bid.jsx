import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class CreateBid extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleBidder = this.handleBidder.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleBid = this.handleBid.bind(this);

    this.state = {
      loading: false,
      error: false,
      success: '',
      reason: '',
      bidder: '',
      name: '',
      bid: 0.0001,
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['bidder']);
      }, 1000);
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
      bindNameToState(this.setState.bind(this), ['bidder']);
    }
  }

  handleBidder(e) {
    this.setState({ bidder: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  handleBid(e) {
    this.setState({ bid: e.target.value });
  }

  createBid(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, reason:''});
    this.state.eos.transaction(tr => {
      tr.bidname({
        bidder: this.state.bidder,
        newname: this.state.name,
        bid: this.state.bid + ' EOS',
      })
    }).then((data) => {
      console.log(data);
      this.setState({loading:false, error:false});
    }).catch((e) => {
      let error = JSON.stringify(e);
      this.setState({loading:false, error:true});

      if(error.includes('must increase bid by 10%')) {
        this.setState({reason:'Increase bid by 10%'});
      } else if(error.includes('Missing required accounts')) {
        this.setState({reason:'Incorrect scatter account - please review chain id, network, and account name.'});
      }
    });
  }



  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    const isSuccess = this.state.success;

    const contract = (
      <Popover id="popover-positioned-right" title="bidname">
        <strong>Action - {'{ bidname }'}</strong><br/>
        <strong>Description</strong><br/>
        The {'{ bidname }'} action places a bid on a premium account name, in the knowledge that the high bid will purchase the name.<br/>
        <br/>
        As an authorized party I {'{ signer }'} wish to bid on behalf of {'{ bidder }'} the amount of {'{ bid }'} toward purchase of the account name {'{ newname }'}.
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
        <Alert bsStyle="warning"><strong>Important notice!</strong> Your bid is transferred immediately. Your bid will be returned if you are outbid.</Alert>
        <Form style={{paddingTop: '1em'}}>
          <FormGroup>
            <ControlLabel>Your Account Name (the Bidder)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.bidder}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleBidder}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Premium Name to Bid On</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name"
              onChange={this.handleName}
            />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Bid Amount (in EOS)</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.bid}
                placeholder="Account Name"
                onChange={this.handleBid}
              />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.createBid.bind(this)}>Bid on Name</Button>
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
