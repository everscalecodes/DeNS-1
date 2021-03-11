pragma ton-solidity ^0.37.0;

/**
 * Stores the parameters of the auction, because parameters do not fit into body of bounced message.
 * Body of bounced message contains only first 256 bits. Workflow:
 * 1. Saving data.
 * 2. Sending message.
 * 3. Getting bounced message.
 * 4. Reading data from stash and delete data from stash.
 *
 * Error codes
 *     200 - Hash doesn't exist
 *     201 - Hash received from the wrong address
 */
contract Stash {
    /*************
     * STRUCTURES *
     *************/
    struct AuctionParameters {
        address certificateAddress;
        address sender;
        string  name;
        uint8   periods;
        uint256 bid;
    }



    /*************
     * VARIABLES *
     *************/
    mapping(uint128 => AuctionParameters) private _storage;



    /*************
     * MODIFIERS *
     *************/
    modifier hashExists(uint128 hash) {
        require(_storage.exists(hash), 200, "Hash doesn't exist");
        _;
    }

    modifier validHashSource(uint128 hash) {
        require(msg.sender == _storage[hash].certificateAddress, 201, "Hash received from the wrong address");
        _;
    }



    /************
     * INTERNAL *
     ************/
    function _stash(
        address certificateAddress,
        address sender,
        string name,
        uint8 periods,
        uint256 bid
    )
        internal returns(uint128 hash)
    {
        AuctionParameters parameters = AuctionParameters(certificateAddress, sender, name, periods, bid);
        TvmBuilder builder;
        builder.store(parameters);
        TvmCell cell = builder.toCell();
        hash = uint128(tvm.hash(cell) % (1 << 32));
        _storage.add(hash, parameters);
    }

    function _exists(uint128 hash) internal view returns(bool) {
        return _storage.exists(hash);
    }

    function _unpack(uint128 hash) internal returns(AuctionParameters parameters) {
        parameters = _storage[hash];
        delete _storage[hash];
    }
}