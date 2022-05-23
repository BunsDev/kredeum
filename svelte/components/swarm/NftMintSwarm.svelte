<script lang="ts">
  import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

  import { ethers } from "ethers";

  import { nftGetSwarmMetadata } from "./swarmNftGetMetadata";

  import type { NftType } from "lib/ktypes";
  import { nftMintTexts, nftMint4 } from "lib/knft-mint";
  import { textShort, ipfsGatewayUrl, explorerTxUrl, explorerNftUrl, nftUrl } from "lib/kconfig";

  import { metamaskSigner } from "main/metamask";

  import CollectionList from "../Collection/CollectionList.svelte";

  /////////////////////////////////////////////////
  import { uploadSwarmData, uploadFile, downloadFile } from "helpers/beejs";
  import type { JsonRpcSigner } from "@ethersproject/providers";
  import { collectionContractGet } from "lib/kcollection-get";
  import { getNetwork } from "lib/kconfig";

  /////////////////////////////////////////////////
  //  <NftMint {chainId} />
  // Display NFT
  /////////////////////////////////////////////////
  export let chainId: number;
  /////////////////////////////////////////////////

  let account: string;
  $: $metamaskSigner && handleSigner().catch(console.error);
  const handleSigner = async (): Promise<void> => {
    account = await $metamaskSigner.getAddress();
  };

  let address: string;

  $: $metamaskSigner && chainId && handleChange();
  const handleChange = async () => {
    // Get signer account
    account = await $metamaskSigner.getAddress();
  };

  let nftTitle: string = "";

  let files: FileList;
  let image: string;

  let ipfsImage: string;
  let ipfsJson: string;
  let minting: number;
  let mintingTxResp: TransactionResponse;
  let mintedNft: NftType;
  let mintingError: string;

  /////////////////////////////////////////////////
  let swarmUploadedRef: string;
  let swarmJson: string;
  /////////////////////////////////////////////////

  const mintReset = (): void => {
    ipfsImage = null;
    ipfsJson = null;
    minting = 0;
    mintingTxResp = null;
    mintedNft = null;
    mintingError = null;
  };

  // DISPLAY image AFTER upload
  const fileload = () => {
    mintReset();

    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      nftTitle = nftTitle || files[0].name;
      reader.onload = (e) => {
        image = e.target.result.toString();
      };
    }
  };

  const swarmJsonPrepare = (object: unknown): string => JSON.stringify(object, null, 2);

  const nftMint2SwarmJson = async (
    name = "NO NAME",
    ipfs = "",
    address = "",
    image = "",
    metadata = "{}"
  ): Promise<string> => {
    // console.log("nftMint2IpfsJson", name, ipfs, address, image, metadata);

    const json = {
      name,
      description: name || "",
      image: `https://api.gateway.ethswarm.org/bzz/${ipfs}`,
      ipfs,
      origin: textShort(image, 140),
      minter: address
    } as NftType;
    if (metadata) json.metadata = JSON.parse(metadata);

    const swarmJson = await uploadFile(swarmJsonPrepare(json), "swarmJson", "text", 100);

    console.log("🚀 ~ file: NftMintSwarm.svelte ~ line 99 ~ swarmJson", swarmJson);
    // console.log("nftMint ipfs metadata", ipfsJson);
    return swarmJson;
  };

  // GET minting tx response
  const nftMint3TxResponseSwarm = async (
    chainId: number,
    address: string,
    swarmJson: string,
    minter: JsonRpcSigner
  ): Promise<TransactionResponse | null> => {
    if (!(chainId && address && swarmJson && minter)) return null;
    // console.log("nftMint3TxResponse", chainId, address, ipfsJson, await minter.getAddress());

    const openNFTs = (await collectionContractGet(chainId, address, minter.provider)).connect(minter);

    type MintOpenNFTFunctionType = {
      (address: string, json: string): Promise<TransactionResponse>;
    };

    // OpenNFTsV0 = addUser
    // OpenNFTsV1 = mintNFT
    // OpenNFTsV2 = mintNFT
    // OpenNFTsV3+ = mintOpenNFT
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mintFunction: MintOpenNFTFunctionType = openNFTs.mintOpenNFT || openNFTs.mintNFT || openNFTs.addUser;
    const urlJson = `https://api.gateway.ethswarm.org/bzz/${swarmJson}`;

    const txResp = await mintFunction(await minter.getAddress(), urlJson);
    console.log(`${getNetwork(chainId)?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

    console.log("🚀 ~ file: NftMintSwarm.svelte ~ line 135 ~ txResp", txResp);

    return txResp;
  };

  const _swarmMintTokenID = (txReceipt: TransactionReceipt): string => {
    let tokenID = "";

    // console.log("txReceipt", txReceipt);
    if (txReceipt.logs) {
      const abi = ["event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);"];
      const iface = new ethers.utils.Interface(abi);
      const log = iface.parseLog(txReceipt.logs[0]);
      ({ tokenID } = log.args);
    }

    // const tokenID = res.events[0].args[2].toString();
    return tokenID.toString();
  };

  const _swarmMintedNft = async (
    chainId: number,
    address: string,
    tokenID: string,
    urlJson: string,
    minterAddress: string
  ): Promise<NftType> =>
    await nftGetSwarmMetadata({
      chainId,
      address,
      tokenID,
      tokenURI: urlJson,
      creator: minterAddress,
      minter: minterAddress,
      owner: minterAddress
    });

  // GET minting tx receipt
  const nftSwarmMint4 = async (
    chainId: number,
    address: string,
    txResponse: TransactionResponse,
    swarmJsonRef: string,
    minter: string
  ): Promise<NftType | undefined> => {
    let nft: NftType | undefined = undefined;

    if (txResponse) {
      const txReceipt = await txResponse.wait();
      // console.log("txReceipt", txReceipt);

      if (txReceipt) {
        const tokenID = _swarmMintTokenID(txReceipt);
        // console.log("tokenID", tokenID);

        if (tokenID) {
          nft = await _swarmMintedNft(
            chainId,
            address,
            tokenID,
            `https://api.gateway.ethswarm.org/bzz/${swarmJsonRef}`,
            // swarmJsonRef,
            minter
          );
          nft.ipfsJson = swarmJsonRef;
          // console.log("nftMint4", nft);
        }
      }
    }

    return nft;
  };

  const mint = async (): Promise<NftType> => {
    mintReset();

    if (image) {
      minting = 1;

      //   ipfsImage = await nftMint1IpfsImage(image);
      // console.log("ipfsImage", ipfsImage);
      swarmUploadedRef = await uploadFile(files[0], nftTitle, files[0].type, files[0].size);
      console.log("🚀 ~ file: NftMintSwarm.svelte ~ line 146 ~ mint ~ swarmUploadedRef", swarmUploadedRef);

      if (swarmUploadedRef) {
        minting = 2;

        swarmJson = await nftMint2SwarmJson(nftTitle, swarmUploadedRef, account, image);
        // console.log("json", ipfsJson);

        if (swarmJson) {
          minting = 3;

          mintingTxResp = await nftMint3TxResponseSwarm(chainId, address, swarmJson, $metamaskSigner);
          // console.log("txResp", txResp);

          if (mintingTxResp) {
            minting = 4;

            mintedNft = await nftSwarmMint4(chainId, address, mintingTxResp, swarmJson, account);
            // console.log("mintedNft", mintedNft);

            if (mintedNft) {
              minting = 5;
            } else {
              mintingError = "Problem with sent transaction.";
            }
          } else {
            mintingError = "Problem while sending transaction.";
          }
        } else {
          mintingError = "Problem while archiving metadata on IPFS.";
        }
      } else {
        mintingError = "Problem while archiving image on IPFS.";
      }
    } else {
      mintingError = "Missing NFT file. Sorry can't mint.";
    }
    if (mintingError) {
      console.error("ERROR", mintingError);
    }

    return mintedNft;
  };
</script>

<div id="kredeum-create-nft">
  <div class="modal-content">
    <a href="./#" title="Close" class="modal-close"><i class="fa fa-times" /></a>

    <div class="modal-body">
      <div class="titre">
        <i class="fas fa-plus fa-left c-green" />Mint Swarm NFT
      </div>

      {#if minting}
        <div class="media media-photo">
          <img src={image} alt="nft" />
        </div>

        <ul class="steps process">
          {#if mintedNft}
            <li class="complete">
              <div class="flex">
                <span class="titre"
                  >NFT Minted, congrats!
                  <i class="fas fa-check fa-left c-green" />
                </span>
              </div>
              <div class="flex">
                <a class="link" href={explorerNftUrl(chainId, mintedNft)} target="_blank">{nftUrl(mintedNft, 6)}</a>
              </div>
            </li>
          {:else}
            <li>
              <div class="flex">
                <span class="titre">
                  {#if mintingError}
                    Minting Error
                    <i class="fa fa-times fa-left" />
                  {:else}
                    Minting NFT
                    <i class="fas fa-spinner fa-left c-green refresh" />
                  {/if}
                </span>
              </div>
              <div class="flex">
                <span class="t-light">
                  {#if mintingError}
                    {mintingError}
                  {:else if 1 <= minting && minting <= 5}
                    {nftMintTexts[minting]}
                  {/if}
                </span>
              </div>
            </li>
          {/if}

          <li class={minting >= 2 ? "complete" : ""}>
            <div class="flex"><span class="label">Swarm Image link</span></div>
            <div class="flex">
              {#if ipfsImage}
                <a class="link" href={ipfsGatewayUrl(ipfsImage)} target="_blank">{textShort(ipfsImage, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 3 ? "complete" : ""}>
            <div class="flex"><span class="label">Swarm Metadata link</span></div>
            <div class="flex">
              {#if ipfsJson}
                <a class="link" href={ipfsGatewayUrl(ipfsJson)} target="_blank">{textShort(ipfsJson, 15)}</a>
              {/if}
            </div>
          </li>
          <li class={minting >= 4 ? "complete" : ""}>
            <div class="flex"><span class="label">Transaction</span></div>
            <div class="flex">
              {#if mintingTxResp}
                <a class="link" href={explorerTxUrl(chainId, mintingTxResp.hash)} target="_blank"
                  >{textShort(mintingTxResp.hash, 15)}</a
                >
              {/if}
            </div>
          </li>
          <li class={minting >= 5 ? "complete" : ""}>
            <div class="flex"><span class="label">Token ID</span></div>
            <div class="flex">
              {#if mintedNft}
                <strong>{mintedNft?.tokenID}</strong>
              {/if}
            </div>
          </li>
        </ul>
      {:else}
        <div class="section">
          <span class="label label-big">NFT file</span>
          <div class="box-file">
            {#if image}
              <div class="media media-photo mt-20">
                <img src={image} alt="nft" />
              </div>
            {:else}
              <input type="file" id="file" name="file" bind:files on:change={fileload} />
            {/if}
          </div>
        </div>
        <div class="section">
          <span class="label label-big">NFT title</span>
          <div class="form-field">
            <input type="text" placeholder="My NFT title" bind:value={nftTitle} id="title-nft" />
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Media type</span>
          <div class="box-fields">
            <input class="box-field" id="create-type-video" name="media-type" type="checkbox" value="Video" disabled />
            <label class="field" for="create-type-video"><i class="fas fa-play" />Video</label>

            <input
              class="box-field"
              id="create-type-picture"
              name="media-type"
              type="checkbox"
              value="Picture"
              checked
            />
            <label class="field" for="create-type-picture"><i class="fas fa-image" />Picture</label>

            <input class="box-field" id="create-type-texte" name="media-type" type="checkbox" value="Text" disabled />
            <label class="field" for="create-type-texte"><i class="fas fa-file-alt" />Text</label>

            <input class="box-field" id="create-type-music" name="media-type" type="checkbox" value="Music" disabled />
            <label class="field" for="create-type-music"><i class="fas fa-music" />Music</label>

            <input class="box-field" id="create-type-web" name="media-type" type="checkbox" value="Web" disabled />
            <label class="field" for="create-type-web"><i class="fas fa-code" />Web</label>
          </div>
        </div>

        <div class="section">
          <span class="label label-big">Add to an existing address ?</span>
          <CollectionList {chainId} bind:address {account} mintable={true} label={false} />
        </div>
        <div class="txtright">
          <button class="btn btn-default btn-sell" on:click={mint}>Mint NFT</button>
        </div>
        {#if mintingError}
          <div class="section">
            <p class="txtright errormsg">
              {mintingError}
            </p>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
