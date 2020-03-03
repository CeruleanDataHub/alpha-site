import React, { Component } from "react";
import { render } from "react-dom";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import moment from "moment-timezone";

export default class Chart extends Component {
    constructor(props) {
        super(props);
        const { timeLabels, data } = this.timelineData(moment().tz('Europe/Helsinki').format('HH:mm'), 10, 'minutes');
        this.state = {
            // To avoid unnecessary update keep all options in the state.
            chartOptions: {
                chart: {
                    width: 620,
                    height: 280
                },
                title: null,
                xAxis: {
                    categories: timeLabels
                },
                yAxis: {
                    title: { enabled: false }
                },
                series: [{ data }],
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                mouseOver: this.setHoverData.bind(this)
                            }
                        }
                    }
                },
                legend: { enabled: false },
                credits: { enabled: false }
            },
            hoverData: null
        };
    }

    timelineData = (desiredStartTime, interval, period) => {
        const periodsInADay = moment.duration(2, 'hours').as(period);

        const timeLabels = [];
        const data = [];
        const startTimeMoment = moment(desiredStartTime, 'hh:mm');
        for (let i = 0; i <= periodsInADay; i += interval) {
          startTimeMoment.add(i === 0 ? 0 : interval, period);
          timeLabels.push(startTimeMoment.tz('Europe/Helsinki').format('D.M.Y HH:mm'));
          data.push(parseFloat(Number((Math.random() * 3) + 20).toFixed(2)));
        }

        return { timeLabels, data };
    };

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
