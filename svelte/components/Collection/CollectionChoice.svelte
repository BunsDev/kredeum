<script lang="ts">
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  // <CollectionChoice bind:{address} {txt} />
  // Choose Collection, after Account Connect and Network choose
  /////////////////////////////////////////////////
  export let address: string = undefined;
  export let txt = true;

  let account: string;
  let chainId: number;
</script>

<p>
  <AccountConnect bind:account {txt} />
</p>
<p>
  <NetworkList bind:chainId {txt} />
</p>

{#if chainId && account}
  <p>
    <CollectionList {chainId} {account} bind:address {txt} mintable={true} />
  </p>
{/if}
