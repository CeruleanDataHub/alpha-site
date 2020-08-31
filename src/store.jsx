import { configureStore } from "@reduxjs/toolkit";
import denimMiddleware, {
    telemetryReducer,
    Auth0SessionProvider,
    devicesReducer,
    hierarchyReducer,
} from "@ceruleandatahub/middleware-redux";

require("dotenv").config();

const settingsProvider = {
    API_URL: process.env.REACT_APP_API_URL,
    API_ROOT: process.env.REACT_APP_API_ROOT,
    API_VERSION: process.env.REACT_APP_API_VERSION,
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();
sessionProvider.setTenant(process.env.REACT_APP_AUTH0_TENANT);

const setToken = (token) => sessionProvider.setToken(token);

const store = configureStore({
    reducer: {
        telemetry: telemetryReducer,
        device: devicesReducer,
        hierarchy: hierarchyReducer,
    },
    middleware: [
        ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
    ],
});

export { store, setToken };
