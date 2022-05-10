// import type { Nft as NftType } from "../../../../common/lib/ktypes";

import { requestNfts, receiveNftsSuccess, receiveNftsError, requestAddNft } from "./nftStore";

import { nftGetFromContract } from "../../../../common/lib/knft-get";
import { nftGetMetadata } from "../../../../common/lib/knft-get-metadata";
import { collectionGet } from "../../../../common/lib/kcollection-get";
import { Provider } from "@ethersproject/providers";

const createFlash = window.alert;

export const fetchNfts = (chainId: number, collection: string, tokenID: string, metamaskProvider: Provider) => {
  requestNfts();

  return collectionGet(chainId, collection, metamaskProvider).then((collectionMetadata) =>
    nftGetFromContract(chainId, collectionMetadata.address, tokenID, metamaskProvider).then((nft) =>
      nftGetMetadata(nft)
        .then((nftWMetadatas) => receiveNftsSuccess(nftWMetadatas))
        .catch((error) => {
          receiveNftsError(error);
          createFlash("There was an error getting nft");
        })
    )
  );

  // nftGetMetadata(
  //          nftGetFromContract(
  //       chainId,
  //       await collectionGet(chainId, collection, metamaskProvider),
  //       tokenID,
  //       metamaskProvider
  //     )
  //   )
  //   .then(receiveNftsSuccess)
  //   .catch((error) => {
  //       receiveNftsError(error)
  //       createFlash('There was an error getting nft')
  //   })
};

export const addNft = (nft) => {
  requestAddNft();

  // const newNfts = [{ name: nft }]
  // return nftGetMetadata(
  //     nftGetFromContract(
  //         chainId,
  //         collectionGet(_chainId, _collection, _metamaskProvider),
  //         tokenID,
  //         _metamaskProvider
  //     )
  //     )
  //   .then(({ data }) => receiveAddNftSuccess(data))
  //   .catch(receiveAddNftError);
};
