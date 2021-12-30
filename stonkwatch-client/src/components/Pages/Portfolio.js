import React, { Component } from 'react';
import PortfolioTable from '../Tables/PortfolioTable';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
    baseURL: `http://localhost:8080/api`
})

// Retrieving currently logged in user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem('userProfile'));

// Class Component implemented for the Portfolio Page
class Portfolio extends Component {

    state={
        currentUserID:0
    }

    constructor(props){
        super(props);
        this.getCurrentUser();
    }

    // Function to get the id of the currently logged in user
    getCurrentUser = async() =>{
        let UID = await dbAPI.get(`/users?emailID=${currentUser.email}`).then(({data}) => data[0].user_id);
        this.setState({currentUserID:UID});
    }
    
    render() {
        return (
            <div className="portfolio">
                <br/>
                <h1 className="portfolioTitle">Track my portfolio</h1>
                <div className="portolioTable">    
                    <PortfolioTable uid={this.state.currentUserID} ></PortfolioTable>
                </div>
            </div>
        );
    }
}

export default Portfolio; 