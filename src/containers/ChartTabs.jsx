import React, { useEffect, useState } from "react";
import { Icon, Line, Tab } from "@ceruleandatahub/react-components";
import { aggregateTelemetryQuery } from "@ceruleandatahub/middleware-redux";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { icons } from "./assets/icons/icons";
import { flow, map, round, some } from "lodash";

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
    const lineChartValues = getLineChartValues(
        averageValueIntegers,
        averageValueDoubles
    );
    const series = populateSeriesData(activeTab, lineChartValues);
    const dates = getTimes(latestHourlyTelemetry).reverse();
    const xAxis = populateXAxisData(dates);

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

const roundEachByTwo = (iterable) => map(iterable, (item) => round(item, 2));

const getTimes = (latestHourlyTelemetry) => map(latestHourlyTelemetry, "time");

const getAverageValueIntegers = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueInt");

const getAverageValueDoubles = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueDouble");

const getLineChartValues = (averageValueIntegers, averageValueDoubles) =>
    some(averageValueIntegers)
        ? roundEachByTwo(divideEachByHundred(averageValueIntegers))
        : roundEachByTwo(averageValueDoubles);

const dispatchAggregateTelemetryQuery = (dispatch) =>
    flow([telemetryQueryData, aggregateTelemetryQuery, dispatch]);

const getActiveTab = (activeTab, tab) => activeTab === tab;

const populateSeriesData = (activeTab, lineChartValues) => ({
    name: activeTab,
    data: lineChartValues,
});

const populateXAxisData = (dates) => [{ categories: dates }];

export default ChartTabs;
