pragma ton-solidity ^0.37.0;

import "../../contracts/utils/Stash.sol";

/**
 * Error codes
 *     100 - Method for the manager only
 */
contract IdleV2 is Stash {
    /*************
     * VARIABLES *
     *************/
    TvmCell  private _certificateCode;
    uint32   private _certificateDuration;
    uint32   private _certificateProlongationPeriod;
    uint32   private _certificateAuctionPeriod;
    bool     private _certificateCheckLeapYear;
    TvmCell  private _auctionCode;
    uint32   private _auctionBidsDuration;
    uint32   private _auctionSubmittingDuration;
    uint32   private _auctionFinishDuration;
    address  private _manager;
    uint32[] private _versionHistory;



    /*************
     * MODIFIERS *
     *************/
    modifier accept {
        tvm.accept();
        _;
    }

    modifier onlyManager {
        require(msg.sender == _manager, 100, "Method for the manager only");
        _;
    }



    /***************************
     * EXTERNAL * ONLY MANAGER *
     ***************************/
    function upgrade(TvmCell code) external onlyManager accept {
        tvm.setcode(code);
        tvm.setCurrentCode(code);
        onCodeUpgrade();
    }



    /***********
     * GETTERS *
     ***********/
    function getVersionHistory() public view returns (uint32[] versionHistory) {
        return _versionHistory;
    }

    function isIdle() public pure returns (bool idle) {
        return true;
    }



    /*****************************
     * PRIVATE * ON CODE UPGRADE *
     *****************************/
    function onCodeUpgrade() private {
        _versionHistory.push(now);
    }
}