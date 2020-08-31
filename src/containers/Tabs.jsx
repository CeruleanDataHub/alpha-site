import { Icon, Tab } from "@ceruleandatahub/react-components";
import React from "react";

import PropTypes from "prop-types";
import { icons } from "./assets/icons/icons";

const Tabs = ({ tabs, activeTab, setActiveTab }) => (
    <>
        {tabs.map((tab, key) => {
            return (
                <Tab
                    key={key}
                    active={isActiveTab(activeTab, tab)}
                    onClick={() => setActiveTab(tab)}
                    text={tab}
                    icon={<Icon customIcon={getIcon(tab)} />}
                />
            );
        })}
    </>
);

const isActiveTab = (activeTab, currentTab) => activeTab === currentTab;

const getIcon = (name) => icons[name.toLowerCase()];

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
};

export default Tabs;
