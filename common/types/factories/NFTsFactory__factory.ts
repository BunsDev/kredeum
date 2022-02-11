/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFTsFactory, NFTsFactoryInterface } from "../NFTsFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "template",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "NewImplementation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "template",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "NewTemplate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "ERC721",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_ENUMERABLE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_ENUMERABLE_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_METADATA",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_METADATA_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ERC721_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPEN_NFTS",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OPEN_NFTS_SIG",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "addImplementation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "nft",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balanceOf",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
        ],
        internalType: "struct INFTsFactory.NftData",
        name: "nftData",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "balancesOf",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "nft",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "balanceOf",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
        ],
        internalType: "struct INFTsFactory.NftData[]",
        name: "nftData",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    name: "clone",
    outputs: [
      {
        internalType: "address",
        name: "clone_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractProbe",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "implementations",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementationsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setContractProbe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "setDefaultTemplate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "template",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "templates",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawEther",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5062000032620000266200003860201b60201c565b6200004060201b60201c565b62000104565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612c0f80620001146000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c8063845affc8116100c3578063c17bae4f1161007c578063c17bae4f1461036c578063c6e2a4001461038a578063d33cdd74146103a6578063f2fde38b146103c4578063f7888aec146103e0578063f7f5d46d146104105761014d565b8063845affc8146102985780638da5cb5b146102c857806393199bcf146102e6578063a25e0d7014610316578063b98a474814610332578063bcde32a11461034e5761014d565b80636cc41ea9116101155780636cc41ea91461020c5780636f2ddd931461022a578063715018a6146102485780637362377b146102525780637d19ec931461025c5780638425abff1461027a5761014d565b80630a7c6d191461015257806320a99bd0146101705780632bf0d071146101a05780636392a51f146101be5780636bc259cc146101ee575b600080fd5b61015a61042e565b6040516101679190611c90565b60405180910390f35b61018a60048036038101906101859190611d1d565b610439565b6040516101979190611d59565b60405180910390f35b6101a861046c565b6040516101b59190611d90565b60405180910390f35b6101d860048036038101906101d39190611d1d565b610471565b6040516101e59190611fbe565b60405180910390f35b6101f661055e565b6040516102039190611c90565b60405180910390f35b610214610569565b6040516102219190611c90565b60405180910390f35b61023261058d565b60405161023f9190611d59565b60405180910390f35b6102506105b3565b005b61025a61063b565b005b6102646106ca565b6040516102719190611c90565b60405180910390f35b6102826106d5565b60405161028f9190611d90565b60405180910390f35b6102b260048036038101906102ad919061200c565b6106da565b6040516102bf9190611d59565b60405180910390f35b6102d0610719565b6040516102dd9190611d59565b60405180910390f35b61030060048036038101906102fb919061216e565b610742565b60405161030d9190611d59565b60405180910390f35b610330600480360381019061032b9190611d1d565b610855565b005b61034c60048036038101906103479190611d1d565b610915565b005b610356610ac5565b6040516103639190611d59565b60405180910390f35b610374610aeb565b60405161038191906121f5565b60405180910390f35b6103a4600480360381019061039f9190611d1d565b610af8565b005b6103ae610bd4565b6040516103bb9190611d90565b60405180910390f35b6103de60048036038101906103d99190611d1d565b610bd9565b005b6103fa60048036038101906103f59190612210565b610cd1565b60405161040791906122e0565b60405180910390f35b6104186112d1565b6040516104259190611d90565b60405180910390f35b63780e9d6360e01b81565b60046020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600181565b606060038054905067ffffffffffffffff81111561049257610491612043565b5b6040519080825280602002602001820160405280156104cb57816020015b6104b8611bf3565b8152602001906001900390816104b05790505b50905060005b60038054905081101561055857610526600382815481106104f5576104f4612302565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684610cd1565b82828151811061053957610538612302565b5b60200260200101819052506001816105519190612360565b90506104d1565b50919050565b6380ac58cd60e01b81565b7f9e4ad4800000000000000000000000000000000000000000000000000000000081565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6105bb6112d6565b73ffffffffffffffffffffffffffffffffffffffff166105d9610719565b73ffffffffffffffffffffffffffffffffffffffff161461062f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161062690612413565b60405180910390fd5b61063960006112de565b565b6106436112d6565b73ffffffffffffffffffffffffffffffffffffffff16610661610719565b73ffffffffffffffffffffffffffffffffffffffff16146106b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ae90612413565b60405180910390fd5b6106c86106c26112d6565b476113a2565b565b63780e9d6360e01b81565b600081565b600381815481106106ea57600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600061074c611496565b90506107977f9e4ad480000000000000000000000000000000000000000000000000000000008273ffffffffffffffffffffffffffffffffffffffff1661158590919063ffffffff16565b6107d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107cd9061247f565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16635c108a4384846107fc6112d6565b60006040518563ffffffff1660e01b815260040161081d94939291906124f3565b600060405180830381600087803b15801561083757600080fd5b505af115801561084b573d6000803e3d6000fd5b5050505092915050565b61085d6112d6565b73ffffffffffffffffffffffffffffffffffffffff1661087b610719565b73ffffffffffffffffffffffffffffffffffffffff16146108d1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108c890612413565b60405180910390fd5b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b61091d6112d6565b73ffffffffffffffffffffffffffffffffffffffff1661093b610719565b73ffffffffffffffffffffffffffffffffffffffff1614610991576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161098890612413565b60405180910390fd5b60008061099d836115aa565b915091508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610a0f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a0690612592565b60405180910390fd5b81610a1e57610a1d83610af8565b5b82600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610a676112d6565b73ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f81bbf04250a28f0d5979a401ffb6705dcebf8b354060431d672cf1ea4594fc6760405160405180910390a3505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600380549050905090565b610b006112d6565b73ffffffffffffffffffffffffffffffffffffffff16610b1e610719565b73ffffffffffffffffffffffffffffffffffffffff1614610b74576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b6b90612413565b60405180910390fd5b600080610b80836115aa565b915091508115610bc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bbc906125fe565b60405180910390fd5b610bcf8382611777565b505050565b600281565b610be16112d6565b73ffffffffffffffffffffffffffffffffffffffff16610bff610719565b73ffffffffffffffffffffffffffffffffffffffff1614610c55576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c4c90612413565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610cc5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cbc90612690565b60405180910390fd5b610cce816112de565b50565b610cd9611bf3565b6000600467ffffffffffffffff811115610cf657610cf5612043565b5b604051908082528060200260200182016040528015610d245781602001602082028036833780820191505090505b5090506380ac58cd60e01b81600060ff1681518110610d4657610d45612302565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600160ff1681518110610db157610db0612302565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600260ff1681518110610e1c57610e1b612302565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507f9e4ad4800000000000000000000000000000000000000000000000000000000081600360ff1681518110610ea057610e9f612302565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250506000610f17828673ffffffffffffffffffffffffffffffffffffffff166118d490919063ffffffff16565b905080600060ff1681518110610f3057610f2f612302565b5b6020026020010151156112c95784836000019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508473ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401610fae9190611d59565b60206040518083038186803b158015610fc657600080fd5b505afa158015610fda573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610ffe91906126c5565b83602001818152505080600160ff168151811061101e5761101d612302565b5b602002602001015115611142578473ffffffffffffffffffffffffffffffffffffffff166306fdde036040518163ffffffff1660e01b815260040160006040518083038186803b15801561107157600080fd5b505afa158015611085573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906110ae9190612762565b83606001819052508473ffffffffffffffffffffffffffffffffffffffff166395d89b416040518163ffffffff1660e01b815260040160006040518083038186803b1580156110fc57600080fd5b505afa158015611110573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906111399190612762565b83608001819052505b80600260ff168151811061115957611158612302565b5b6020026020010151156111ee578473ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156111ac57600080fd5b505afa1580156111c0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111e491906126c5565b8360a00181815250505b80600360ff168151811061120557611204612302565b5b6020026020010151156112c8578473ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561125857600080fd5b505afa15801561126c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061129091906127c0565b836040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b5b505092915050565b600381565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b804710156113e5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113dc90612839565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff168260405161140b9061288a565b60006040518083038185875af1925050503d8060008114611448576040519150601f19603f3d011682016040523d82523d6000602084013e61144d565b606091505b5050905080611491576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161148890612911565b60405180910390fd5b505050565b60008073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611529576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115209061297d565b60405180910390fd5b611554600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166119a6565b905061158281600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611777565b90565b600061159083611a7b565b80156115a257506115a18383611ac8565b5b905092915050565b6000806000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663275e5da5856040518263ffffffff1660e01b815260040161160a9190611d59565b604080518083038186803b15801561162157600080fd5b505afa158015611635573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061165991906129c9565b8093508192505050806116a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161169890612a55565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156116df576116de612a75565b5b600073ffffffffffffffffffffffffffffffffffffffff16600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415925050915091565b6003829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506118606112d6565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f053585d4de2374a5e4cee65e665171098bd6777e89041c2915cdac4d567cd93f60405160405180910390a45050565b60606000825167ffffffffffffffff8111156118f3576118f2612043565b5b6040519080825280602002602001820160405280156119215781602001602082028036833780820191505090505b50905061192d84611a7b565b1561199c5760005b835181101561199a576119628585838151811061195557611954612302565b5b6020026020010151611ac8565b82828151811061197557611974612302565b5b602002602001019015159081151581525050808061199290612aa4565b915050611935565b505b8091505092915050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611a76576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6d90612b39565b60405180910390fd5b919050565b6000611aa7827f01ffc9a700000000000000000000000000000000000000000000000000000000611ac8565b8015611ac15750611abf8263ffffffff60e01b611ac8565b155b9050919050565b6000806301ffc9a760e01b83604051602401611ae49190611c90565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090506000808573ffffffffffffffffffffffffffffffffffffffff1661753084604051611b6e9190612b95565b6000604051808303818686fa925050503d8060008114611baa576040519150601f19603f3d011682016040523d82523d6000602084013e611baf565b606091505b5091509150602081511015611bca5760009350505050611bed565b818015611be7575080806020019051810190611be69190612bac565b5b93505050505b92915050565b6040518060c00160405280600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160608152602001600081525090565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611c8a81611c55565b82525050565b6000602082019050611ca56000830184611c81565b92915050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611cea82611cbf565b9050919050565b611cfa81611cdf565b8114611d0557600080fd5b50565b600081359050611d1781611cf1565b92915050565b600060208284031215611d3357611d32611cb5565b5b6000611d4184828501611d08565b91505092915050565b611d5381611cdf565b82525050565b6000602082019050611d6e6000830184611d4a565b92915050565b600060ff82169050919050565b611d8a81611d74565b82525050565b6000602082019050611da56000830184611d81565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611de081611cdf565b82525050565b6000819050919050565b611df981611de6565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611e39578082015181840152602081019050611e1e565b83811115611e48576000848401525b50505050565b6000601f19601f8301169050919050565b6000611e6a82611dff565b611e748185611e0a565b9350611e84818560208601611e1b565b611e8d81611e4e565b840191505092915050565b600060c083016000830151611eb06000860182611dd7565b506020830151611ec36020860182611df0565b506040830151611ed66040860182611dd7565b5060608301518482036060860152611eee8282611e5f565b91505060808301518482036080860152611f088282611e5f565b91505060a0830151611f1d60a0860182611df0565b508091505092915050565b6000611f348383611e98565b905092915050565b6000602082019050919050565b6000611f5482611dab565b611f5e8185611db6565b935083602082028501611f7085611dc7565b8060005b85811015611fac5784840389528151611f8d8582611f28565b9450611f9883611f3c565b925060208a01995050600181019050611f74565b50829750879550505050505092915050565b60006020820190508181036000830152611fd88184611f49565b905092915050565b611fe981611de6565b8114611ff457600080fd5b50565b60008135905061200681611fe0565b92915050565b60006020828403121561202257612021611cb5565b5b600061203084828501611ff7565b91505092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61207b82611e4e565b810181811067ffffffffffffffff8211171561209a57612099612043565b5b80604052505050565b60006120ad611cab565b90506120b98282612072565b919050565b600067ffffffffffffffff8211156120d9576120d8612043565b5b6120e282611e4e565b9050602081019050919050565b82818337600083830152505050565b600061211161210c846120be565b6120a3565b90508281526020810184848401111561212d5761212c61203e565b5b6121388482856120ef565b509392505050565b600082601f83011261215557612154612039565b5b81356121658482602086016120fe565b91505092915050565b6000806040838503121561218557612184611cb5565b5b600083013567ffffffffffffffff8111156121a3576121a2611cba565b5b6121af85828601612140565b925050602083013567ffffffffffffffff8111156121d0576121cf611cba565b5b6121dc85828601612140565b9150509250929050565b6121ef81611de6565b82525050565b600060208201905061220a60008301846121e6565b92915050565b6000806040838503121561222757612226611cb5565b5b600061223585828601611d08565b925050602061224685828601611d08565b9150509250929050565b600060c0830160008301516122686000860182611dd7565b50602083015161227b6020860182611df0565b50604083015161228e6040860182611dd7565b50606083015184820360608601526122a68282611e5f565b915050608083015184820360808601526122c08282611e5f565b91505060a08301516122d560a0860182611df0565b508091505092915050565b600060208201905081810360008301526122fa8184612250565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061236b82611de6565b915061237683611de6565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156123ab576123aa612331565b5b828201905092915050565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006123fd6020836123b6565b9150612408826123c7565b602082019050919050565b6000602082019050818103600083015261242c816123f0565b9050919050565b7f436c6f6e65206973206e6f74204f70656e204e46547320636f6e747261637400600082015250565b6000612469601f836123b6565b915061247482612433565b602082019050919050565b600060208201905081810360008301526124988161245c565b9050919050565b60006124aa82611dff565b6124b481856123b6565b93506124c4818560208601611e1b565b6124cd81611e4e565b840191505092915050565b60008115159050919050565b6124ed816124d8565b82525050565b6000608082019050818103600083015261250d818761249f565b90508181036020830152612521818661249f565b90506125306040830185611d4a565b61253d60608301846124e4565b95945050505050565b7f54656d706c617465206973206120436c6f6e6500000000000000000000000000600082015250565b600061257c6013836123b6565b915061258782612546565b602082019050919050565b600060208201905081810360008301526125ab8161256f565b9050919050565b7f496d706c656d656e746174696f6e20616c726561647920657869737473000000600082015250565b60006125e8601d836123b6565b91506125f3826125b2565b602082019050919050565b60006020820190508181036000830152612617816125db565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b600061267a6026836123b6565b91506126858261261e565b604082019050919050565b600060208201905081810360008301526126a98161266d565b9050919050565b6000815190506126bf81611fe0565b92915050565b6000602082840312156126db576126da611cb5565b5b60006126e9848285016126b0565b91505092915050565b6000612705612700846120be565b6120a3565b9050828152602081018484840111156127215761272061203e565b5b61272c848285611e1b565b509392505050565b600082601f83011261274957612748612039565b5b81516127598482602086016126f2565b91505092915050565b60006020828403121561277857612777611cb5565b5b600082015167ffffffffffffffff81111561279657612795611cba565b5b6127a284828501612734565b91505092915050565b6000815190506127ba81611cf1565b92915050565b6000602082840312156127d6576127d5611cb5565b5b60006127e4848285016127ab565b91505092915050565b7f416464726573733a20696e73756666696369656e742062616c616e6365000000600082015250565b6000612823601d836123b6565b915061282e826127ed565b602082019050919050565b6000602082019050818103600083015261285281612816565b9050919050565b600081905092915050565b50565b6000612874600083612859565b915061287f82612864565b600082019050919050565b600061289582612867565b9150819050919050565b7f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260008201527f6563697069656e74206d61792068617665207265766572746564000000000000602082015250565b60006128fb603a836123b6565b91506129068261289f565b604082019050919050565b6000602082019050818103600083015261292a816128ee565b9050919050565b7f54656d706c61746520646f65736e277420657869737400000000000000000000600082015250565b60006129676016836123b6565b915061297282612931565b602082019050919050565b600060208201905081810360008301526129968161295a565b9050919050565b6129a6816124d8565b81146129b157600080fd5b50565b6000815190506129c38161299d565b92915050565b600080604083850312156129e0576129df611cb5565b5b60006129ee858286016129b4565b92505060206129ff858286016127ab565b9150509250929050565b7f4e6f74206120436f6e7472616374000000000000000000000000000000000000600082015250565b6000612a3f600e836123b6565b9150612a4a82612a09565b602082019050919050565b60006020820190508181036000830152612a6e81612a32565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b6000612aaf82611de6565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612ae257612ae1612331565b5b600182019050919050565b7f455243313136373a20637265617465206661696c656400000000000000000000600082015250565b6000612b236016836123b6565b9150612b2e82612aed565b602082019050919050565b60006020820190508181036000830152612b5281612b16565b9050919050565b600081519050919050565b6000612b6f82612b59565b612b798185612859565b9350612b89818560208601611e1b565b80840191505092915050565b6000612ba18284612b64565b915081905092915050565b600060208284031215612bc257612bc1611cb5565b5b6000612bd0848285016129b4565b9150509291505056fea2646970667358221220f0be692587c4c25d93202216eea7ccd9aa9c3ccdd6ac079f6599750f51cf8df664736f6c63430008090033";

type NFTsFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: NFTsFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class NFTsFactory__factory extends ContractFactory {
  constructor(...args: NFTsFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "NFTsFactory";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NFTsFactory> {
    return super.deploy(overrides || {}) as Promise<NFTsFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NFTsFactory {
    return super.attach(address) as NFTsFactory;
  }
  connect(signer: Signer): NFTsFactory__factory {
    return super.connect(signer) as NFTsFactory__factory;
  }
  static readonly contractName: "NFTsFactory";
  public readonly contractName: "NFTsFactory";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): NFTsFactoryInterface {
    return new utils.Interface(_abi) as NFTsFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NFTsFactory {
    return new Contract(address, _abi, signerOrProvider) as NFTsFactory;
  }
}
