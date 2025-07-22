import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nfts: [],
  nftFetched: false,
  nftLoading: false,
  nftError: null,
  nftFetchMore: null,
  nftSecondaryLoading: false,
};

const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    setNfts: (state, action) => {
      state.nfts = action.payload;
    },
    setNftFetched: (state, action) => {
      state.nftFetched = action.payload;
    },
    setNftLoading: (state, action) => {
      state.nftLoading = action.payload;
    },
    setNftError: (state, action) => {
      state.nftError = action.payload;
    },
    setNftFetchMore: (state, action) => {
      state.nftFetchMore = action.payload;
    },
    setNftSecondaryLoading: (state, action) => {
      state.nftSecondaryLoading = action.payload;
    },
  },
});

export const {
  setNfts,
  setNftFetched,
  setNftLoading,
  setNftError,
  setNftFetchMore,
  setNftSecondaryLoading,
} = nftSlice.actions;

export default nftSlice.reducer;
