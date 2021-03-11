pragma ton-solidity ^0.37.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "./interfaces/IRootAuction.sol";
import "./interfaces/IAuction.sol";

/**
 * Error codes
 *     100 - Method for the root only
 *     101 - Invalid number of periods
 *     102 - Bid period is over
 *     103 - Submitting period is over
 *     104 - Finish period is over
 *     105 - Value is zero
 *     106 - Invalid hash
 *     107 - Invalid hash sender
 */
contract Auction is IAuction {
    /*************
     * STRUCTURES *
     *************/
    struct Winner {
        address addr;
        uint128 value;
    }



    /**********
     * STATIC *
     **********/
    string  static _name;
    address static _root;



    /*************
     * VARIABLES *
     *************/
    uint32 private _bidsDuration;
    uint32 private _submittingDuration;
    uint32 private _finishDuration;

    bool   private _finished;
    uint8  private _periods;
    uint32 private _bidsEndTime;
    uint32 private _submittingEndTime;
    uint32 private _finishTime;
    bool   private _needToCreate;
    mapping(uint256 => address) private _bids;

    Winner private _first;
    Winner private _second;



    /*************
     * MODIFIERS *
     *************/
    modifier accept {
        tvm.accept();
        _;
    }

    modifier onlyRoot() {
        require(msg.sender == _root, 100, "Method for the root only");
        _;
    }

    modifier periodsAreQqual(uint8 periods) {
        require(periods == _periods, 101, "Invalid number of periods");
        _;
    }

    modifier canBid() {
         require(now < _bidsEndTime, 102, "Bid period is over");
        _;
    }

    modifier canSubmit() {
         require(now >= _bidsEndTime && now < _submittingEndTime, 103, "Submitting period is over");
        _;
    }

    modifier canFinish() {
         require(!_finished && now >= _submittingEndTime && now < _finishTime, 104, "Finish period is over");
        _;
    }

    modifier notZeroValue() {
        require(msg.value > 0, 105, "Value is zero");
        _;
    }

    modifier hashExists(uint256 hash) {
        require(_bids.exists(hash), 106, "Invalid hash");
        _;
    }

    modifier hashSenderIsValid(address sender, uint256 hash) {
        require(_bids[hash] == sender, 107, "Invalid hash sender");
        _;
    }


    /***************************
     * CONSTRUCTOR * ONLY ROOT *
     ***************************/
    /**
     * bidsDuration ....... The minimum duration of the auction in seconds.
     * submittingDuration . Duration of period, in seconds, during which users can pay value.
     * finishDuration ..... Duration of period, in seconds, during which users can complete auction.
     */
    constructor(uint32 bidsDuration, uint32 submittingDuration, uint32 finishDuration) public onlyRoot accept {
        _bidsDuration = bidsDuration;
        _submittingDuration = submittingDuration;
        _finishDuration = finishDuration;
    }



    /************************
     * EXTERNAL * ONLY ROOT *
     ************************/
    function bid(address sender, uint8 periods, uint256 hash, bool needToCreate) external onlyRoot {
        ///////////////////////////////////////////////////////////////////
        // Restart if auction finished by user or time to finish is over //
        ///////////////////////////////////////////////////////////////////
        if (_finished || (_finishTime < now))
            _restartAuction(sender, periods, hash, needToCreate);
        else
            _bid(sender, periods, hash);
    }



    /**********
     * PUBLIC *
     **********/
    //////////////////////////////////////////////////////////
    // Participants confirm the bid with money.             //
    // If make it possible not to confirm the bid with      //
    // money, then the trolls will be able to do this:      //
    //                                                      //
    // 1. Bet on 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF         //
    // 2. Win the auction.                                  //
    // 3. Don't pay.                                        //
    //                                                      //
    // This makes it possible for anyone who wants to block //
    // any auction for just 1 crystal. It is unacceptable.  //
    //////////////////////////////////////////////////////////
    function submit(uint256 salt) public canSubmit notZeroValue {
        address sender = msg.sender;
        uint128 value = msg.value;

        TvmBuilder builder;
        builder.store(value);
        builder.store(salt);
        TvmCell cell = builder.toCell();
        uint256 bidHash = tvm.hash(cell);

        _submit(sender, value, bidHash);
    }

    //////////////////////////////////////////////////////
    // Anyone can finish auction if the auction has not //
    // finished yet and the finishing time has come.    //
    //////////////////////////////////////////////////////
    function finish() public canFinish {
        Winner first = _first;
        Winner second = _second;
        _sendGrams(second.addr, second.value);
        _sendGrams(first.addr, first.value - second.value);
        _finished = true;
        IRootAuction(_root).auctionComplete{value: 0, flag: 128}(
            _name,
            _periods,
            first.addr,
            second.value,
            _needToCreate
        );
    }



    /***********
     * GETTERS *
     ***********/
    function getInfo() override public view returns(
            bool    finished,
            uint8   periods,
            uint32  bidsEndTime,
            uint32  submittingEndTime,
            uint32  finishTime,
            address firstWinnerAddress,
            uint128 firstWinnerValue,
            address secondWinnerAddress,
            uint128 secondWinnerValue
        )
    {
        return (
            _finished,
            _periods,
            _bidsEndTime,
            _submittingEndTime,
            _finishTime,
            _first.addr,
            _first.value,
            _second.addr,
            _second.value
        );
    }



    /***********
     * PRIVATE *
     **********/
    function _restartAuction(address sender, uint8 periods, uint256 hash, bool needToCreate) private {
        _finished = false;
        _periods = periods;
        _bidsEndTime = now + _periods * _bidsDuration;
        _submittingEndTime = _bidsEndTime + _submittingDuration;
        _finishTime = _submittingEndTime + _finishDuration;
        _needToCreate = needToCreate;
        _bids.add(hash, sender);
        _first = Winner(address(0), 0);
        _second = Winner(address(0), 0);
    }

    function _bid(
        address sender,
        uint8   periods,
        uint256 hash
    )
        private periodsAreQqual(periods) canBid
    {
        _bids.add(hash, sender);
    }

    //////////////////////////////////////////////////////////
    // Participants who did not take the first two places   //
    // receive their bets back. Participants who finish in  //
    // the first two places receive money when the finish() //
    // is called.                                           //
    //////////////////////////////////////////////////////////
    function _submit(address sender, uint128 value, uint256 hash)
        private
        hashExists(hash)
        hashSenderIsValid(sender, hash)
    {
        delete _bids[hash];

        Winner first = _first;
        Winner second = _second;
        Winner newbie = Winner(sender, value);
        if (value > first.value) {
            _first = newbie;
            _second = first;
            _sendGrams(second.addr, second.value);
        } else if (value > first.value) {
            _second = Winner(sender, value);
            _sendGrams(second.addr, second.value);
        } else
            _sendGrams(newbie.addr, newbie.value);

        if (_bids.empty())
            finish();
    }

    function _sendGrams(address addr, uint128 value) private pure {
        if (value > 0)
            address(addr).transfer(value, false);
    }
}