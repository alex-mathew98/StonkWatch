import React, { Component, useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class Component implemented for the top gainers table
class TopGainers extends Component {
  state = {
    topGainers: [],
    open: false,
  };

  constructor() {
    super();
    this.getTopGainers();
  }

  //Receiving quote data from the api endpoint
  getTopGainers = async () => {
    let data = await api
      .get(`/v3/gainers?apikey=${API_KEY}`)
      .then(({ data }) => data);
    this.setState({ topGainers: data });
  };

  //Rendering data received
  renderStocks() {
    return this.state.topGainers.map((stock, index) => {
      return (
        <tr key={index}>
          <td>
            <b>
              <Link to={`/ticker/${stock.ticker}`} className="hyperlink">
                {stock.companyName}
              </Link>
            </b>
          </td>
          <td>{stock.ticker}</td>
          <td>{stock.price}</td>
          <td>{stock.changesPercentage}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div>
          <ReactBootStrap.Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Company</th>
                <th>Ticker</th>
                <th>Price</th>
                <th>% Change</th>
              </tr>
            </thead>
            <tbody>{this.renderStocks()}</tbody>
          </ReactBootStrap.Table>
        </div>
      </div>
    );
  }
}

export default TopGainers;
