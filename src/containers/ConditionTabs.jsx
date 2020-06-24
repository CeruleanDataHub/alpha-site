import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { aggregateTelemetryQuery } from "@ceruleandatahub/middleware-redux";

import { Chart } from "@ceruleandatahub/react-components";
import Icon, { ICONS } from "./Icon.jsx";

const ConditionTabsContainer = styled.div``;
const RealtimeContainer = styled.ul`
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    margin: 0;
    padding: 0;
`;
const RealtimeValue = styled.li`
    flex: 1;
    position: relative;
    border-radius: 3px;
    background-position: 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5rem;
    background-image: url(${(props) => props.type});
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    font-weight: bold;
    padding: 2rem;
    cursor: pointer;

    &:before {
        font-size: 0.75rem;
        content: '${(props) => props.name}';
        display: block;
        position: absolute;
        top: 0.5rem;
        left: 0;
        width: 100%;
        text-align: center;
        color: #03254c;
        text-transform: uppercase;
    }
`;

const ActiveTabIndicator = styled.div`
    position: absolute;
    top: 5.4em;
    left: ${(props) => props.activeTab * 206 - 103}px;
    width: 0;
    height: 0;
    border-bottom: 10px solid #eeeeee;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    transition: all 280ms ease-in-out;
`;
const ChartContainer = styled.div`
    background-color: #eeeeee;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    padding: 0.5em;
`;

const ChartFader = styled.div`
    transition: all 280ms ease-in-out;
    opacity: ${(props) => (props.fade === "in" ? 1 : 0)};
`;

const REAL_TIME_VALUE_PLACEHOLDER = "-"

const TABS = {
    temperature: 1,
    humidity: 2,
    pressure: 3
}

class ConditionTabs extends React.Component {
    constructor() {
        super();
        this.state = { activeTab: TABS.temperature, fade: "in", showChart: false };
        this._handleTabChange = this._handleTabChange.bind(this);
    }

    _handleTabChange(index) {
        return function () {
            setTimeout(() => {
                this.setState({ activeTab: index });
                setTimeout(() => {
                    this.setState({ fade: "in" });
                }, 280);
            }, 280);
        }.bind(this);
    }

    componentDidMount() {
        this.initData("temperature", () => { this.setState({
            ["tab" + TABS.temperature + "Ready"]: true
        })});
        this.initData("humidity", () => { this.setState({
            ["tab" + TABS.humidity + "Ready"]: true
        })});
        this.initData("pressure", () => { this.setState({
            ["tab" + TABS.pressure + "Ready"]: true
        })});
    }

    initData(sensorName, callback) {
        this.props.getLatestHourlyTelemetry({
            deviceId: this.props.device.id,
            sensorName: sensorName,
            type: "HOURLY",
            order: {
                time: "DESC"
            },
            limit: 10,
        }).then((result) => {
            const data = [...result.payload.body].reverse();
            this.setState({
                [sensorName]: {
                    times: data.map(({ time }) => time),
                    values: sensorName === 'pressure' ?
                        data.map(({ avgValueInt }) => Number(avgValueInt.toFixed(2))) :
                        data.map(({ avgValueDouble }) => Number(avgValueDouble.toFixed(2)))
                }
            });
            callback();
        });
    }

    renderChart() {
        const { activeTab } = this.state;
        const xAxis = [];
        const series = [];
        if (activeTab === TABS.temperature) {
            xAxis.push({
                categories: this.state.temperature.times
            });
            series.push({
                name: "Temperature",
                data: this.state.temperature.values,
            });
        } else if (activeTab === TABS.humidity) {
            xAxis.push({
                categories: this.state.humidity.times
            });
            series.push({
                name: "Humidity",
                data: this.state.humidity.values,
            });
        } else if (activeTab === TABS.pressure) {
            xAxis.push({
                categories: this.state.pressure.times
            });
            series.push({
                name: "Pressure",
                data: this.state.pressure.values,
            });
        }
        return <Chart key={activeTab} xAxis={xAxis} series={series} />;
    }

    render() {
        const data = this.props.data ? this.props.data.telemetry : null;
        const { activeTab, fade } = this.state;
        return (
            <ConditionTabsContainer>
                <RealtimeContainer>
                    <RealtimeValue
                        name="Temperature"
                        onClick={this._handleTabChange(TABS.temperature)}
                    >
                        <Icon type={ICONS.temperature} />
                        {data && data.temperature
                            ? data.temperature.toFixed(2)
                            : REAL_TIME_VALUE_PLACEHOLDER}{" "}
                        °C
                    </RealtimeValue>
                    <RealtimeValue
                        name="Humidity"
                        onClick={this._handleTabChange(TABS.humidity)}
                    >
                        <Icon type={ICONS.humidity} />
                        {data && data.humidity
                            ? data.humidity.toFixed(2)
                            : REAL_TIME_VALUE_PLACEHOLDER}{" "}
                        %
                    </RealtimeValue>
                    <RealtimeValue
                        name="Pressure"
                        onClick={this._handleTabChange(TABS.pressure)}
                    >
                        <Icon type={ICONS.pressure} />
                        {data && data.pressure
                            ? data.pressure.toFixed(2) / 100
                            : REAL_TIME_VALUE_PLACEHOLDER}{" "}
                        HPa
                    </RealtimeValue>
                </RealtimeContainer>
                <ActiveTabIndicator activeTab={activeTab} />
                { this.state["tab" + activeTab + "Ready"] &&
                    <ChartContainer>
                        <ChartFader fade={fade}>{this.renderChart()}</ChartFader>
                    </ChartContainer>
                }
            </ConditionTabsContainer>
        );
    }
}

export default connect(
    null,
    (dispatch) => ({
        getLatestHourlyTelemetry: (data) => {
            return dispatch(aggregateTelemetryQuery(data));
        },
    })
)(ConditionTabs);
