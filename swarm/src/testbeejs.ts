import { Bee } from "@ethersphere/bee-js";

const bee = new Bee("http://localhost:1633");

const testBeeJS = async () => {
  console.log("testBeeJS");

  const result = await bee.uploadData("a2fae7a4314c63436d2a575296afe35496bdaa12141c2b73e068c2d175c6ad7c", "Bee is awesome!");
  console.log("data upload reference", result.reference);

  const retrievedData = await bee.downloadData(result.reference);
  console.log("I really hope that", retrievedData.text()); // prints 'Bee is awesome!'
};

const testDownloadData = async (dataReference:string) => {
  const retrievedFile = await bee.downloadFile(dataReference);

  return retrievedFile;
}

const testUploadFile = async (file:File) => {
  const result = await bee.uploadFile("a2fae7a4314c63436d2a575296afe35496bdaa12141c2b73e068c2d175c6ad7c", file, "superfileuploaded", {"pin": true});

  return result.reference;
}

const testDownloadFile = async (fileReference:string) => {
  const retrievedFile = await bee.downloadFile(fileReference);

  return retrievedFile;
}

export { testBeeJS, testDownloadData, testUploadFile, testDownloadFile };
