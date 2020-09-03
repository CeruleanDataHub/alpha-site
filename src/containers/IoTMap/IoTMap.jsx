import React, { useCallback, useEffect, useRef, useState } from "react";
import { find, flow, get } from "lodash";
import * as world from "wrld.js";
import { marker } from "wrld.js";
import PropTypes from "prop-types";

const IoTMap = ({
    setShowIndoorEntityModal,
    setClickedIndoorEntity,
    invokeOnIndoorsEntityClick,
    API_KEY,
    centerCoordinates,
    indoorMarkers,
    outdoorMarkers,
    id,
}) => {
    const [mapData, _setMapData] = useState({});
    const mapDataRef = useRef(mapData);
    const setMapDataRef = (data) => (mapDataRef.current = data);
    const setMapDataStateAndRef = useCallback((mapData) => {
        _setMapData(mapData);
        setMapDataRef(mapData);
    }, []);

    const onIndoorsEntityClick = useCallback(
        async (indoorEntity) => {
            invokeOnIndoorsEntityClick(indoorEntity);

            setClickedIndoorEntity(indoorEntity);
            setShowIndoorEntityModal(true);
        },
        [
            invokeOnIndoorsEntityClick,
            setClickedIndoorEntity,
            setShowIndoorEntityModal,
        ]
    );

    const onOutdoorsEntityClick = useCallback(
        (event) => {
            const indoorMapEntityData = getIndoorMapEntityData(event);

            createMarkers(indoorMarkers, mapDataRef.current);

            indoorMapEntityData.addTo(mapDataRef.current);
            event.target.setFloor(5);
        },
        [indoorMarkers]
    );

    useEffect(() => {
        const worldMap = initializeWorldMap(
            id,
            world,
            API_KEY,
            centerCoordinates
        );
        const indoors = getIndoors(worldMap);

        setOutdoorsEntityClickEventListener(indoors, onOutdoorsEntityClick);
        setIndoorsEntityClickEventListener(indoors, onIndoorsEntityClick);

        createMarkers(outdoorMarkers, mapDataRef.current);

        setMapDataStateAndRef(worldMap);
    }, [
        onOutdoorsEntityClick,
        onIndoorsEntityClick,
        setMapDataStateAndRef,
        id,
        API_KEY,
        centerCoordinates,
        outdoorMarkers,
    ]);

    return <div id={id} />;
};

const createMarker = (coordinates, options, mapDataRef) =>
    marker(coordinates, options).addTo(mapDataRef);

const createMarkers = (markers, mapData) =>
    markers &&
    markers.forEach(({ coordinates, options }) =>
        createMarker(coordinates, options, mapData)
    );

const initializeWorldMap = (id, worldInitializer, API_KEY, centerCoordinates) =>
    worldInitializer.map(id, API_KEY, {
        center: centerCoordinates,
        zoom: 15,
        indoorsEnabled: true,
        //Reduce CPU Usage
        trafficEnabled: false,
        frameRateThrottleWhenIdleEnabled: true,
        throttledTargetFrameIntervalMilliseconds: 500,
        idleSecondsBeforeFrameRateThrottle: 15.0,
    });

const getIndoors = (world) => get(world, "indoors");

const setOutdoorsEntityClickEventListener = (indoors, onOutdoorsEntityClick) =>
    indoors.on("indoormapenter", (event) => onOutdoorsEntityClick(event));

const setIndoorsEntityClickEventListener = (indoors, onIndoorsEntityClick) =>
    indoors.on("indoorentityclick", (event) => onIndoorsEntityClick(event));

const findGetIndoorMapId = (event) => find(event, "getIndoorMapId");

const indoorMapEntityInformationGetter = (event) =>
    getIndoorMapEntityInformationGetter(event);

const getIndoorMapEntityData = flow([
    findGetIndoorMapId,
    indoorMapEntityInformationGetter,
]);

const getIndoorMapEntityInformationGetter = get(
    window,
    "L.Wrld.indoorMapEntities.indoorMapEntityInformation"
);

IoTMap.propTypes = {
    setShowIndoorEntityModal: PropTypes.func.isRequired,
    setClickedIndoorEntity: PropTypes.func.isRequired,
    invokeOnIndoorsEntityClick: PropTypes.func.isRequired,
    API_KEY: PropTypes.string.isRequired,
    centerCoordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
    indoorMarkers: PropTypes.arrayOf(PropTypes.shape({})),
    outdoorMarkers: PropTypes.arrayOf(PropTypes.shape({})),
    id: PropTypes.string.isRequired,
};

export default IoTMap;
