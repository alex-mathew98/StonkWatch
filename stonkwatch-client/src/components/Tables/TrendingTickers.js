import React, { Component, useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class Component implemented for the trending tickers table
class TrendingTickers extends Component {
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
    let tickerList = "";
    for (var i = 0; i < data.length; i++) {
      tickerList += data[i].ticker + ",";
    }
    let stockData = await api
      .get(`/v3/quote/${tickerList}?apikey=${API_KEY}`)
      .then(({ data }) => data);
    this.setState({ trendingStockData: stockData });
  };

  //Rendering data received
  renderStocks() {
    return this.state.trendingStockData.map((stock, index) => {
      return (
        <tr key={index} onClick={this.handleOpen}>
          <td>{stock.name}</td>
          <td>{stock.symbol}</td>
          <td>{stock.exchange}</td>
          <td>{stock.price}</td>
          <td>{stock.change.toFixed(2)}</td>
          <td>{stock.changesPercentage.toFixed(2)}%</td>
          <td>{stock.marketCap}</td>
          <td>{stock.volume}</td>
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
                <th>Exchange</th>
                <th>Price</th>
                <th>Changes</th>
                <th>Changes Percentage</th>
                <th>Market Cap</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>{this.renderStocks()}</tbody>
          </ReactBootStrap.Table>
        </div>
      </div>
    );
  }
}

export default TrendingTickers;
