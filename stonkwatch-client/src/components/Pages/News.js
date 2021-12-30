import React, { Component } from "react";
import NewsArticle from "../Cards/NewsArticle";
import axios from "axios";
import ReactPaginate from "react-paginate";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Setting up the axios endpoints for the financial modelling prep API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class component or displaying the news feed
class News extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      offset: 0,
      perPage: 10,
      currentPage: 0,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  // Function to retrieve the news articles from the API endpoint
  getArticles = async () => {
    await api
      .get(`/v3/stock_news?limit=100&apikey=${API_KEY}`)
      .then((res) => {
        //Implementing pagination to slice the large dat set of new articles retrieved
        const data = res.data;
        const slice = data.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        const postData = slice.map((article) => (
          <NewsArticle
            title={article.title}
            description={article.text}
            url={article.url}
            image={article.image}
            border={true}
            publishedDate={article.publishedDate}
          />
        ));
        this.setState({
          pageCount: Math.ceil(data.length / this.state.perPage),
          postData,
        });
      });
  };

  // Function to manage the state of pagination and keep track of the sets/page of the news articles
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;
    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.getArticles();
      }
    );
  };

  componentDidMount() {
    this.getArticles();
  }

  render() {
    return (
      <div className="newsWrap">
        <div className="sectionTitle">
          <h1 className="hTitle">Financial News</h1>
          <h4 className="hSubHeading">See whats trending</h4>
        </div>
        {this.state.postData}
        <ReactPaginate
          previousLabel={"prev"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={"pagination"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active"}
        />
        <br></br>
      </div>
    );
  }
}

export default News;
