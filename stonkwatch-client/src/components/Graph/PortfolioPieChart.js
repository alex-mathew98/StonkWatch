import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import axios from 'axios';

// Database endpoint for retrieving the user portfolio data
const dbAPI = axios.create({
    baseURL: `http://localhost:8080/api`
})

// Retrieving the current user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem('userProfile'));

// Class Component implemented for the Portfolio pie chart segment
class PortfolioPieChart extends Component {
    
  constructor(props) {
    super(props);
    this.getTickersFollowed();
  }

  state = {
    options: {
      labels: []
    },
    series: [],
    plotOptions:{
      pie: {
          expandOnClick: false,
          donut: {
            size:"20px",  
            labels: {
              show: true,
              total: {
                show: true,
              }
            }
          }
      }
    },
    render:false
  }

  //Function for retrieving the portfolio entries for a user from the back-end
  getTickersFollowed = async() =>{
    let currentUserId = await dbAPI.get(`/users?emailID=${currentUser.email}`).then(({data}) => data[0].user_id);
    let data = await dbAPI.get(`/user-portfolio/${currentUserId}`).then(({data}) => {
      let portfolioTickers=[];
      let portfolioHoldings=[];
      for (const dataObj of data){
        portfolioTickers.push(dataObj.company_ticker);
        portfolioHoldings.push(parseInt(dataObj.quantity));   
      }

      this.setState({options:{ labels: portfolioTickers}});
      this.setState({series:portfolioHoldings});
    }); 
  }


  render() {
    return (
      <div className="donut">
        <Chart options={this.state.options} series={this.state.series} type="donut" width="500" />
      </div>
    );
  }
}

export default PortfolioPieChart;