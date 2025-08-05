export default function getTxFilterData(tx, walletAddress) {
  const txData = tx.map((tx) => {
    const entryName = tx.from_address_entity || tx.to_address_entity;
    const entryLabel = tx.from_address_label || tx.to_address_label;
    const entryImage = tx.from_address_entity_logo || tx.to_address_entity_logo;
    const status = tx.receipt_status == 1 ? 'Success' : 'Failed';
    const gasFee =
      tx.from_address?.toLowerCase() === walletAddress?.toLowerCase()
        ? tx.transaction_fee
        : null;

    const tokens =
      tx.category == 'approve'
        ? [tx.contract_interactions?.approvals?.map((a) => a.token)]
        : tx.category == 'revoke'
        ? [tx.contract_interactions?.revokes?.map((a) => a.token)]
        : [...(tx.erc20_transfers || []), ...(tx.native_transfers || [])];
    const category =
      tx.category === 'token send'
        ? 'send'
        : tx.category === 'token receive'
        ? 'receive'
        : tx.category;

    return {
      _tokens: tokens?.map((t) => {
        if (t?.address == '0x2e9a6df78e42a30712c10a9dc4b1c8656f8f2879') {
          return {
            ...t,
            token_name: 'Maker',
            token_symbol: 'MKR',
          };
        }
        return t;
      }),
      _hash: tx.hash,
      _category: category,
      _summary: tx.summary,
      _from: tx.from_address,
      _to: tx.to_address,
      _entryName: entryName,
      _entryImage: entryImage,
      _entryLabel: entryLabel,
      _fee: gasFee,
      _status: status,
      _time: tx.block_timestamp,
    };
  });
  return txData;
}
