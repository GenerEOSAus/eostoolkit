import React from 'react'
import ReactDOM from 'react-dom'
import update from 'react-addons-update';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Navbar, Nav, NavItem, Panel, Alert, ButtonGroup, Button } from 'react-bootstrap';
import { ScatterConnect } from './scatter-client.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import Unlock from './unlock.jsx'
import Tools from './tools/tools.jsx'
import Names from './names/names.jsx'
import './theme.css';

const Home = () => (
  <Redirect from="/" to="/tools" />
);

class Toolkit extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {
    return (
      <Router>
      <div>
       <Navbar inverse fixedTop className="navbar">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="https://www.genereos.io" target="new">EOS Toolkit by GenerEOS</a>
          </Navbar.Brand>
        </Navbar.Header>
      <Nav>
        <LinkContainer to="/tools">
          <NavItem>
            Tools
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/names">
          <NavItem>
            Name Auction
          </NavItem>
        </LinkContainer>
      </Nav>
      </Navbar>

      <div className="container theme-showcase" role="main">
        <Alert bsStyle="warning"><Unlock/></Alert>
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Scatter Integration</Panel.Title>
          </Panel.Heading>
          <Panel.Body><ScatterConnect/></Panel.Body>
        </Panel>
            {/*<Route exact path="/" component={Home} />*/}
            <Route path="/" component={Tools} />
            <Route path="/names" component={Names} />


        <p style={{float: 'right'}}>Copywrite GenerEOS 2018 | <a href="https://www.genereos.io" target="new">Website</a> | <a href="https://github.com/genereos/eostoolkit" target="new">GitHub</a></p>
      </div>
      </div>
      </Router>
    );
  }
}

ReactDOM.render(<Toolkit />, document.getElementById('app'));

module.hot.accept();
