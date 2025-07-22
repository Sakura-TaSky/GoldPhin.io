import { configureStore } from '@reduxjs/toolkit';
import walletReducer from './slice/walletSlice';
import tokenReducer from './slice/tokenSlice';
import transactionReducer from './slice/transactionSlice';
import nftReducer from './slice/nftSlice';
import swapReducer from './slice/swapSlice';

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    token: tokenReducer,
    transaction: transactionReducer,
    nft: nftReducer,
    swap: swapReducer,
  },
});

export default store;
