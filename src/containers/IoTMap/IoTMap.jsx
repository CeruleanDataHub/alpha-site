import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";
import { findHierarchies } from "@ceruleandatahub/middleware-redux";
import { find, flow, get } from "lodash";
import { setToken } from "../../store";
import Modal from "../shared/Modal";
import SpinnerTentative from "../shared/SpinnerTentative";
import IoTMapModal from "./IoTMapModal";

const IoTMap = () => {
    const { getAccessTokenSilently } = useAuth0();

    const dispatch = useDispatch();

    const mapRef = useRef(null);

    const hierarchy = useSelector((state) => getHierarchy(state));

    const [mapData, _setMap] = useState({});
    const mapDataRef = useRef(mapData);
    const setMapDataRef = (data) => (mapDataRef.current = data);
    const setMapDataStateAndRef = useCallback((mapData) => {
        _setMap(mapData);
        setMapDataRef(mapData);
    }, []);

    const [clickedIndoorEntity, _setClickedIndoorEntity] = useState({});
    const clickedIndoorEntityRef = useRef(clickedIndoorEntity);
    const setClickedIndoorEntityRef = (data) =>
        (clickedIndoorEntityRef.current = data);
    const setClickedIndoorEntityRefAndState = useCallback(
        (clickedIndoorEntityData) => {
            _setClickedIndoorEntity(clickedIndoorEntityData);
            setClickedIndoorEntityRef(clickedIndoorEntityData);
        },
        []
    );

    const [showTelemetry, setShowTelemetry] = useState(false);

    const onIndoorsEntityClick = useCallback(
        async (indoorEntity) => {
            setClickedIndoorEntityRefAndState(indoorEntity);

            const hierarchyUUID = getHierarchyUUID(
                clickedIndoorEntityRef.current
            );

            dispatchHierarchiesQuery(dispatch)(hierarchyUUID);

            setShowTelemetry(true);
        },
        [dispatch, setClickedIndoorEntityRefAndState]
    );

    const onOutdoorsEntityClick = useCallback((event) => {
        const indoorMapEntityData = getIndoorMapEntityData(event);

        indoorMapEntityData.addTo(mapDataRef.current);
        event.target.setFloor(5);
    }, []);

    useEffect(() => {
        const handleSetToken = async () => {
            const token = await getAccessTokenSilently();

            return setToken(token);
        };

        handleSetToken();

        const indoors = getIndoorEntity(window);

        setIndoorsEntityClickEventListener(indoors, onIndoorsEntityClick);
        setOutdoorsEntityClickEventListener(indoors, onOutdoorsEntityClick);

        const worldMap = getWorldMap(window);
        setMapDataStateAndRef(worldMap);
    }, [
        onOutdoorsEntityClick,
        getAccessTokenSilently,
        onIndoorsEntityClick,
        setMapDataStateAndRef,
    ]);

    const handlePopupClose = () => {
        setShowTelemetry(false);
    };

    return (
        <div>
            <div id="map" ref={mapRef} />

            <Modal
                isVisible={showTelemetry}
                handlePopupClose={handlePopupClose}
            >
                <SpinnerTentative condition={!!hierarchy}>
                    <IoTMapModal
                        clickedIndoorEntity={clickedIndoorEntity}
                        hierarchy={hierarchy}
                    />
                </SpinnerTentative>
            </Modal>
        </div>
    );
};

const hierarchiesQueryData = (hierarchyUUID) => ({
    select: ["id", "name"],
    where: { uuid: hierarchyUUID },
    take: 1,
});

const ENTITY_TO_HIERARCHY = {
    7214: "8597b49a-de5d-4224-99e9-aa969fbcd07d", // Solar
    743: "61ea841a-52b7-4369-9dd5-2e552fae7b24", // Pluto
    765: "dc1b571f-44dc-4f71-ab79-487b2a412b2a", // Space
    771: "c57bedaf-1395-40a8-8cab-bfff1547757c", // Hacklab
};

const dispatchHierarchiesQuery = (dispatch) =>
    flow([hierarchiesQueryData, findHierarchies, dispatch]);

const getHierarchyUUID = (event) => ENTITY_TO_HIERARCHY[event.ids[0]];

const populateWorldMap = (world) =>
    world.map("map", "e7dfd119fdb36ca4274823b3039ab84d", {
        center: [60.19109, 24.94946],
        zoom: 15,
        indoorsEnabled: true,
        //Reduce CPU Usage
        trafficEnabled: false,
        frameRateThrottleWhenIdleEnabled: true,
        throttledTargetFrameIntervalMilliseconds: 500,
        idleSecondsBeforeFrameRateThrottle: 15.0,
    });

const setOutdoorsEntityClickEventListener = (indoors, onOutdoorsEntityClick) =>
    indoors.on("indoormapenter", (event) => onOutdoorsEntityClick(event));

const getHierarchy = (state) => get(state, "hierarchy.hierarchies[0]");

const setIndoorsEntityClickEventListener = (indoors, onIndoorsEntityClick) =>
    indoors.on("indoorentityclick", (event) => onIndoorsEntityClick(event));

const getIndoors = (worldMap) => get(worldMap, "indoors");

const getWorld = (window) => get(window, "L.Wrld");

const getIndoorMapEntityData = (event) =>
    flow([findGetIndoorMapId, indoorMapEntityInformationGetter])(event);

const getWorldMap = flow([getWorld, populateWorldMap]);

const getIndoorEntity = flow([getWorldMap, getIndoors]);

const getIndoorMapEntityInformationGetter = get(
    window,
    "L.Wrld.indoorMapEntities.indoorMapEntityInformation"
);

const indoorMapEntityInformationGetter = (event) =>
    getIndoorMapEntityInformationGetter(event);

const findGetIndoorMapId = (event) => find(event, "getIndoorMapId");

export default IoTMap;
