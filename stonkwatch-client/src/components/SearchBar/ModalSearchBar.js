import * as React from "react";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import Button from "react-bootstrap/Button";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`,
});

//Functional Component implemented for the watchlist search option
export default function ModalSearchBar(prop) {
  const [stockList, setStockList] = useState([]);
  var [name, setName] = useState("");
  var [companyID, setCompanyID] = useState("");
  var [callSubmit, setCallSubmit] = useState(false);
  var currentUser = prop.currentUser;

  // Function to retrieve stock list on search
  const getStocks = async () => {
    let stockData = await api
      .get(`/v3/search?query=${name}&limit=20&apikey=${API_KEY}`)
      .then((stockData) => {
        const stocks = stockData.data;
        setStockList(stocks);
      });
  };

  useEffect(() => {
    getStocks();
  }, []);

  // Function to check if company is present
  let addCompany = async (ticker) => {
    var companyData = await api
      .get(`/v3/profile/${ticker}?apikey=${API_KEY}`)
      .then(({ data }) => data[0]);
    let res = await dbAPI
      .post("/company", {
        company_id: 0,
        company_name: companyData.companyName,
        company_ticker: companyData.symbol,
        company_desription: companyData.sector,
      })
      .then(() => {
        func(ticker);
      });
  };

  // Function to check if company is present
  const checkTicker = async (companyTicker) => {
    var res = true;
    let result = await dbAPI
      .get(`/company/check?ticker=${companyTicker}`)
      .then((data) => {
        res = data.data;
        if (!res) {
          addCompany(companyTicker);
        } else {
          func(companyTicker);
        }
      });
    return res;
  };

  const func = async (companyTicker) => {
    var companyIDResp = await dbAPI
      .get(`/company/get-id/${companyTicker}`)
      .then(({ data }) => {
        if (data[0] != null) {
          setCompanyID(data[0]["company_id"]);
          setCallSubmit(true);
        }
      });
  };

  const addStock = async (userID, companyTicker) => {
    var isTickerPresent = checkTicker(companyTicker).then(() => {
      console.log("Company Ticker retrieved", companyTicker);
    });
  };

  // Function for handle submit
  const handleSubmit = async () => {
    let checkCompanyInWatchList = false;
    if (callSubmit === true) {
      let userID = await dbAPI
        .get(`/users?emailID=${currentUser.email}`)
        .then(({ data }) => data[0].user_id);
      await dbAPI
        .get(`/watchlist/check/${userID}?companyID=${companyID}`)
        .then((data) => {
          checkCompanyInWatchList = data.data;
        });

      if (!checkCompanyInWatchList) {
        let res = await dbAPI
          .post("/watchlist", {
            user_company_id: 0,
            user_id: userID,
            company_id: companyID,
          })
          .then(setCallSubmit(false));
        alert(`Ticker - added to Watchlist!`);
      } else {
        alert("Ticker is already present in the Watchlist!");
      }
    }
  };

  const getTicker = (event, newValue) => {
    if (newValue != null) {
      if (prop && prop.use == "add") {
        let currentUser = 1;
        addStock(currentUser, newValue.symbol);
        return;
      }
    }
  };

  return (
    <div className="modalSearchBar">
      <Autocomplete
        disablePortal
        onChange={getTicker}
        id="combo-box-demo"
        options={stockList}
        getOptionLabel={(option) => option && option.name}
        sx={{ width: 500, height: 30 }}
        renderInput={(params) => (
          <TextField
            onChange={(event) => {
              setName(event.target.value);
              getStocks();
            }}
            {...params}
            label="Ticker"
          />
        )}
      />
      <Button className="addButton" onClick={handleSubmit}>
        Add
      </Button>
    </div>
  );
}
