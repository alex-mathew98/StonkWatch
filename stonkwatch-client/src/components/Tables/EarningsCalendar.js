import React, { Component } from 'react';
import * as ReactBootStrap from "react-bootstrap"
import axios from 'axios';

const API_KEY='62dc2bd1fedd8c6ace955cc4335f7ebe';

// Base endpoint for FMP API
const api =axios.create({
    baseURL: `https://financialmodelingprep.com/api`
});
  
// Class Component implemented for the earnings calendar table
class EarningsCalendar extends Component{

    state = {
        earningsData: [],
        open: false
    }
    constructor() {
        super();
        this.getEarnings();
    }

    //Receiving earnings data from the api endpoint
    getEarnings = async() =>{
        let data = await api.get(`/v3/earning_calendar?apikey=${API_KEY}`).then(({data}) => data); 
        this.setState({ earningsData: data  });
    }

    //Rendering data received
    renderStocks() {
        return this.state.earningsData.map((ticker, index) => {
           return (
                <tr key={index} onClick={this.handleOpen} >
                        <td><b>{ticker.symbol}</b></td>
                        <td>{ticker.date}</td>
                        <td>{ticker.epsEstimated}</td>
                        <td>{ticker.revenueEstimated}</td>
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
                            <th>Symbol</th>
                            <th>Release Date</th>
                            <th>EPS</th>
                            <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderStocks()}
                        </tbody>
                    </ReactBootStrap.Table>
                    </div>
                </div>
        );
    }
  }

export default EarningsCalendar;