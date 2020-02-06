import React from 'react';

export default class IoTMap extends React.Component {

    componentDidMount() {

        var map = window.L.Wrld.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
            center: [60.19109,24.94946],
            zoom: 15,
            indoorsEnabled: true,
        });
        // save map and layer references to local state
        this.setState({
            map: map
        });

    }

    componentDidUpdate(prevProps, prevState) {
        /*this.state.featuresLayer.setSource(
            new window.ol.source.Vector({
                features: this.props.routes
            })
        );*/
    }

    render() {
        return (
            <div id="map" ref="mapContainer"></div>
        );
    }
}
