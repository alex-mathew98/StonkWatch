import React, { Component } from 'react';
import * as ReactBootStrap from "react-bootstrap"
import axios from 'axios';

const API_KEY='62dc2bd1fedd8c6ace955cc4335f7ebe';

// Base endpoint for FMP API
const api =axios.create({
    baseURL: `https://financialmodelingprep.com/api`
});
  
// Class Component implemented for the ticker's historical data
class HistoricalData extends Component{

    state = {
        historicalData: []
    }
    
    constructor(props) {
        super(props);
        this.getHistoricalData();
    }

    //Receiving quote data from the api endpoint
    getHistoricalData = async() =>{
        let ticker = this.props.ticker;
        // Current date
        let today = new Date();
        let currentDate= today.toISOString().slice(0, 10);
        // Six month interval date
        let sixMonth = new Date();
        sixMonth.setDate(sixMonth.getDate() - 182);
        let sixMonthDate = sixMonth.toISOString().slice(0, 10);
        let data = await api.get(`/v3/historical-price-full/${ticker}?from=${sixMonthDate}&to=${currentDate}&apikey=${API_KEY}`).then(({data}) => data); 
        this.setState({ historicalData: data.historical  });
    }

    //Rendering data received
    renderData() {
        return this.state.historicalData.map((data, index) => {
           return (
              <tr key={index} >
                    <td>{data.date}</td>
                    <td>{data.open.toFixed(2)}</td>
                    <td>{data.close.toFixed(2)}</td> 
                    <td>{data.high.toFixed(2)}</td>
                    <td>{data.low.toFixed(2)}</td>
                    <td>{data.volume}</td>
              </tr>
           ) 
        })
     }

    render(){
        return(
                <div>
                   <div>
                   <ReactBootStrap.Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                            <th>Date</th>
                            <th>Open</th>
                            <th>Close</th>
                            <th>High</th>
                            <th>Low</th>
                            <th>Volume</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderData()}
                        </tbody>
                    </ReactBootStrap.Table>
                    </div>
                </div>
        );
    }


  }

export default HistoricalData;