/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { NFTsFactory, NFTsFactoryInterface } from "../NFTsFactory";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
        name: "owner",
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
        name: "count",
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
  "0x60806040523480156200001157600080fd5b5062000032620000266200003860201b60201c565b6200004060201b60201c565b62000104565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b612b4b80620001146000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c8063845affc8116100c3578063c17bae4f1161007c578063c17bae4f1461036c578063c6e2a4001461038a578063d33cdd74146103a6578063f2fde38b146103c4578063f7888aec146103e0578063f7f5d46d146104105761014d565b8063845affc8146102985780638da5cb5b146102c857806393199bcf146102e6578063a25e0d7014610316578063b98a474814610332578063bcde32a11461034e5761014d565b80636cc41ea9116101155780636cc41ea91461020c5780636f2ddd931461022a578063715018a6146102485780637362377b146102525780637d19ec931461025c5780638425abff1461027a5761014d565b80630a7c6d191461015257806320a99bd0146101705780632bf0d071146101a05780636392a51f146101be5780636bc259cc146101ee575b600080fd5b61015a61042e565b6040516101679190611c89565b60405180910390f35b61018a60048036038101906101859190611d16565b610439565b6040516101979190611d52565b60405180910390f35b6101a861046c565b6040516101b59190611d89565b60405180910390f35b6101d860048036038101906101d39190611d16565b610471565b6040516101e59190611fb7565b60405180910390f35b6101f661055e565b6040516102039190611c89565b60405180910390f35b610214610569565b6040516102219190611c89565b60405180910390f35b61023261058d565b60405161023f9190611d52565b60405180910390f35b6102506105b3565b005b61025a61063b565b005b610264610766565b6040516102719190611c89565b60405180910390f35b610282610771565b60405161028f9190611d89565b60405180910390f35b6102b260048036038101906102ad9190612005565b610776565b6040516102bf9190611d52565b60405180910390f35b6102d06107b5565b6040516102dd9190611d52565b60405180910390f35b61030060048036038101906102fb9190612167565b6107de565b60405161030d9190611d52565b60405180910390f35b610330600480360381019061032b9190611d16565b610950565b005b61034c60048036038101906103479190611d16565b610a10565b005b610356610bb9565b6040516103639190611d52565b60405180910390f35b610374610bdf565b60405161038191906121ee565b60405180910390f35b6103a4600480360381019061039f9190611d16565b610bec565b005b6103ae610cc8565b6040516103bb9190611d89565b60405180910390f35b6103de60048036038101906103d99190611d16565b610ccd565b005b6103fa60048036038101906103f59190612209565b610dc5565b60405161040791906122d9565b60405180910390f35b6104186113c5565b6040516104259190611d89565b60405180910390f35b63780e9d6360e01b81565b60046020528060005260406000206000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600181565b606060018054905067ffffffffffffffff8111156104925761049161203c565b5b6040519080825280602002602001820160405280156104cb57816020015b6104b8611bec565b8152602001906001900390816104b05790505b50905060005b60018054905081101561055857610526600182815481106104f5576104f46122fb565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1684610dc5565b828281518110610539576105386122fb565b5b60200260200101819052506001816105519190612359565b90506104d1565b50919050565b6380ac58cd60e01b81565b7fd94a1db20000000000000000000000000000000000000000000000000000000081565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6105bb6113ca565b73ffffffffffffffffffffffffffffffffffffffff166105d96107b5565b73ffffffffffffffffffffffffffffffffffffffff161461062f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106269061240c565b60405180910390fd5b61063960006113d2565b565b6106436113ca565b73ffffffffffffffffffffffffffffffffffffffff166106616107b5565b73ffffffffffffffffffffffffffffffffffffffff16146106b7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ae9061240c565b60405180910390fd5b60003373ffffffffffffffffffffffffffffffffffffffff16476040516106dd9061245d565b60006040518083038185875af1925050503d806000811461071a576040519150601f19603f3d011682016040523d82523d6000602084013e61071f565b606091505b5050905080610763576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161075a906124be565b60405180910390fd5b50565b63780e9d6360e01b81565b600081565b6001818154811061078657600080fd5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60006107e8611496565b90506108337fd94a1db2000000000000000000000000000000000000000000000000000000008273ffffffffffffffffffffffffffffffffffffffff1661158590919063ffffffff16565b610872576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108699061252a565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16634cd88b7684846040518363ffffffff1660e01b81526004016108ad929190612583565b600060405180830381600087803b1580156108c757600080fd5b505af11580156108db573d6000803e3d6000fd5b505050508073ffffffffffffffffffffffffffffffffffffffff1663f2fde38b336040518263ffffffff1660e01b81526004016109189190611d52565b600060405180830381600087803b15801561093257600080fd5b505af1158015610946573d6000803e3d6000fd5b5050505092915050565b6109586113ca565b73ffffffffffffffffffffffffffffffffffffffff166109766107b5565b73ffffffffffffffffffffffffffffffffffffffff16146109cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109c39061240c565b60405180910390fd5b80600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b610a186113ca565b73ffffffffffffffffffffffffffffffffffffffff16610a366107b5565b73ffffffffffffffffffffffffffffffffffffffff1614610a8c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a839061240c565b60405180910390fd5b600080610a98836115aa565b915091508273ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610b0a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0190612606565b60405180910390fd5b81610b1957610b1883610bec565b5b82600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f81bbf04250a28f0d5979a401ffb6705dcebf8b354060431d672cf1ea4594fc6760405160405180910390a3505050565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600180549050905090565b610bf46113ca565b73ffffffffffffffffffffffffffffffffffffffff16610c126107b5565b73ffffffffffffffffffffffffffffffffffffffff1614610c68576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c5f9061240c565b60405180910390fd5b600080610c74836115aa565b915091508115610cb9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cb090612672565b60405180910390fd5b610cc38382611777565b505050565b600281565b610cd56113ca565b73ffffffffffffffffffffffffffffffffffffffff16610cf36107b5565b73ffffffffffffffffffffffffffffffffffffffff1614610d49576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d409061240c565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610db9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610db090612704565b60405180910390fd5b610dc2816113d2565b50565b610dcd611bec565b6000600467ffffffffffffffff811115610dea57610de961203c565b5b604051908082528060200260200182016040528015610e185781602001602082028036833780820191505090505b5090506380ac58cd60e01b81600060ff1681518110610e3a57610e396122fb565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600160ff1681518110610ea557610ea46122fb565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505063780e9d6360e01b81600260ff1681518110610f1057610f0f6122fb565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815250507fd94a1db20000000000000000000000000000000000000000000000000000000081600360ff1681518110610f9457610f936122fb565b5b60200260200101907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681525050600061100b828673ffffffffffffffffffffffffffffffffffffffff166118cd90919063ffffffff16565b905080600060ff1681518110611024576110236122fb565b5b6020026020010151156113bd5784836000019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250508473ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b81526004016110a29190611d52565b60206040518083038186803b1580156110ba57600080fd5b505afa1580156110ce573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110f29190612739565b83602001818152505080600160ff1681518110611112576111116122fb565b5b602002602001015115611236578473ffffffffffffffffffffffffffffffffffffffff166306fdde036040518163ffffffff1660e01b815260040160006040518083038186803b15801561116557600080fd5b505afa158015611179573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f820116820180604052508101906111a291906127d6565b83606001819052508473ffffffffffffffffffffffffffffffffffffffff166395d89b416040518163ffffffff1660e01b815260040160006040518083038186803b1580156111f057600080fd5b505afa158015611204573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525081019061122d91906127d6565b83608001819052505b80600260ff168151811061124d5761124c6122fb565b5b6020026020010151156112e2578473ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156112a057600080fd5b505afa1580156112b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112d89190612739565b8360a00181815250505b80600360ff16815181106112f9576112f86122fb565b5b6020026020010151156113bc578473ffffffffffffffffffffffffffffffffffffffff16638da5cb5b6040518163ffffffff1660e01b815260040160206040518083038186803b15801561134c57600080fd5b505afa158015611360573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113849190612834565b836040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b5b505092915050565b600381565b600033905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b60008073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611529576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611520906128ad565b60405180910390fd5b611554600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1661199f565b905061158281600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16611777565b90565b600061159083611a74565b80156115a257506115a18383611ac1565b5b905092915050565b6000806000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663275e5da5856040518263ffffffff1660e01b815260040161160a9190611d52565b604080518083038186803b15801561162157600080fd5b505afa158015611635573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116599190612905565b8093508192505050806116a1576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161169890612991565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156116df576116de6129b1565b5b600073ffffffffffffffffffffffffffffffffffffffff16600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415925050915091565b6001829080600181540180825580915050600190039060005260206000200160009091909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f053585d4de2374a5e4cee65e665171098bd6777e89041c2915cdac4d567cd93f60405160405180910390a45050565b60606000825167ffffffffffffffff8111156118ec576118eb61203c565b5b60405190808252806020026020018201604052801561191a5781602001602082028036833780820191505090505b50905061192684611a74565b156119955760005b83518110156119935761195b8585838151811061194e5761194d6122fb565b5b6020026020010151611ac1565b82828151811061196e5761196d6122fb565b5b602002602001019015159081151581525050808061198b906129e0565b91505061192e565b505b8091505092915050565b60006040517f3d602d80600a3d3981f3363d3d373d3d3d363d7300000000000000000000000081528260601b60148201527f5af43d82803e903d91602b57fd5bf3000000000000000000000000000000000060288201526037816000f0915050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415611a6f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6690612a75565b60405180910390fd5b919050565b6000611aa0827f01ffc9a700000000000000000000000000000000000000000000000000000000611ac1565b8015611aba5750611ab88263ffffffff60e01b611ac1565b155b9050919050565b6000806301ffc9a760e01b83604051602401611add9190611c89565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505090506000808573ffffffffffffffffffffffffffffffffffffffff1661753084604051611b679190612ad1565b6000604051808303818686fa925050503d8060008114611ba3576040519150601f19603f3d011682016040523d82523d6000602084013e611ba8565b606091505b5091509150602081511015611bc35760009350505050611be6565b818015611be0575080806020019051810190611bdf9190612ae8565b5b93505050505b92915050565b6040518060c00160405280600073ffffffffffffffffffffffffffffffffffffffff16815260200160008152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160608152602001600081525090565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b611c8381611c4e565b82525050565b6000602082019050611c9e6000830184611c7a565b92915050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611ce382611cb8565b9050919050565b611cf381611cd8565b8114611cfe57600080fd5b50565b600081359050611d1081611cea565b92915050565b600060208284031215611d2c57611d2b611cae565b5b6000611d3a84828501611d01565b91505092915050565b611d4c81611cd8565b82525050565b6000602082019050611d676000830184611d43565b92915050565b600060ff82169050919050565b611d8381611d6d565b82525050565b6000602082019050611d9e6000830184611d7a565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b611dd981611cd8565b82525050565b6000819050919050565b611df281611ddf565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611e32578082015181840152602081019050611e17565b83811115611e41576000848401525b50505050565b6000601f19601f8301169050919050565b6000611e6382611df8565b611e6d8185611e03565b9350611e7d818560208601611e14565b611e8681611e47565b840191505092915050565b600060c083016000830151611ea96000860182611dd0565b506020830151611ebc6020860182611de9565b506040830151611ecf6040860182611dd0565b5060608301518482036060860152611ee78282611e58565b91505060808301518482036080860152611f018282611e58565b91505060a0830151611f1660a0860182611de9565b508091505092915050565b6000611f2d8383611e91565b905092915050565b6000602082019050919050565b6000611f4d82611da4565b611f578185611daf565b935083602082028501611f6985611dc0565b8060005b85811015611fa55784840389528151611f868582611f21565b9450611f9183611f35565b925060208a01995050600181019050611f6d565b50829750879550505050505092915050565b60006020820190508181036000830152611fd18184611f42565b905092915050565b611fe281611ddf565b8114611fed57600080fd5b50565b600081359050611fff81611fd9565b92915050565b60006020828403121561201b5761201a611cae565b5b600061202984828501611ff0565b91505092915050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61207482611e47565b810181811067ffffffffffffffff821117156120935761209261203c565b5b80604052505050565b60006120a6611ca4565b90506120b2828261206b565b919050565b600067ffffffffffffffff8211156120d2576120d161203c565b5b6120db82611e47565b9050602081019050919050565b82818337600083830152505050565b600061210a612105846120b7565b61209c565b90508281526020810184848401111561212657612125612037565b5b6121318482856120e8565b509392505050565b600082601f83011261214e5761214d612032565b5b813561215e8482602086016120f7565b91505092915050565b6000806040838503121561217e5761217d611cae565b5b600083013567ffffffffffffffff81111561219c5761219b611cb3565b5b6121a885828601612139565b925050602083013567ffffffffffffffff8111156121c9576121c8611cb3565b5b6121d585828601612139565b9150509250929050565b6121e881611ddf565b82525050565b600060208201905061220360008301846121df565b92915050565b600080604083850312156122205761221f611cae565b5b600061222e85828601611d01565b925050602061223f85828601611d01565b9150509250929050565b600060c0830160008301516122616000860182611dd0565b5060208301516122746020860182611de9565b5060408301516122876040860182611dd0565b506060830151848203606086015261229f8282611e58565b915050608083015184820360808601526122b98282611e58565b91505060a08301516122ce60a0860182611de9565b508091505092915050565b600060208201905081810360008301526122f38184612249565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061236482611ddf565b915061236f83611ddf565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156123a4576123a361232a565b5b828201905092915050565b600082825260208201905092915050565b7f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572600082015250565b60006123f66020836123af565b9150612401826123c0565b602082019050919050565b60006020820190508181036000830152612425816123e9565b9050919050565b600081905092915050565b50565b600061244760008361242c565b915061245282612437565b600082019050919050565b60006124688261243a565b9150819050919050565b7f4661696c656420746f2077697468647261772045746865720000000000000000600082015250565b60006124a86018836123af565b91506124b382612472565b602082019050919050565b600060208201905081810360008301526124d78161249b565b9050919050565b7f436c6f6e65206973206e6f74204f70656e204e46547320636f6e747261637400600082015250565b6000612514601f836123af565b915061251f826124de565b602082019050919050565b6000602082019050818103600083015261254381612507565b9050919050565b600061255582611df8565b61255f81856123af565b935061256f818560208601611e14565b61257881611e47565b840191505092915050565b6000604082019050818103600083015261259d818561254a565b905081810360208301526125b1818461254a565b90509392505050565b7f54656d706c617465206973206120436c6f6e6500000000000000000000000000600082015250565b60006125f06013836123af565b91506125fb826125ba565b602082019050919050565b6000602082019050818103600083015261261f816125e3565b9050919050565b7f496d706c656d656e746174696f6e20616c726561647920657869737473000000600082015250565b600061265c601d836123af565b915061266782612626565b602082019050919050565b6000602082019050818103600083015261268b8161264f565b9050919050565b7f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160008201527f6464726573730000000000000000000000000000000000000000000000000000602082015250565b60006126ee6026836123af565b91506126f982612692565b604082019050919050565b6000602082019050818103600083015261271d816126e1565b9050919050565b60008151905061273381611fd9565b92915050565b60006020828403121561274f5761274e611cae565b5b600061275d84828501612724565b91505092915050565b6000612779612774846120b7565b61209c565b90508281526020810184848401111561279557612794612037565b5b6127a0848285611e14565b509392505050565b600082601f8301126127bd576127bc612032565b5b81516127cd848260208601612766565b91505092915050565b6000602082840312156127ec576127eb611cae565b5b600082015167ffffffffffffffff81111561280a57612809611cb3565b5b612816848285016127a8565b91505092915050565b60008151905061282e81611cea565b92915050565b60006020828403121561284a57612849611cae565b5b60006128588482850161281f565b91505092915050565b7f54656d706c61746520646f65736e277420657869737400000000000000000000600082015250565b60006128976016836123af565b91506128a282612861565b602082019050919050565b600060208201905081810360008301526128c68161288a565b9050919050565b60008115159050919050565b6128e2816128cd565b81146128ed57600080fd5b50565b6000815190506128ff816128d9565b92915050565b6000806040838503121561291c5761291b611cae565b5b600061292a858286016128f0565b925050602061293b8582860161281f565b9150509250929050565b7f4e6f74206120436f6e7472616374000000000000000000000000000000000000600082015250565b600061297b600e836123af565b915061298682612945565b602082019050919050565b600060208201905081810360008301526129aa8161296e565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052600160045260246000fd5b60006129eb82611ddf565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415612a1e57612a1d61232a565b5b600182019050919050565b7f455243313136373a20637265617465206661696c656400000000000000000000600082015250565b6000612a5f6016836123af565b9150612a6a82612a29565b602082019050919050565b60006020820190508181036000830152612a8e81612a52565b9050919050565b600081519050919050565b6000612aab82612a95565b612ab5818561242c565b9350612ac5818560208601611e14565b80840191505092915050565b6000612add8284612aa0565b915081905092915050565b600060208284031215612afe57612afd611cae565b5b6000612b0c848285016128f0565b9150509291505056fea264697066735822122002400dc549ce1887f657a9d177548b5c469c029bcd54f9c13a52521c714aa62464736f6c63430008090033";

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
