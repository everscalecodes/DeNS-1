pragma ton-solidity ^0.37.0;

interface ICertificateManagement {
    function setAddress(uint16 key, address addr) external;
    function removeAddress(uint16 key) external;
    function changeManager(address manager) external;
    function changeOwner(uint256 owner) external;
    function lock(uint32 expirationTime) external;
    function unlock() external;
}