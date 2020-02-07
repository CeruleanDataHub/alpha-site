import React from "react";
import io from "socket.io-client";

export default class Popup extends React.Component {
    constructor() {
        super();
        this.state = {sensorData: null}
    }

    componentDidMount() {
        const socket = io("https://iot-platform-api-test.azurewebsites.net");

        socket.on("sensorData", data => {
            if( data.reqJson ){
                this.setState({sensorData: data.reqJson})
            }
        });
    }

    render() {
        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    height: "100px",
                    width: "200px",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    marginTop: "-55px",
                    marginLeft: "-105px",
                    padding: "10px",
                    border: "2px solid"
                }}
                onClick={() => this.props.handlePopupClose()}
            >
                {this.state.sensorData ? (
                    <div>
                        Temperature: {this.state.sensorData.temperature.toFixed(2)} <br />
                        Humidity: {this.state.sensorData.humidity.toFixed(2)} <br />
                        Pressure: {this.state.sensorData.pressure.toFixed(2)} <br />
                    </div>
                ): <div>Loading...</div>}
                <br />
            </div>
        );
    }
}
