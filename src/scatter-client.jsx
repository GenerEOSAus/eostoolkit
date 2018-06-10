import Eos from 'eosjs'
import React from 'react'
import ReactDOM from 'react-dom'
import update from 'react-addons-update';
import { Button, Label } from 'react-bootstrap';


const network = {
    blockchain:'eos',
    host:'dev.cryptolions.io', // ( or null if endorsed chainId )
    port:38888, // ( or null if defaulting to 80 )
    chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", // Or null to fetch automatically ( takes longer )
}

const eosOptions = {
    broadcast: true,
    sign: true,
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
}

export function EosClient() {
  return window.scatter.eos(network,Eos,eosOptions);
}

export class ScatterConnect extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      connecting: false,
      error: false,
      scatter: window.scatter,
      identity: null
    }

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      // Scatter will now be available from the window scope.
      // At this stage the connection to Scatter from the application is
      // already encrypted.
      this.setState({scatter: window.scatter, identity: window.scatter.identity});

      // It is good practice to take this off the window once you have
      // a reference to it.
      //window.scatter = null;
    })
  }

  connectIdentity() {
    this.state.scatter.suggestNetwork(network).then(() => {
      console.log('Network attached');
      this.state.scatter.getIdentity().then(() => {
        console.log('Attach Identity');
        console.log(this.state.scatter.identity);
        this.setState({identity: window.scatter.identity});
      }).catch(error => {
        console.error(error);
      });
    });
  }

  removeIdentity() {
    this.state.scatter.forgetIdentity().then(() => {
      console.log('Detach Identity');
      console.log(this.state.scatter.identity);
      this.setState({identity: window.scatter.identity});
    }).catch((e) => {
      if(e.code == 423) {
        console.log('No identity to detach');
      }
    });
  }

  renderScatter() {
    const id = this.state.identity ? (
          <Label bsStyle="info">{this.state.identity.name}</Label>
        ) : ( <div/>);

    const button = this.state.identity ? (
      <Button type="submit" onClick={this.removeIdentity.bind(this)} bsStyle="warning">Remove Identity</Button>
    )  : (
      <Button type="submit" onClick={this.connectIdentity.bind(this)} bsStyle="info">Attach Identity</Button>
    );

    return (
      <div>

        <h3>{id} {button}</h3>

      </div>
    );
  }

  render() {
      if(this.state.scatter === undefined) {
        return (<h3>Scatter is required to send transactions. <a href="https://scatter-eos.com/" target="new">Install Scatter</a></h3>);
      } else {
        return ( this.renderScatter() );
      }
    }
}
