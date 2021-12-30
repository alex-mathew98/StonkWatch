import React, { Component } from "react";
import { Card, CardHeader, CardContent, CardActions, Typography } from "@mui/material";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Class Component implemented for the Sentiment Analysis feature of the ticker page
class SentimentAnalysis extends Component {
  constructor(props) {
    super(props);
    this.getSentimentData();
  }

  state = {
    sentimentData: [],
  };

  // Function to retrieve the sentiment data from the FMP API based on the ticker
  getSentimentData = async () => {
    let ticker = this.props.ticker;
    let data = await api
              .get(`/v4/social-sentiment?symbol=${ticker}&limit=10&apikey=${API_KEY}`)
              .then(({ data }) => data);
    this.setState({ sentimentData: data });
  };

  render() {
    let data = this.state.sentimentData;
    var avgSentimentScore = 0;
    var twitterMentions = 0;
    var avgTwitterScore = 0;
    var stockTwits = 0;
    var avgStockTwitsScore = 0;
    var dataSize = data.length;

    for (var i = 0; i < dataSize; i++) {
      avgSentimentScore += data[i].sentiment;
      twitterMentions += data[i].tweetMentions;
      avgTwitterScore += data[i].tweetSentiment;
      stockTwits += data[i].stocktwitsPostMentions;
      avgStockTwitsScore += data[i].stocktwitsPostSentiment;
    }

    return (
      <div>
        <Card sx={{ height: 400, width: 400, maxWidth: 900, maxHeight: 500 }}>
          <CardHeader
            title="How is the public feeling about this stock today?"
            subheader="November 11,2021"
          />
          {this.state.sentimentData.length !== 0 ? (
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <h4>
                  Overall Sentiment:{" "}
                  {((avgSentimentScore / dataSize) * 100).toFixed(2)}%{" "}
                </h4>
              </Typography>
              <br></br>
              <Typography variant="body2" color="text.secondary">
                <h5>
                  Twitter Sentiment Score:{" "}
                  {((avgTwitterScore / dataSize) * 100).toFixed(2)}%
                </h5>
                <h6>
                  Average Twitter Mentions:{" "}
                  {(twitterMentions / dataSize).toFixed(0)}{" "}
                </h6>
              </Typography>
              <br></br>
              <Typography variant="body2" color="text.secondary">
                <h5>
                  StockTwits Sentiment Score:{" "}
                  {((avgStockTwitsScore / dataSize) * 100).toFixed(2)}%
                </h5>
                <h6>
                  Average StockTwits Mentions:{" "}
                  {(stockTwits / dataSize).toFixed(0)}{" "}
                </h6>
              </Typography>
              <br></br>
            </CardContent>
          ) : (
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <h2>No data found</h2>
              </Typography>
            </CardContent>
          )}
          <CardActions disableSpacing></CardActions>
        </Card>
      </div>
    );
  }
}

export default SentimentAnalysis;
