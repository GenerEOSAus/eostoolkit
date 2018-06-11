import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,Label } from 'react-bootstrap';
import EosClient from '../eos-client.jsx';

export default class AccountLookup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handlePubkey = this.handlePubkey.bind(this);
    this.handleName = this.handleName.bind(this);

    this.state = {
      loading: false,
      error: false,
      pubkey: '',
      name: '',
      accounts: [],
      eos: EosClient()
    };
  }

  handlePubkey(e) {
    this.setState({ pubkey: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  lookupAccountsByKey(e) {
    e.preventDefault();
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.state.eos.getKeyAccounts(this.state.pubkey).then((data) => {
      data.account_names.map((name) => {this.getAccountDetail(name)});
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    })
  }

  lookupAccountsByName(e) {
    e.preventDefault();
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.getAccountDetail(this.state.name);
  }

  getAccountDetail(name) {
    this.state.eos.getAccount(name).then((data) => {
      this.state.eos.getCurrencyBalance('eosio.token',name).then((currency) => {
        data.currency = currency;
        console.log(data);
        const newAccounts = update(this.state.accounts, {$push: [
          data,
        ]});
        this.setState({ loading:false, error:false, accounts: newAccounts })
      });
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    })
  }

  renderPermission(permission) {
    const keys = permission.required_auth.keys.map((k)=>{
      let key = {
        perm_name: permission.perm_name,
        key: k.key,
        weight: k.weight,
      }
      return key;
    });
    const renderKey = (k) => {
      return (
        <tr key={k.perm_name}>
          <td>{k.perm_name}</td>
          <td>{k.key}</td>
          <td>{k.weight}</td>
        </tr>
      );
    }
    return (
        keys.map(renderKey.bind(this))
    );
    return(<tr><td>test</td></tr>);
  }

  renderAccount(account) {
    const cpu = Number(account.self_delegated_bandwidth ? account.self_delegated_bandwidth.cpu_weight.slice(0,-4) : 0);
    const net = Number(account.self_delegated_bandwidth ? account.self_delegated_bandwidth.net_weight.slice(0,-4) : 0);
    const eos = Number(account.currency[0] ? account.currency[0].slice(0,-4) : 0);

    return (
      // <ListGroupItem key={account.account_name}>{account.account_name}</ListGroupItem>
      <Panel bsStyle="info" key={account.account_name}>
        <Panel.Heading>
          <Panel.Title componentClass="h3"><b>{account.account_name}</b><div style={{float:'right'}}>{cpu+net+eos} EOS</div></Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <div>

          <Grid>
            <Row className="show-grid">
              <Col md={5} sm={4}>
                <Table responsive striped>
                  <thead>
                    <tr><th colSpan="1">Available Currency</th></tr>
                  </thead>
                  <tbody>
                    {account.currency.map((value)=>{return <tr key={value.slice(-3)}><td>{value}</td></tr>})}
                  </tbody>
                </Table>
              </Col>
              <Col md={5} sm={4}>
                <Table responsive striped>
                  <thead>
                    <tr><th colSpan="2">Resources</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NET Stake</td>
                      <td>{account.total_resources.net_weight}</td>
                    </tr>
                    <tr>
                      <td>CPU Stake</td>
                      <td>{account.total_resources.cpu_weight}</td>
                    </tr>
                    <tr>
                      <td>RAM Used</td>
                      <td>{(account.ram_usage/1024).toFixed(3)} kB</td>
                    </tr>
                    <tr>
                      <td>RAM Quota</td>
                      <td>{(account.ram_quota/1024).toFixed(3)} kB</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={10} sm={4}>
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Permission</th>
                      <th>Key</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {account.permissions.map(this.renderPermission.bind(this))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row className="show-grid">
              <Col md={10} sm={4}>
                <h3>Votes:</h3>
                <p>{account.voter_info.producers.join(',')}</p>
              </Col>
            </Row>
          </Grid>

          </div>

        </Panel.Body>
      </Panel>
    );
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    return (
      <div>
        <Form inline>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Enter Public Key</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.pubkey}
              placeholder="Public Key"
              onChange={this.handlePubkey}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.lookupAccountsByKey.bind(this)}>Search</Button>
        </Form>
        <p style={{paddingTop: '1em'}}>OR...</p>
        <Form inline style={{paddingTop: '1em'}}>
          <FormGroup style={{width: '70%'}}>
            <ControlLabel style={{width: '25%'}}>Enter Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.name}
              placeholder="Account Name"
              onChange={this.handleName}
              style={{width: '70%'}}
            />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.lookupAccountsByName.bind(this)}>Search</Button>
        </Form>
        <div style={{paddingTop: '2em'}}>
          {isError ? (
            <Alert bsStyle="warning">
              <strong>No results!</strong> The public key or name provided may be invalid or does not exist.
            </Alert>
          ) : (
            isLoading ? (
              <ProgressBar active now={100} label='Querying Network'/>
            ) : (
              this.state.accounts.map(this.renderAccount.bind(this))
            )
          )}
        </div>
      </div>
    );
  }
}
module.hot.accept();
