import { Bee, Data, FileData } from "@ethersphere/bee-js";

const bee: Bee = new Bee("http://localhost:1633");
const batchId: string = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";


const uploadFile = async (file:File, fileName:string, contentType:string): Promise<string> => {
  const result = await bee.uploadFile(batchId, file, fileName, {contentType, "pin": true});

  return result.reference;
}

const downloadFile = async (fileReference:string): Promise<FileData<Data>> => {
  const retrievedFile = await bee.downloadFile(fileReference);

  return retrievedFile;
}

export { uploadFile, downloadFile };
