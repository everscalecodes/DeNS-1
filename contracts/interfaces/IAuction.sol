pragma ton-solidity ^0.37.0;

interface IAuction {
    function getInfo() external view returns(
            bool    finished,
            uint8   periods,
            uint32  bidsEndTime,
            uint32  submittingEndTime,
            uint32  finishTime,
            address firstWinnerAddress,
            uint128 firstWinnerValue,
            address secondWinnerAddress,
            uint128 secondWinnerValue
        );
}