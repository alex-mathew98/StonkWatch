import * as React from 'react';
import { useState,useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useHistory } from 'react-router';
import axios from 'axios';

const API_KEY='62dc2bd1fedd8c6ace955cc4335f7ebe';

// Base endpoint for FMP API
const api = axios.create({
    baseURL: `https://financialmodelingprep.com/api`
})

//Functional Component implemented for the dashboard searchbar
export default function SearchTicker(prop) {
  
  const [stockList,setStockList] = useState([]); 
  var [name,setName] = useState('');
  let history = useHistory();

  // Function to retrieve stock list on search
  const getStocks = async() =>{
    let stockData = await api.get(`/v3/search?query=${name}&limit=20&apikey=${API_KEY}`).then((stockData) =>{
      const stocks = stockData.data;
      setStockList(stocks);
    })
  };

  useEffect(()=>{
    getStocks();
  },[]);

  // Function to redirect user to the corresponding ticker page
  const getTicker =(event,newValue) =>{
    history.push(`/ticker/${newValue.symbol}`);
  }

  return (  
    <Autocomplete
      disablePortal
      onChange={getTicker}
      id="combo-box-demo"
      options={stockList}
      getOptionLabel={(option) => `${(option) && option.name} - ${(option) && option.symbol}`}
      sx={{ width: 700 , height: 20 }}
      renderInput={(params) => <TextField 
        onChange = {(event)=>
                    { setName(event.target.value) 
                      getStocks();
                    
                    }}  
        {...params} label="Ticker" />}
    />
  );
}


