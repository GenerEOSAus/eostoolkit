import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,OverlayTrigger,Popover } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class BuySellRam extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handlePayer = this.handlePayer.bind(this);
    this.handleReceiver = this.handleReceiver.bind(this);
    this.handleQuant = this.handleQuant.bind(this);
    this.handleBytes = this.handleBytes.bind(this);
    this.handleAccount = this.handleAccount.bind(this);

    this.state = {
      loading: false,
      error: false,
      reason: '',
      success: '',
      payer: '',
      receiver: '',
      account: '',
      bytes: null,
      quant: null,
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['payer']);
        bindNameToState(this.setState.bind(this), ['account']);
        if (!this.state.receiver) bindNameToState(this.setState.bind(this), ['receiver']);
      }, 1000)
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
      bindNameToState(this.setState.bind(this), ['payer']);
      bindNameToState(this.setState.bind(this), ['account']);
      if (!this.state.receiver) bindNameToState(this.setState.bind(this), ['receiver']);
    }
  }

  handlePayer(e) {
    this.setState({ payer: e.target.value });
  }

  handleReceiver(e) {
    this.setState({ receiver: e.target.value });
  }

  handleQuant(e) {
    this.setState({ quant: e.target.value });
  }

  handleAccount(e) {
    this.setState({ account: e.target.value });
  }

  handleBytes(e) {
    this.setState({ bytes: e.target.value });
  }

  buyRAM(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, success: ''});
    this.state.eos.transaction(tr => {
      tr.buyram({
        payer: this.state.payer,
        receiver: this.state.receiver,
        quant: this.state.quant + ' EOS',
      })
    }).then((data) => {
      console.log(data.transaction_id);
      this.setState({loading:false, error:false, success: data.transaction_id});
    }).catch((e) => {
      if (e.message) {
        this.setState({loading:false, error:true, reason: e.message})
      }
      else {
        const error = JSON.parse(e).error;
        if (error.details.length) {
          this.setState({loading:false, error:true, reason: error.details[0].message})
        }
      }
    })
  }
  sellRAM(e) {
    e.preventDefault();
    this.setState({loading:true, error:false, success: ''});
    this.state.eos.transaction(tr => {
      tr.sellram({
        account: this.state.account,
        bytes: Number(this.state.bytes),
      })
    }).then((data) => {
      console.log(data.transaction_id);
      this.setState({loading:false, error:false, success: data.transaction_id});
    }).catch((e) => {
      if (e.message) {
        this.setState({loading:false, error:true, reason: e.message})
      }
      else {
        const error = JSON.parse(e).error;
        if (error.details.length) {
          this.setState({loading:false, error:true, reason: error.details[0].message})
        }
      }
    })
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    const isSuccess = this.state.success;

    const contractBuyRAM = (
      <Popover id="popover-positioned-left" title="buyram">
        <strong>Action - {'{ buyram }'}</strong><br/>
        <strong>Description</strong><br/>
        This action will attempt to reserve about {'{ quant }'} worth of RAM on behalf of {'{ receiver }'}.
        <br/><br/>
        {'{ buyer }'} authorizes this contract to transfer {'{ quant }'} to buy RAM based upon the current price as determined by the market maker algorithm.
        <br/><br/>
        {'{ buyer }'} accepts that a 0.5% fee will be charged on the amount spent and that the actual RAM received may be slightly less than expected due to the approximations necessary to enable this service.
        <br/><br/>
        {'{ buyer }'} accepts that a 0.5% fee will be charged if and when they sell the RAM received.
        <br/><br/>
        {'{ buyer }'} accepts that rounding errors resulting from limits of computational precision may result in less RAM being allocated.
        <br/><br/>
        {'{ buyer }'} acknowledges that the supply of RAM may be increased at any time up to the limits of off-the-shelf computer equipment and that this may result in RAM selling for less than purchase price.
        <br/><br/>
        {'{ buyer }'} acknowledges that the price of RAM may increase or decrease over time according to supply and demand.
        <br/><br/>
        {'{ buyer }'} acknowledges that RAM is non-transferrable.
        <br/><br/>
        {'{ buyer }'} acknowledges RAM currently in use by their account cannot be sold until it is freed and that freeing RAM may be subject to terms of other contracts.
      </Popover>
    );
    const contractSellRAM = (
      <Popover id="popover-positioned-left" title="sellram">
        <strong>Action - {'{ sellram }'}</strong><br/>
        <strong>Description</strong><br/>
        The {'{ sellram }'} action sells unused RAM for tokens.
        <br/><br/>
        As an authorized party I {'{ signer }'} wish to sell {'{ bytes }'} of unused RAM from account {'{ account }'}.
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
            <strong>Transaction sent. TxId: <a target="_blank" href={"https://eosflare.io/tx/" + isSuccess}>{isSuccess}</a></strong>
          </Alert>
        );
      }
      return('');
    }

    return (
      <div>
        {/* Buy RAM */}
        <Alert bsStyle="info"><strong>Buy RAM</strong> This action will attempt to reserve about {'{ quant }'} worth of RAM on behalf of {'{ receiver }'}.
        <OverlayTrigger trigger="click" placement="left" overlay={contractBuyRAM}>
          <Button bsStyle="warning" style={{float:'right',marginTop:'-0.5em'}}>Read Contract</Button>
        </OverlayTrigger></Alert>
        <Form>
          <FormGroup>
            <ControlLabel>Payer (Must be linked to your Scatter)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.payer}
              placeholder="The account paying for RAM (required)"
              onChange={this.handlePayer}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Receiver</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.receiver}
              placeholder="The account receiving bought RAM (required)"
              onChange={this.handleReceiver}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>Quantity (in EOS)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.quant}
              placeholder="The amount of EOS to pay for RAM (required)"
              onChange={this.handleQuant}
            />
          </FormGroup>
          <Button type="submit" onClick={this.buyRAM.bind(this)}>Buy RAM</Button>
        </Form>
        <br/><br/>
        {/* Sell RAM */}
        <Alert bsStyle="info"><strong>Sell RAM</strong> The {'{ sellram }'} action sells unused RAM for tokens.
        <OverlayTrigger trigger="click" placement="left" overlay={contractSellRAM}>
          <Button bsStyle="warning" style={{float:'right',marginTop:'-0.5em'}}>Read Contract</Button>
        </OverlayTrigger></Alert>
        <Form>
          <FormGroup>
            <ControlLabel>Payer (Must be linked to your Scatter)</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.account}
              placeholder="The account to receive EOS for sold RAM (required)"
              onChange={this.handleAccount}
              disabled
            />
          </FormGroup>
          <FormGroup inline>
            <ControlLabel>Bytes</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.bytes}
              placeholder="Number of RAM bytes to sell (required)"
              onChange={this.handleBytes}
            />
          </FormGroup>
          <Button type="submit" onClick={this.sellRAM.bind(this)}>Sell RAM</Button>
        </Form>
        <div style={{paddingTop: '2em'}}>
          <RenderStatus/>
        </div>
      </div>
    );
  }
}
module.hot.accept();
