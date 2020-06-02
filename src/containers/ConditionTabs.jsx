import React from "react";
import styled, { css } from "styled-components";
import TemperatureChart from "./TemperatureChart.jsx";
import HumidityChart from "./HumidityChart.jsx";
import PressureChart from "./PressureChart.jsx";
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

const TEMPERATURE_PLACEHOLDER = "+24,7";
const HUMIDITY_PLACEHOLDER = "33,4";
const PRESSURE_PLACEHOLDER = "1024";

export default class ConditionTabs extends React.Component {
    constructor() {
        super();
        this.state = { activeTab: 1, fade: "in" };
        this._handleTabChange = this._handleTabChange.bind(this);
    }

    _handleTabChange(index) {
        return function () {
            this.setState({ fade: "out" });
            setTimeout(() => {
                this.setState({ activeTab: index });
                setTimeout(() => {
                    this.setState({ fade: "in" });
                }, 280);
            }, 280);
        }.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ animate: true });
        }, 100);
    }

    renderChart() {
        const { activeTab } = this.state;
        if (activeTab === 1) {
            return <TemperatureChart />;
        } else if (activeTab === 2) {
            return <HumidityChart />;
        } else if (activeTab === 3) {
            return <PressureChart />;
        }
    }

    render() {
        const { data } = this.props;
        const { activeTab, fade } = this.state;
        return (
            <ConditionTabsContainer>
                <RealtimeContainer>
                    <RealtimeValue
                        name="Temperature"
                        onClick={this._handleTabChange(1)}
                    >
                        <Icon type={ICONS.temperature} />
                        {data && data.temperature
                            ? data.temperature.toFixed(2)
                            : TEMPERATURE_PLACEHOLDER}{" "}
                        °C
                    </RealtimeValue>
                    <RealtimeValue
                        name="Humidity"
                        onClick={this._handleTabChange(2)}
                    >
                        <Icon type={ICONS.humidity} />
                        {data && data.humidity
                            ? data.humidity.toFixed(2)
                            : HUMIDITY_PLACEHOLDER}{" "}
                        %
                    </RealtimeValue>
                    <RealtimeValue
                        name="Pressure"
                        onClick={this._handleTabChange(3)}
                    >
                        <Icon type={ICONS.pressure} />
                        {data && data.pressure
                            ? data.pressure.toFixed(2) / 100
                            : PRESSURE_PLACEHOLDER}{" "}
                        HPa
                    </RealtimeValue>
                </RealtimeContainer>
                <ActiveTabIndicator activeTab={activeTab} />
                <ChartContainer>
                    <ChartFader fade={fade}>{this.renderChart()}</ChartFader>
                </ChartContainer>
            </ConditionTabsContainer>
        );
    }
}
