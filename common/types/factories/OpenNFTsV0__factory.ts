/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { OpenNFTsV0, OpenNFTsV0Interface } from "../OpenNFTsV0";

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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
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
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
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
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600981526020017f4f70656e204e46547300000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f4e46540000000000000000000000000000000000000000000000000000000000815250816000908051906020019062000096929190620000b8565b508060019080519060200190620000af929190620000b8565b505050620001cd565b828054620000c69062000197565b90600052602060002090601f016020900481019282620000ea576000855562000136565b82601f106200010557805160ff191683800117855562000136565b8280016001018555821562000136579182015b828111156200013557825182559160200191906001019062000118565b5b50905062000145919062000149565b5090565b5b80821115620001645760008160009055506001016200014a565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620001b057607f821691505b60208210811415620001c757620001c662000168565b5b50919050565b61342780620001dd6000396000f3fe608060405234801561001057600080fd5b506004361061010b5760003560e01c80634f6ccce7116100a2578063a22cb46511610071578063a22cb465146102de578063b88d4fde146102fa578063c87b56dd14610316578063e985e9c514610346578063eacabe14146103765761010b565b80634f6ccce7146102305780636352211e1461026057806370a082311461029057806395d89b41146102c05761010b565b806318160ddd116100de57806318160ddd146101aa57806323b872dd146101c85780632f745c59146101e457806342842e0e146102145761010b565b806301ffc9a71461011057806306fdde0314610140578063081812fc1461015e578063095ea7b31461018e575b600080fd5b61012a60048036038101906101259190612036565b6103a6565b604051610137919061207e565b60405180910390f35b6101486103b8565b6040516101559190612132565b60405180910390f35b6101786004803603810190610173919061218a565b61044a565b60405161018591906121f8565b60405180910390f35b6101a860048036038101906101a3919061223f565b6104cf565b005b6101b26105e7565b6040516101bf919061228e565b60405180910390f35b6101e260048036038101906101dd91906122a9565b6105f4565b005b6101fe60048036038101906101f9919061223f565b610654565b60405161020b919061228e565b60405180910390f35b61022e600480360381019061022991906122a9565b6106f9565b005b61024a6004803603810190610245919061218a565b610719565b604051610257919061228e565b60405180910390f35b61027a6004803603810190610275919061218a565b61078a565b60405161028791906121f8565b60405180910390f35b6102aa60048036038101906102a591906122fc565b61083c565b6040516102b7919061228e565b60405180910390f35b6102c86108f4565b6040516102d59190612132565b60405180910390f35b6102f860048036038101906102f39190612355565b610986565b005b610314600480360381019061030f91906124ca565b61099c565b005b610330600480360381019061032b919061218a565b6109fe565b60405161033d9190612132565b60405180910390f35b610360600480360381019061035b919061254d565b610a10565b60405161036d919061207e565b60405180910390f35b610390600480360381019061038b919061262e565b610aa4565b60405161039d919061228e565b60405180910390f35b60006103b182610adc565b9050919050565b6060600080546103c7906126b9565b80601f01602080910402602001604051908101604052809291908181526020018280546103f3906126b9565b80156104405780601f1061041557610100808354040283529160200191610440565b820191906000526020600020905b81548152906001019060200180831161042357829003601f168201915b5050505050905090565b600061045582610b56565b610494576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161048b9061275d565b60405180910390fd5b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006104da8261078a565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561054b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610542906127ef565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff1661056a610bc2565b73ffffffffffffffffffffffffffffffffffffffff161480610599575061059881610593610bc2565b610a10565b5b6105d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105cf90612881565b60405180910390fd5b6105e28383610bca565b505050565b6000600880549050905090565b6106056105ff610bc2565b82610c83565b610644576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161063b90612913565b60405180910390fd5b61064f838383610d61565b505050565b600061065f8361083c565b82106106a0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610697906129a5565b60405180910390fd5b600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002054905092915050565b6107148383836040518060200160405280600081525061099c565b505050565b60006107236105e7565b8210610764576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161075b90612a37565b60405180910390fd5b6008828154811061077857610777612a57565b5b90600052602060002001549050919050565b6000806002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415610833576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161082a90612af8565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108ad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108a490612b8a565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060018054610903906126b9565b80601f016020809104026020016040519081016040528092919081815260200182805461092f906126b9565b801561097c5780601f106109515761010080835404028352916020019161097c565b820191906000526020600020905b81548152906001019060200180831161095f57829003601f168201915b5050505050905090565b610998610991610bc2565b8383610fc8565b5050565b6109ad6109a7610bc2565b83610c83565b6109ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109e390612913565b60405180910390fd5b6109f884848484611135565b50505050565b6060610a0982611191565b9050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b6000610ab0600b6112e3565b6000610abc600b6112f9565b9050610ac88482611307565b610ad28184611325565b8091505092915050565b60007f780e9d63000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610b4f5750610b4e82611399565b5b9050919050565b60008073ffffffffffffffffffffffffffffffffffffffff166002600084815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610c3d8361078a565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000610c8e82610b56565b610ccd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cc490612c1c565b60405180910390fd5b6000610cd88361078a565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610d4757508373ffffffffffffffffffffffffffffffffffffffff16610d2f8461044a565b73ffffffffffffffffffffffffffffffffffffffff16145b80610d585750610d578185610a10565b5b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610d818261078a565b73ffffffffffffffffffffffffffffffffffffffff1614610dd7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dce90612cae565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610e47576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e3e90612d40565b60405180910390fd5b610e5283838361147b565b610e5d600082610bca565b6001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ead9190612d8f565b925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610f049190612dc3565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610fc383838361148b565b505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611037576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161102e90612e65565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051611128919061207e565b60405180910390a3505050565b611140848484610d61565b61114c84848484611490565b61118b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118290612ef7565b60405180910390fd5b50505050565b606061119c82610b56565b6111db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111d290612f89565b60405180910390fd5b6000600a600084815260200190815260200160002080546111fb906126b9565b80601f0160208091040260200160405190810160405280929190818152602001828054611227906126b9565b80156112745780601f1061124957610100808354040283529160200191611274565b820191906000526020600020905b81548152906001019060200180831161125757829003601f168201915b505050505090506000611285611627565b905060008151141561129b5781925050506112de565b6000825111156112d05780826040516020016112b8929190612fe5565b604051602081830303815290604052925050506112de565b6112d98461163e565b925050505b919050565b6001816000016000828254019250508190555050565b600081600001549050919050565b6113218282604051806020016040528060008152506116e5565b5050565b61132e82610b56565b61136d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113649061307b565b60405180910390fd5b80600a60008481526020019081526020016000209080519060200190611394929190611f27565b505050565b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061146457507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80611474575061147382611740565b5b9050919050565b6114868383836117aa565b505050565b505050565b60006114b18473ffffffffffffffffffffffffffffffffffffffff166118be565b1561161a578373ffffffffffffffffffffffffffffffffffffffff1663150b7a026114da610bc2565b8786866040518563ffffffff1660e01b81526004016114fc94939291906130f0565b602060405180830381600087803b15801561151657600080fd5b505af192505050801561154757506040513d601f19601f820116820180604052508101906115449190613151565b60015b6115ca573d8060008114611577576040519150601f19603f3d011682016040523d82523d6000602084013e61157c565b606091505b506000815114156115c2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115b990612ef7565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061161f565b600190505b949350505050565b606060405180602001604052806000815250905090565b606061164982610b56565b611688576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161167f906131f0565b60405180910390fd5b6000611692611627565b905060008151116116b257604051806020016040528060008152506116dd565b806116bc846118e1565b6040516020016116cd929190612fe5565b6040516020818303038152906040525b915050919050565b6116ef8383611a42565b6116fc6000848484611490565b61173b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161173290612ef7565b60405180910390fd5b505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b6117b5838383611c1c565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156117f8576117f381611c21565b611837565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614611836576118358382611c6a565b5b5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141561187a5761187581611dd7565b6118b9565b8273ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16146118b8576118b78282611ea8565b5b5b505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b60606000821415611929576040518060400160405280600181526020017f30000000000000000000000000000000000000000000000000000000000000008152509050611a3d565b600082905060005b6000821461195b57808061194490613210565b915050600a826119549190613288565b9150611931565b60008167ffffffffffffffff8111156119775761197661239f565b5b6040519080825280601f01601f1916602001820160405280156119a95781602001600182028036833780820191505090505b5090505b60008514611a36576001826119c29190612d8f565b9150600a856119d191906132b9565b60306119dd9190612dc3565b60f81b8183815181106119f3576119f2612a57565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600a85611a2f9190613288565b94506119ad565b8093505050505b919050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611ab2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611aa990613336565b60405180910390fd5b611abb81610b56565b15611afb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611af2906133a2565b60405180910390fd5b611b076000838361147b565b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611b579190612dc3565b92505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4611c186000838361148b565b5050565b505050565b6008805490506009600083815260200190815260200160002081905550600881908060018154018082558091505060019003906000526020600020016000909190919091505550565b60006001611c778461083c565b611c819190612d8f565b9050600060076000848152602001908152602001600020549050818114611d66576000600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002054905080600660008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600084815260200190815260200160002081905550816007600083815260200190815260200160002081905550505b6007600084815260200190815260200160002060009055600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008381526020019081526020016000206000905550505050565b60006001600880549050611deb9190612d8f565b9050600060096000848152602001908152602001600020549050600060088381548110611e1b57611e1a612a57565b5b906000526020600020015490508060088381548110611e3d57611e3c612a57565b5b906000526020600020018190555081600960008381526020019081526020016000208190555060096000858152602001908152602001600020600090556008805480611e8c57611e8b6133c2565b5b6001900381819060005260206000200160009055905550505050565b6000611eb38361083c565b905081600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600083815260200190815260200160002081905550806007600084815260200190815260200160002081905550505050565b828054611f33906126b9565b90600052602060002090601f016020900481019282611f555760008555611f9c565b82601f10611f6e57805160ff1916838001178555611f9c565b82800160010185558215611f9c579182015b82811115611f9b578251825591602001919060010190611f80565b5b509050611fa99190611fad565b5090565b5b80821115611fc6576000816000905550600101611fae565b5090565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61201381611fde565b811461201e57600080fd5b50565b6000813590506120308161200a565b92915050565b60006020828403121561204c5761204b611fd4565b5b600061205a84828501612021565b91505092915050565b60008115159050919050565b61207881612063565b82525050565b6000602082019050612093600083018461206f565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156120d35780820151818401526020810190506120b8565b838111156120e2576000848401525b50505050565b6000601f19601f8301169050919050565b600061210482612099565b61210e81856120a4565b935061211e8185602086016120b5565b612127816120e8565b840191505092915050565b6000602082019050818103600083015261214c81846120f9565b905092915050565b6000819050919050565b61216781612154565b811461217257600080fd5b50565b6000813590506121848161215e565b92915050565b6000602082840312156121a05761219f611fd4565b5b60006121ae84828501612175565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006121e2826121b7565b9050919050565b6121f2816121d7565b82525050565b600060208201905061220d60008301846121e9565b92915050565b61221c816121d7565b811461222757600080fd5b50565b60008135905061223981612213565b92915050565b6000806040838503121561225657612255611fd4565b5b60006122648582860161222a565b925050602061227585828601612175565b9150509250929050565b61228881612154565b82525050565b60006020820190506122a3600083018461227f565b92915050565b6000806000606084860312156122c2576122c1611fd4565b5b60006122d08682870161222a565b93505060206122e18682870161222a565b92505060406122f286828701612175565b9150509250925092565b60006020828403121561231257612311611fd4565b5b60006123208482850161222a565b91505092915050565b61233281612063565b811461233d57600080fd5b50565b60008135905061234f81612329565b92915050565b6000806040838503121561236c5761236b611fd4565b5b600061237a8582860161222a565b925050602061238b85828601612340565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6123d7826120e8565b810181811067ffffffffffffffff821117156123f6576123f561239f565b5b80604052505050565b6000612409611fca565b905061241582826123ce565b919050565b600067ffffffffffffffff8211156124355761243461239f565b5b61243e826120e8565b9050602081019050919050565b82818337600083830152505050565b600061246d6124688461241a565b6123ff565b9050828152602081018484840111156124895761248861239a565b5b61249484828561244b565b509392505050565b600082601f8301126124b1576124b0612395565b5b81356124c184826020860161245a565b91505092915050565b600080600080608085870312156124e4576124e3611fd4565b5b60006124f28782880161222a565b94505060206125038782880161222a565b935050604061251487828801612175565b925050606085013567ffffffffffffffff81111561253557612534611fd9565b5b6125418782880161249c565b91505092959194509250565b6000806040838503121561256457612563611fd4565b5b60006125728582860161222a565b92505060206125838582860161222a565b9150509250929050565b600067ffffffffffffffff8211156125a8576125a761239f565b5b6125b1826120e8565b9050602081019050919050565b60006125d16125cc8461258d565b6123ff565b9050828152602081018484840111156125ed576125ec61239a565b5b6125f884828561244b565b509392505050565b600082601f83011261261557612614612395565b5b81356126258482602086016125be565b91505092915050565b6000806040838503121561264557612644611fd4565b5b60006126538582860161222a565b925050602083013567ffffffffffffffff81111561267457612673611fd9565b5b61268085828601612600565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806126d157607f821691505b602082108114156126e5576126e461268a565b5b50919050565b7f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b6000612747602c836120a4565b9150612752826126eb565b604082019050919050565b600060208201905081810360008301526127768161273a565b9050919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b60006127d96021836120a4565b91506127e48261277d565b604082019050919050565b60006020820190508181036000830152612808816127cc565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760008201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000602082015250565b600061286b6038836120a4565b91506128768261280f565b604082019050919050565b6000602082019050818103600083015261289a8161285e565b9050919050565b7f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60008201527f776e6572206e6f7220617070726f766564000000000000000000000000000000602082015250565b60006128fd6031836120a4565b9150612908826128a1565b604082019050919050565b6000602082019050818103600083015261292c816128f0565b9050919050565b7f455243373231456e756d657261626c653a206f776e657220696e646578206f7560008201527f74206f6620626f756e6473000000000000000000000000000000000000000000602082015250565b600061298f602b836120a4565b915061299a82612933565b604082019050919050565b600060208201905081810360008301526129be81612982565b9050919050565b7f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60008201527f7574206f6620626f756e64730000000000000000000000000000000000000000602082015250565b6000612a21602c836120a4565b9150612a2c826129c5565b604082019050919050565b60006020820190508181036000830152612a5081612a14565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460008201527f656e7420746f6b656e0000000000000000000000000000000000000000000000602082015250565b6000612ae26029836120a4565b9150612aed82612a86565b604082019050919050565b60006020820190508181036000830152612b1181612ad5565b9050919050565b7f4552433732313a2062616c616e636520717565727920666f7220746865207a6560008201527f726f206164647265737300000000000000000000000000000000000000000000602082015250565b6000612b74602a836120a4565b9150612b7f82612b18565b604082019050919050565b60006020820190508181036000830152612ba381612b67565b9050919050565b7f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860008201527f697374656e7420746f6b656e0000000000000000000000000000000000000000602082015250565b6000612c06602c836120a4565b9150612c1182612baa565b604082019050919050565b60006020820190508181036000830152612c3581612bf9565b9050919050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b6000612c986025836120a4565b9150612ca382612c3c565b604082019050919050565b60006020820190508181036000830152612cc781612c8b565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000612d2a6024836120a4565b9150612d3582612cce565b604082019050919050565b60006020820190508181036000830152612d5981612d1d565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000612d9a82612154565b9150612da583612154565b925082821015612db857612db7612d60565b5b828203905092915050565b6000612dce82612154565b9150612dd983612154565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115612e0e57612e0d612d60565b5b828201905092915050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b6000612e4f6019836120a4565b9150612e5a82612e19565b602082019050919050565b60006020820190508181036000830152612e7e81612e42565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b6000612ee16032836120a4565b9150612eec82612e85565b604082019050919050565b60006020820190508181036000830152612f1081612ed4565b9050919050565b7f45524337323155524953746f726167653a2055524920717565727920666f722060008201527f6e6f6e6578697374656e7420746f6b656e000000000000000000000000000000602082015250565b6000612f736031836120a4565b9150612f7e82612f17565b604082019050919050565b60006020820190508181036000830152612fa281612f66565b9050919050565b600081905092915050565b6000612fbf82612099565b612fc98185612fa9565b9350612fd98185602086016120b5565b80840191505092915050565b6000612ff18285612fb4565b9150612ffd8284612fb4565b91508190509392505050565b7f45524337323155524953746f726167653a2055524920736574206f66206e6f6e60008201527f6578697374656e7420746f6b656e000000000000000000000000000000000000602082015250565b6000613065602e836120a4565b915061307082613009565b604082019050919050565b6000602082019050818103600083015261309481613058565b9050919050565b600081519050919050565b600082825260208201905092915050565b60006130c28261309b565b6130cc81856130a6565b93506130dc8185602086016120b5565b6130e5816120e8565b840191505092915050565b600060808201905061310560008301876121e9565b61311260208301866121e9565b61311f604083018561227f565b818103606083015261313181846130b7565b905095945050505050565b60008151905061314b8161200a565b92915050565b60006020828403121561316757613166611fd4565b5b60006131758482850161313c565b91505092915050565b7f4552433732314d657461646174613a2055524920717565727920666f72206e6f60008201527f6e6578697374656e7420746f6b656e0000000000000000000000000000000000602082015250565b60006131da602f836120a4565b91506131e58261317e565b604082019050919050565b60006020820190508181036000830152613209816131cd565b9050919050565b600061321b82612154565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561324e5761324d612d60565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b600061329382612154565b915061329e83612154565b9250826132ae576132ad613259565b5b828204905092915050565b60006132c482612154565b91506132cf83612154565b9250826132df576132de613259565b5b828206905092915050565b7f4552433732313a206d696e7420746f20746865207a65726f2061646472657373600082015250565b60006133206020836120a4565b915061332b826132ea565b602082019050919050565b6000602082019050818103600083015261334f81613313565b9050919050565b7f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000600082015250565b600061338c601c836120a4565b915061339782613356565b602082019050919050565b600060208201905081810360008301526133bb8161337f565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fdfea264697066735822122076e68599f1535e4c9f173396a5097198f5b493b5dca3c0d365d18dc2277cab3664736f6c63430008090033";

type OpenNFTsV0ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OpenNFTsV0ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OpenNFTsV0__factory extends ContractFactory {
  constructor(...args: OpenNFTsV0ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "OpenNFTsV0";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<OpenNFTsV0> {
    return super.deploy(overrides || {}) as Promise<OpenNFTsV0>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): OpenNFTsV0 {
    return super.attach(address) as OpenNFTsV0;
  }
  connect(signer: Signer): OpenNFTsV0__factory {
    return super.connect(signer) as OpenNFTsV0__factory;
  }
  static readonly contractName: "OpenNFTsV0";
  public readonly contractName: "OpenNFTsV0";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OpenNFTsV0Interface {
    return new utils.Interface(_abi) as OpenNFTsV0Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OpenNFTsV0 {
    return new Contract(address, _abi, signerOrProvider) as OpenNFTsV0;
  }
}