import React, { useEffect } from "react";
import moment from "moment-timezone";
import { Line } from "@ceruleandatahub/react-components";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { flow, map, reverse, round, some } from "lodash";
import { aggregateTelemetryQuery } from "@ceruleandatahub/middleware-redux";
import PropTypes from "prop-types";

const Content = styled.div`
    padding: 0.2em 0 0 0.1em;
`;

const IndoorEntityChart = ({ activeTab, device }) => {
    const dispatch = useDispatch();

    const latestHourlyTelemetry = useSelector(
        ({ telemetry }) => telemetry.queryResult
    );

    useEffect(() => {
        dispatchAggregateTelemetryQuery(dispatch)(device, activeTab);
    }, [activeTab, device, dispatch]);

    const averageValueIntegers = getAverageValueIntegers(latestHourlyTelemetry);
    const averageValueDoubles = getAverageValueDoubles(latestHourlyTelemetry);
    const lineChartValues = getLineChartValues(
        averageValueIntegers,
        averageValueDoubles
    );

    const series = populateSeriesData(activeTab, lineChartValues);
    const dates = getDates(latestHourlyTelemetry);
    const xAxis = populateXAxisData(dates);
    const options = {
        legend: { enabled: false },
    };

    return (
        <Content>
            <Line
                title={`hourly ${activeTab}`}
                xAxis={xAxis}
                series={series}
                options={options}
            />
        </Content>
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

const getAverageValueIntegers = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueInt");

const getAverageValueDoubles = (latestHourlyTelemetry) =>
    map(latestHourlyTelemetry, "avgValueDouble");

const getLineChartValues = (averageValueIntegers, averageValueDoubles) =>
    some(averageValueIntegers)
        ? roundEachByTwo(divideEachByHundred(averageValueIntegers))
        : roundEachByTwo(averageValueDoubles);

const divideEachByHundred = (dividends) => map(dividends, (item) => item / 100);

const roundEachByTwo = (roundables) =>
    map(roundables, (item) => round(item, 2));

const getTimes = (latestHourlyTelemetry) => map(latestHourlyTelemetry, "time");

const dispatchAggregateTelemetryQuery = (dispatch) =>
    flow([telemetryQueryData, aggregateTelemetryQuery, dispatch]);

const populateSeriesData = (activeTab, lineChartValues) => [
    {
        name: activeTab,
        data: lineChartValues,
    },
];

const populateXAxisData = (dates) => [{ categories: dates }];

const formatDate = (date) => moment(date).format("DD.MM. hh:mm");

const formatDates = (dates) => map(dates, (date) => formatDate(date));

const getDates = (telemetryData) =>
    flow([getTimes, reverse, formatDates])(telemetryData);

IndoorEntityChart.propTypes = {
    activeTab: PropTypes.string.isRequired,
    device: PropTypes.shape({}),
};

export default IndoorEntityChart;
