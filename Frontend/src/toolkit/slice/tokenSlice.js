import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokens: [],
  tokenFetched: false,
  tokenLoading: false,
  tokenError: null,
  tokenFetchMore: null,
  tokenSecondaryLoading: false,
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setTokenFetched: (state, action) => {
      state.tokenFetched = action.payload;
    },
    setTokenLoading: (state, action) => {
      state.tokenLoading = action.payload;
    },
    setTokenError: (state, action) => {
      state.tokenError = action.payload;
    },
    setTokenFetchMore: (state, action) => {
      state.tokenFetchMore = action.payload;
    },
    setTokenSecondaryLoading: (state, action) => {
      state.tokenSecondaryLoading = action.payload;
    },
  },
});

export const {
  setTokens,
  setTokenFetched,
  setTokenLoading,
  setTokenError,
  setTokenFetchMore,
  setTokenSecondaryLoading,
} = tokenSlice.actions;
export default tokenSlice.reducer;
