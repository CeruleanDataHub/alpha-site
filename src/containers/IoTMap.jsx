import React from 'react';
import Wrld from 'wrld.js';

import Popup from './Popup';

const highlightColor = [255, 255, 255, 50];

export default class IoTMap extends React.Component {

    constructor() {
        super();
        this.state = { map: undefined, selectedEntityIds: [], showTelemetry: false, entityCoordinates: undefined, entityInfo: [] };

    }

    onEnter = (event) => {
        const indoorMapEntityInformation = new Wrld.indoorMapEntities.indoorMapEntityInformation(event.indoorMap.getIndoorMapId());
        indoorMapEntityInformation.addTo(this.state.map);
        this.setState({ entityInfo: indoorMapEntityInformation });
        event.target.setFloor(5);
    }

    resolveIndoorMapEntity = (entities, id) => {
        return entities.filter((entity) => entity.getIndoorMapEntityId() === id)[0];
    }

    indoorEntityClicked = (event) => {
        const entity = this.resolveIndoorMapEntity(this.state.entityInfo.getIndoorMapEntities(), event.ids[0]);
        const indoors = event.target;
        const entityPosition = entity.getPosition();
        const elevatedPosition = window.L.latLng(entityPosition.lat, entityPosition.lng, 35);

        // Clear first, only one entity can be active at any given time
        indoors.clearEntityHighlights(this.state.selectedEntityIds);
        indoors.setEntityHighlights(event.ids, highlightColor);
        this.setState({ selectedEntityIds: event.ids });
        this.setState({ entityCoordinates: this.state.map.latLngToLayerPoint(elevatedPosition) });
        this.setState({ showTelemetry: true });
    }

    handlePopupClose = () => {
        this.setState({showTelemetry: false})
    }

    removeLeafletControlContainer = () => {
        var leafletControlContainer =  document.querySelector('.leaflet-bottom.leaflet-right');
        leafletControlContainer.parentElement.removeChild(leafletControlContainer);
    }

    componentDidMount() {
        var map = Wrld.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
            center: [60.19109,24.94946],
            zoom: 15,
            indoorsEnabled: true,
            //Reduce CPU Usage
            trafficEnabled: false,
            frameRateThrottleWhenIdleEnabled: true,
            throttledTargetFrameIntervalMilliseconds: 500,
            idleSecondsBeforeFrameRateThrottle: 15.0
        });
        map.on("initialstreamingcomplete", this.removeLeafletControlContainer);
        map.indoors.on("indoormapenter", this.onEnter);
        map.indoors.on('indoorentityclick', this.indoorEntityClicked);

        // save map and layer references to local state
        this.setState({
            map: map
        });
    }


    render() {
        return (
            <div>
                <div id="map" ref="mapContainer"></div>
                {this.state.showTelemetry && (
                    <Popup
                        entityCoordinates={ this.state.entityCoordinates }
                        handlePopupClose={ this.handlePopupClose }
                    />
                )}
            </div>
        );
    }
}
