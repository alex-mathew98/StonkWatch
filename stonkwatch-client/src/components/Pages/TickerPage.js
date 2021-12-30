import React, { Component } from "react";
import Tabs from "../Tabs/Tabs";
import axios from "axios";
import GraphTabs from "../Tabs/GraphTabs";
import SentimentAnalysis from "../Cards/SentimentAnalysis";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class Component implemented for the Ticker Page
class TickerPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockTicker: this.props.match.params.ticker,
    };
    this.getQuote();
  }

  state = {
    sentiment: [],
    stockTicker: this.props.match.params.ticker,
    historicalData: [],
    quoteFigures: {
      name:'',
      exchange:'',
      price:0,
      open: 0,
      prevClose: 0,
      high: 0,
      low: 0,
      marketCap: 0,
      volume: 0,
      pe: 0,
      change: 0,
      yearHigh: 0,
      yearLow: 0,
    },
  };

  // Function for retrieving the quote price data from the FMP API endpoint
  getQuote = async () => {
    let ticker = this.state.stockTicker;
    let data = await api
      .get(`/v3/quote/${ticker}?apikey=${API_KEY}`)
      .then(({ data }) => {
        data = data;
        let marketCap = this.formatValue(data[0].marketCap);
        let volume = this.formatValue(data[0].volume);
        this.setState({
          quoteFigures: {
            name:data[0].name,
            exchange:data[0].exchange,
            price: data[0].price,
            open: data[0].open,
            prevClose: data[0].previousClose,
            high:data[0].dayHigh,
            low:data[0].dayLow,
            marketCap: marketCap,
            volume: volume,
            pe:data[0].pe,
            change: data[0].change,
            yearHigh:data[0].yearHigh,
            yearLow:data[0].yearLow
          },
        });
      });
  };

  // Function for formatting the price data
  formatValue = (value) => {
    let newValue = value;
    if (value > 1000000000000) {
      return (value / 1000000000000).toFixed(2) + "T";
    } else if (value > 1000000000) {
      return (value / 1000000000).toFixed(2) + "B";
    } else if (value > 1000000) {
      return (value / 1000000).toFixed(2) + "M";
    } else {
      return newValue;
    }
  };

  render() {
    const ticker = this.state.stockTicker;
    return (
      <div className="OWrap">
        <div className="top">
          <div className="t-left">
            <div className="title">
              <h1>
                {" "}
                <b> {this.state.quoteFigures && this.state.quoteFigures.name} </b> - {ticker}{" "}
                ({this.state.quoteFigures && this.state.quoteFigures.exchange})
              </h1>
              {(this.state.quoteFigures && this.state.quoteFigures.change) > 0
               ? (
                <h2 className="inProfit">
                  {" "}
                  {this.state.quoteFigures && this.state.quoteFigures.price}
                </h2>
              ) : (
                <h2 className="inLoss">
                  {" "}
                  {this.state.quoteFigures && this.state.quoteFigures.price}
                </h2>
              )}
            </div>
            <div className="A-parent">
              <div className="B">
                <h4>
                  <b>Open: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.open}
                </h4>
                <br></br>
                <h4>
                  <b>High: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.high}
                </h4>
                <br></br>
                <h4>
                  <b>Market Cap: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.marketCap}
                </h4>
                <br></br>
                <h4>
                  <b>P/E: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.pe}
                </h4>
                <br></br>
                <h4>
                  <b>Year high: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.yearHigh}
                </h4>
                <br></br>
              </div>
              <div className="C">
                <h4>
                  <b>Prev. Close: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.prevClose}
                </h4>
                <br></br>
                <h4>
                  <b>Low: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.low}
                </h4>
                <br></br>
                <h4>
                  <b>Volume: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.volume}
                </h4>
                <br></br>
                <h4>
                  <b>Change: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.change}
                </h4>
                <br></br>
                <h4>
                  <b>Year low: </b>
                  {this.state.quoteFigures && this.state.quoteFigures.yearLow}
                </h4>
                <br></br>
              </div>
            </div>
          </div>
        </div>
        <div className="middle">
          <GraphTabs ticker={this.state.stockTicker} />
        </div>
        <div className="bottom">
          <div className="b-left">
            <Tabs ticker={this.state.stockTicker} />
          </div>
          <div className="b-right">
            <h1>Sentiment Analysis</h1>
            <hr />
            <br />
            <SentimentAnalysis ticker={this.state.stockTicker}/>
          </div>
        </div>
      </div>
    );
  }
}

export default TickerPage;
