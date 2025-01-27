import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { OpenNFTsV3 } from "types/OpenNFTsV3";
import type { NFTsFactoryV2 } from "types/NFTsFactoryV2";
import type { NetworkType } from "lib/ktypes";

import {
  collectionList,
  collectionListFromCovalent,
  collectionListFromTheGraph,
  collectionListFromFactory
} from "lib/kcollection-list";
import { expect } from "chai";
import { getNetwork } from "lib/kconfig";
import hre from "hardhat";
import { Signer } from "ethers";
const { ethers, deployments } = hre;

describe("13 List contracts lib", function () {
  let owner: string;
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  let configNetwork: NetworkType | undefined;
  let nftsFactory: NFTsFactoryV2;
  let openNFTsV3: OpenNFTsV3;

  let network: string;
  let chainId: number;
  let live: boolean;
  let signer: Signer;

  before(async () => {
    signer = (await ethers.getNamedSigner("deployer")) as Signer;
    owner = await signer.getAddress();

    network = hre.network.name;
    chainId = Number(await hre.getChainId());
    live = hre.network.live;
    console.log("network", network, chainId, live);
  });

  beforeEach(async () => {
    configNetwork = getNetwork(chainId);
    const { deployer } = await ethers.getNamedSigners();

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTsV3", "NFTsFactoryV2"]);
    }

    openNFTsV3 = await ethers.getContract("OpenNFTsV3", signer);
    expect(openNFTsV3.address).to.be.properAddress;
    await ((await openNFTsV3.mintOpenNFT(artist, "", txOptions)) as TransactionResponse).wait();

    nftsFactory = await ethers.getContract("NFTsFactoryV2", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await nftsFactory.connect(deployer).templateSet("generic", openNFTsV3.address);
  });

  it("List with NFTsFactoryV2", async function () {
    if (chainId !== 31337) {
      // console.log((await nftsFactory.implementationsCount()).toString());
      // console.log(await nftsFactory.balancesOf(owner));
      // console.log(await collectionListFromFactory(chainId, owner, ethers.provider));
      expect((await collectionListFromFactory(chainId, owner, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with default method", async function () {
    if (chainId !== 31337) {
      expect((await collectionList(chainId, artist, ethers.provider)).size).to.be.gte(1);
    }
  });

  it("List with The Graph", async function () {
    if (configNetwork?.subgraph) {
      expect((await collectionListFromTheGraph(chainId, owner)).size).to.be.gte(1);
    }
  });

  it("With Covalent", async function () {
    if (configNetwork?.covalent) {
      expect((await collectionListFromCovalent(chainId, artist)).size).to.be.gte(1);
    }
  });
});
