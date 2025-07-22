import { apiKey, baseUrl } from '@/const/const';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  setMakingSwap,
  setSwapError,
  setSwapLoading,
  setSwapPayToken,
  setSwapReceiveToken,
} from '@/toolkit/slice/swapSlice';
import { toast } from 'sonner';

export default function useSwapApi() {
  const { walletChain } = useSelector((state) => state.wallet);
  const headers = {
    headers: {
      'X-API-Key': apiKey,
    },
  };

  const dispatch = useDispatch();

  const chainHex = walletChain.hex;

  const isNative = (token) => {
    return token.symbol == walletChain.nativeToken;
  };

  const coingeckoIdMap = {
    ETH: 'ethereum',
    BNB: 'binancecoin',
    AVAX: 'avalanche-2',
    POL: 'polygon',
    ARB: 'arbitrum',
    OP: 'optimism',
  };

  async function fetchNativeTokenUsdPrice(symbol) {
    const coingeckoId = coingeckoIdMap[symbol?.toUpperCase()];
    if (!coingeckoId) {
      toast.error(`No Usd price found for ${symbol}`);
    }
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;
      const response = await axios.get(url);

      const usdPrice =
        response.data?.[coingeckoId]?.usd ||
        response.data?.[coingeckoId]?.usdPrice;

      if (!usdPrice) {
        toast.error(`No Usd price found for ${symbol}`);
        return 0.0;
      }
      return usdPrice;
    } catch (error) {
      dispatch(setSwapError(error.message || 'something went wrong'));
      toast.error(`No Usd price found for ${symbol}`);
    }
  }

  const getSelectedSwapTokenPrice = async (tokenOne, tokenTwo) => {
    if (!tokenOne || !tokenTwo) return;

    if (
      tokenOne.symbol === tokenTwo.symbol ||
      tokenOne.address === tokenTwo.address
    ) {
      dispatch(setSwapError('You can not swap same token each other'));
      toast.error('You can not swap same token each other');
      return;
    }

    try {
      dispatch(setSwapLoading(true));

      const isTokenOneNative = isNative(tokenOne);
      const isTokenTwoNative = isNative(tokenTwo);

      const erc20Response = await axios.post(
        `${baseUrl}/erc20/prices`,
        {
          chain: chainHex,
          tokens: [
            isTokenOneNative
              ? null
              : {
                  token_address: tokenOne?.address || tokenOne?.token_address,
                },
            isTokenTwoNative
              ? null
              : {
                  token_address: tokenTwo?.address || tokenTwo?.token_address,
                },
          ].filter(Boolean),
        },
        headers
      );

      const erc20Prices = erc20Response.data;

      if (!erc20Prices || erc20Prices.length == 0) {
        dispatch(setSwapError('USD price not found of selected token !'));
        toast.error('USD price not found of selected token !');
      }

      let tokenOnePrice = null;
      let tokenTwoPrice = null;

      if (isTokenOneNative) {
        tokenOnePrice = await fetchNativeTokenUsdPrice(tokenOne.symbol);
      } else {
        tokenOnePrice =
          erc20Prices[0]?.usdPrice || erc20Prices[0]?.usdPriceFormatted;
      }

      if (isTokenTwoNative) {
        tokenTwoPrice = await fetchNativeTokenUsdPrice(tokenTwo.symbol);
      } else {
        tokenTwoPrice =
          erc20Prices[isTokenOneNative ? 0 : 1]?.usdPrice ||
          erc20Prices[isTokenOneNative ? 0 : 1]?.usdPriceFormatted;
      }

      if (!tokenOnePrice || !tokenTwoPrice) {
        dispatch(setSwapError('USD price not found of selected token !'));
        toast.error('USD price not found of selected token !');
        return;
      }

      dispatch(
        setSwapPayToken({
          address: isTokenOneNative
            ? null
            : tokenOne?.address || tokenOne?.token_address,
          logo: tokenOne?.logo || tokenOne?.thumbnail || tokenOne?.logoURI,
          symbol: tokenOne?.symbol,
          usdPrice: tokenOnePrice,
        })
      );

      dispatch(
        setSwapReceiveToken({
          address: isTokenTwoNative
            ? null
            : tokenTwo?.address || tokenTwo?.token_address,
          logo: tokenTwo?.logo || tokenTwo?.thumbnail || tokenTwo?.logoURI,
          symbol: tokenTwo?.symbol,
          usdPrice: tokenTwoPrice,
        })
      );
    } catch (error) {
      dispatch(setSwapError(error.message || 'Something went wrong'));
      toast.error(error.message || 'Something went wrong');
    } finally {
      dispatch(setSwapLoading(false));
    }
  };

  return {
    getSelectedSwapTokenPrice,
  };
}
