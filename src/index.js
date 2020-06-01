import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Auth0Provider } from "./auth0-spa.jsx";
import IoTMapWrapper from "./containers/IoTMapWrapper.jsx";
import Home from "./containers/Home.jsx";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

const onRedirectCallback = (appState) => {
    createBrowserHistory().push(
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    );
};
console.log(process.env.REACT_APP_AUTH0_DOMAIN);

ReactDOM.render(
    <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
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
