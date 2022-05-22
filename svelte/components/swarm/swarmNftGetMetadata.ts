import type { NftType, NftMetadata } from "lib/ktypes";
import { getNetwork, getChecksumAddress, nftKey } from "lib/kconfig";

import { uploadSwarmData, uploadFile, downloadFile } from "helpers/beejs";

// Cache contentType(url)
const contentTypes: Map<string, string> = new Map();

const nftGetImageSwarmLink = (nft: NftType): string =>
  nft?.ipfs ? `https://api.gateway.ethswarm.org/bzz/${nft.ipfs}` : nft?.image || "";

const nftGetSwarmContentType = async (nft: NftType): Promise<string> => {
  // const { chainId, address, tokenID } = nft || {};
  // const url = nftGetImageSwarmLink(nft);

  let contentType = "text";
  // if (!(chainId && address && tokenID && url)) return contentType;

  // contentType = contentTypes.get(url) || "";
  // if (contentType) return contentType;

  // contentType = "image";
  // try {
  //   const response = await fetch(url, { method: "HEAD" });
  //   contentType = response.headers.get("content-type") || contentType;
  //   contentTypes.set(url, contentType);
  // } catch (e) {
  //   console.error("ERROR nftGetContentType", e, url, nft);
  // }

  const swarmData = await downloadFile(nft.ipfs);
  contentType = swarmData.contentType;

  return contentType;
};

type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

const fetchSwarmJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (url) {
    try {
      // console.log(url, config);
      const res = await fetch(url, config);
      // console.log(res);
      json = (await res.json()) as FetchResponse;
    } catch (e) {
      json = { error: e };
      console.error("OpenNFTs.fetchJson ERROR", e, url, json);
    }
  } else {
    const e = "OpenNFTs.fetchJson URL not defined";
    console.error(e);
    json = { error: e };
  }
  // console.log("fetchJson(", url, config, ") =>", json);
  return json;
};

const nftGetSwarmMetadata = async (nft: NftType): Promise<NftType> => {
  // console.log("nftGetMetadata", nft);

  const { chainId, address, tokenID } = nft || {};
  const network = getNetwork(chainId);
  if (!(chainId && address && tokenID && network)) return nft;

  // ERC721 OPTIONAL METADATA => tokenURI includes METADATA
  if (nft.tokenURI) {
    if (!nft.ipfsJson) {
      const ipfsJson = nft.tokenURI;
      if (ipfsJson) nft.ipfsJson = ipfsJson;
    }

    try {
      // nft.ipfsJson = ipfs://...cid... : metadata URI found on IPFS
      // nft.tokenURI : default metadata URI
      const tokenURIAnswer = await fetchSwarmJson(nft.ipfsJson || nft.tokenURI);
      if (tokenURIAnswer.error) {
        console.error("ERROR nftGetMetadata tokenURIAnswer.error ", tokenURIAnswer.error);
      } else {
        const nftMetadata = tokenURIAnswer as NftMetadata;
        // console.log("nftGetMetadata", nft.tokenURI, nft.ipfsJson, nftMetadata);

        if (nftMetadata) {
          nft.metadata = nftMetadata;

          if (!nft.name && nftMetadata.name) nft.name = nftMetadata.name;
          if (!nft.description && nftMetadata.description) nft.description = nftMetadata.description;
          if (!nft.creator && nftMetadata.creator) nft.creator = getChecksumAddress(nftMetadata.creator);
          if (!nft.minter && nftMetadata.minter) nft.minter = getChecksumAddress(nftMetadata.minter);
          if (!nft.owner && nftMetadata.owner) nft.owner = getChecksumAddress(nftMetadata.owner);

          if (!nft.image && (nftMetadata.image || nftMetadata.image_url))
            nft.image = nftMetadata.image || nftMetadata.image_url;

          if (!nft.ipfs && (nftMetadata.ipfs || nft.image)) nft.ipfs = nftMetadata.ipfs || nft.image;
        }
      }
    } catch (e) {
      console.error("ERROR nftGetMetadata tokenURIAnswer", e);
    }
  }

  nft.chainName ||= network.chainName;
  nft.nid ||= nftKey(chainId, address, tokenID);
  const swarmData = await downloadFile(nft.ipfs);
  nft.contentType ||= swarmData.contentType;

  // console.log(`nftGetMetadata ${nftKey(chainId, address, tokenID)}\n`, nft);
  return nft;
};

export { nftGetSwarmMetadata /*, nftGetImageLink*/, nftGetSwarmContentType };
