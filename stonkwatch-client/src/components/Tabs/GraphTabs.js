import { useState, useEffect } from "react";
import "./CompanyTabs.css";
import StockGraph from "../Graph/StockGraph";

//Functional Component implemented for the graph tabs in the stock ticker page
function GraphTabs({ ticker }) {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="tabContainer">
      <div className="bloc-tabs">
        <button
          className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(1)}
        >
          1D
        </button>
        <button
          className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(2)}
        >
          5D
        </button>
        <button
          className={toggleState === 3 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(3)}
        >
          1M
        </button>
        <button
          className={toggleState === 4 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(4)}
        >
          6M
        </button>
        <button
          className={toggleState === 5 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(5)}
        >
          1Y
        </button>
        <button
          className={toggleState === 6 ? "tabs active-tabs" : "tabs"}
          onClick={() => toggleTab(6)}
        >
          5Y
        </button>
      </div>

      <div className="content-tabs">
        <div
          className={toggleState === 1 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"1D"}></StockGraph>
        </div>
        <div
          className={toggleState === 2 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"5D"}></StockGraph>
        </div>

        <div
          className={toggleState === 3 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"1M"}></StockGraph>
        </div>

        <div
          className={toggleState === 4 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"6M"}></StockGraph>
        </div>

        <div
          className={toggleState === 5 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"1Y"}></StockGraph>
        </div>

        <div
          className={toggleState === 6 ? "content  active-content" : "content"}
        >
          <StockGraph ticker={ticker} timeRange={"5Y"}></StockGraph>
        </div>
      </div>
    </div>
  );
}

export default GraphTabs;
