// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/ICloneFactory.sol";
import "./interfaces/IContractProbe.sol";

/// @title Clone Factory
/// @notice
contract CloneFactory is ICloneFactory, Ownable {
  /// @notice implementations : template or clone contracts
  address[] public implementations;

  /// @notice template : template contract to be cloned
  address public template;

  /// @notice contract probe address
  address public contractProbe;

  /// @notice templates : list template "parent" contract of each clone
  mapping(address => address) public templates;

  /// @notice NewImplementation : new template or new clone
  /// @dev if implementation and template equal
  /// @dev then implementation is a template
  /// @dev else implementation is a clone
  event NewImplementation(
    address indexed implementation,
    address indexed template,
    address indexed creator
  );

  /// @notice NewTemplate : new template
  event NewTemplate(address indexed template, address indexed creator);

  /// @notice SET contractProbe Address
  /// @param  addr : contractProbe smartcontract address
  function setContractProbe(address addr) external override(ICloneFactory) onlyOwner {
    contractProbe = addr;
  }

  /// @notice ADD Implementation onlyOwner
  /// @param  addr : smartcontract address of candidate implementation
  function addImplementation(address addr) public override(ICloneFactory) onlyOwner {
    (bool isImplementation, address forwardTo) = _probe(addr);
    require(!isImplementation, "Implementation already exists");

    _addImplementation(addr, forwardTo);
  }

  /// @notice SET default Template to be cloned
  /// @param addr : smartcontract address of candidate template
  function setDefaultTemplate(address addr) public override(ICloneFactory) onlyOwner {
    /// @notice probe addr
    (bool isImplementation, address forwardTo) = _probe(addr);
    require((forwardTo == addr), "Template is a Clone");

    /// @notice addr not already registered as an implementation, so add it
    if (!isImplementation) addImplementation(addr);

    /// @notice set addr as default template
    template = addr;

    /// @notice emit event NewTemplate
    emit NewTemplate(addr, msg.sender);
  }

  /// @notice Implementations count
  /// @return count : Number of implementations
  function implementationsCount() public view override(ICloneFactory) returns (uint256 count) {
    return implementations.length;
  }

  /// @notice ADD Implementation internal
  /// @param  impl : implementation address
  /// @param  tmpl : template address
  function _addImplementation(address impl, address tmpl) internal {
    /// @notice register implementation
    implementations.push(impl);

    /// @notice register template
    templates[impl] = tmpl;

    /// @notice emit event NewImplementation
    emit NewImplementation(impl, tmpl, msg.sender);
  }

  /// @notice Clone Template
  /// @param  addr : clone address
  function _clone() internal returns (address addr) {
    require(template != address(0), "Template doesn't exist");

    /// @notice clone template and get clone address
    addr = Clones.clone(template);

    /// @notice register clone as new implementation
    _addImplementation(addr, template);
  }

  /// @dev probe if address is contract and/or clone
  /// @param addr : probe address
  /// @notice revert if probe address is not contract
  /// @notice throws if forwardTo not found
  /// @return isImplementation : true if probe address is implemention
  /// @return forwardTo : parent template address if clone, probe address otherwise
  function _probe(address addr) internal view returns (bool isImplementation, address forwardTo) {
    bool isContract;
    (isContract, forwardTo) = IContractProbe(contractProbe).probe(addr);
    require(isContract, "Not a Contract");
    assert(forwardTo != address(0));

    isImplementation = (templates[addr] != address(0));
  }
}
