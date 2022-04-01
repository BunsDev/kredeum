<script lang="ts">
  import { onMount } from "svelte";

  import { Collection } from "lib/ktypes";
  import { nftListFromCache } from "lib/knft-list";

  // import { nftUrl, explorerCollectionUrl, explorerAddressLink, kredeumNftUrl } from "lib/kconfig";

  // From Kredeum-get-nft.svelte
  import type { Nft } from "lib/ktypes";
  import { nftGetImageLink } from "lib/knft-get";

  import {
    getShortAddress,
    nftUrl,
    explorerCollectionUrl,
    nftDescription,
    nftDescriptionShort,
    nftName,
    nftOpenSeaUrl,
    addressSame,
    textShort,
    explorerNftUrl,
    explorerAddressLink,
    kredeumNftUrl
  } from "lib/kconfig";

  import { chainId, network, owner, signer } from "main/network";

  import TransferNft from "../kredeum-transfer-nft.svelte";
  //////////////////////////////

  export let collection: Collection = undefined;
  export let tokenID: number = undefined;

  let nfts;
  let nft;

  // From Kredeum-get-nft.svelte
  let more = tokenID;
  let index: number;
  let platform = "wordpress";
  //////////////////////////////

  onMount(() => {
    nfts = nftListFromCache();
    console.log("nfts", nfts);

    nft = new Map([...nfts].filter(([, nftFromCollec]) => nftFromCollec.tokenID === tokenID.toString()))
      .values()
      .next().value;

    console.log("NFT", nft);

    // From Kredeum-get-nft.svelte
    index = tokenID;
    if (more == -1) moreToggle();
    //////////////////////////////
  });

  // From Kredeum-get-nft.svelte
  const moreToggle = (): void => {
    more = more > 0 ? 0 : (document.getElementById(`more-detail-${index}`)?.offsetHeight || 0) + 70;
  };

  const shortcode = async (nft: Nft) => {
    const data = `[kredeum_sell chain="${nft.chainName}" collection="${nft.collection}" tokenid="${
      nft.tokenID
    }" ipfs="${nft.ipfs}"]${nftName(nft)}[/kredeum_sell]`;

    await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
    console.log("Copied");
  };

  const divMediaImage = (src: string, height?: number) => {
    const heightString = height ? `height="${height}"` : "";
    return `<img alt="link" src=${src} ${heightString}/>`;
  };

  const divMediaVideo = (src: string, small = true) => {
    let video: string;
    if (small) {
      video = '<video preload="metadata" style="border-radius: initial;">';
    } else {
      video =
        '<video autoplay="true"  controls="" controlslist="nodownload" loop="" playsinline="" preload="metadata" style="border-radius: initial;">';
    }
    video += `<source src="${src}" type="video/mp4"></video>`;
    return video;
  };

  const divMedia = async (nft: Nft, index: number, small = false) => {
    const mediaContentType = nft.contentType?.split("/");
    const mediaType = mediaContentType[0] || "image";

    const mediaSrc = nftGetImageLink(nft);
    let div: string;
    if (small) {
      div = `<div id="media-small-${index}" class="media media-small media-${mediaType}">`;
    } else {
      div = `<div id="media-full-${index}" class="media media-${mediaType}">`;
    }
    if (mediaType == "video") {
      div += divMediaVideo(mediaSrc, small);
    } else if (mediaType == "image") {
      div += divMediaImage(mediaSrc);
    } else {
      div += '<div class="media-text"></div>';
    }
    div += "</div>";

    // console.log("divMedia div", div);
    return div;
  };
  //////////////////////////////
</script>

{#if nft === true}
  <h2 class="m-b-20 return">
    <i class="fa fa-arrow-left fa-left" /><a href="." class="link">Return to collection</a>
  </h2>

  <div class="row grid-detail-krd">
    <div class="col col-xs-12 col-sm-4 col-md-3">
      <div class="card-krd">
        <div class="media media-photo">
          <a href="#zoom">
            <i class="fas fa-search" />
            <img src={nft.image} alt={nft.name} />
          </a>
        </div>
      </div>
    </div>

    <div class="col col-xs-12 col-sm-8 col-md-9">
      <div class="card-krd">
        <h3>{nft.name}</h3>
        <p>
          {nft.description}
        </p>

        <ul class="steps">
          <li>
            <div class="flex"><span class="label"><strong>Token ID</strong></span></div>
            <div class="flex"><strong>#{nft.tokenID}</strong></div>
          </li>
          <li>
            <div class="flex"><span class="label">Owner</span></div>
            <div class="flex">{@html explorerAddressLink(nft.chainId, nft.owner, 15)}</div>
          </li>
          <li>
            <div class="flex"><span class="label">Permanent link</span></div>
            <div class="flex">
              <a
                class="link overflow-ellipsis"
                href={kredeumNftUrl(nft.chainId, nft)}
                title={nftUrl(nft, 10)}
                target="_blank"
              >
                {@html nftUrl(nft, 10)}
              </a>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">collection @</span></div>
            <div class="flex">
              <a
                class="link overflow-ellipsis"
                href={explorerCollectionUrl(nft.chainId, nft?.collection)}
                title={nft.collection}
                target="_blank"
              >
                {nft.collection}
              </a>
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Metadata ipfs</span></div>
            <div class="flex">
              <a class="link overflow-ellipsis" href={nft.tokenURI} title={nft.ipfsJson} target="_blank"
                >{nft.ipfsJson}</a
              >
            </div>
          </li>
          <li>
            <div class="flex"><span class="label">Image</span></div>
            <div class="flex">
              <a class="link overflow-ellipsis" href={nft.image} title={nft.ipfs} target="_blank">
                {nft.ipfs}
              </a>
            </div>
          </li>
        </ul>

        <div class="p-t-40 p-b-40 grid-buttons">
          <a href="#schortcodes" class="btn btn-small btn-outline" title="Get shortcode"
            ><i class="fa fa-code" /><span>Get shortcode</span></a
          >
          <a href="#gift" class="btn btn-small btn-outline" title="Make a gift"
            ><i class="fa fa-gift" /><span>Make a gift</span></a
          >

          <a href="#" class="btn btn-small btn-sell" title="Sell">Sell</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Modales of detail view -->
  <!-- Modal Zoom -->
  <div id="zoom" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
        <div class="modal-body">
          <div class="media media-photo">
            <a href="#zoom"><img src={nft.image} alt={nft.name} /></a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Shortcodes -->
  <div id="schortcodes" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-code fa-left c-green" />
            Shortcodes
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac felis a sapien lobortis finibus nec vel
            lectus.
          </p>

          <ul class="steps">
            <li>
              <div class="flex"><span class="label">Sell direclty on Opensea</span></div>
              <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
            </li>
            <li>
              <div class="flex"><span class="label">Sell direclty on Gamestop</span></div>
              <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
            </li>
            <li>
              <div class="flex"><span class="label">Mint on your front page</span></div>
              <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
            </li>
            <li>
              <div class="flex"><span class="label">Sell directly without market-places</span></div>
              <div class="flex"><a class="btn btn-small btn-outline" href="" title="Copy">Copy</a></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal gift -->
  <div id="gift" class="modal-window">
    <div>
      <div class="modal-content">
        <a href="#" title="Close" class="modal-close"><i class="fa fa-times" /></a>
        <div class="modal-body">
          <div class="titre">
            <i class="fas fa-gift fa-left c-green" />
            Make a gift
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ac felis a sapien lobortis finibus nec vel
            lectus.
          </p>

          <form method="POST" action="" enctype="multipart/form-data">
            <div class="section">
              <div class="form-field">
                <input type="text" id="gift" name="gift" placeholder="Enter the recipient's address" />
              </div>
            </div>
            <div class="txtright">
              <button class="btn btn-default btn-sell" type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- // From Kredeum-get-nft.svelte -->
{#if nft}
  <div
    id="table-drop-{index}"
    class="table-row table-drop"
    class:closed={!more}
    style="height: {more ? `${more}px` : 'auto'};"
  >
    <div id="media-{index}" class="table-col">
      <div class="table-col-content">
        {#await divMedia(nft, index, true)}
          <div class="media media-small media-text" />
        {:then mediaDiv}
          {@html mediaDiv}
        {/await}

        <strong>{nftName(nft)}</strong>
        <span id="description-short-{index}" class:hidden={more}>{nftDescriptionShort(nft, 64)} </span>
        <a
          class="info-button"
          href={nftGetImageLink(nft)}
          title="&#009;{nftDescription(nft)} 
                NFT address (click to view in explorer)&#013.{nftUrl(nft)}"
          target="_blank"><i class="fas fa-info-circle" /></a
        >
      </div>
    </div>

    <div id="marketplace-{index}" class="table-col">
      <div class="table-col-content">
        {#if $network?.openSea}
          {#if addressSame(nft.owner, $owner)}
            <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
              Sell
            </a>
          {:else}
            <a href={nftOpenSeaUrl($chainId, nft)} class="btn btn-small btn-buy" title="Buy" target="_blank"> Buy </a>
          {/if}
        {:else}
          <a
            class="info-button"
            href={nftGetImageLink(nft)}
            title="&#009;{nftDescription(nft)} 
                  NFT address (click to view explorer)&#013.{nftUrl(nft)}"
            target="_blank"><i class="fas fa-info-circle" /></a
          >
        {/if}
        <span id="token-id-{index}" title="  #{nft.tokenID}">
          &nbsp;&nbsp;<strong>#{textShort(nft.tokenID)}</strong>
        </span>
      </div>
    </div>

    <div id="more-{index}" class="table-col more" on:click={() => moreToggle()}>
      <div class="table-col-content txtright">
        <div class="more-button"><i class="fas fa-chevron-down" /></div>
      </div>
    </div>

    <div id="more-detail-{index}" class="detail">
      {#await divMedia(nft, index)}
        <div class="media media-full media-text" />
      {:then mediaDiv}
        {@html mediaDiv}
      {/await}
      <div id="description-{index}" class="description">
        <strong>Description</strong>

        <p>
          {nftDescription(nft)}
        </p>
        <ul class="steps">
          <li class="complete">
            <div class="flex"><span class="label">Owner</span></div>
            <div class="flex">
              {@html explorerAddressLink($chainId, nft.owner, 15)}
            </div>
          </li>
          <li class="complete">
            <div class="flex"><span class="label">Permanent Link</span></div>
            <div class="flex">
              <a class="link" href={kredeumNftUrl($chainId, nft)} target="_blank">
                {@html nftUrl(nft, 10)}
              </a>
            </div>
          </li>
          <li class="complete">
            <div class="flex"><span class="label">Collection @</span></div>
            <div class="flex">
              <a class="link" href={explorerCollectionUrl($chainId, nft?.collection)} target="_blank"
                >{getShortAddress(nft.collection, 15)}</a
              >
            </div>
          </li>

          <li class="complete">
            <div class="flex"><span class="label">Metadata IPFS</span></div>
            <div class="flex">
              <a class="link" href={nft.tokenURI} target="_blank">{textShort(nft.ipfsJson)}</a>
            </div>
          </li>

          <li class="complete">
            <div class="flex"><span class="label">Image IPFS</span></div>
            <div class="flex">
              <a class="link" href={nft.image} target="_blank">{textShort(nft.ipfs)}</a>
            </div>
          </li>
          <li class="complete">
            <div class="flex">
              <a href="#transfert-nft-{nft.tokenID}" class="btn btn-small btn-default" title="Transfer NFT">
                <i class="fas fa-gift" /> Transfer
              </a>
            </div>
          </li>
          {#if platform === "wordpress"}
            <li class="complete">
              <div class="flex"><span class="label">Copy shortcode sell button</span></div>
              <div class="flex">
                <button on:click={() => shortcode(nft)} class="btn krd_shortcode_data">Shortcode</button>
              </div>
            </li>
          {/if}
        </ul>
      </div>
    </div>

    <!-- Modal transfer nft -->
    <div id="transfert-nft-{nft.tokenID}" class="modal-window">
      <TransferNft bind:nft />
    </div>
  </div>
{/if}

{#if platform === "wordpress"}
  <div>WordPress</div>
{/if}
<!-- ////////////////////////////// -->
