import networks from "../config/networks.json";
import abis from "../config/abis.json";
import type { Collection, Network, ABIS, Nft, KredeumKeys, ErcKeys } from "./ktypes";

import { providers } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";

const networksMap = new Map(networks.map((network) => [network.chainId, network]));

const getNetwork = (chainId: number | string): Network | undefined => {
  return networksMap.get(Number(chainId));
};

const getProvider = (chainId: number): Provider | undefined => {
  const network = getNetwork(chainId);
  // console.log("getProvider", chainId, "=>", network);

  const url = network?.rpcUrls[0];
  let apiKey = url?.includes("infura.io")
    ? process.env.INFURA_API_KEY
    : url?.includes("etherscan.io")
      ? process.env.ETHERSCAN_API_KEY
      : url?.includes("maticvigil.com")
        ? process.env.MATICVIGIL_API_KEY
        : null;
  apiKey = apiKey ? "/" + apiKey : "";
  const provider = new providers.JsonRpcProvider(`${url}${apiKey}`);

  return provider;
};

const getEnsName = async (address: string): Promise<string> => {
  let name = "";
  try {
    const ensProvider: Provider = new providers.JsonRpcProvider(
      `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`
    );
    name = (await ensProvider.lookupAddress(address)) || "";
  } catch (e) {
    console.error("NO ENS found");
  }
  return name || address || "";
};

const getSubgraphUrl = (chainId: number): string => {
  const network = getNetwork(chainId);
  return (network?.subgraph?.active && network?.subgraph?.url) || "";
};

const getCovalent = (chainId: number) => {
  const network = getNetwork(chainId);
  return network?.covalent?.active;
};

// GET chain name
const getChainName = (chainId: number) => {
  const network = getNetwork(chainId);
  return network?.chainName || "";
};

// GET explorer
const getExplorer = (chainId: number) => {
  const network = getNetwork(chainId);
  return network?.blockExplorerUrls[0] || "";
};

// GET openNFTs
const getOpenNFTsAddress = (chainId: number): string => {
  const network = getNetwork(chainId);
  return network?.openNFTs || "";
};

// GET OpenSea
const getOpenSea = (chainId: number) => {
  const network = getNetwork(chainId);
  return network?.openSea || {};
};

// nfts url : nfts://chainName/contractAddress
const nftsUrl = (chainId: number, _address: string): string => {
  const network = getNetwork(chainId);
  return "nfts://" + (network ? network.chainName + (_address ? "/" + _address : "...") : "...");
};

// nft url : nft://chainName/contractAddress/tokenID
const nftUrl = (chainId: number, _contract: string, _tokenId: string, plus = "..."): string => {
  const network = getNetwork(chainId);
  const ret =
    "nft://" +
    (network
      ? network.chainName +
        (_contract ? "/" + (_contract + (_tokenId ? "/" + _tokenId : plus)) : plus)
      : plus);
  // console.log("nftUrl", chainId, _contract, _tokenId, plus, ret);
  return ret;
};

export {
  abis,
  networks,
  getChainName,
  getNetwork,
  getEnsName,
  getProvider,
  getSubgraphUrl,
  getOpenSea,
  getOpenNFTsAddress,
  getCovalent,
  getExplorer,
  nftUrl,
  nftsUrl
};
export type { Collection, Network, ABIS, Nft, KredeumKeys, ErcKeys };