import React from "react";
import ReactDOM from "react-dom";

import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import { store } from "./store.jsx";
import IoTMap from "./containers/IoTMap.jsx";

import "./index.css";
import * as serviceWorker from "./serviceWorker";
import PropTypes from "prop-types";
import { ModalProvider } from "styled-react-modal/";

export const history = createBrowserHistory();

const ProtectedRoute = ({ component, ...args }) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
);

ProtectedRoute.propTypes = {
    component: PropTypes.func,
};

const onRedirectCallback = (appState) =>
    history.replace(appState?.returnTo || window.location.pathname);

ReactDOM.render(
    <Provider store={store}>
        <ModalProvider>
            <Auth0Provider
                domain={process.env.REACT_APP_AUTH0_DOMAIN}
                audience={process.env.REACT_APP_AUTH0_AUDIENCE}
                clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
                redirectUri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                {
                    <Router history={history}>
                        <Switch>
                            <ProtectedRoute path="/" component={IoTMap} />
                        </Switch>
                    </Router>
                }
            </Auth0Provider>
        </ModalProvider>
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
