pragma ton-solidity ^0.37.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "./interfaces/ICertificate.sol";
import "./interfaces/ICertificateManagement.sol";

/**
 * Error codes
 *     100 - Method for the owner or manager only
 *     101 - Method for the manager only
 *     102 - Method for the root only
 *     103 - Manager address cannot be null
 *     104 - Owner public key cannot be null
 *     105 - Invalid expiration time
 *     106 - Certificate expired
 *     107 - Manager locked
 *     108 - Invalid lock time
 */
contract Certificate is ICertificate, ICertificateManagement {
    /*************
     * CONSTANTS *
     *************/
    uint32 private constant MAX_LOCK_PERIOD = 2419200; // 4 weeks. Protect from endless locking.



    /**********
     * STATIC *
     **********/
    string  static _name;
    address static _root;



    /*************
     * VARIABLES *
     *************/
    address private _manager;
    uint256 private _owner;
    uint32  private _creationTime;
    uint32  private _expirationTime;
    uint32  private _managerUnlockTime;
    uint128 private _price;
    mapping(uint16 => address) private _addresses;



    /*************
     * MODIFIERS *
     *************/
    modifier accept {
        tvm.accept();
        _;
    }

    modifier onlyOwnerOrManager {
        require(msg.pubkey() == _owner || msg.sender == _manager, 100, "Method for the owner or manager only");
        _;
    }

    modifier onlyManager {
        require(msg.sender == _manager, 101, "Method for the manager only");
        _;
    }

    modifier onlyRoot() {
        require(msg.sender == _root, 102, "Method for the root only");
        _;
    }

    modifier managerIsNotNull(address manager) {
        require(manager != address(0), 103, "Manager address cannot be null");
        _;
    }

    modifier ownerIsNotNull(uint256 owner) {
        require(owner != 0, 104, "Owner public key cannot be null");
        _;
    }

    modifier expirationTimeIsValid(uint32 newExpirationTime) {
        require(newExpirationTime > _expirationTime, 105, "Invalid expiration time");
        _;
    }

    modifier notExpired() {
        require(_expirationTime > now, 106, "Certificate expired");
        _;
    }

    modifier unlocked() {
        require(_managerUnlockTime < now, 107, "Manager locked");
        _;
    }

    modifier unlockTimeIsValid(uint32 unlockTime) {
        require(unlockTime < (now + MAX_LOCK_PERIOD), 108, "Invalid lock time");
        _;
    }



    /***************************
     * CONSTRUCTOR * ONLY ROOT *
     ***************************/
    /**
     * manager ........ Contract that governs this contract.
     * owner .......... Owner public key.
     * expirationTime . Expiration time of the certificate. Unix timestamp in seconds.
     * price .......... Price of certificate at auction.
     */
    constructor(
        address manager,
        uint256 owner,
        uint32  expirationTime,
        uint128 price
    )
        public onlyRoot managerIsNotNull(manager) ownerIsNotNull(owner) accept
    {
        _manager = manager;
        _owner = owner;
        _creationTime = now;
        _expirationTime = expirationTime;
        _price = price;
    }



    /************************
     * EXTERNAL * ONLY ROOT *
     ************************/
    function receiveRegistrationInfo(uint128 hash) external onlyRoot view returns (
            uint128 rHash,
            uint32  expirationTime
        )
    {
        return{value: 0, bounce: false, flag: 64} (hash, _expirationTime);
    }

    function prolong(uint32 expirationTime) external onlyRoot expirationTimeIsValid(expirationTime) {
        _expirationTime = expirationTime;
    }

    function renew(
        address manager,
        uint256 owner,
        uint32  expirationTime,
        uint128 price
    )
        external onlyRoot
    {
        _manager = manager;
        _owner = owner;
        _expirationTime = expirationTime;
        _price = price;
        _managerUnlockTime = 0;
    }



    /************************************
     * EXTERNAL * ONLY OWNER OR MANAGER *
     ************************************/
    // TODO test
    function setAddress(uint16 key, address addr) external override onlyOwnerOrManager notExpired accept {
        _addresses[key] = addr;
    }

    // TODO test
    function removeAddress(uint16 key) external override onlyOwnerOrManager notExpired accept {
        if (_addresses.exists(key))
            delete _addresses[key];
    }

    // TODO test
    function changeManager(address manager)
        external
        override
        onlyOwnerOrManager
        notExpired
        unlocked
        managerIsNotNull(manager)
        accept
    {
        _manager = manager;
    }

    // TODO test
    function changeOwner(uint256 owner)
        external
        override
        onlyOwnerOrManager
        notExpired
        ownerIsNotNull(owner)
        accept
    {
        _owner = owner;
    }

    // TODO test
    function lock(uint32 unlockTime)
        external
        override
        onlyOwnerOrManager
        notExpired
        unlocked
        accept
    {
        _managerUnlockTime = unlockTime;
    }



    /***************************
     * EXTERNAL * ONLY MANAGER *
     ***************************/
    // TODO test
    function unlock() external override onlyManager notExpired accept {
        _managerUnlockTime = 0;
    }



    /************************
     * EXTERNAL * RECEIVERS *
     ************************/
    // TODO test
    function receiveAddress(uint16 key) external override view returns (address addr) {
        address result = _addresses.exists(key) ? _addresses[key] : address(0);
        return{value: 0, bounce: false, flag: 64} result;
    }

    // TODO test
    function whois() external override view returns (
            string  name,
            address root,
            address manager,
            uint256 owner,
            uint32  creationTime,
            uint32  expirationTime,
            uint32  managerUnlockTime,
            uint128 price
        )
    {
        return{value: 0, bounce: false, flag: 64} getWhois();
    }



    /***********
     * GETTERS *
     ***********/
    function getWhois() public view returns(
            string  name,
            address root,
            address manager,
            uint256 owner,
            uint32  creationTime,
            uint32  expirationTime,
            uint32  managerUnlockTime,
            uint128 price
        )
    {
        name = _name;
        root = _root;
        manager = _manager;
        owner = _owner;
        creationTime = _creationTime;
        expirationTime = _expirationTime;
        managerUnlockTime = _managerUnlockTime;
        price = _price;
    }
}