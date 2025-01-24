<script lang="ts">
  import type { Readable } from "svelte/store";

  import AccountConnect from "../Account/AccountConnect.svelte";

  import type { NftType } from "lib/ktypes";
  import { nftMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 } from "lib/knft-mint";
  import { nftGetImageLink } from "lib/knft-get-metadata";
  import { ipfsGatewayLink, urlToLink, nftOpenSeaUrl, getNetwork } from "lib/kconfig";
  import { collectionStore } from "stores/collection/collection";

  import { metamaskChainId, metamaskSigner } from "main/metamask";

  /////////////////////////////////////////////////
  // <NftMintButton {src} {metadata} {alt} {pid} {width} {display} />
  // Nft Mint Button
  /////////////////////////////////////////////////
  export let src: string;
  export let alt: string = undefined;
  export let pid: string = undefined;
  export let metadata: string = "{}";
  export let width = 100;
  export let display = false;
  /////////////////////////////////////////////////

  let mintedNft: NftType;
  let minting: number;

  let ipfsImage: string;

  let account: string;
  let address: Readable<string>;

  // ON network or account change
  $: $metamaskChainId && $metamaskSigner && handleChange().catch(console.error);
  const handleChange = async () => {
    account = await $metamaskSigner.getAddress();
    console.log("handleChange", $metamaskChainId, account);

    address = collectionStore.getDefaultSubStore($metamaskChainId, true, account);
    console.log("handleChange ~ address", $address);
  };

  const sell = (e: Event): void => {
    e.preventDefault();
    location.href = nftOpenSeaUrl($metamaskChainId, mintedNft);
  };

  const view = (e: Event): void => {
    e.preventDefault();
    location.href = nftGetImageLink(mintedNft);
  };

  const mint = async (e: Event): Promise<NftType> => {
    e.preventDefault();
    // console.log("collection", collection);
    ipfsImage = null;
    mintedNft = null;

    const signerAddress = await $metamaskSigner.getAddress();

    if (src && $address) {
      minting = 1;

      ipfsImage = await nftMint1IpfsImage(src);
      // console.log("ipfsImage", ipfsImage);

      minting = 2;

      const ipfsJson = await nftMint2IpfsJson(alt, ipfsImage, signerAddress, src, metadata);
      // console.log("json", ipfsJson);

      minting = 3;

      const mintingTxResp = await nftMint3TxResponse($metamaskChainId, $address, ipfsJson, $metamaskSigner);
      // console.log("txResp", txResp);

      minting = 4;

      mintedNft = await nftMint4($metamaskChainId, $address, mintingTxResp, ipfsJson, signerAddress);
      // console.log("mintedNft", mintedNft);

      minting = 5;
    } else {
      console.error("KredeumNftsMint ERROR : no src or collection address, impossible to mint!", src, $address);
    }

    return mintedNft;
  };
</script>

<main id="kredeum-mint">
  {#if display && src}
    <img {src} {alt} {width} /><br />
  {/if}

  {#if $metamaskSigner}
    {#if minting}
      {#if mintedNft}
        {#if getNetwork($metamaskChainId)?.openSea}
          <button on:click={sell} class="btn btn-small btn-sell" title="Sell on OpenSea">SELL NFT</button>
        {:else}
          <button on:click={view} class="btn btn-small btn-sell" title="View in Explorer">VIEW NFT</button>
        {/if}
      {:else if 1 <= minting && minting <= 5}
        <div>
          <button id="mint-button" class="btn btn-small btn-minting">MINTING {minting}...</button>
        </div>
        <div>
          <em>{nftMintTexts[minting]}</em>
        </div>
      {/if}
    {:else}
      <button id="mint-button-{pid || '0'}" on:click={mint} class="btn btn-small btn-mint"> MINT NFT </button>
    {/if}
  {:else}
    <small>
      <br /><AccountConnect />
    </small>
  {/if}

  {#if display}
    <small>
      <br />{urlToLink(src, `${src}@${alt}`)}

      <br />{ipfsGatewayLink(ipfsImage)}
    </small>
  {/if}
</main>

<style>
  button.btn {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
  }
  button.btn-mint {
    background-color: #2a81de;
  }
  button.btn-minting {
    /* color: black; */
    background-color: grey;
  }
  button.btn-mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.btn-sell {
    background-color: #36d06f;
  }
</style>
