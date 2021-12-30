import React, { useState, useEffect, useRef } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Link } from "react-router-dom";
import PortfolioPieChart from "../Graph/PortfolioPieChart";
import Portfolio from "../Cards/Portfolio";
import AsyncSelect from "react-select/async";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api/v3`,
});

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`,
});

// Retrieving currently logged in user's profile from localStorage
var currentUser = JSON.parse(localStorage.getItem("userProfile"));
var currentUserID = JSON.parse(localStorage.getItem("CurrentUserID"));

function PortfolioTable({ uid }) {
  //For retrieval of records
  const [record, setRecord] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioTickers, setPortfolioTickers] = useState([]);
  const [render, setRender] = useState(false);
  const [stockList, setStockList] = useState([]);
  var [name, setName] = useState("");
  const [entry, setEntry] = useState({
    portfolio_entry: 0,
    user_id: currentUserID,
    company_ticker: "",
    quantity: "",
    price_bought: "",
  });
  const [loginStatus, setLoginStatus] = useState(false);
  const { company_ticker, quantity, price_bought } = entry;
  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  // Function to retrieve stock list on search
  const getStocks = async () => {
    let stockData = await api
      .get(
        `/search?query=${name}&limit=20&apikey=${API_KEY}`
      )
      .then((stockData) => {
        const stock_List = stockData.data;
        setStockList(stock_List);
      });
  };

  // Function to handle input change
  const onInputChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  // Function to load user's portfolio data
  const loadPortfolio = async () => {
    var currentUserId = JSON.parse(localStorage.getItem("CurrentUserID"));
    if (currentUserId > 0) {
      setLoginStatus(true);
      let res = await dbAPI
        .get(`/user-portfolio/${currentUserId}`)
        .then(({ data }) => data)
        .then(function (myJson) {
          setRecord(myJson);
          setPortfolioTable(myJson);
        });
    }
  };

  useEffect(() => {
    loadPortfolio();
    getStocks();
  }, []);

  // Function to handle new entry being made
  const enterPortfolioEntry = async (e) => {
    var currentUserId = JSON.parse(localStorage.getItem("CurrentUserID"));
    let checkCompanyInPortfolio = false;
    e.preventDefault();
    e.target.reset();
    await dbAPI
      .get(`/user-portfolio/check/${currentUserId}?ticker=${entry.company_ticker}`)
      .then((data) => {
        checkCompanyInPortfolio = data.data
        });
    if(!checkCompanyInPortfolio){
      if((entry.price_bought>0) && (entry.quantity>0)){
        await dbAPI.post("/user-portfolio", entry);
        alert("Data Inserted");
        loadPortfolio();
      }
      else{
        alert("Values can't be negative/empty")
      }
    }
    else{
      alert("Ticker is already present in the portfolio");
    }
    
    setRender(!render);
  };

  // Delete Employee Record
  const deleteRecord = (portfolioID) => {
    dbAPI
      .delete(`/user-portfolio/${portfolioID}`)
      .then((result) => {
        loadPortfolio();
      })
      .catch(() => {
        alert("Error Occured");
      });
  };

  // Function to handle input change
  const handleInputChange = (value) => {
    setValue(value);
  };

  // Handle selection
  const handleChange = (value, event) => {
    if (value != null) {
      setSelectedValue(value);
      setEntry({ ...entry, [event.name]: value.symbol });
    }
  };

  const fetchData = async () => {
    return api
      .get(
        `/search?query=${inputValue}&limit=20&apikey=${API_KEY}`
      )
      .then((result) => {
        const res = result.data;
        return res;
      });
  };

  const toggleClear = () => {
    setSelectedValue("");
  };

  // Function to show input for adding new entry
  const showEntryForm = () => {
    return (
      <div class="col-sm-4">
        <div
          className="box p-3 mb-3 mt-5"
          style={{ border: "1px solid #d0d0d0" }}
        >
          <form onSubmit={enterPortfolioEntry}>
            <h5 className="mb-3 ">Add entry into portfolio</h5>
            <div class="form-group">
              <AsyncSelect
                cacheOptions
                defaultOptions={""}
                isClearable={toggleClear}
                isSearchable
                defaultValue={""}
                name="company_ticker"
                getOptionLabel={(e) => e.name + " - " + e.symbol}
                getOptionValue={(e) => e.symbol}
                loadOptions={fetchData}
                onInputChange={handleInputChange}
                onChange={handleChange}
                closeMenuOnSelect={true}
              />
              <br />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control  mb-4"
                name="quantity"
                value={quantity}
                onChange={(e) => onInputChange(e)}
                placeholder="Enter Quantity"
                required=""
              />
            </div>
            <div class="form-group">
              <input
                type="text"
                class="form-control mb-4"
                name="price_bought"
                value={price_bought}
                onChange={(e) => onInputChange(e)}
                placeholder="Enter Price Bought"
                required=""
              />
            </div>
            <div className="formButtons">
              <button type="submit" class="btn btn-primary btn-block mt-4">
                Insert Record
              </button>
              <button
                type="submit"
                class="btn btn-danger btn-block mt-4"
                onClick={() => {
                  setShowForm(false);
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const setPortfolioTable = async (data) => {
    let obj = [];
    let tickers = [];
    for (var i = 0; i < data.length; i++) {
      let currentEntry = {};
      currentEntry.user_id = data[i].user_id;
      currentEntry.portfolio_entry = data[i].portfolio_entry;
      currentEntry.company_ticker = data[i].company_ticker;
      currentEntry.price_bought = data[i].price_bought;
      currentEntry.quantity = data[i].quantity;
      await api
        .get(
          `/quote/${data[i].company_ticker}?apikey=${API_KEY}`
        )
        .then((result) => {
          currentEntry.currentPrice = result.data[0].price;
          currentEntry.company = result.data[0].name;
          tickers.push(currentEntry.company_ticker);
          obj.push(currentEntry);
        });
    }
    setPortfolioTickers(tickers);
    setPortfolioData(obj);
  };

  const renderEntries = (entry, index) => {
    return (
      <tr>
        <td>{entry.company}</td>
        <td>{entry.company_ticker}</td>
        <td>{entry.quantity}</td>
        <td>{entry.price_bought}</td>
        <td>{entry.currentPrice}</td>
        <td>
          <a
            className="text-danger mr-2"
            onClick={() => {
              const confirmBox = window.confirm(
                "Do you really want to delete" + entry.company_ticker
              );
              if (confirmBox === true) {
                deleteRecord(entry.portfolio_entry);
              }
            }}
          >
            {" "}
            <i
              class="far fa-trash-alt"
              style={{ fontSize: "18px", marginRight: "5px" }}
            ></i>{" "}
          </a>
        </td>
        <td>
          <Link class=" mr-2" to={`/EditEntry/editID/${entry.portfolio_entry}`}>
            <i class="fa fa-edit" aria-hidden="true"></i>
          </Link>
        </td>
      </tr>
    );
  };

  return (
    <div>
      {loginStatus ? (
        <div>
          <div className="portfolioDetails">
            <div className="portfolioValue">
              {portfolioData.length > 0 ? (
                <Portfolio portfolioData={portfolioData}></Portfolio>
              ) : null}
            </div>
            <div className="PieChart">
              <PortfolioPieChart></PortfolioPieChart>
            </div>
          </div>
          <div>
            <ReactBootStrap.Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Ticker</th>
                  <th>Qty</th>
                  <th>Price Bought</th>
                  <th>Current Price</th>
                  <th>Delete</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{portfolioData.map(renderEntries)}</tbody>
            </ReactBootStrap.Table>
          </div>
          <br />
          <Button
            onClick={() => {
              setShowForm(true);
            }}
          >
            Add entry
          </Button>
          {showForm ? showEntryForm() : null}
        </div>
      ) : (
        <div>
          <h3 className="portfolioDefaultMessage">Sign in to view portfolio</h3>
        </div>
      )}
    </div>
  );
}

export default PortfolioTable;
