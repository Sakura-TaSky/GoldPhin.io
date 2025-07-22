import { createSlice } from '@reduxjs/toolkit';

// swapPayToken: {
//   address: '';
//   logo: '';
//   symbol: '';
//   usdPrice: '';
//   valu:0.00
// }

const initialState = {
  tokenList: [],
  swapPayToken: null,
  swapReceiveToken: null,
  swapLoading: false,
  swapError: null,
  makingSwap: null,
};

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    setSwapPayToken: (state, action) => {
      state.swapPayToken = action.payload;
    },
    setSwapReceiveToken: (state, action) => {
      state.swapReceiveToken = action.payload;
    },
    setSwapLoading: (state, action) => {
      state.swapLoading = action.payload;
    },
    setSwapError: (state, action) => {
      state.swapError = action.payload;
    },
    setMakingSwap: (state, action) => {
      state.makingSwap = action.payload;
    },
  },
});

export const {
  setTokenList,
  setSwapPayToken,
  setSwapReceiveToken,
  setSwapLoading,
  setSwapError,
  setMakingSwap,
} = swapSlice.actions;

export default swapSlice.reducer;
