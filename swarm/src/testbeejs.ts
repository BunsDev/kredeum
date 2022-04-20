import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");
const batchId = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";

const testBeeJS = async () => {
  console.log("testBeeJS");

  const result = await bee.uploadData(batchId, "Bee is awesome!");
  console.log("data upload reference", result.reference);

  const retrievedData = await bee.downloadData(result.reference);
  console.log("I really hope that", retrievedData.text()); // prints 'Bee is awesome!'
};

const testDownloadData = async (dataReference:string) => {
  const retrievedFile = await bee.downloadFile(dataReference);

  return retrievedFile;
}

const testUploadFile = async (file:File) => {
  const result = await bee.uploadFile(batchId, file, "superfileuploaded", {"pin": true});

  return result.reference;
}

const testDownloadFile = async (fileReference:string) => {
  const retrievedFile = await bee.downloadFile(fileReference);

  return retrievedFile;
}

export { testBeeJS, testDownloadData, testUploadFile, testDownloadFile };
