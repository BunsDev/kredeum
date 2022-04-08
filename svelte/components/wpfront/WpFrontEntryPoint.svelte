<script lang="ts">
  import type { Nft } from "lib/ktypes";
  // import type { Collection as CollectionType } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  import { onMount } from "svelte";
  // import {
  //   wpMetamaskInit,
  //   wpMetamaskConnect,
  //   wpMetamaskSwitchChain,
  //   metamaskConnectMessage,
  //   metamaskInstallMessage
  // } from "helpers/metamaskWpHelper";
  import Metamask from "../Tests/Metamask.svelte";
  // import { metamaskAccount } from "main/metamaskWp";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionListGet from "../CollectionList/CollectionListGet.svelte";

  import Create from "../Global/Create.svelte";
  // import Navigation from "./Global/Navigation.svelte";

  import NftGet from "../Nft/NftGet.svelte";
  import NftSolo from "../Nft/Nft.svelte";

  // import NftsListGet from "./NftsList/NftsListGet.svelte";
  // import NftsListRefresh from "./NftsList/NftsListRefresh.svelte";

  // import Title from "./Global/Title.svelte";
  // // import BreadCrumb from "./Global/BreadCrumb.svelte";
  import ShortcodeLayout from "./views/ShortcodeLayout.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  import { nftGet, nftGetFromContract } from "lib/knft-get";
  import { nftGetMetadata } from "lib/knft-get-metadata";
  import { collectionGet } from "lib/kcollection-get";
  // // import NftDetail from "./NftDetail.svelte";
  import { metamaskProvider } from "main/metamask";

  import { metamaskSigner } from "main/metamask";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  import { nfts, isLoading, error, isAddingNft, errorAddingNft } from "./store/nftStore";
  import { fetchNfts } from "./store/nftService";
  import { Writable } from "svelte/store";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  export let props;

  let platform: string = "wordpress";

  let chainId: number = Number(props.chainId);
  let collection: string = props.collection;
  let tokenID: string = props.tokenID;
  let account: string = props.account;
  let refreshing: boolean;
  let refresh: number;

  // let nft: Nft;
  let nft;

  // $: nft = $nfts;

  nfts.subscribe((value) => {
    nft = value ? value : null;
  });

  $: console.log("NFT from store", nft);

  $: displayError = JSON.stringify($error);

  $: fetchNfts(chainId, collection, tokenID, $metamaskProvider);

  // $: wpNftGet(chainId, collection, tokenID, $metamaskProvider);

  // const _nftSet = async (_nft: Nft): Promise<void> => {
  //   nft = _nft;
  //   console.log("🚀 ~ file: WpFrontEntryPoint.svelte ~ line 60 ~ nft", nft);
  // };

  // const wpNftGet = async (
  //   _chainId: number,
  //   _collection: string,
  //   _tokenID: string,
  //   _metamaskProvider
  // ): Promise<void> => {
  //   if (_metamaskProvider) {
  //     _nftSet(
  //       await nftGetMetadata(
  //         await nftGetFromContract(
  //           chainId,
  //           await collectionGet(_chainId, _collection, _metamaskProvider),
  //           tokenID,
  //           _metamaskProvider
  //         )
  //       )
  //     );
  //   }
  // };

  onMount(async () => {
    // fetchNfts(chainId, collection, tokenID, $metamaskProvider);
    // await wpMetamaskInit();
    // wpMetamaskConnect();
    // wpMetamaskSwitchChain(chainId);
  });
</script>

<!-- <Metamask {account} {chainId} /> -->
<Metamask bind:account bind:chainId />
<ShortcodeLayout>
  <span slot="nav">
    <!-- <Navigation /> -->
  </span>

  <span slot="header">
    <!-- <Title /> -->

    {#if account && getCreate(chainId)}
      <Create {chainId} />
    {/if}

    <!-- <BreadCrumb display={true} /> -->

    <div class="row alignbottom">
      <!-- View account -->
      <!-- <AccountConnect bind:account /> -->

      <!-- Select network -->
      <!-- <NetworkList bind:chainId /> -->

      <!-- Select collection -->
      {#if chainId && account}
        <!-- <CollectionListGet {chainId} {account} bind:collection /> -->

        {#if account && collection && factoryGetAddress(chainId)}
          <!-- Refresh button -->
          <!-- <NftsListRefresh {refreshing} bind:refresh /> -->
        {/if}
      {/if}
    </div>
  </span>

  <span slot="content">
    <!-- NFTs list -->
    <!-- <NftDetail collection={collectionObject} {tokenID} /> -->
    {#if chainId && account && collection}
      {#if nft}
        <div class="table">
          <!-- <NftGet {chainId} {collection} {tokenID} /> -->
          <NftSolo {nft} />
        </div>
      {:else}
        <!-- <NftsList {chainId} {collection} {account} bind:refreshing bind:nftsList {platform} /> -->
        <!-- <NftsListGet {chainId} {collection} {account} bind:refreshing {refresh} /> -->
      {/if}
    {/if}
  </span>
</ShortcodeLayout>

<style>
  div {
    /* DO NOT REMOVE ! */
    visibility: visible;
  }
</style>
