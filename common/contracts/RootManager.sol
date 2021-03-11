pragma ton-solidity ^0.37.0;

import "../../contracts/interfaces/IRootManagement.sol";

/**
 * Error codes
 *     100 - Method for the owner only
 */
contract RootManager {
    /*************
     * VARIABLES *
     *************/
    address private _root;



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



    /***************
     * CONSTRUCTOR *
     ***************/
    constructor(address root) public accept {
        _root = root;
    }



    /***********************
     * PUBLIC * ONLY OWNER *
     ***********************/
    function changeManager(address manager) public view onlyOwner accept {
        IRootManagement(_root).changeManager{value: 1e9}(manager);
    }

    function upgrade(TvmCell code) public view onlyOwner accept {
        IRootManagement(_root).upgrade{value: 1e9}(code);
    }

    function createCertificate(string name, uint32 expirationTime, uint128 price) public view onlyOwner accept {
        IRootManagement(_root).createCertificate{value: 1e9}(name, expirationTime, price);
    }

    function prolongCertificate(string name, uint32 expirationTime) public view onlyOwner accept {
        IRootManagement(_root).prolongCertificate{value: 1e9}(name, expirationTime);
    }
}