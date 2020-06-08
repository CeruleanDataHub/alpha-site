import React from "react";
import styled, { css } from "styled-components";
import io from "socket.io-client";
import ConditionTabs from "./ConditionTabs.jsx";

const PopupContainer = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transition: all 280ms ease-in-out;
    width: 0;
    height: 0;
    background-color: white;
    border-radius: 3px;
    padding: 0;
    box-sizing: border-box;
    box-shadow: 0 0 0 0px rgba(0, 0, 0, 0);
    overflow: hidden;
    ${(props) =>
        props.animate &&
        css`
            width: 40em;
            height: 25em;
            margin-left: -20em;
            margin-top: -12.5em;
            box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.25);
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

export default class Popup extends React.Component {
    constructor() {
        super();
        this.state = { animate: false, deviceData: null };
        this._handleClose = this._handleClose.bind(this);
    }

    _handleClose() {
        this.setState({ animate: false });
        setTimeout(() => {
            this.props.handlePopupClose();
        }, 280);
    }

    componentDidMount() {
        this.socket = io(process.env.REACT_APP_TELEMETRY_WEBSOCKET_URL);

        // rasp pi device id
        this.data = {
            deviceId: "fe:70:c2:91:f6:4e",
        };
        this.socket.on("connect", (_) => {
            this.socket.emit("UPDATE_DEVICE_SELECTION", {
                ...this.data,
                prop: "ADD",
            });
        });
        this.socket.on("DEVICE_DATA", (deviceData) => {
            this.setState({ deviceData });
        });

        setTimeout(() => {
            this.setState({ animate: true });
        }, 100);
    }

    componentWillUnmount() {
        this.socket.emit("UPDATE_DEVICE_SELECTION", {
            ...this.data,
            prop: "REMOVE",
        });
        this.socket.close();
    }
    render() {
        return (
            <PopupContainer
                animate={this.state.animate}
                x={this.props.entityCoordinates.x}
                y={this.props.entityCoordinates.y}
            >
                <PopupClose onClick={this._handleClose}>X</PopupClose>
                {/*isDataAvailable(this.state.sensorData) ? (
                    <PopupLayer>
                        Temperature: {this.state.sensorData.temperature.toFixed(2)} <br />
                        Humidity: {this.state.sensorData.humidity.toFixed(2)} <br />
                        Pressure: {this.state.sensorData.pressure.toFixed(2)} <br />
                    </PopupLayer>
                ) : <div>Loading...</div>*/}
                {this.state.deviceData && (
                    <ConditionTabs data={this.state.deviceData.telemetry} />
                )}
            </PopupContainer>
        );
    }
}
