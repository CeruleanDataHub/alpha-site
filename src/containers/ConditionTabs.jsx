import React from "react";
import styled, { css } from 'styled-components';
import temperature from './assets/icons/temperature.svg';
import humidity from './assets/icons/humidity.svg';
import pressure from './assets/icons/pressure.svg';
import Chart from './Chart.jsx';

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
    background-image: url(${ props => props.type });
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    font-weight: bold;
    padding: 2rem;

    &:before {
        font-size: 0.75rem;
        content: '${ props => props.name }';
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


const TEMPERATURE_PLACEHOLDER="+24,7";
const HUMIDITY_PLACEHOLDER="33,4";
const PRESSURE_PLACEHOLDER="1024";

export default class ConditionTabs extends React.Component {
    constructor() {
        super();
        this.state = { selectedTab: 0 };
    }

    _handleTabChange() {
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ animate: true });
        }, 100);
    }

    render() {
        return (
            <ConditionTabsContainer>
                <RealtimeContainer>
                    <RealtimeValue type={ temperature } name="Temperature">
                        { this.props.data && this.props.data.temperature ? this.props.data.temperature.toFixed(2) : TEMPERATURE_PLACEHOLDER } °C
                    </RealtimeValue>
                    <RealtimeValue type={ humidity } name="Humidity">
                        { this.props.data && this.props.data.humidity ? this.props.data.humidity.toFixed(2) : HUMIDITY_PLACEHOLDER } %
                    </RealtimeValue>
                    <RealtimeValue type={ pressure } name="Pressure">
                        { this.props.data && this.props.data.pressure ? this.props.data.pressure.toFixed(2) : PRESSURE_PLACEHOLDER }HPa
                    </RealtimeValue>
                </RealtimeContainer>
                <Chart />
            </ConditionTabsContainer>
        );
    }
}
