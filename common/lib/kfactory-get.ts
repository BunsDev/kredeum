import type { Provider } from "@ethersproject/abstract-provider";
import type { Address, AbiType } from "./ktypes";
import type { NFTsFactory } from "types/NFTsFactory";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";

import { Signer, Contract } from "ethers";
import { getNetwork, config } from "./kconfig";

// ! MUST manage simultaneously NFTsFactory V1 and V2
// ! until all networks are on NFTsFactory V2
import ICloneFactory from "abis/deployed/ICloneFactory.json";
import INFTsFactory from "abis/deployed/INFTsFactory.json";
import ICloneFactoryV2 from "abis/new/ICloneFactoryV2.json";
import INFTsFactoryV2 from "abis/new/INFTsFactoryV2.json";

// nftsFactory cache over networks
const nftsFactories: Map<number, Contract> = new Map();

const factoryGetVersion = async (chainId: number, provider: Provider | undefined): Promise<number> => {
  console.log("factoryGetVersion ~ chainId", chainId, provider);

  const code = (await provider?.getCode(config.nftsFactoryV2)) || "0x";
  // console.log("factoryGetVersion ~ code", code);

  console.log("factoryGetVersion ~ version BEFORE");
  const version = code != "0x" ? 2 : getNetwork(chainId)?.nftsFactory ? 1 : 0;
  console.log("factoryGetVersion ~ version AFTER", version);

  return version;
};

const factoryGetAddress = (chainId: number, version: number): string => {
  console.log("factoryGetAddress", chainId, version);

  const address = version == 2 ? config.nftsFactoryV2 : getNetwork(chainId)?.nftsFactory || "";
  console.log("factoryGetAddress ~ address", address);

  return address;
};

const factoryGetAbi = (chainId: number, version: number): string[] => {
  console.log("factoryGetAbi", chainId, version);
  const factoryAbi =
    version == 2
      ? ICloneFactoryV2.concat(INFTsFactoryV2)
      : getNetwork(chainId)?.nftsFactory
      ? ICloneFactory.concat(INFTsFactory)
      : [];
  console.log("factoryAbi", version, factoryAbi);
  return factoryAbi;
};

// GET NFTsFactory Contract
const factoryGetContract = (
  chainId: number,
  version: number,
  signerOrProvider: Signer | Provider
): NFTsFactory | NFTsFactoryV2 => {
  console.log("factoryGetContract", chainId, version);

  let nftsFactory = nftsFactories.get(chainId) as NFTsFactory | NFTsFactoryV2;
  if (!nftsFactory) {
    nftsFactory = new Contract(
      factoryGetAddress(chainId, version),
      factoryGetAbi(chainId, version),
      signerOrProvider
    ) as NFTsFactory | NFTsFactoryV2;
    nftsFactories.set(chainId, nftsFactory);
  }
  console.log("nftsFactory", nftsFactory);

  return nftsFactory;
};

// GET OpenNFTs default template via onchain call
const factoryGetTemplate = async (
  chainId: number,
  version: number,
  template: string,
  provider: Provider
): Promise<Address> => {
  console.log("factoryGetTemplate", chainId, version, template);

  let templateAddress = "";
  if (version == 2) {
    const nftsFactory = factoryGetContract(chainId, version, provider) as NFTsFactoryV2;
    templateAddress = await nftsFactory.templates(template);
  } else {
    const nftsFactory = factoryGetContract(chainId, version, provider) as NFTsFactory;
    templateAddress = await nftsFactory.template();
  }

  // console.log("factoryGetTemplate ~ templateAddress", templateAddress);
  return templateAddress;
};

export { factoryGetContract, factoryGetAddress, factoryGetTemplate, factoryGetVersion };
