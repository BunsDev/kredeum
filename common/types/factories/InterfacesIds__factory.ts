/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { InterfacesIds, InterfacesIdsInterface } from "../InterfacesIds";

const _abi = [
  {
    inputs: [],
    name: "ids",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "interfacesIds",
        type: "bytes4[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061084b806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063e7657e1514610030575b600080fd5b61003861004e565b6040516100459190610795565b60405180910390f35b6060600c67ffffffffffffffff81111561006b5761006a6107b7565b5b6040519080825280602002602001820160405280156100995781602001602082028036833780820191505090505b5090507f01ffc9a700000000000000000000000000000000000000000000000000000000816000815181106100d1576100d06107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f80ac58cd0000000000000000000000000000000000000000000000000000000081600181518110610152576101516107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f150b7a0200000000000000000000000000000000000000000000000000000000816002815181106101d3576101d26107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f5b5e139f0000000000000000000000000000000000000000000000000000000081600381518110610254576102536107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f780e9d6300000000000000000000000000000000000000000000000000000000816004815181106102d5576102d46107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507fd9b67a260000000000000000000000000000000000000000000000000000000081600581518110610356576103556107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f4e2312e000000000000000000000000000000000000000000000000000000000816006815181106103d7576103d66107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f0e89341c0000000000000000000000000000000000000000000000000000000081600781518110610458576104576107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f4b68d43100000000000000000000000000000000000000000000000000000000816008815181106104d9576104d86107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507feacabe14000000000000000000000000000000000000000000000000000000008160098151811061055a576105596107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507fd94a1db20000000000000000000000000000000000000000000000000000000081600a815181106105db576105da6107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f9e4ad4800000000000000000000000000000000000000000000000000000000081600b8151811061065c5761065b6107e6565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505090565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61070c816106d7565b82525050565b600061071e8383610703565b60208301905092915050565b6000602082019050919050565b6000610742826106ab565b61074c81856106b6565b9350610757836106c7565b8060005b8381101561078857815161076f8882610712565b975061077a8361072a565b92505060018101905061075b565b5085935050505092915050565b600060208201905081810360008301526107af8184610737565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea2646970667358221220803a849968f55e1657e0f59767b0a87438609e85ade1f4a06c593b175b56c4c364736f6c63430008090033";

type InterfacesIdsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: InterfacesIdsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class InterfacesIds__factory extends ContractFactory {
  constructor(...args: InterfacesIdsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "InterfacesIds";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InterfacesIds> {
    return super.deploy(overrides || {}) as Promise<InterfacesIds>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): InterfacesIds {
    return super.attach(address) as InterfacesIds;
  }
  connect(signer: Signer): InterfacesIds__factory {
    return super.connect(signer) as InterfacesIds__factory;
  }
  static readonly contractName: "InterfacesIds";
  public readonly contractName: "InterfacesIds";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InterfacesIdsInterface {
    return new utils.Interface(_abi) as InterfacesIdsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InterfacesIds {
    return new Contract(address, _abi, signerOrProvider) as InterfacesIds;
  }
}