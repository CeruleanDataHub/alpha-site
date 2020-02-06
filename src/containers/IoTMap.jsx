import React from 'react';

let indoorMapId;
let indoorFloorId;

const onEnter = (event) => {
    console.log('event : ', event.indoorMap.getIndoorMapId());
    event.target.setFloor(5);
}

export default class IoTMap extends React.Component {

    componentDidMount() {
        var map = window.L.Wrld.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
            center: [60.19109,24.94946],
            zoom: 15,
            indoorsEnabled: true,
        });
        map.indoors.on("indoormapenter", onEnter);

        // save map and layer references to local state
        this.setState({
            map: map
        });

        window.L.marker([60.190975, 24.949280], {
            title: "This is indoors!",
            indoorMapId: "EIM-dbc3c842-5303-4ec5-989e-db20bc18bc58",
            indoorMapFloorId: 5,
            elevation: 2
          }).addTo(map);

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
