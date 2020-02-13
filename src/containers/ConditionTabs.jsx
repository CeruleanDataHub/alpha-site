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
                    <RealtimeValue type={ temperature } name="Temperature">+24,7 °C</RealtimeValue>
                    <RealtimeValue type={ humidity } name="Humidity">33,4%</RealtimeValue>
                    <RealtimeValue type={ pressure } name="Pressure">1024 HPa</RealtimeValue>
                </RealtimeContainer>
                <Chart />
            </ConditionTabsContainer>
        );
    }
}
