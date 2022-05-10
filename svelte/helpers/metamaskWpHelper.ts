import type { EthereumProvider } from "hardhat/types";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { get } from "svelte/store";

import { numberToHexString, getChecksumAddress, getNetwork, networks } from "../../common/lib/kconfig";

// import { refNft } from "helpers/urlHash";
import { metamaskChainId, metamaskAccount, metamaskProvider, metamaskSigner } from "main/metamaskWp";

let ethereumProvider: EthereumProvider;
let metamaskInstalled = false;

const metamaskConnectMessage = "Connect to Metamask";
const metamaskInstallMessage = "Please install MetaMask extension to connect";
const metamaskMultipleWallets = "Do you have multiple wallets installed?";

let targetChain = false;

const addEthereumChain = (_chainId: number): void => {
  if (_chainId) {
    console.log("addEthereumChain", _chainId);

    if (targetChain) {
      console.warn("Already connecting network...");
    }
    targetChain = true;

    // no need to add default ethereum chain
    if (_chainId !== 1) {
      const _network = getNetwork(_chainId);
      if (_network) {
        // EIP-3085 fields only or fails
        type EthereumChainParameter = {
          chainId: string;
          blockExplorerUrls?: string[];
          chainName?: string;
          iconUrls?: string[];
          nativeCurrency?: {
            name: string;
            symbol: string;
            decimals: number;
          };
          rpcUrls?: string[];
        };
        const params: EthereumChainParameter = {
          chainId: numberToHexString(_network.chainId),
          blockExplorerUrls: _network.blockExplorerUrls,
          chainName: _network.chainName,
          iconUrls: [],
          nativeCurrency: _network.nativeCurrency,
          rpcUrls: _network.rpcUrls
        };

        // add new chain to metamask
        ethereumProvider
          .request({
            method: "wallet_addEthereumChain",
            params: [params]
          })
          .catch((err) => console.error("Metamask ERROR wallet_addEthereumChain", err));
      }
    }
  }
};

const handleChainId = (_chainId: number): void => {
  console.log(`handleChainId ${_chainId}`);

  if (_chainId && _chainId != get(metamaskChainId)) {
    const _network = getNetwork(_chainId);

    if (_network) {
      // SAVE chainId in Svelte store $metamaskChainId
      metamaskChainId.set(Number(_network.chainId));
    } else {
      // chainId not accepted : switch to first accepted chainId
      wpMetamaskSwitchChain(networks[0].chainId);
    }
  }
};

const handleAccounts = (accounts: Array<string>): void => {
  console.log("handleAccounts", accounts);

  if (accounts?.length === 0) {
    wpMetamaskConnect();
  } else if (accounts[0] !== String(get(metamaskAccount))) {
    metamaskSigner.set(get(metamaskProvider).getSigner(0));
    metamaskAccount.set(getChecksumAddress(accounts[0]));
  }
};

const wpMetamaskSwitchChain = (_chainId: number): void => {
  console.log(`metamaskSwitchChain ${_chainId}`);

  if (_chainId > 0 && _chainId != Number(get(metamaskChainId))) {
    ethereumProvider
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHexString(_chainId) }]
      })
      .catch((err: { code: number }) => {
        if (err.code === 4902) {
          addEthereumChain(_chainId);
        }
      });
  }
};

const wpMetamaskConnect = (): void => {
  console.log("wpMetamaskConnect");

  ethereumProvider
    .request({
      method: "eth_requestAccounts"
    })
    .then(handleAccounts)
    .catch((err: { code: number }) => {
      if (err.code === 4001) {
        alert(metamaskConnectMessage);
      } else {
        console.error("Metamask ERROR eth_requestAccounts", err);
      }
    });
};

const wpMetamaskInit = async (): Promise<boolean> => {
  if (!get(metamaskChainId)) {
    console.log("metamaskInit");
    ethereumProvider = (await detectEthereumProvider()) as EthereumProvider;

    if (ethereumProvider) {
      metamaskInstalled = true;

      if (ethereumProvider !== window.ethereum) alert(metamaskMultipleWallets);

      const ethersProvider = new ethers.providers.Web3Provider(window.ethereum, "any");
      metamaskProvider.set(ethersProvider);

      let _chainId: number;
      try {
        // GET chainId from node connected to
        _chainId = (await ethereumProvider.request({ method: "eth_chainId" })) as number;
      } catch (err) {
        console.error("Metamask ERROR eth_chainId", err);
      }

      // IF chainId requested in url is different THEN switch chain on metamask
      // const _urlChainId = refNft().chainId;
      // if (_urlChainId > 0 && _urlChainId != _chainId) {
      //   _chainId = _urlChainId;
      //   metamaskSwitchChain(_urlChainId);
      // }
      handleChainId(Number(_chainId));

      try {
        const _accounts = (await ethereumProvider.request({ method: "eth_accounts" })) as Array<string>;
        handleAccounts(_accounts);
      } catch (err) {
        console.error("Metamask ERROR eth_accounts", err);
      }

      ethereumProvider.on("chainChanged", handleChainId);

      ethereumProvider.on("accountsChanged", handleAccounts);
    } else {
      console.log(metamaskInstallMessage);
    }
  }

  return metamaskInstalled;
};

export { wpMetamaskInit, wpMetamaskConnect, wpMetamaskSwitchChain, metamaskConnectMessage, metamaskInstallMessage };
