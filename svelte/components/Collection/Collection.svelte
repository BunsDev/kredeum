<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "lib/ktypes";
  import { DEFAULT_NAME, DEFAULT_SYMBOL } from "lib/kconfig";
  // import { collectionKey } from "lib/kconfig";

  import { collectionStore } from "stores/collection/collection";

  /////////////////////////////////////////////////
  // <Collection {chainId} {address} {account}? />
  // Display Collection
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let account: string = undefined;

  let collection: Readable<CollectionType>;

  // let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && handleChange();
  const handleChange = (): void => {
    // console.log(`COLLECTION CHANGE #${i++} ${collectionKey(chainId, address, account)}`);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);

    // ACTION : async refresh Collection
    collectionStore.refreshOne(chainId, address, account).catch(console.error);
  };
</script>

{#if $collection}
  {$collection.name || DEFAULT_NAME}
  ({$collection.balancesOf?.get(account) || 0}
  {$collection.symbol || DEFAULT_SYMBOL})
{:else}
  Choose one collection
{/if}
