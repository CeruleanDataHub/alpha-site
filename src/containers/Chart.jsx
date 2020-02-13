import React, { Component } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                chart: {
                    width: 620,
                    height: 280
                },
                title: null,
                xAxis: {
                    categories: ["13.2.2020 16:15", "13.2.2020 16:25", "13.2.2020 16:35"]
                },
                series: [{ data: [24.3, 24.4, 24.7] }],
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: this.setHoverData.bind(this)
                            }
                        }
                    }
                }
            },
            hoverData: null
        };
    }

    setHoverData = e => {
        // The chart is not updated because `chartOptions` has not changed.
        this.setState({ hoverData: e.target.category });
    };

    render() {
        const { chartOptions } = this.state;

        return (
            <HighchartsReact
                highcharts={ Highcharts }
                options={ chartOptions }
            />
        );
    }
}
