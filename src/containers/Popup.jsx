import React from "react";
import styled, { css } from 'styled-components';
import io from "socket.io-client";
import ConditionTabs from './ConditionTabs.jsx';

const PopupContainer = styled.div`
    position: absolute;
    top: ${props => props.y}px;
    left: ${props => props.x}px;
    transition: all 280ms ease-in-out;
    width: 0;
    height: 0;
    background-color: white;
    border-radius: 3px;
    padding: 0;
    box-sizing: border-box;
    box-shadow: 0 0 0 0px rgba(0,0,0,0);
    overflow: hidden;
    ${props => props.animate && css`
        width: 40em;
        height: 25em;
        margin-left: -20em;
        margin-top: -12.5em;
        box-shadow: 0 0 0 10px rgba(0,0,0,0.25);
    `};
`;

const PopupClose = styled.div`
    position: absolute;
    top: 1em;
    right: 1em;
    width: 1em;
    height: 1em;
    text-align: center;
    line-height: 1em;
    z-index: 1;
    cursor: pointer;
`;

const PopupLayer = styled.div``;

const isDataAvailable = (data) => {
    return (
        data
        && data.temperature
        && data.humidity
        && data.pressure
    );
}
export default class Popup extends React.Component {
    constructor() {
        super();
        this.state = { sensorData: null, animate: false };
    }

    handleClose = () => {
        this.setState({ animate: false });
        setTimeout(() => {
            this.props.handlePopupClose()
        }, 280);
    }

    componentDidMount() {
        const socket = io("https://iot-platform-api-test.azurewebsites.net");

        socket.on("sensorData", data => {
            if( data.data ){
                this.setState({sensorData: data.data})
            }
        });
        setTimeout(() => {
            this.setState({ animate: true });
        }, 100);
    }

    render() {
        return (
            <PopupContainer
                animate={ this.state.animate }
                x={ this.props.entityCoordinates.x }
                y={ this.props.entityCoordinates.y }
            >
                <PopupClose onClick={ this._handleClose }>X</PopupClose>
                {/*isDataAvailable(this.state.sensorData) ? (
                    <PopupLayer>
                        Temperature: {this.state.sensorData.temperature.toFixed(2)} <br />
                        Humidity: {this.state.sensorData.humidity.toFixed(2)} <br />
                        Pressure: {this.state.sensorData.pressure.toFixed(2)} <br />
                    </PopupLayer>
                ) : <div>Loading...</div>*/}
                <ConditionTabs data={this.state.sensorData} />
            </PopupContainer>
        );
    }
}
