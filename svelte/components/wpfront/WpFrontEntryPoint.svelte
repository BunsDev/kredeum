<script lang="ts">
  import type { Collection as CollectionType } from "lib/ktypes";
  import { factoryGetAddress } from "lib/kfactory-get";
  import { getCreate } from "lib/kconfig";

  // import AccountConnect from "./Account/AccountConnect.svelte";
  // import NetworkList from "./Network/NetworkList.svelte";
  // import CollectionListGet from "./CollectionList/CollectionListGet.svelte";

  // import Create from "./Global/Create.svelte";
  // import Navigation from "./Global/Navigation.svelte";

  import NftGet from "../Nft/NftGet.svelte";
  // import NftsListGet from "./NftsList/NftsListGet.svelte";
  // import NftsListRefresh from "./NftsList/NftsListRefresh.svelte";

  // import Title from "./Global/Title.svelte";
  // // import BreadCrumb from "./Global/BreadCrumb.svelte";
  import ShortcodeLayout from "./views/ShortcodeLayout.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // import { collectionGet } from "lib/kcollection-get";
  // // import NftDetail from "./NftDetail.svelte";
  // import { metamaskProvider } from "main/metamask";

  // let collectionObject: CollectionType;
  // $: _collectionGet(collection).catch(console.error);
  // const _collectionGet = async (collection: string): Promise<void> => {
  //   collectionObject = await collectionGet(chainId, collection, $metamaskProvider, account);
  // };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  export let props;

  let chainId: number = Number(props.chainId);
  let collection: string = props.collection;
  let tokenID: string = props.tokenID;
  let account: string = props.account;
  let refreshing: boolean;
  let refresh: number;
</script>

<ShortcodeLayout>
  <span slot="nav">
    <!-- <Navigation /> -->
  </span>

  <span slot="header">
    <!-- <Title /> -->

    {#if account && getCreate(chainId)}
      <!-- <Create {chainId} /> -->
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
      {#if tokenID}
        <div class="table">
          <NftGet {chainId} {collection} {tokenID} />
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
