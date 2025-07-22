export const getNftFilterData = (nfts) => {
  const normalizeIpfs = (urlOrCid) => {
    const gateway = 'https://ipfs.io/ipfs/';

    if (!urlOrCid) return '';

    if (urlOrCid.startsWith('ipfs://')) {
      return gateway + urlOrCid.slice(7);
    }

    if (
      urlOrCid.startsWith('bafy') ||
      urlOrCid.startsWith('Qm') ||
      urlOrCid.startsWith('ar')
    ) {
      return gateway + urlOrCid;
    }

    try {
      const url = new URL(urlOrCid);
      const pathParts = url.pathname.split('/');
      const ipfsIndex = pathParts.findIndex((part) => part === 'ipfs');
      if (ipfsIndex >= 0 && pathParts[ipfsIndex + 1]) {
        const cid = pathParts[ipfsIndex + 1];
        return gateway + cid;
      }
    } catch (err) {}

    return urlOrCid;
  };

  const nftMap = new Map();

  nfts.forEach((n) => {
    const key = n.token_address;

    const imageRaw = n.normalized_metadata?.image;
    const image = normalizeIpfs(imageRaw);

    if (nftMap.has(key)) {
      const existing = nftMap.get(key);
      existing._total += Number(n.amount || 1);
    } else {
      nftMap.set(key, {
        _total: Number(n.amount || 1),
        _mainName: n.name,
        _name: n.normalized_metadata?.name,
        _description: n.normalized_metadata?.description,
        _image: image,
        _collectionImage: n.collection_logo || n.collection_banner_image,
        _category: n.collection_category,
        _floorPriceUsd: n.floor_price_usd,
        _floorPriceCurrency: n.floor_price_currency,
        _floorPrice: n.floor_price,
      });
    }
  });

  return Array.from(nftMap.values());
};
