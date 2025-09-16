import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./reducers/AuthReducer";

const store = configureStore({
    reducer: {
        authReducer,
    },
    devTools: true
});

export default store;