import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Card } from "@mui/material";

// Database endpoint for retrieving the user data from the back-end
const dbAPI = axios.create({
  baseURL: `http://localhost:8080/api`
});

// Retrieving currently logged in user's id from localStorage
var currentUserId = JSON.parse(localStorage.getItem("CurrentUserID"));

// Component implemented for editing a portfolio entry
const EditEntry = () => {
  const { id } = useParams();
  const [tickerData, setTickerData] = useState({});
  let history = useHistory();
  const [entry, setEntry] = useState({
    portfolio_entry: id,
    user_id: "",
    company_ticker: "",
    quantity: "",
    price_bought: "",
  });

  useEffect(() => {
    getEntryDetails();
    loadEntry();
  }, []);

  const { quantity, price_bought } = entry;

  // Function for getting the current portfolio entry details to edit
  const getEntryDetails = async (e) => {
    let data = await dbAPI
      .get(`/user-portfolio?portfolio_entry=${id}`)
      .then(({ data }) => data[0]);
    setTickerData(data);
    setEntry({
      portfolio_entry: id,
      user_id: currentUserId,
      company_ticker: data.company_ticker,
    });
  };

  // Function for handling the input change
  const onInputChange = (e) => {
    setEntry({ ...entry, [e.target.name]: e.target.value });
  };

  // Function for handling the updation of the entry
  const updateEntry = async (e) => {
    e.preventDefault();
    await dbAPI
      .put(`/user-portfolio`, entry)
      .then(alert(`Entry for ${tickerData.company_ticker} updated`));
    history.push("/portfolio");
  };

  // Function for loading the entry
  const loadEntry = () => {
    fetch(`http://localhost:8080/api/user-portfolio?portfolio_entry=${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEntry({
          portfolio_entry: id,
          update: true,
          user_id: currentUserId,
          quantity: result.response[0].quantity,
          price_bought: result.response[0].price_bought,
        });
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="container">
      <div className="row mt-4">
        <div className="col-sm-5 col-offset-3 mx-auto shadow p-5">
          <h4 className="text-center mb-4">
            Edit entry for {tickerData.company_ticker}
          </h4>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder={`Enter new quantity (Currently: ${tickerData.quantity})`}
              name="quantity"
              value={quantity}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder={`Enter price bought (Currently: ${tickerData.price_bought})`}
              name="price_bought"
              value={price_bought}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <button onClick={updateEntry} className="btn btn-secondary btn-block">
            Update Entry
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default EditEntry;
