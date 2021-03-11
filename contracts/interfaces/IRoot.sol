pragma ton-solidity ^0.37.0;

interface IRoot {
    function resolve(string name) external view returns (address addr);
    function resolveAuction(string name) external view returns (address addr);
}