import React from "react";
import { withAuth0 } from "@auth0/auth0-react";

import Popup from "./Popup";
import { connect } from "react-redux";
import {
    findHierarchies,
    findDevices,
} from "@denim/iot-platform-middleware-redux";
import { setToken } from "../store.jsx";
const highlightColor = [255, 255, 255, 50];

const ENTITY_TO_HIERARCHY = {
    7214: "8597b49a-de5d-4224-99e9-aa969fbcd07d",
    743: "6bea86bb-d6d6-4fbe-b55f-68c31536aad5",
};

class IoTMap extends React.Component {
    constructor() {
        super();
        this._onEnter = this._onEnter.bind(this);
        this._resolveIndoorMapEntity = this._resolveIndoorMapEntity.bind(this);
        this._indoorEntityClicked = this._indoorEntityClicked.bind(this);
        this.state = { map: undefined, showTelemetry: false };
        this.handlePopupClose = this.handlePopupClose.bind(this);
    }

    _onEnter(event) {
        const indoorMapEntityInformation = new window.L.Wrld.indoorMapEntities.indoorMapEntityInformation(
            event.indoorMap.getIndoorMapId()
        );
        indoorMapEntityInformation.addTo(this.state.map);
        this.setState({ entityInfo: indoorMapEntityInformation });
        event.target.setFloor(5);
    }

    _resolveIndoorMapEntity(entities, id) {
        return entities.filter(
            (entity) => entity.getIndoorMapEntityId() === id
        )[0];
    }

    async _indoorEntityClicked(event) {
        const entity = this._resolveIndoorMapEntity(
            this.state.entityInfo.getIndoorMapEntities(),
            event.ids[0]
        );
        const indoors = event.target;
        const entityPosition = entity.getPosition();
        const elevatedPosition = window.L.latLng(
            entityPosition.lat,
            entityPosition.lng,
            35
        );

        // Clear first, only one entity can be active at any given time
        indoors.clearEntityHighlights(this.state.selectedEntityIds);
        indoors.setEntityHighlights(event.ids, highlightColor);
        this.setState({
            entityCoordinates: this.state.map.latLngToLayerPoint(
                elevatedPosition
            ),
        });

        const indoorMapEntityId = entity.getIndoorMapEntityId();
        const hierarchyUUID = ENTITY_TO_HIERARCHY[indoorMapEntityId];

        if (!hierarchyUUID) {
            console.error(
                `No hierarchy found for indoorMapEntity ${indoorMapEntityId}`
            );
            this.setState({ showTelemetry: false });
            return;
        }

        await this.props.getHierarchies({
            select: ["id"],
            where: { uuid: hierarchyUUID },
            take: 1,
        });

        if (!this.props.hierarchy) {
            console.log(`No hierarchy found with UUID ${hierarchyUUID}`);
            this.setState({ showTelemetry: false });
            return;
        }

        await this.props.getDevices({
            select: ["id", "external_id"],
            where: { hierarchy_id: this.props.hierarchy.id },
            take: 1,
        });

        if (!this.props.device) {
            console.log(
                `No device found with hierarchy_id ${this.props.hierarchy.id}`
            );
            this.setState({ showTelemetry: false });
            return;
        }

        this.setState({ showTelemetry: true });
    }

    async componentDidMount() {
        const { getAccessTokenSilently } = this.props.auth0;
        const token = await getAccessTokenSilently({
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        });

        setToken(token);

        var map = window.L.Wrld.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
            center: [60.19109, 24.94946],
            zoom: 15,
            indoorsEnabled: true,
            //Reduce CPU Usage
            trafficEnabled: false,
            frameRateThrottleWhenIdleEnabled: true,
            throttledTargetFrameIntervalMilliseconds: 500,
            idleSecondsBeforeFrameRateThrottle: 15.0,
        });
        map.indoors.on("indoormapenter", this._onEnter);
        map.indoors.on("indoorentityclick", this._indoorEntityClicked);

        // save map and layer references to local state
        this.setState({
            map: map,
        });
    }

    handlePopupClose() {
        this.setState({ showTelemetry: false });
    }

    render() {
        return (
            <div>
                <div id="map" ref="mapContainer"></div>
                {this.state.showTelemetry && this.props.device && (
                    <Popup
                        device={this.props.device}
                        handlePopupClose={this.handlePopupClose}
                    />
                )}
            </div>
        );
    }
}

export default connect(
    (state) => {
        const hierarchies = state.hierarchy.hierarchies || [];
        const hierarchy = hierarchies.length > 0 ? hierarchies[0] : null;
        const devices = state.device.devices || [];
        const device = devices.length > 0 ? devices[0] : null;
        return {
            hierarchy,
            device,
        };
    },
    (dispatch) => ({
        getHierarchies: (query) => {
            return dispatch(findHierarchies(query));
        },
        getDevices: (query) => {
            return dispatch(findDevices(query));
        },
    })
)(withAuth0(IoTMap));
