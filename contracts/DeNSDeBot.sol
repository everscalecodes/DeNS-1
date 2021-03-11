pragma ton-solidity ^0.37.0;
pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "debot/itf/Menu.sol";
import "debot/itf/Terminal.sol";
import "debot/itf/Sdk.sol";
import "./debot/Debot.sol";
import "./interfaces/IRoot.sol";

/**
 * Error codes
 *     100 - Method for the owner only
 */
contract DeNSDeBot is Debot {
    /**************
     * VARIABLES *
     *************/
    address _rootAddress;
    string  _name;
    string  _certificateAddress;
    bool    _certificateExists;



    /*************
     * MODIFIERS *
     *************/
    modifier accept() {
        tvm.accept();
        _;
    }

    modifier onlyOwner() {
        require(tvm.pubkey() == msg.pubkey(), 100, "Method for the owner only");
        _;
    }



    /***************
     * CONSTRUCTOR *
     ***************/
    constructor(string deBotAbi, string targetAbi, address targetAddr) public onlyOwner accept {
        _rootAddress = targetAddr;
        init(DEBOT_ABI | DEBOT_TARGET_ABI | DEBOT_TARGET_ADDR, deBotAbi, targetAbi, targetAddr);
    }



    /**********
     * PUBLIC *
     **********/
    function start() public {
        Terminal.inputStr(tvm.functionId(inputCertificateName), "Input certificate name", false);
    }

    function inputCertificateName(string value) public {
        _name = value;
        optional(uint256) none;
        IRoot(_targetAddr).resolve{
            abiVer: 2,
            extMsg: true,
            callbackId: tvm.functionId(onRootResolve),
            onErrorId: 0,
            time: 0,
            expire: 0,
            sign: false,
            pubkey: none
        }(value);
    }

    function onRootResolve(address addr) public {
        _certificateAddress = addr;
        Sdk.getAccountType(tvm.functionId(getCertificateAccountType), _certificateAddress);
    }

    function getCertificateAccountType(int8 acc_type) public {
        _certificateExists = acc_type == 1;
    }



    /**************
     * DEPRECATED *
     **************/
    function fetch() public override returns (Context[] contexts) {}



    /***********
     * VERSION *
     ***********/
    function getVersion() override public returns (string name, uint24 semver) {
        name = "DeNS";
        semver = (1 << 16) | 0;
    }



    /********
     * QUIT *
     ********/
    function quit() override public accept {}
}