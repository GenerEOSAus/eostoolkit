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
      table: "namebids",
      limit: 10000
    }

    this.eosClient.getTableRows(bids).then((table)=>{
      this.setState({data: table.rows,loading:false});
      console.log(table.rows)
    });
  }

  formatDate(date) {
    console.log(date);
    let newDate = new Date(date/1000);
    console.log(newDate.toUTCString());
    return newDate.toUTCString();
  }

  render() {
    const { data, loading } = this.state;
    return (
      <div>
        <Button type="submit" onClick={this.getBids.bind(this)}>Refresh</Button>
        <ReactTable
          columns={[
            {
              Header: "Name",
              id: "newname",
              accessor: "newname"
            },
            {
              Header: "Bidder",
              accessor: "high_bidder"
            },
            {
              Header: "High Bid",
              accessor: "high_bid"
            },
            {
              Header: "Last Bid Time",
              accessor: "last_bid_time",
              Cell: row => (
                <span>{this.formatDate(row.value)}</span>
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
              id: "high_bid",
              desc: true
            }
          ]}
        />
        <br />
      </div>
    );
  }
}
