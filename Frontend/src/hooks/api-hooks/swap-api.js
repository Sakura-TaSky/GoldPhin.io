import { apiKey, baseUrl, BlockChain } from '@/const/const';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
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
      toast.error(`No USD price mapping for native token: ${symbol}`);
      return 0.0;
    }

    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`;
      const response = await axios.get(url);

      const usdPrice =
        response.data?.[coingeckoId]?.usd ||
        response.data?.[coingeckoId]?.usdPrice;

      if (!usdPrice) {
        toast.error(`No USD price found for ${symbol}`);
        return 0.0;
      }

      return usdPrice;
    } catch (error) {
      toast.error(`Failed to fetch price for ${symbol}`);
      return 0.0;
    }
  }

  const getSelectedSwapTokenPrice = async (tokenOneO, tokenTwoT) => {
    if (!tokenOneO.symbol || !tokenTwoT.symbol) return;

    if (
      tokenOneO.symbol === tokenTwoT.symbol ||
      tokenOneO.address === tokenTwoT.address
    ) {
      dispatch(setSwapError('You can not swap same token each other'));
      toast.error('You can not swap same token each other');
      return;
    }

    try {
      dispatch(setSwapLoading(true));

      const isTokenOneNative = isNative(tokenOneO);
      const isTokenTwoNative = isNative(tokenTwoT);

      const erc20Response = await axios.post(
        `${baseUrl}/erc20/prices`,
        {
          chain: chainHex,
          tokens: [
            isTokenOneNative
              ? null
              : {
                  token_address: tokenOneO?.address || tokenOneO?.token_address,
                },
            isTokenTwoNative
              ? null
              : {
                  token_address: tokenTwoT?.address || tokenTwoT?.token_address,
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

      let tokenOne = null;
      let tokenTwo = null;

      if (isTokenOneNative) {
        tokenOne = await fetchNativeTokenUsdPrice(tokenOneO.symbol);
      } else {
        tokenOne = erc20Prices[0] || erc20Prices[0];
      }

      if (isTokenTwoNative) {
        tokenTwo = await fetchNativeTokenUsdPrice(tokenTwoT.symbol);
      } else {
        tokenTwo = erc20Prices[isTokenOneNative ? 0 : 1];
        erc20Prices[isTokenOneNative ? 0 : 1];
      }

      if (!tokenOne || !tokenTwo) {
        dispatch(setSwapError('USD price not found of selected token !'));
        toast.error('USD price not found of selected token !');
        return;
      }

      dispatch(
        setSwapPayToken({
          address: isTokenOneNative
            ? walletChain.NativeTokenAddresses
            : tokenOneO?.address || tokenOneO?.token_address,
          logo: tokenOneO?.logo || tokenOneO?.thumbnail || tokenOneO?.logoURI,
          symbol: tokenOneO?.symbol,
          usdPrice: isTokenOneNative
            ? tokenOne
            : tokenOne?.usdPrice || tokenOne?.usdPriceFormatted,
          decimal: isTokenOneNative
            ? tokenOne?.nativePrice?.decimals
            : tokenOne?.tokenDecimals || 18,
        })
      );

      dispatch(
        setSwapReceiveToken({
          address: isTokenTwoNative
            ? walletChain.NativeTokenAddresses
            : tokenTwoT?.address || tokenTwoT?.token_address,
          logo: tokenTwoT?.logo || tokenTwoT?.thumbnail || tokenTwoT?.logoURI,
          symbol: tokenTwoT?.symbol,
          usdPrice: isTokenTwoNative
            ? tokenTwo
            : tokenTwo?.usdPrice || tokenTwo?.usdPriceFormatted,
          decimal: isTokenTwoNative
            ? tokenTwo?.nativePrice?.decimals
            : tokenTwo?.tokenDecimals || 18,
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
