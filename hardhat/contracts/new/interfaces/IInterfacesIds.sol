// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IInterfacesIds {
    function ids() external pure returns (bytes4[] memory interfacesIds);
}