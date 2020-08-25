import React from "react";
import styled, { css } from "styled-components";
import io from "socket.io-client";
import ChartTabs from "./ChartTabs.jsx";

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
        this.state = { animate: false, device: null, realTimeValues: {} };
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

        const data = {
            deviceId: this.props.device.external_id,
        };

        this.socket.on("connect", (_) => {
            this.socket.emit("UPDATE_DEVICE_SELECTION", {
                ...data,
                prop: "ADD",
            });
        });

        this.socket.on("DEVICE_DATA", (deviceData) => {
            this.setState({
                realTimeValues: {
                    temperature:
                        deviceData.telemetry.temperature ||
                        this.state.realTimeValues.temperature ||
                        null,
                    humidity:
                        deviceData.telemetry.humidity ||
                        this.state.realTimeValues.humidity ||
                        null,
                    pressure:
                        deviceData.telemetry.pressure ||
                        this.state.realTimeValues.pressure ||
                        null,
                },
            });
        });

        setTimeout(() => {
            this.setState({ animate: true });
        }, 100);
    }

    componentWillUnmount() {
        if (!this.socket) {
            return;
        }
        this.socket.emit("UPDATE_DEVICE_SELECTION", {
            ...this.data,
            prop: "REMOVE",
        });
        this.socket.close();
    }
    render() {
        return (
            <PopupContainer animate={this.state.animate}>
                <PopupClose onClick={this._handleClose}>X</PopupClose>
                <ChartTabs
                    device={this.props.device}
                    realTimeValues={this.state.realTimeValues}
                />
            </PopupContainer>
        );
    }
}
