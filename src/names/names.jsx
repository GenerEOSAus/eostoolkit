import React from 'react'
import { Panel } from 'react-bootstrap';
import BidTable from './bid-table.jsx'

export default class Names extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <BidTable/>
      </div>
    );
  }
}
