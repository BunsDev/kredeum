import { getChainId, getChainName } from "lib/kconfig";

type RefNFT = {
  account?: string;
  chainId: number;
  collection?: string;
  tokenID?: string;
};

// CAIP-22 : erc721 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md
// CAIP-29 : erc1155 : https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-29.md
const refs = (refNFT: RefNFT) => {
  const { account, chainId, collection, tokenID } = refNFT || {};

  const chainName = getChainName(chainId);

  const ref =
    (chainName
      ? collection
        ? tokenID
          ? `${chainName}/${collection}/${tokenID}`
          : `${chainName}/${collection}`
        : chainName
      : "") + (account ? `@${account}` : "");

  const caip =
    (chainId
      ? collection
        ? tokenID
          ? `eip155:${chainId}/erc721:${collection}/${tokenID}`
          : `eip155:${chainId}/erc721:${collection}`
        : `eip155:${chainId}`
      : "") + (account ? `@${account}` : "");

  const hash =
    "/" +
    (chainName
      ? collection
        ? tokenID
          ? `${chainName}/${collection}/${tokenID}`
          : `${chainName}/${collection}`
        : `${chainName}`
      : "") +
    (account ? `@${account}` : "");

  const breadcrumb =
    "> " +
    (chainName
      ? collection
        ? tokenID
          ? `${chainName} > coll:${collection} > nft:${tokenID}`
          : `${chainName} > coll:${collection}`
        : `${chainName}`
      : "Home") +
    (account ? ` > user:${account}` : "");

  console.log("refs", chainName, ref, caip, hash, breadcrumb);
  return { chainName, ref, caip, hash, breadcrumb };
};

export type { RefNFT };
export { refs };
