import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	data: []
};

const artistSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setArtists: (state, action) => {
			state.data = action.payload;
		},
        addArtist: (state, action) => {
            state.data = [...state.data, action.payload]
        },
        setAlbums: (state, action) => {
            const {artistId, albums} = action.payload
            console.log(artistId, albums)
            const artist = state.data.find(artist => artist.id === artistId)
            if(artist){
                artist.albums = albums;
            }
        }
	},
});

export const { setArtists, addArtist, setAlbums } = artistSlice.actions;

export default artistSlice.reducer;
