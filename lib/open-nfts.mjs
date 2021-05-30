import { ethers } from "ethers";
import contracts from "../config/contracts.json";
import abis from "../config/abis.json";
import networks from "../config/networks.json";

class OpenNfts {
  network;
  contract;
  subgraphUrl;

  get network() {
    return this.network;
  }

  get contract() {
    return this.contract;
  }

  constructor(chainId, contractAddress) {
    let address, abi;
    // search with contract address
    if (contractAddress) {
      const contract = contracts.find((_contract) => _contract.address === contractAddress);
      if (contract) {
        address = contractAddress;
        this.subgraphUrl = contract.subgraphUrl;
        this.network = networks.find((_network) => _network.chainName === contract.network);
        abi = abis[contract.abi];
      }
    }
    // else search with network chainId
    if (!this.network) {
      this.network = networks.find((_network) => Number(_network.chainId) === Number(chainId));
      const contract = contracts.find((_contract) => _contract.network === this.network.chainName);

      if (contract) {
        this.subgraphUrl = contract.subgraphUrl;
        address = contract.address;
        abi = abis[contract.abi];
      }
    }

    if (address) {
      const provider = new ethers.providers.JsonRpcProvider(this.network.rpcUrls[0]);
      this.contract = new ethers.Contract(address, abi, provider);
    }
  }

  async fetchJson(tokenURI, config = {}) {
    let json = {};
    try {
      json = await (await fetch(tokenURI, config)).json();
    } catch (e) {
      console.error("OpenNfts.fetchJson ERROR", tokenURI, e);
    }
    return json;
  }

  async getToken(index) {
    const nft = {};
    try {
      nft.tokenId = (await this.contract.tokenByIndex(index)).toString();
      nft.ownerOf = await this.contract.ownerOf(nft.tokenId);
      nft.tokenURI = await this.contract.tokenURI(nft.tokenId);
      nft.tokenJSON = await this.fetchJson(nft.tokenURI);
      nft.contract = this.contract.address;
    } catch (e) {
      console.error("nft.getToken ERROR", e, nft);
    }
    // console.log("nft.getToken #" + nft?.tokenId, nft);
    return nft;
  }

  async listTheGraph() {
    let tokens = [];

    // const query = `{ tokens(first: 999) {id owner {id} tokenURI tokenJSON} }`;
    const query = `
    {
      owner (id: "0x981ab0d817710d8fffc5693383c00d985a3bda38") {
        id
        numTokens
        tokens(first:99) {
          id 
          owner {
            id
          }
          tokenURI 
          name 
          description 
          image  
          metadata
          contract {
            id
          }
        }
      }
    }
    `;

    const config = { method: "POST", body: JSON.stringify({ query }) };

    const answerGQL = (await this.fetchJson(this.subgraphUrl, config)).data;
    // const answerGQL = (await this.fetchJson(this.network?.subgraphUrl, config)).data;
    console.log("nft.listTheGraph query", query);
    console.log("nft.listTheGraph subgraphUrl", this.subgraphUrl);
    console.log("nft.listTheGraph answerGQL", answerGQL);

    tokens = await Promise.all(
      answerGQL.owner.tokens.map(async (token) => {
        // console.log("token", token);

        const nft = {};
        nft.tokenId = Number(token.id).toString();
        nft.contract = token.contract.id;
        nft.ownerOf = token.owner.id;
        nft.tokenURI = token.tokenURI;
        nft.tokenJSON = token.metadata;
        // try {
        //   if (token.tokenJSON) {
        //     nft.tokenJSON = JSON.parse(token.tokenJSON);
        //   } else {
        //     nft.tokenJSON = await this.fetchJson(nft.tokenURI);
        //   }
        // } catch (e) {
        //   console.error(e);
        // }
        // console.log("nft", nft);
        return nft;
      })
    );

    // console.log("nft.listTheGraph", tokens);
    return tokens;
  }

  async listContract() {
    let tokens;

    try {
      const totalSupply = (await this.contract.totalSupply()).toNumber();
      // console.log("listContract totalSupply", totalSupply);

      const nftPromises = [];
      for (let index = 0; index < totalSupply; index++) {
        nftPromises[totalSupply - 1 - index] = this.getToken(index);
      }
      tokens = await Promise.all(nftPromises);
    } catch (e) {
      console.info("This contract doesn't support the optional enumeration extension of ERC721");
    }

    return tokens;
  }

  async list() {
    const nftList = new Map();
    let tokens;

    if (this.subgraphUrl) tokens = await this.listTheGraph();
    // if (this.subgraphUrl) tokens = await this.listTheGraph();
    else tokens = await this.listContract();

    tokens.sort((a, b) => b.tokenId - a.tokenId);
    tokens.forEach((nfti) => {
      let cid = nfti.tokenJSON?.cid;
      if (!cid) {
        const img = nfti.tokenJSON?.image;
        if (img) {
          const cid1 = img.match(/^ipfs:\/\/(.*)$/i);
          const cid2 = img.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
          cid = (cid1 && cid1[1]) || (cid2 && cid2[1]);
          // console.log('cid nft#' + nfti.tokenId, cid, '<=', img);
        }
      }
      nfti.cid = cid;
      nftList.set(nfti.tokenId + ":" + nfti.contract, nfti);
    });

    // console.log("nftList", nftList);
    return nftList;
  }

  async Mint(signer, urlJson) {
    const address = await signer.getAddress();

    console.log("nft.Mint", address, urlJson);
    console.log(this.contract.address);

    //  const tx1 = await this.contract.connect(signer).addUser(address, urlJson);
    const tx1 = await this.contract.connect(signer).mintNFT(address, urlJson);
    console.log(`${this.network?.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    const tokenId = res.events[0].args[2].toString();
    return { chainId: this.network.chainId, address: this.contract.address, tokenId };
  }
}

export default OpenNfts;
