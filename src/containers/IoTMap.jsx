import React from 'react';
import Popup from './Popup';

const highlightColor = [255, 255, 255, 50];

export default class IoTMap extends React.Component {

    constructor() {
        super();
        this._onEnter = this._onEnter.bind(this);
        this._resolveIndoorMapEntity = this._resolveIndoorMapEntity.bind(this);
        this._indoorEntityClicked = this._indoorEntityClicked.bind(this);
        this.state = { map: undefined, selectedEntities: [], showTelemetry: false};
        this.handlePopupClose = this.handlePopupClose.bind(this);
    }

    _onEnter(event) {
        const indoorMapEntityInformation = new window.L.Wrld.indoorMapEntities.indoorMapEntityInformation(event.indoorMap.getIndoorMapId());
        indoorMapEntityInformation.addTo(this.state.map);
        this.setState({ entityInfo: indoorMapEntityInformation });
        event.target.setFloor(5);
    }

    _resolveIndoorMapEntity(entities, id) {
        return entities.filter((entity) => entity.getIndoorMapEntityId() === id)[0];
    }

    _indoorEntityClicked(event) {
        const entity = this._resolveIndoorMapEntity(this.state.entityInfo.getIndoorMapEntities(), event.ids[0]);
        const indoors = event.target;
        // Clear first, only one entity can be active at any given time
        indoors.clearEntityHighlights(this.state.selectedEntities);
        indoors.setEntityHighlights(event.ids, highlightColor);
        this.setState({ selectedEntities: event.ids });

        this.setState({showTelemetry: true})

        // var popup = window.L.popup({ elevation: 170 })
        //     .setLatLng(entity.getPosition())
        //     .setContent('<p>Hello world!<br />This is a nice popup.</p>')
        //     .openOn(this.state.map);

        // this.setState({ activePopup: popup });
    }

    componentDidMount() {
        var map = window.L.Wrld.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
            center: [60.19109,24.94946],
            zoom: 15,
            indoorsEnabled: true,
        });
        map.indoors.on("indoormapenter", this._onEnter);
        map.indoors.on('indoorentityclick', this._indoorEntityClicked);

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

    handlePopupClose() {
        this.setState({showTelemetry: false})
    }

    render() {
        return (
            <>
                <div id="map" ref="mapContainer"></div>
                {this.state.showTelemetry && (
                    <Popup handlePopupClose={this.handlePopupClose}/>
                )}
            </>
        );
    }
}
