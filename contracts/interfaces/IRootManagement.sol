pragma ton-solidity ^0.37.0;

interface IRootManagement {
    function changeManager(address manager) external;
    function upgrade(TvmCell code) external;
    function createCertificate(string name, uint32 expirationTime, uint128 price) external;
    function prolongCertificate(string name, uint32 expirationTime) external;
}