type OpenNFTsKeys = "IOpenNFTsV3" | "IOpenNFTsV2" | "IOpenNFTsV1" | "IOpenNFTsV0" | "IOpenNFTs";
type ErcKeys = "IERC165" | "IERC721" | "IERC721Metadata" | "IERC721Enumerable" | "IERC1155" | "IERC1155MetadataURI";
type AbiType = { abi: Array<string>; interfaceId?: string };
type ABIS = ErcKeys | OpenNFTsKeys;

type Address = string;

type NetworkType = {
  chainId: number;
  chainName: string;
  rpcUrls: Array<string>;
  iconUrls?: Array<string>;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  blockExplorerUrls: Array<string>;
  subgraph?: { url?: string; startBlock?: number; active?: boolean };
  alchemy?: { url?: string; active: boolean };
  covalent?: { active: boolean };
  mainnet?: boolean;
  testnet?: boolean;
  create?: boolean;
  admin?: string;
  openSea?: { assets?: string; openNFTs?: string };
  openMulti?: string;
  defaultOpenNFTs?: string;
  nftsFactory?: string;
  nftsFactoryV2?: string;
  eip1559?: boolean;
};

type CollectionType = {
  chainId: number;
  address: string;
  owner?: string;
  name?: string;
  symbol?: string;
  chainName?: string;
  interfaces?: Array<string>;
  totalSupply?: number;
  startBlock?: number;
  description?: string;
  balancesOf?: Map<string, number>;
  version?: number;
  burnable?: boolean;
  open?: boolean;
  supports?: CollectionSupports;
};
type CollectionSupports = {
  IERC165?: boolean;
  IERC721?: boolean;
  IERC1155?: boolean;
  IERC721Metadata?: boolean;
  IERC721Enumerable?: boolean;
  IERC1155MetadataURI?: boolean;
  IERC173?: boolean;
  IOpenMulti?: boolean;
  IOpenNFTs?: boolean;
  IOpenNFTsV0?: boolean;
  IOpenNFTsV1?: boolean;
  IOpenNFTsV2?: boolean;
  IOpenNFTsV3?: boolean;
};

///////////////////////////////////////////////////
// Exclusives storage parameters for Ipfs | Swarm
///////////////////////////////////////////////////
type Without<T> = { [P in keyof T]?: undefined };
type XOR<T, U> = (Without<T> & U) | (Without<U> & T);

////////
type ipfsType = {
  ipfs?: string;
  ipfsJson?: string;
};

type swarmType = {
  swarm?: string;
  swarmJson?: string;
};

////////
type storageType = XOR<ipfsType, swarmType>;

///////////////////////////////////////////////////

type NftMetadata = {
  name?: string;
  description?: string;
  creator?: string;
  minter?: string;
  owner?: string;
  image?: string;
  image_url?: string;
  animation_url?: string;
} & storageType;

type NftType = {
  chainId: number;
  address: string;
  tokenID: string;
  tokenURI?: string;
  owner?: string;
  chainName?: string;
  name?: string;
  contractName?: string;
  description?: string;
  tokenJson?: NftMetadata;
  metadata?: NftMetadata | unknown;
  image?: string;
  image_url?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  background_color?: string;
  attributes?: unknown;
  origin?: string;
  creator?: string;
  minter?: string;
  nid?: string;
  contentType?: string;
} & storageType;

export type {
  NftType,
  AbiType,
  NetworkType,
  CollectionType,
  Address,
  CollectionSupports,
  ABIS,
  NftMetadata,
  OpenNFTsKeys,
  ErcKeys
};
