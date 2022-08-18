import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "./Components/Button";
import "./App.css";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import CompanyCard from "./Components/CompanyCard";
import CandlestickChart from "./Components/CandlestickChart";
import Card from "./Components/Card";

function App() {
  const [searchValue, setSearchValue] = useState("");
  const [companyInfo, setCompanyInfo] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [chartDataReady, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [isCompanyAttributeValid, setIsCompanyAttributeValid] = useState(true);
  const chartData = [];

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length === 35) {
      setErrorMessage(true);
    } else setErrorMessage(false);
  };

  const buttonClickHandler = () => {
    setIsClicked(true);

    const finnhub = require("finnhub");

    const api_key = finnhub.ApiClient.instance.authentications["api_key"];
    api_key.apiKey = "cbtot8aad3i651t1e010";
    const finnhubClient = new finnhub.DefaultApi();

    finnhubClient.companyProfile2(
      { symbol: searchValue },
      (error, data, response) => {
        if (Object.keys(data).length === 0) {
          setIsCompanyAttributeValid(false);
        } else {
          setCompanyInfo({
            name: data.name,
            country: data.country,
            currency: data.currency,
            weburl: data.weburl,
            logo: data.logo,
          });
          setIsCompanyAttributeValid(true);
        }
      }
    );

    finnhubClient.stockCandles(
      "AAPL",
      "D",
      unixStartDate,
      unixEndDate,
      (error, data, response) => {
        // console.log(data.c);
        const number = data.c.length;
        // console.log(number);
        // console.log(loadedChartData);

        for (let i = 0; i < data.c.length; i++) {
          let unix_timestamp = data.t[i];
          var date = new Date(unix_timestamp * 1000);
          chartData.push({
            x: date,
            y: [data.o[i], data.h[i], data.l[i], data.c[i]],
          });
        }

        setChartData([
          {
            data: chartData,
          },
        ]);

        console.log(chartDataReady);
      }
    );
  };

  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const unixStartDate = Math.floor(state[0].startDate.getTime() / 1000);
  const unixEndDate = Math.floor(state[0].endDate.getTime() / 1000);
  console.log(unixStartDate);
  console.log(unixEndDate);

  return (
    <div className="main">
      <h1>Search Company</h1>
      {errorMessage && (
        <p className="error">Can only enter up to 35 symbols!</p>
      )}
      <div className="search">
        <TextField
          id="outlined-basic"
          variant="outlined"
          fullWidth
          maxLength={35}
          label="Search company symbol"
          value={searchValue}
          onChange={handleChange}
          inputProps={{
            maxLength: 35,
          }}
        />
      </div>
      <Button onClick={buttonClickHandler}>Search</Button>
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        ranges={state}
        direction="horizontal"
        rangeColors={["purple"]}
        color="purple"
      />
      {!isCompanyAttributeValid && (
        <Card className="message">
          {`Company with entered symbol does not exist`}
        </Card>
      )}
      {isClicked && isCompanyAttributeValid && (
        <CompanyCard companyInfo={companyInfo}></CompanyCard>
      )}
      <CandlestickChart chartData={chartDataReady}></CandlestickChart>
    </div>
  );
}

export default App;
