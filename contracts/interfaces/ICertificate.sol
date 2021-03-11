pragma ton-solidity ^0.37.0;

interface ICertificate {
    function receiveAddress(uint16 key) external view returns (address addr);
    function whois() external view returns (
        string  name,
        address root,
        address manager,
        uint256 owner,
        uint32  creationTime,
        uint32  expirationTime,
        uint32  managerUnlockTime,
        uint128 price
    );
}