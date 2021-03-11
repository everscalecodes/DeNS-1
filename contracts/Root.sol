pragma ton-solidity ^0.37.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "./Auction.sol";
import "./Certificate.sol";
import "./interfaces/IRootAuction.sol";
import "./interfaces/IRootManagement.sol";
import "./utils/Stash.sol";
import "./interfaces/IRoot.sol";

/**
 * ██████╗         ███╗   ██╗███████╗
 * ██╔══██╗███████╗████╗  ██║██╔════╝
 * ██║  ██║██▄▄▄██║██╔██╗ ██║███████╗
 * ██║  ██║██╔════╝██║╚██╗██║╚════██║
 * ██████╔╝███████╗██║ ╚████║███████║
 * ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚══════╝
 * Decentralized Name Service
 *
 * Error codes
 *     100 - Method for the owner only
 *     101 - Method for the manager only
 *     102 - Manager address cannot be null
 *     103 - Invalid name
 *     104 - Method available with only 1 ton
 *     105 - Invalid number of periods
 *     106 - Certificate only method
 *     107 - Auction only method
 *     108 - Too early to create an auction
 *
 *     200 - Hash doesn't exist
 *     201 - Hash received from the wrong address
 */
contract Root is Stash, IRoot, IRootManagement, IRootAuction {
    /*************
     * CONSTANTS *
     *************/
    uint256 private constant DEFAULT = 0x0000111122223333444455556666777788889999AAAABBBBCCCCDDDDEEEEFFFF;



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

    modifier onlyOwner {
        require(msg.pubkey() == tvm.pubkey(), 100, "Method for the owner only");
        _;
    }

    modifier onlyManager {
        require(msg.sender == _manager, 101, "Method for the manager only");
        _;
    }

    modifier managerIsNotNull(address manager) {
        require(manager != address(0), 102, "Manager address cannot be null");
        _;
    }

    modifier nameIsValid(string name) {
        require(_nameIsValid(name), 103, "Invalid name");
        _;
    }

    modifier oneTon() {
        require(msg.value == 1 ton, 104, "Method available with only 1 ton");
        _;
    }

    modifier periodsIsValid(uint8 periods) {
        require(periods >= 1 && periods <= 4, 105, "Invalid number of periods");
        _;
    }

    modifier onlyCertificate(string name) {
        require(msg.sender == resolve(name), 106, "Certificate only method");
        _;
    }

    modifier onlyAuction(string name) {
        require(msg.sender == resolveAuction(name), 107, "Auction only method");
        _;
    }

    modifier canBePutUpForAuction(uint32 expirationTime) {
        require(now >= (int256(expirationTime) - _certificateAuctionPeriod), 108, "Too early to create an auction");
        _;
    }



    /***************
     * CONSTRUCTOR *
     ***************/
    /**
     * certificateCode ............... Code of certificate.
     * certificateDuration ........... Minimum period duration in seconds for which the certificate is issued.
     * certificateProlongationPeriod . Duration of the period in seconds,
     *                                 during which the owner can prolong the certificate..
     * certificateAuctionPeriod ...... Length of the period in seconds, before the certificate expires,
     *                                 during which someone can create an auction.
     * certificateCheckLeapYear ...... If true, adds a day to certificate expiration date in leap year.
     * auctionCode ................... Code of auction.
     * auctionBidsDuration ........... The minimum duration of the auction in seconds.
     * auctionSubmittingDuration ..... Duration of period, in seconds, during which users can pay value.
     * auctionFinishDuration ......... Duration of period, in seconds, during which users can complete auction.
     * manager ....................... Contract that governs this contract.
     * names ......................... UTF8-encoded names.
     */
    constructor(
        TvmCell  certificateCode,
        uint32   certificateDuration,
        uint32   certificateProlongationPeriod,
        uint32   certificateAuctionPeriod,
        bool     certificateCheckLeapYear,
        TvmCell  auctionCode,
        uint32   auctionBidsDuration,
        uint32   auctionSubmittingDuration,
        uint32   auctionFinishDuration,
        address  manager,
        string[] names
    )
        public onlyOwner managerIsNotNull(manager) accept
    {
        _certificateCode = certificateCode;
        _certificateDuration = certificateDuration;
        _certificateProlongationPeriod = certificateProlongationPeriod;
        _certificateAuctionPeriod = certificateAuctionPeriod;
        _certificateCheckLeapYear = certificateCheckLeapYear;
        _auctionCode = auctionCode;
        _auctionBidsDuration = auctionBidsDuration;
        _auctionSubmittingDuration = auctionSubmittingDuration;
        _auctionFinishDuration = auctionFinishDuration;
        _manager = manager;

        if (_namesIsValid(names))
            _deployDefinedCertificates(names);

        _versionHistory.push(now);
    }



    /***************************
     * EXTERNAL * ONLY MANAGER *
     ***************************/
    /**
     * Manager can change manager address to another.
     * manager . contract that governs this contract.
     */
    function changeManager(address manager) external override onlyManager managerIsNotNull(manager) accept {
        _manager = manager;
    }

    /**
     * Manager can upgrade auction code.
     * code . New version of contract code.
     */
    function upgrade(TvmCell code) external override onlyManager accept {
        tvm.setcode(code);
        tvm.setCurrentCode(code);
        onCodeUpgrade();
    }

    /**
     * Manager can create new certificate bypassing an auction.
     * name ........... Name of the certificate.
     * expirationTime . Expiration time of the certificate. Unix timestamp in seconds.
     * price .......... Price of the certificate. Used for prolongation.
     */
    function createCertificate(string name, uint32 expirationTime, uint128 price)
        external
        override
        onlyManager
        accept
        nameIsValid(name)
    {
        _deployCertificate(name, msg.sender, DEFAULT, expirationTime, price);
    }

    /**
     * Manager can prolong certificate which were created by the manager.
     * name ........... Name of the certificate.
     * expirationTime . Expiration time of the certificate. Unix timestamp in seconds.
     */
    function prolongCertificate(string name, uint32 expirationTime) external override onlyManager accept {
        address certificateAddress = resolve(name);
        Certificate(certificateAddress).prolong(expirationTime);
    }



    /***************************
     * EXTERNAL * ONLY AUCTION *
     ***************************/
    function auctionComplete(
        string  name,
        uint8   periods,
        address addr,
        uint128 price,
        bool    needToCreate
    )
        external override onlyAuction(name)
    {
        if (needToCreate)
            _deployCertificate(name, addr, DEFAULT, periods * _certificateDuration, price);
        else {
            address certificateAddress = resolve(name);
            Certificate(certificateAddress).renew(addr, DEFAULT, periods * _certificateDuration, price);
        }
    }



    /**********
     * PUBLIC *
     **********/
    /**
     * Anyone can register a certificate.
     * name .... Name of the certificate.
     * periods . The number of periods for which the certificate is registered. Minimum is 0, maximum is 4.
     *           The duration of the period is determined by the parameters:
     *           _certificateDuration and _certificateCheckLeapYear.
     * bid ..... Hash of bid. tvm.hash(uint128 value, uint256 salt)
     */
    function registerName(
        string  name,
        uint8   periods,
        uint256 bid
    )
        public oneTon nameIsValid(name) periodsIsValid(periods)
    {
        address certificateAddress = resolve(name);
        uint128 hash = _stash(certificateAddress, msg.sender, name, periods, bid);
        Certificate(certificateAddress).receiveRegistrationInfo{
            value: 0,
            bounce: true,
            flag: 64,
            callback: onReceiveRegistrationInfo
        }(
            hash
        );
    }

        ////////////////////////////////////////////////////
        // Certificate.receiveRegistrationInfo() onBounce //
        ////////////////////////////////////////////////////
        onBounce(TvmSlice slice) external {
            uint32 functionId = slice.decode(uint32);
            if (functionId == tvm.functionId(Certificate.receiveRegistrationInfo)) {
                slice.decode(uint32);
                uint128 hash = slice.decode(uint128);
                onReceiveRegistrationInfo(hash, 0);
            }
        }

        ////////////////////////////////////////////////////
        // Certificate.receiveRegistrationInfo() callback //
        ////////////////////////////////////////////////////
        function onReceiveRegistrationInfo(uint128 rHash, uint32  expirationTime)
            public
            hashExists(rHash)
            validHashSource(rHash)
            canBePutUpForAuction(expirationTime)
        {
            AuctionParameters parameters = _unpack(rHash);

            //////////////////////////////////////////////////////////////////////////////////////
            // Deployment. If the auction has already deployed, the transaction will be aborted //
            //////////////////////////////////////////////////////////////////////////////////////
            address auctionAddress = new Auction{
                code: _auctionCode,
                value: 0.2 ton,
                pubkey: tvm.pubkey(),
                varInit: {
                    _name: parameters.name,
                    _root: address(this)
                }
            }(_auctionBidsDuration, _auctionSubmittingDuration, _auctionFinishDuration);

            //////////////////////////////////////////////////////////////////////////////////////////////
            // If the auction has already started and has not finished, the transaction will be aborted //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            // If number of periods is not equal to the number of auction periods, the transaction will be aborted //
            /////////////////////////////////////////////////////////////////////////////////////////////////////////
            Auction(auctionAddress).bid{value: 0.6 ton}(
                parameters.sender,
                parameters.periods,
                parameters.bid,
                expirationTime > 0
            );
        }



    /***********
     * GETTERS *
     ***********/
    function getSettings()
        public
        view
        returns (
            TvmCell certificateCode,
            uint32  certificateDuration,
            uint32  certificateProlongationPeriod,
            uint32  certificateAuctionPeriod,
            bool    certificateCheckLeapYear,
            TvmCell auctionCode,
            uint32  auctionBidsDuration,
            uint32  auctionSubmittingDuration,
            uint32  auctionFinishDuration
        )
    {
        return (
            _certificateCode,
            _certificateDuration,
            _certificateProlongationPeriod,
            _certificateAuctionPeriod,
            _certificateCheckLeapYear,
            _auctionCode,
            _auctionBidsDuration,
            _auctionSubmittingDuration,
            _auctionFinishDuration
        );
    }

    function getPublicKey() public view returns (uint256 publicKey) {
        return tvm.pubkey();
    }

    function getManager() public view returns (address manager) {
        return _manager;
    }

    function getVersionHistory() public view returns (uint32[] versionHistory) {
        return _versionHistory;
    }

    function resolve(string name) override public view returns (address addr) {
        TvmCell stateInit = tvm.buildStateInit({
            contr: Certificate,
            varInit: {
                _name: name,
                _root: address(this)
            },
            pubkey: tvm.pubkey(),
            code: _certificateCode
        });
        return address(tvm.hash(stateInit));
    }

    function resolveAuction(string name) override public view returns (address addr) {
        TvmCell stateInit = tvm.buildStateInit({
            contr: Auction,
            varInit: {
                _name: name,
                _root: address(this)
            },
            pubkey: tvm.pubkey(),
            code: _auctionCode
        });
        return address(tvm.hash(stateInit));
    }



    /***********
     * PRIVATE *
     ***********/
    /**
     * Called once and prevents the constructor from being called with an unpredictable result.
     * Returns false if name length == 0 or name length > 255 or name contains invalid characters.
     * Examples:
     *     _validateLengths(['',  '1234']) // false
     *     _validateLengths(['.', '1234']) // false
     *     _validateLengths(['/', '1234']) // false
     *     _validateLengths(['1234', '5']) // true
     */
    function _namesIsValid(string[] names) private pure returns (bool) {
        for (uint8 i = 0; i < names.length; i++)
            if (!_nameIsValid(names[i]))
                return false;
        return true;
    }

    /**
     * Returns true if string contains any UTF-8 encoded string except for a dot "." and forward slash "/".
     * Examples:
     *     _validateCharacters('1.34') // false
     *     _validateCharacters('1/34') // false
     *     _validateCharacters('1234') // true
     */
    function _nameIsValid(string name) private pure returns (bool) {
        if (name.byteLength() < 1 || name.byteLength() > 0xFF)
            return false;

        TvmSlice slice = name.toSlice();
        uint16 bytesCount;
        uint8 character;
        bool runAgain;
        do {
            bytesCount = slice.bits() >> 3;
            for (uint8 i = 0; i < bytesCount; i++) {
                character = slice.decode(uint8);
                if (
                    character == 0x2E || // "."
                    character == 0x2F    // "/"
                )
                    return false;
            }
            if (slice.refs() > 0)
                slice = slice.loadRef().toSlice();
            else
                runAgain = false;
        } while(runAgain);
        return true;
    }

    function _deployDefinedCertificates(string[] names) private {
        address manager = _manager;
        for (uint16 i = 0; i < names.length; i++)
            _deployCertificate(names[i], manager, DEFAULT, 0xFFFFFFFF, 0);
    }

    function _deployCertificate(
        string  name,
        address manager,
        uint256 owner,
        uint32  expirationTime,
        uint128 price
    )
        private
    {
        new Certificate{
            code: _certificateCode,
            value: 0.4 ton,
            pubkey: tvm.pubkey(),
            varInit: {
                _name: name,
                _root: address(this)
            }
        }(manager,owner, expirationTime, price);
    }



    /*****************************
     * PRIVATE * ON CODE UPGRADE *
     *****************************/
    function onCodeUpgrade() private pure {}
}