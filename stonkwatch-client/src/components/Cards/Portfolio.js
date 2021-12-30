import React, { Component } from "react";
import { Card, CardContent, CardActions, Typography } from "@mui/material";

// Class Component implemented for the Portfolio segment representing the current valuation
class Portfolio extends Component {
  // Retrieving portfolio data as props from the parent component
  constructor(props) {
    super(props);
    this.state = {
      portfolio: this.props.portfolioData,
      portfolioValueCurrent: 0,
      portfolioValue: 0,
      difference: 0,
      profit: false,
    };
    this.calculatePortfolio();
  }

  // Function to calculate the current price and the state of profit/loss for current holdings
  calculatePortfolio = () => {
    let currentTotalValue = 0;
    let portfolioTotalValue = 0;
    let portfolio = this.state.portfolio;

    if (this.state.portfolio.length > 0) {
      for (const obj of portfolio) {
        let sharesBought = obj.quantity;
        let currentPrice = obj.currentPrice;
        let priceBought = parseInt(obj.price_bought).toFixed(2);

        // Calculating the current market value of the user's portfolio
        currentTotalValue += sharesBought * currentPrice;
        // Calculating the portfolio value based on the price for which the user bought the stock:
        portfolioTotalValue += sharesBought * priceBought;
      }

      let difference = 0;
      if (currentTotalValue > portfolioTotalValue) {
        difference = currentTotalValue - portfolioTotalValue;
        this.setState({ profit: true });
      } else {
        difference = portfolioTotalValue - currentTotalValue;
        this.setState({ profit: false });
      }

      this.setState({ portfolioValueCurrent: currentTotalValue.toFixed(2) });
      this.setState({ portfolioValue: portfolioTotalValue.toFixed(2) });
      this.setState({ difference: difference.toFixed(2) });
    }
  };

  componentDidMount() {
    this.calculatePortfolio();
  }

  render() {
    return (
      <div>
        <Card sx={{ width: 500, height: 200, maxWidth: 900, maxHeight: 500 }}>
          <CardContent>
            <h2>Based on current holdings,</h2>
            <hr />
            <Typography variant="body2" color="text.secondary">
              <h4> Current value : {this.state.portfolioValueCurrent} $ </h4>
              {this.state.profit ? (
                <h4 className="inProfit"> Profit : {this.state.difference} $</h4>
              ) : (
                <h4 className="inLoss "> Loss : {this.state.difference} $</h4>
              )}
            </Typography>
            <br></br>
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>
      </div>
    );
  }
}

export default Portfolio;
