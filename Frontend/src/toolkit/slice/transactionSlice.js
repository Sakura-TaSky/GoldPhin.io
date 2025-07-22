import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  transactionFetched: false,
  transactionLoading: false,
  transactionError: null,
  transactionFetchMore: null,
  transactionSecondaryLoading: false,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setTransactionFetched: (state, action) => {
      state.transactionFetched = action.payload;
    },
    setTransactionLoading: (state, action) => {
      state.transactionLoading = action.payload;
    },
    setTransactionError: (state, action) => {
      state.transactionError = action.payload;
    },
    setTransactionFetchMore: (state, action) => {
      state.transactionFetchMore = action.payload;
    },
    setTransactionSecondaryLoading: (state, action) => {
      state.transactionSecondaryLoading = action.payload;
    },
  },
});

export const {
  setTransactions,
  setTransactionFetched,
  setTransactionLoading,
  setTransactionError,
  setTransactionFetchMore,
  setTransactionSecondaryLoading,
} = transactionSlice.actions;

export default transactionSlice.reducer;
