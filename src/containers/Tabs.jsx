import React, { useEffect, useState } from "react";
import { Icon, Tab } from "@ceruleandatahub/react-components";
import { findDevices } from "@ceruleandatahub/middleware-redux";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "./assets/icons/icons";
import { flow, get } from "lodash";
import PropTypes from "prop-types";
import Chart from "./Chart";

const tabs = ["Temperature", "Humidity", "Pressure"];

const TabContainer = styled.div`
    display: flex;
    padding: 0.2em 0 0 0.1em;
`;

const Tabs = ({ hierarchy }) => {
    const dispatch = useDispatch();

    const device = useSelector((state) => {
        return getDevice(state);
    });

    const [activeTab, setActiveTab] = useState(tabs[0]);

    useEffect(() => {
        dispatchDevicesQuery(dispatch)(hierarchy);
    }, [dispatch, activeTab, hierarchy]);

    const isActiveTab = (tab) => getActiveTab(activeTab, tab);
    const getIcon = (tab) => icons[tab.toLowerCase()];

    return (
        <>
            <TabContainer>
                {tabs.map((tab, key) => (
                    <Tab
                        key={key}
                        active={isActiveTab(tab)}
                        onClick={() => setActiveTab(tab)}
                        text={tab}
                        icon={<Icon customIcon={getIcon(tab)} />}
                    />
                ))}
            </TabContainer>

            {device && <Chart activeTab={activeTab} device={device} />}
        </>
    );
};

const dispatchDevicesQuery = (dispatch) =>
    flow([devicesQueryData, findDevices, dispatch]);

const getActiveTab = (activeTab, tab) => activeTab === tab;

const devicesQueryData = (hierarchy) => ({
    select: ["id", "external_id"],
    where: { hierarchy_id: hierarchy.id },
    take: 1,
});

const getDevice = (state) => get(state, "device.devices[0]");

Tabs.propTypes = {
    device: PropTypes.shape({}),
    clickedIndoorEntity: PropTypes.shape({}).isRequired,
    hierarchy: PropTypes.shape({}).isRequired,
};

export default Tabs;
