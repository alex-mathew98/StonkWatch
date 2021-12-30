import React, { Component } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  CartesianGrid
} from "recharts";
import { format, parseISO } from "date-fns";
import axios from "axios";

const API_KEY = "62dc2bd1fedd8c6ace955cc4335f7ebe";

// Base endpoint for FMP API
const api = axios.create({
  baseURL: `https://financialmodelingprep.com/api`,
});

let today = new Date();
let todayDate = today.toISOString().slice(0, 10);

//Retrieving date for 5 days from present
let fiveDays = new Date();
fiveDays.setDate(fiveDays.getDate() - 5);
let fiveDaysDate = fiveDays.toISOString().slice(0, 10);

//Retrieving date for 1 month from present
let oneMonth = new Date();
oneMonth.setDate(oneMonth.getDate() - 30);
let oneMonthDate = oneMonth.toISOString().slice(0, 10);

//Retrieving date for 6 months from present
let sixMonth = new Date();
sixMonth.setDate(sixMonth.getDate() - 182);
let sixMonthDate = sixMonth.toISOString().slice(0, 10);

//Retrieving date for 1 year from present
let oneYear = new Date();
oneYear.setDate(oneYear.getDate() - 365);
let oneYearDate = oneYear.toISOString().slice(0, 10);

//Retrieving date for 5 years from present
let fiveYear = new Date();
fiveYear.setDate(fiveYear.getDate() - 1825);
let fiveYearDate = fiveYear.toISOString().slice(0, 10);

// Class Component implemented for the Stock chart graph segment
class StockGraph extends Component {
  constructor(props) {
    super(props);
    this.getGraphData();
  }

  state = {
    graphData: [],
    intraDay: [],
  };

  //Function for retrieving the required graph data based on the time ranges
  getGraphData = async () => {
    let ticker = this.props.ticker;
    let timeRange = this.props.timeRange;
    let data = await api
      .get(
        `/v3/historical-price-full/${ticker}?from=2020-10-01&to=${todayDate}&apikey=${API_KEY}`
      )
      .then(({ data }) => data);
    let timeRangeData = [];
    if (timeRange === "5D") {
      data = await api
        .get(
          `/v3/historical-price-full/${ticker}?from=${fiveDaysDate}&to=${todayDate}&apikey=${API_KEY}`
        )
        .then(({ data }) => data);
      timeRangeData = data.historical;
    } else if (timeRange === "1M") {
      data = await api
        .get(
          `/v3/historical-price-full/${ticker}?from=${oneMonthDate}&to=${todayDate}&apikey=${API_KEY}`
        )
        .then(({ data }) => data);
      timeRangeData = data.historical;
    } else if (timeRange === "6M") {
      data = await api
        .get(
          `/v3/historical-price-full/${ticker}?from=${sixMonthDate}&to=${todayDate}&apikey=${API_KEY}`
        )
        .then(({ data }) => data);
      timeRangeData = data.historical;
    } else if (timeRange === "1Y") {
      data = await api
        .get(
          `/v3/historical-price-full/${ticker}?from=${oneYearDate}&to=${todayDate}&apikey=${API_KEY}`
        )
        .then(({ data }) => data);
      timeRangeData = data.historical;
    } else if (timeRange === "5Y") {
      data = await api
        .get(
          `/v3/historical-price-full/${ticker}?from=${fiveYearDate}&to=${todayDate}&apikey=${API_KEY}`
        )
        .then(({ data }) => data);
      timeRangeData = data.historical;
    } else if (timeRange === "1D") {
      let datax = await api
        .get(`/v3/historical-chart/30min/${ticker}?&apikey=${API_KEY}`)
        .then(({ data }) => data);
      for (var i = 0; i < 14; i++) {
        timeRangeData.push(datax[i]);
      }
    }
    this.setState({ graphData: timeRangeData });
  };

  // Utilizing re-charts library to implement the area graph
  render() {
    const data = this.state.graphData;
    return (
      <div>
        <ResponsiveContainer width="100%" height={700}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2451B7" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#2451B7" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <Area dataKey="close" stroke="#2451B7" fill="url(#color)">
              {}
            </Area>
            <XAxis dataKey="date" tickLine={false} />
            <YAxis
              dataKey="close"
              tickLine={false}
              domain={["dataMin -5", "dataMax +20"]}
              tickFormatter={(number) => `$${number.toFixed(1)}`}
            />
            <Tooltip content={customToolTip}></Tooltip>
            <CartesianGrid opacity={0.1}></CartesianGrid>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

// Function to implement the custom tooltip for the charts
function customToolTip({ active, payload, label }) {
  if (active) {
    if (payload != null) {
      return (
        <div className="customTooltip">
          <h5>
            <b>Date: {format(parseISO(label), "d MMM, yyyy")}</b>
          </h5>
          <br></br>
          <p>Open: {payload[0].payload.open.toFixed(2)}</p>
          <p>Close: {payload[0].payload.close.toFixed(2)}</p>
          <p>High: {payload[0].payload.high.toFixed(2)}</p>
          <p>Low: {payload[0].payload.low.toFixed(2)}</p>
        </div>
      );
    }
  }
  return null;
}

export default StockGraph;
