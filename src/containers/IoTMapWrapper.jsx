import React from "react";
import IoTMap from "./IoTMap.jsx";
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../auth0-spa.jsx";

const IoTMapWrapper = () => {
    const { isAuthenticated } = useAuth0();
    return isAuthenticated ? <IoTMap /> : <Redirect to="/" />;
};
export default IoTMapWrapper;
