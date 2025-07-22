import useClickOutSide from './ui-hooks/useClickOutSide';
import useShortCuts from './ui-hooks/useShortCuts';
import useWindowResize from './ui-hooks/useWindowResize';
import { useWallet } from './eth-window-connect/useWallet';
import useCopyToClipboard from './utils-hooks/useCopyToClipboard';
import useCryptoApi from './api-hooks/api-crypto';
import useTrim from './utils-hooks/useTrim';
import getDominantColor from './utils-hooks/getDominantColor';
import useDominantColor from './ui-hooks/useDominantColor';
import getTxFilterData from './utils-hooks/getTxFilterData';
import useSlice from './utils-hooks/useSlice';
import useFormatDate from './utils-hooks/useFormatDate';
import useLoadMoreApiCrypto from './api-hooks/loadmore-api-crypto';
import useServerApi from './api-hooks/server-api';
import useSwapApi from './api-hooks/swap-api';

export {
  useClickOutSide,
  useShortCuts,
  useWindowResize,
  useWallet,
  useCopyToClipboard,
  useCryptoApi,
  useTrim,
  getDominantColor,
  useDominantColor,
  getTxFilterData,
  useSlice,
  useFormatDate,
  useLoadMoreApiCrypto,
  useServerApi,
  useSwapApi,
};
