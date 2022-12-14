import ReactApexChart from "react-apexcharts";

const CandlestickChart = (props) => {
  const chartConfig = {
    options: {
      chart: {
        type: "candlestick",
        height: 350,
      },
      title: {
        text: `${props.companySymbol} Chart`,
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={chartConfig.options}
        series={props.chartData}
        type="candlestick"
        height={350}
      />
    </div>
  );
};

export default CandlestickChart;
