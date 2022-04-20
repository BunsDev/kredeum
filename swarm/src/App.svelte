<script lang="ts">
  import type { Data, FileData } from "@ethersphere/bee-js";

  import { onMount } from "svelte";

  import {
    testBeeJS,
    testDownloadData,
    testUploadFile,
    testDownloadFile,
  } from "./testbeejs";

  export let name: string;

  // let dataReference: string =
  //   "fd79d5e0ebd8407e422f53ce1d7c4c41ebf403be55143900f8d1490560294780";
  // let fileReference: string =
  //   "d7e9c173ec0bc5ab995752482c9ae42d1141218acfa4979013fe2874d30872aa";
  let uploadedFileReference: string =
    "74e785efff856afe89911cae8cbc51125d30c00e1a06396fbfb235d0b3d84433";

  let swarmData: FileData<Data>;

  let files: FileList;
  let imagePath;
  let imageContainer;
  let image = new Image(300, 200);

  let uploadedRef;

  // testBeeJS();

  onMount(async () => {
    swarmData = await testDownloadFile(uploadedFileReference);
    // swarmData = await testDownloadData(dataReference);
  });

  $: if (swarmData)
    console.log(
      "🚀 ~ file: App.svelte ~ line 21 ~ onMount ~ swarmData",
      swarmData
    );

  $: if (swarmData && swarmData.data.buffer) {
    // image.src = `data:image/jpeg;base64,${btoa(swarmData.data.text())}`;
    image.src = URL.createObjectURL(
      new Blob([swarmData.data.buffer], { type: "image/jpeg" })
    );

    imageContainer.appendChild(image);
    // let a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";

    // var url = URL.createObjectURL(
    //   new Blob([swarmData.data.buffer], { type: "image/jpeg" })
    // );
    // a.href = url;
    // a.download = "Zoro";
    // a.click();
    // URL.revokeObjectURL(url);

    console.log("🚀 ~ file: App.svelte ~ line 33 ~ image", image);
  }

  //////////////////////////////////////////////

  const fileload = () => {
    if (files) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        imagePath = e.target.result.toString();
      };
    }
  };

  const fileupload = async () => {
    if (files) {
      uploadedRef = await testUploadFile(files[0]);
    }
  };

  $: console.log("uploadedRef :", uploadedRef);
</script>

<main>
  <h1>Hello {name}!</h1>
  <section>
    <div>
      {#if imagePath}
        <img src={imagePath} alt="" />
      {/if}
    </div>
    <input type="file" id="file" name="file" bind:files on:change={fileload} />
    <br />
    <button on:click={fileupload}>Upload</button>
  </section>
  <section>
    {#if image}
      <div bind:this={imageContainer} />
    {/if}
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  section {
    max-height: 300px;
  }

  section div {
    max-height: inherit;
  }

  section img {
    max-height: inherit;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
