import React from 'react'
import { Panel } from 'react-bootstrap';
import VoteTable from './vote-table.jsx'

export default class Votes extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <div>
        <VoteTable/>
      </div>
    );
  }
}
