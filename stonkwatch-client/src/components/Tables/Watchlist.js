import React, { Component, useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`,
});

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api/v3`,
});

// Retrieving currently logged in user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem("userProfile"));

// Class Component implemented for the Watchlist section of the page
class Watchlist extends Component {
  state = {
    quotes: [],
    open: false,
  };

  constructor() {
    super();
    this.getWatchListData();
  }

  //Retrieving list of stocks monitored by user
  getWatchListData = async () => {
    let userID = localStorage.getItem("CurrentUserID");
    if(userID!=0){
      let currentUserId = userID;
      let data = await dbAPI
      .get(`/watchlist/following/${currentUserId}`)
      .then(({ data }) => data);
      //Initializing empty array to store the stock quote data
      let stockData = [];      
      for (var i = 0; i < data.length; i++) {
        let currentEntry = {};
        //Iterating through the company list retrieved from initial step
        let quoteTicker = data[i].company_ticker;
        //Gettng the stock data for each of the tickers
        let quoteData = await api
          .get(`/quote/${quoteTicker}?apikey=${API_KEY}`)
          .then(({ data }) => data);
        // Pushing it to the array of stock quote data
        currentEntry.watchlist_id = data[i].user_company_id;
        currentEntry.name = quoteData[0].name;
        currentEntry.symbol = quoteData[0].symbol;
        currentEntry.price = quoteData[0].price;
        currentEntry.changesPercentage = quoteData[0].changesPercentage;
        stockData.push(currentEntry);
      }
      this.setState({ quotes: stockData });
    }
  };

  handleOpen = async () => {
    this.setState({ open: true });
  };

  handleClose = async () => {
    this.setState({ open: false });
    this.getWatchListData();
  };

  // Function to handle deletion of ticker in watchlist
  deleteTicker = (id) => {
    dbAPI
      .delete(`/watchlist/${id}`)
      .then((result) => {
        this.getWatchListData();
      })
      .catch(() => {
        alert("Error Occured");
      });
  };

  // Rendering data received
  renderStocks() {
    return this.state.quotes.map((stock, index) => {
      return (
        <tr key={index} onClick={this.handleOpen}>
          <td>
            <b>{stock.name}</b>
          </td>
          <td>{stock.symbol}</td>
          <td>{stock.price}</td>
          <td>{stock.changesPercentage}%</td>
          <td>
            <a
              className="text-danger mr-2"
              onClick={() => {
                const confirmBox = window.confirm(
                  "Do you really want to delete " +
                    stock.name +
                    " from the watchlist?"
                );
                if (confirmBox === true) {
                  this.deleteTicker(stock.watchlist_id);
                }
              }}
            >
              {" "}
              <i
                class="far fa-trash-alt"
                style={{ fontSize: "18px", marginRight: "5px" }}
              ></i>{" "}
            </a>
          </td>
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
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>{this.renderStocks()}</tbody>
          </ReactBootStrap.Table>
        </div>
      </div>
    );
  }
}

export default Watchlist;
