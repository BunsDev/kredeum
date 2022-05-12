import { Bee, Data, FileData } from "@ethersphere/bee-js";

const nodeUrl: string = "http://localhost:1633";
const bee: Bee = new Bee(nodeUrl);
const batchId: string = "5feccb39054640d8721c2c8393f0f3317ea0753f499e89166741195d006d7be6";

const uploadFile = async (file: File, fileName: string, contentType: string, fileSize: number): Promise<string> => {
  console.log("🚀 ~ file: testbeejs.ts ~ line 18 ~ contentType", contentType);
  const result = await bee.uploadFile(batchId, file, fileName, {
    pin: true,
    size: fileSize,
    contentType: contentType
  });

  return result.reference;
};

const downloadFile = async (fileReference: string): Promise<FileData<Data>> => await bee.downloadFile(fileReference);

export { uploadFile, downloadFile };
