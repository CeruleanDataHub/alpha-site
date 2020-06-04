import React, { Component } from "react";
import { connect } from "react-redux";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

class TemperatureChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoverData: null,
        };
    }

    setHoverData = (e) => {
        // The chart is not updated because `chartOptions` has not changed.
        this.setState({ hoverData: e.target.category });
    };

    getChartOptions() {
        return new Object({
            chart: {
                width: 625,
                height: 299,
                backgroundColor: "#eeeeee",
            },
            title: null,
            xAxis: [
                {
                    categories: this.props.times,
                },
            ],
            yAxis: {
                title: { enabled: false },
            },
            series: [
                {
                    name: "Temperature",
                    data: this.props.temperatures,
                },
            ],
            plotOptions: {
                series: {
                    point: {
                        events: {
                            mouseOver: this.setHoverData.bind(this),
                        },
                    },
                },
            },
            legend: { enabled: false },
            credits: { enabled: false },
        });
    }
    render() {
        if (!this.props.temperatures || this.props.temperatures.length === 0) {
            return <div> loading ... </div>;
        }
        const chartOptions = this.getChartOptions();
        return (
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        );
    }
}

export default connect((state) => ({
    temperatures: state.telemetry.latest
        ? [...state.telemetry.latest]
              .reverse()
              .map(({ avg_temperature }) => parseFloat(avg_temperature))
        : [],
    times: state.telemetry.latest
        ? [...state.telemetry.latest].reverse().map(({ time }) => time)
        : [],
}))(TemperatureChart);
