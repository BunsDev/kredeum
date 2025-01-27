// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IOpenProof.sol";

contract OpenProof is ERC721, IOpenProof {
    using Counters for Counters.Counter;

    string private _tokenURI;
    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("Proof Of Something", "PROOF") {}

    function setTokenURI(string memory tokenURI_) public override(IOpenProof) {
        _tokenURI = tokenURI_;
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
