import { useState, useEffect } from "react";
import NewsArticle from "../Cards/NewsArticle";
import "./CompanyTabs.css";
import axios from "axios";
import HistoricalData from "../Tables/HistoricalData";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

//Functional Component implemented for the tabs in the stock ticker page
function Tabs({ ticker }) {
  const [toggleState, setToggleState] = useState(1);
  const [profile, setProfile] = useState([]);
  const [newsArticles, setNewsArticles] = useState([]);
  const stockTicker = ticker;

  //Function retrieving the company information from the API endpoint
  const getProfile = async () => {
    let response = await api
      .get(`/v3/profile/${stockTicker}?apikey=62dc2bd1fedd8c6ace955cc4335f7ebe`)
      .then((response) => {
        const profile = response.data;
        setProfile(profile[0]);
      });
  };

  //Function retrieving the trending news articles related to the ticker
  const getNewsArticles = async () => {
    let newsData = await api
      .get(
        `/v3/stock_news?tickers=${stockTicker}&limit=5&apikey=62dc2bd1fedd8c6ace955cc4335f7ebe`
      )
      .then((newsData) => {
        const newsArticles = newsData.data;
        setNewsArticles(newsArticles);
      });
  };

  useEffect(() => {
    getProfile();
    getNewsArticles();
  }, []);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="tabContainer">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          News
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          About Company
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          Historical Data
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <h2> Related News:</h2>
          <hr />
          {newsArticles.map((article) => (
            <NewsArticle
              title={article.title}
              description={article.text}
              url={article.url}
            />
          ))}
          <hr />
        </div>

        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          {profile != null ? (
            <div>
              <h2>About {profile.companyName}</h2>
              <hr />
              <br></br>
              <p>{profile.description}</p>
            </div>
          ) : (
            <div>
              <h2>No data found!</h2>
            </div>
          )}
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <h2>Hisorical Data</h2>
          <hr />
          <br></br>
          <HistoricalData ticker={ticker}></HistoricalData>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
