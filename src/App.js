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
  const finnhub = require("finnhub");

  const api_key = finnhub.ApiClient.instance.authentications["api_key"];
  api_key.apiKey = "cbtot8aad3i651t1e010";
  const finnhubClient = new finnhub.DefaultApi();

  const [searchValue, setSearchValue] = useState("");
  const [companyInfo, setCompanyInfo] = useState({});
  const [isClicked, setIsClicked] = useState(false);
  const [chartDataReady, setChartData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageForDigits, setErrorMessageForDigits] = useState(false);
  const [isCompanyAttributeValid, setIsCompanyAttributeValid] = useState(true);
  const [displayChart, setDisplayChart] = useState(false);
  const chartData = [];

  const reg_name_lastname = /^[a-zA-Z\s]*$/;

  const handleChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length === 35) {
      setErrorMessage(true);
    } else setErrorMessage(false);

    if (!reg_name_lastname.test(event.target.value)) {
      setErrorMessageForDigits(true);
    } else setErrorMessageForDigits(false);
  };

  const buttonClickHandler = () => {
    setDisplayChart(false);
    setIsClicked(true);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: searchValue }),
    };
    fetch("https://localhost:5000/action", requestOptions)
      .then((response) => response.json())
      .then((data) => this.setState({ postId: data.id }));

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
  };

  const [pickedDate, setPickedDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const unixStartDate = Math.floor(pickedDate[0].startDate.getTime() / 1000);
  const unixEndDate = Math.floor(pickedDate[0].endDate.getTime() / 1000);
  console.log(unixStartDate);
  console.log(unixEndDate);

  const cardHeaderClickHandler = () => {
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
    setDisplayChart(true);
  };

  //Validation to the user_name input field

  return (
    <div className="main">
      <h1>Search Company</h1>
      {errorMessage && (
        <p className="error">Can only enter up to 35 symbols!</p>
      )}
      {errorMessageForDigits && (
        <p className="error">Can only enter letters and space!</p>
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
        onChange={(item) => setPickedDate([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        ranges={pickedDate}
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
        <CompanyCard
          companyInfo={companyInfo}
          onClick={cardHeaderClickHandler}
        ></CompanyCard>
      )}
      {displayChart && (
        <CandlestickChart chartData={chartDataReady}></CandlestickChart>
      )}
    </div>
  );
}

export default App;
