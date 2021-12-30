import React, { Component } from "react";
import { Link } from "react-router-dom";
import TrendingStocks from "../Tables/TrendingStocks";
import NewsArticle from "../Cards/NewsArticle";
import { Container } from "react-bootstrap";
import SearchTicker from "../SearchBar/SearchTicker";
import TopGainers from "../Tables/TopGainers";
import TopLosers from "../Tables/TopLosers";
import EarningsCalendar from "../Tables/EarningsCalendar";
import axios from "axios";
import WatchlistSection from "./WatchlistSection";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`
})

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Initializing localStorage with empty userprofile object
if (localStorage.getItem("userProfile") == null) {
  let object = {
    email: "",
    familyName: "",
    givenName: "",
    googleId: "",
    imageUrl: "",
    name: "",
  };

  localStorage.setItem("userProfile", JSON.stringify(object));
  localStorage.setItem("CurrentUserID", 0);
}

// Retrieving currently logged in user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem("userProfile"));

// Class Component implemented for the Dashboard Page
class Dashboard extends Component {
  constructor() {
    super();
    this.getDashboardArticles();
  }

  state = {
    currentUserId: "",
    dashboardArticles: [],
    followedTickers:[],
    open: false,
    userName: "",
  };

  //Modal operations
  handleOpen = async () => {
    this.setState({ open: true });
  };
  handleClose = async () => {
    this.setState({ open: false });
  };

  // Function for retrieving the news data from the FMP API endpoint
  getDashboardArticles = async () => {
    let searchEndpoint=`/v3/stock_news?limit=15&apikey=${API_KEY}`;
    if((currentUser!==null)&& (currentUser.email!=='')){
      let UID = await dbAPI.get(`/users?emailID=${currentUser.email}`).then(({data}) => data[0].user_id);
      let followed = await dbAPI.get(`/watchlist/following/${UID}`).then(({data}) => data);
      let tickerList="";
      for(const obj of followed){
        tickerList += obj.company_ticker+","
      }
      searchEndpoint=`/v3/stock_news?tickers=${tickerList}&limit=15&apikey=${API_KEY}`
    }
    let data = await api
      .get(searchEndpoint)
      .then(({ data }) => data);
    this.setState({ dashboardArticles: data });
  };

  render() {
    return (
      <div>
        <Container>
          <div className="welcomeMessage">
            <h1>
              {currentUser.givenName !== ""
                ? `Welcome to your dashboard,${currentUser.givenName}`
                : `Sign in to view your dashboard`}
            </h1>
          </div>
        </Container>
        <div className="OuterWrap">
          <div className="leftSide">
            <div className="searchBar">
              <SearchTicker></SearchTicker>
            </div>
            <Container>
              <div className="newsSection">
                <div>
                  <h1>
                    <Link to="/news" className="hyperlink">
                      News Section
                    </Link>
                  </h1>
                </div>
                <br></br>
                {this.state.dashboardArticles.map((article) => (
                  <div>
                    <NewsArticle
                      title={article.title}
                      description={article.text}
                      url={article.url}
                    />
                    <hr />
                  </div>
                ))}
              </div>
            </Container>
            <Container>
              <div className="earningsCalendar">
                <h1>Upcoming earning calls</h1>
                <br></br>
                <EarningsCalendar></EarningsCalendar>
              </div>
            </Container>
          </div>
          <div className="rightSide">
            <WatchlistSection />
            <div className="trendingStocks">
              <div>
                <h1>
                  <Link to="/trending/tickers" className="hyperlink">
                    Trending Stocks
                  </Link>
                </h1>
                <br />
              </div>
              <TrendingStocks></TrendingStocks>
            </div>
            <div className="watchList">
              <div className="watchList_Title">
                <h1>Top Gainers</h1>
              </div>
              <TopGainers></TopGainers>
            </div>
            <div className="watchList">
              <div className="watchList_Title">
                <h1>Top Losers</h1>
              </div>
              <TopLosers></TopLosers>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
