import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	token: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setCredential: (state, action) => {
			state.token = action.payload;
		},
		logout: (state, action) => {
			state.token = null;
		},
	},
});

export const { setCredential, logout } = authSlice.actions;

export default authSlice.reducer;
