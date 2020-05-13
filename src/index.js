import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Auth0Provider } from "./auth0-spa.jsx";
import IoTMapWrapper from "./containers/IoTMapWrapper.jsx";
import Home from "./containers/Home.jsx";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

import * as reduxMiddleware from "@denim/iot-platform-middleware-redux";

console.log(reduxMiddleware);

const onRedirectCallback = (appState) => {
    createBrowserHistory().push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};

ReactDOM.render(
    <Auth0Provider
        domain="denim-data-hub.eu.auth0.com"
        client_id="OHGmZzsoKP0gM1stF0ckvkkm507FAPGq"
        audience="https://ddh-api.azure-api.net"
        redirect_uri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        <Router>
            <Switch>
                <Route exact path="/map" component={IoTMapWrapper} />
                <Route path="/" component={Home} />
            </Switch>
        </Router>
    </Auth0Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
