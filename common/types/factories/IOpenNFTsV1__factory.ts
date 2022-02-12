/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IOpenNFTsV1, IOpenNFTsV1Interface } from "../IOpenNFTsV1";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        internalType: "string",
        name: "jsonURI",
        type: "string",
      },
    ],
    name: "mintNFT",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenID",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IOpenNFTsV1__factory {
  static readonly abi = _abi;
  static createInterface(): IOpenNFTsV1Interface {
    return new utils.Interface(_abi) as IOpenNFTsV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOpenNFTsV1 {
    return new Contract(address, _abi, signerOrProvider) as IOpenNFTsV1;
  }
}
