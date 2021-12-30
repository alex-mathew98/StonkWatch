import React, { Component } from 'react';
import TrendingTickers from '../Tables/TrendingTickers';

// Class Component implemented for the Trending tickers Page
class TrendingStockTickers extends Component {

    //Rendering the table for trending stock tickers
    render() {
        return (
            <div>
                <h1>Trending Tickers</h1>
                <br></br>
                <TrendingTickers></TrendingTickers>
            </div>
        );
    }
}

export default TrendingStockTickers;