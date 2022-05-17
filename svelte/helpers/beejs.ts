import { Bee, Data, FileData } from "@ethersphere/bee-js";

// const nodeUrl: string = "http://localhost:1633";
const bee: Bee = new Bee("http://localhost:1633");
const batchId: string = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";

const uploadFile = async (file: File, fileName: string, contentType: string, fileSize: number): Promise<string> => {
  const tag = await bee.createTag();
  const updatedTag = await bee.retrieveTag(tag);
  console.log("🚀 ~ file: beejs.ts ~ 1 ~ uploadFile ~ updatedTag", updatedTag);
  // console.log("🚀 ~ file: beejs.ts ~ line 8 ~ uploadFile ~ file", file);
  const result = await bee.uploadFile(batchId, file, fileName, {
    pin: true,
    size: fileSize,
    contentType: contentType,
    tag: tag.uid
  });
  const updatedTag2 = await bee.retrieveTag(tag);
  console.log("🚀 ~ file: beejs.ts ~ 2 ~ uploadFile ~ updatedTag2", updatedTag2);

  console.log("🚀 ~ file: beejs.ts ~ line 18 ~ uploadFile ~ result", result);

  return result.reference;
};

const downloadFile = async (fileReference: string): Promise<FileData<Data>> => await bee.downloadFile(fileReference);

export { uploadFile, downloadFile };
