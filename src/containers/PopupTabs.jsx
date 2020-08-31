import React, { useEffect, useState } from "react";
import { findDevices } from "@ceruleandatahub/middleware-redux";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { flow, get } from "lodash";
import PropTypes from "prop-types";
import Chart from "./Chart";
import SpinnerTentative from "./SpinnerTentative";
import Tabs from "./Tabs";

const tabs = ["Temperature", "Humidity", "Pressure"];

const TabsContainer = styled.div`
    display: flex;
    padding: 0.2em 0 0 0.1em;
`;

const PopupTabs = ({ hierarchy }) => {
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
            <TabsContainer>
                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </TabsContainer>

            <SpinnerTentative condition={!!device}>
                <Chart activeTab={activeTab} device={device} />
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

PopupTabs.propTypes = {
    device: PropTypes.shape({}),
    clickedIndoorEntity: PropTypes.shape({}).isRequired,
    hierarchy: PropTypes.shape({}),
};

export default PopupTabs;
