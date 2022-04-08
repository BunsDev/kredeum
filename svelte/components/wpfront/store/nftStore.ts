// import type { Nft as NftType } from "lib/ktypes";

import { writable, derived } from 'svelte/store'

export const isLoading 						= writable(false)
export const error     						= writable(null)

export const isAddingNft					= writable(false)
export const errorAddingNft     			= writable(false)

export const nfts							= writable()


export const requestNfts = () => isLoading.set(true)

export const receiveNftsSuccess = (data) => {
	// Do any needed data transformation to the received payload here
	nfts.set(data)
	isLoading.set(false)
	// console.log("🚀 ~ file: nftStore.ts ~ line 20 ~ receiveNftsSuccess ~ data", nfts)
}
export const receiveNftsError = (error) => {
	// handle error
	isLoading.set(false)
}

export const requestAddNft = () => {
	isAddingNft.set(true)
}
export const receiveAddNftSuccess = (nft) => {
	// Do any needed data transformation to the received payload here
	isAddingNft.set(false)
	// nfts.update(nfts => ([...nfts, ...nft]))
}

export const receiveAddNftError = (error) => {
	isAddingNft.set(false)
  errorAddingNft.set(error)
}

export const nftsMap = derived(nfts, ($nfts) =>
  $nfts.reduce((map, nft) => {
    map[nft] = nft;
    return map;
  }, {})
);