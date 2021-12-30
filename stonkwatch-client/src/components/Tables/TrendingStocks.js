import React, { Component, useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class Component implemented for the trending stocks table
class TrendingStocks extends Component {
  state = {
    trendingStockData: [],
    open: false,
  };

  constructor() {
    super();
    this.getTrendingStocks();
  }

  //Receiving quote data from the api endpoint
  getTrendingStocks = async () => {
    let data = await api
      .get(`/v3/actives?apikey=${API_KEY}`)
      .then(({ data }) => data);
    let trendingStockList = [];
    for (var i = 0; i < 10; i++) {
      trendingStockList.push(data[i]);
    }
    this.setState({ trendingStockData: trendingStockList });
  };

  //Rendering data received
  renderStocks() {
    return this.state.trendingStockData.map((stock, index) => {
      return (
        <tr key={index} onClick={this.handleOpen}>
          <td>
            <b>
              <Link to={`/ticker/${stock.ticker}`} className="hyperlink">
                {stock.companyName}
              </Link>
            </b>
          </td>
          <td>{stock.ticker}</td>
          <td>{stock.price}</td>
          <td>{stock.changesPercentage}%</td>
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

export default TrendingStocks;
