import React from "react";
import { render } from "react-dom";
import update from 'react-addons-update';
import EosClient from '../eos-client.jsx';
import { Button } from 'react-bootstrap';

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class BidTable extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      loading:false
    };


    this.eosClient = EosClient();
  }

  componentDidMount() {
    this.getBids();
  }

  getBids() {

    this.setState({loading:true});
    var bids = {
      json: true,
      scope: "eosio",
      code: "eosio",
      table: "voters",
      table_key: "owner",
      limit: 1000,
      lower_bound: "g42dknjzgmge"
    }

    this.eosClient.getTableRows(bids).then((table)=>{
      console.log(table.more);
      console.log(table.rows.length);
      console.log(table.rows[0]);
      console.log(table.rows[table.rows.length-1]);
      this.setState({data: table.rows,loading:false});
    });
  }

  formatDate(date) {
    let newDate = new Date(date/1000);
    return newDate.toUTCString();
  }

  formatProds(prod) {
    //console.log(prod);
    return prod.join(',');
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div>
        <Button type="submit" onClick={this.getBids.bind(this)}>Refresh</Button>
        <ReactTable
          columns={[
            {
              Header: "Voter",
              id: "owner",
              accessor: "owner"
            },
            {
              Header: "Staked",
              accessor: "staked",
              Cell: row => (
                <span>{(row.value/10000)} EOS</span>
              )
            },
            {
              Header: "Vote Weight",
              id: "last_vote_weight",
              accessor: "last_vote_weight",
              Cell: row => (
                <span>{(row.value/10000)}</span>
              )
            },
            {
              Header: "Producers",
              accessor: "producers",
              Cell: row => (
                <span>{this.formatProds(row.value)}</span>
              )
            },
          ]}
          defaultPageSize={20}
          data={data}
          className="-striped -highlight"
          loading={loading} // Display the loading overlay when we need it
          filterable
          defaultSorted={[
            {
              id: "last_vote_weight",
              desc: true
            }
          ]}
        />
        <br />
      </div>
    );
  }
}
