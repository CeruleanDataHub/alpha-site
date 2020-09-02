import React, { useEffect, useState } from "react";
import { findDevices } from "@ceruleandatahub/middleware-redux";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { flow, get } from "lodash";
import PropTypes from "prop-types";
import IndoorEntityChart from "./IndoorEntityChart/IndoorEntityChart";
import SpinnerTentative from "../shared/SpinnerTentative";
import Tabs from "../shared/Tabs";
import { Typography } from "@ceruleandatahub/react-components";

const tabs = ["Temperature", "Humidity", "Pressure"];

const TabsContainer = styled.div`
    display: flex;
    padding: 0.2em 0 0 0.1em;
`;

const IoTMapModal = ({ hierarchy }) => {
    const dispatch = useDispatch();

    const device = useSelector((state) => {
        return getDevice(state);
    });

    const [activeTab, setActiveTab] = useState(tabs[0]);

    useEffect(() => {
        dispatchDevicesQuery(dispatch)(hierarchy);
    }, [dispatch, activeTab, hierarchy]);
    return (
        <>
            <Typography color="black" size="large">
                {hierarchy.name || ""}
            </Typography>

            <TabsContainer>
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </TabsContainer>

            <SpinnerTentative condition={!!device}>
                <IndoorEntityChart activeTab={activeTab} device={device} />
            </SpinnerTentative>
        </>
    );
};

const dispatchDevicesQuery = (dispatch) =>
    flow([devicesQueryData, findDevices, dispatch]);

const devicesQueryData = (hierarchy) => ({
    select: ["id", "external_id"],
    where: { hierarchy_id: hierarchy.id },
    take: 1,
});

const getDevice = (state) => get(state, "device.devices[0]");

IoTMapModal.propTypes = {
    device: PropTypes.shape({}),
    clickedIndoorEntity: PropTypes.shape({}).isRequired,
    hierarchy: PropTypes.shape({ name: PropTypes.string }),
};

export default IoTMapModal;
