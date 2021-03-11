pragma ton-solidity ^0.37.0;

interface IRootAuction {
    function auctionComplete(string name, uint8 periods, address addr, uint128 price, bool needToCreate) external;
}