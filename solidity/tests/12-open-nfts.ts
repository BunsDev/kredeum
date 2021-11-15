import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

describe("Open NFTs contract", function () {
  let openNFTs: OpenNFTs;
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

  ethers;
  before(async () => {
    const chainId = (await ethers.provider.getNetwork()).chainId;
    const signer = await ethers.getNamedSigner("deployer");

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;

    await (await openNFTs.mintNFT(artist, "", txOptions)).wait();
  });

  it("Should get sighash", function () {
    expect(openNFTs.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should set OpenNFTs name and NFT symbol only once", async function () {
    const rname = "sTFN nepO";
    const rsymbol = "TFN";
    await openNFTs.initialize(rname, rsymbol);

    expect(await openNFTs.symbol()).to.be.equal(rsymbol);
    expect(await openNFTs.name()).to.be.equal(rname);

    void expect(openNFTs.initialize(rname, rsymbol)).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("Should get openNFTs balanceOf", async function () {
    expect(await openNFTs.balanceOf(artist)).to.be.gte(1);
  });

  it("Should get openNFTs totalSupply", async function () {
    expect(await openNFTs.totalSupply()).to.be.gte(1);
  });
});