import { createSlice } from '@reduxjs/toolkit';
import { BlockChain } from '@/const/const';

const initialState = {
  walletAddress: null,
  walletProfileImg: null,
  walletChain: JSON.parse(localStorage.getItem('blockChain')) || BlockChain[0],
  walletBalance: null,
  walletLoading: false,
  walletError: null,
  walletNativeBalance: null,
  globelLoading: null,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletProfileImg: (state, action) => {
      state.walletProfileImg = action.payload;
    },
    setWalletChain: (state, action) => {
      state.walletChain = action.payload;
    },
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
    },
    setWalletLoading: (state, action) => {
      state.walletLoading = action.payload;
    },
    setWalletError: (state, action) => {
      state.walletError = action.payload;
    },
    setWalletNativeBalance: (state, action) => {
      state.walletNativeBalance = action.payload;
    },
    setGlobelLoading: (state, action) => {
      state.globelLoading = action.payload;
    },
  },
});

export const {
  setWalletAddress,
  setWalletProfileImg,
  setWalletChain,
  setWalletBalance,
  setWalletLoading,
  setWalletError,
  setWalletNativeBalance,
  setGlobelLoading,
} = walletSlice.actions;

export default walletSlice.reducer;
