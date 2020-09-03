import React, { useEffect, useState } from "react";
import IoTMap from "./IoTMap/IoTMap";
import { useDispatch, useSelector } from "react-redux";
import { flow, get } from "lodash";
import { useAuth0 } from "@auth0/auth0-react";
import { setToken } from "../store";
import Modal from "./shared/Modal";
import SpinnerTentative from "./shared/SpinnerTentative";
import TelemetryModal from "./shared/TelemetryModal/TelemetryModal";
import { findHierarchies } from "@ceruleandatahub/middleware-redux";

const MapContainer = () => {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch();
    const hierarchy = useSelector((state) => getHierarchy(state));
    const [showTelemetry, setShowTelemetry] = useState(false);
    const [clickedIndoorEntity, setClickedIndoorEntity] = useState({});

    useEffect(() => {
        const handleSetToken = async () => {
            const token = await getAccessTokenSilently();
            return setToken(token);
        };
        handleSetToken();
    });

    const handlePopupClose = () => {
        setShowTelemetry(false);
    };

    const handleHierarchiesQueryDispatch = (indoorEntity) => {
        const hierarchyUUID = getHierarchyUUID(indoorEntity);

        dispatchHierarchiesQuery(dispatch)(hierarchyUUID);
    };

    return (
        <>
            <IoTMap
                id="map"
                setShowIndoorEntityModal={setShowTelemetry}
                setClickedIndoorEntity={setClickedIndoorEntity}
                invokeOnIndoorsEntityClick={handleHierarchiesQueryDispatch}
                API_KEY={"e7dfd119fdb36ca4274823b3039ab84d"}
                centerCoordinates={[60.19109, 24.94946]}
                markers={[
                    {
                        coordinates: [60.19109, 24.9496],
                        options: {
                            indoorMapId:
                                "EIM-dbc3c842-5303-4ec5-989e-db20bc18bc58",
                            title: "Should be indoors",
                            indoorMapFloorId: 5,
                        },
                    },
                ]}
            />

            <Modal
                isVisible={showTelemetry}
                handlePopupClose={handlePopupClose}
            >
                <SpinnerTentative condition={!!hierarchy}>
                    <TelemetryModal
                        clickedIndoorEntity={clickedIndoorEntity}
                        hierarchy={hierarchy}
                    />
                </SpinnerTentative>
            </Modal>
        </>
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

const getHierarchy = (state) => get(state, "hierarchy.hierarchies[0]");

export default MapContainer;
