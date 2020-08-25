import React, { useEffect, useState } from "react";
import { Icon, Line, Tab } from "@ceruleandatahub/react-components";
import { aggregateTelemetryQuery } from "@ceruleandatahub/middleware-redux";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "./assets/icons/icons";
import { flow, map, some } from "lodash";

const tabs = ["Temperature", "Humidity", "Pressure"];

const TabContainer = styled.div`
    display: flex;
    padding: 0.2em 0 0 0.1em;
`;

const Content = styled.div`
    padding: 0.2em 0 0 0.1em;
`;

const ChartTabs = ({ device }) => {
    const dispatch = useDispatch();
    const latestHourlyTelemetry = useSelector(
        ({ telemetry }) => telemetry.queryResult
    );
    const [activeTab, setActiveTab] = useState(tabs[0]);

    useEffect(() => {
        dispatchAggregateTelemetryQuery(dispatch)(device, activeTab);
    }, [activeTab]);

    const averageValueIntegers = getAverageValueIntegers(latestHourlyTelemetry);
    const averageValueDoubles = getAverageValueDoubles(latestHourlyTelemetry);
    const dates = getTimes(latestHourlyTelemetry).reverse();
    const lineChartValues = getLineChartValues(
        averageValueIntegers,
        averageValueDoubles
    );

    const series = {
        name: activeTab,
        data: lineChartValues,
    };

    const xAxis = [{ categories: dates }];

    const isActiveTab = (tab) => activeTab === tab;

    return (
        <>
            <TabContainer>
                {tabs.map((tab) => (
                    <Tab
                        active={isActiveTab(tab)}
                        onClick={() => setActiveTab(tab)}
                        text={tab}
                        icon={<Icon customIcon={icons[tab.toLowerCase()]} />}
                    />
                ))}
            </TabContainer>

            {lineChartValues && (
                <Content>
                    <Line
                        title={`hourly ${activeTab}`}
                        xAxis={xAxis}
                        series={series}
                    />
                </Content>
            )}
        </>
    );
};

const telemetryQueryData = (device, activeTab) => ({
    deviceId: device.id,
    sensorName: activeTab.toLowerCase(),
    type: "HOURLY",
    order: {
        time: "DESC",
    },
    limit: 10,
});

const divideEachByHundred = (dividend) => map(dividend, (item) => item / 100);

const getTimes = (latestHourlyTelemetry) => map(latestHourlyTelemetry, "time");

const getAverageValueIntegers = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueInt");

const getAverageValueDoubles = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueDouble");

const getLineChartValues = (averageValueIntegers, averageValueDoubles) =>
    some(averageValueIntegers)
        ? divideEachByHundred(averageValueIntegers)
        : averageValueDoubles;

const dispatchAggregateTelemetryQuery = (dispatch) =>
    flow([telemetryQueryData, aggregateTelemetryQuery, dispatch]);

export default ChartTabs;
