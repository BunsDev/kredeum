const KRM = {};

KRM.ADDRESS = {
  goerli: "0x1DbE15fa2fC6EA344dbf506f352f31D91408d172",
  mumbai: "0x494e39873F097cda05257975bCb3B49Ee4e072F0"
};
KRM.ABI = [
  { type: "constructor", stateMutability: "nonpayable", inputs: [] },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { type: "address", name: "owner", internalType: "address", indexed: true },
      { type: "address", name: "spender", internalType: "address", indexed: true },
      { type: "uint256", name: "value", internalType: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { type: "address", name: "previousOwner", internalType: "address", indexed: true },
      { type: "address", name: "newOwner", internalType: "address", indexed: true }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { type: "address", name: "from", internalType: "address", indexed: true },
      { type: "address", name: "to", internalType: "address", indexed: true },
      { type: "uint256", name: "value", internalType: "uint256", indexed: false }
    ],
    anonymous: false
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "allowance",
    inputs: [
      { type: "address", name: "owner", internalType: "address" },
      { type: "address", name: "spender", internalType: "address" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "approve",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "balanceOf",
    inputs: [{ type: "address", name: "account", internalType: "address" }]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "burn",
    inputs: [{ type: "uint256", name: "amount", internalType: "uint256" }]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "burnFrom",
    inputs: [
      { type: "address", name: "account", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint8", name: "", internalType: "uint8" }],
    name: "decimals",
    inputs: []
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "decreaseAllowance",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "subtractedValue", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "increaseAllowance",
    inputs: [
      { type: "address", name: "spender", internalType: "address" },
      { type: "uint256", name: "addedValue", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "mint",
    inputs: [
      { type: "address", name: "to", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "string", name: "", internalType: "string" }],
    name: "name",
    inputs: []
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "owner",
    inputs: []
  },
  { type: "function", stateMutability: "nonpayable", outputs: [], name: "renounceOwnership", inputs: [] },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "string", name: "", internalType: "string" }],
    name: "symbol",
    inputs: []
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "totalSupply",
    inputs: []
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "transfer",
    inputs: [
      { type: "address", name: "recipient", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [{ type: "bool", name: "", internalType: "bool" }],
    name: "transferFrom",
    inputs: [
      { type: "address", name: "sender", internalType: "address" },
      { type: "address", name: "recipient", internalType: "address" },
      { type: "uint256", name: "amount", internalType: "uint256" }
    ]
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferOwnership",
    inputs: [{ type: "address", name: "newOwner", internalType: "address" }]
  }
];

export default KRM;