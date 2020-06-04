import { configureStore } from "@reduxjs/toolkit";
import denimMiddleware, {
    telemetryReducer,
    Auth0SessionProvider,
} from "@denim/iot-platform-middleware-redux";

const settingsProvider = {
    API_URL: "http://localhost:3000",
};

const cacheProvider = {};

const sessionProvider = new Auth0SessionProvider();
//sessionProvider.setTenant(envVar.AUTH0_TENANT);

/*const setToken = token => {
  sessionProvider.setToken(token);
};*/

const store = configureStore({
    reducer: {
        telemetry: telemetryReducer,
    },
    middleware: [
        ...denimMiddleware(settingsProvider, cacheProvider, sessionProvider),
    ],
});

export { store };
