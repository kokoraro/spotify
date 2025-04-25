import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    fetched: false
};

const artistSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setArtists: (state, action) => {
            state.data = action.payload;
            state.fetched = true;
        },
        addArtist: (state, action) => {
            state.data = [...state.data, action.payload]
        }
    },
});

export const { setArtists, addArtist } = artistSlice.actions;

export default artistSlice.reducer;
