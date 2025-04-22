// app/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artistReducer from './slices/artistSlice'

// Create the store
const store = configureStore({
	reducer: {
		auth: authReducer,
		artists: artistReducer
	},
	middleware: (getDefaultMiddleware) =>getDefaultMiddleware({serializableCheck: false}),
});

export default store;
