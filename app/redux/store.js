// app/redux/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import artistReducer from './slices/artistSlice';
import albumReducer from './slices/albumSlice';

const store = configureStore({
	reducer: {
		auth: authReducer,
		artists: artistReducer,
		albums: albumReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
