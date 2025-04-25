import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: []
};

const albumSlice = createSlice({
    name: "album",
    initialState,
    reducers: {
        setAlbums: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setAlbums } = albumSlice.actions;

export default albumSlice.reducer;
