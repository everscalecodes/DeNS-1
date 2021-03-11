# Make
![make.png](images/covers/make.png)

## Script
All
```sh
yarn make
```

Separately
```sh
yarn make:core
yarn make:common
```

## Manually via console
Core
```sh
cd contracts
solc Auction.sol
solc Certificate.sol
solc Root.sol
solc DeNSDeBot.sol
tvm_linker compile Auction.code -o Auction.tvc
tvm_linker compile Certificate.code -o Certificate.tvc
tvm_linker compile Root.code -o Root.tvc
tvm_linker compile DeNSDeBot.code -o DeNSDeBot.tvc
tvm_linker decode --tvc Auction.tvc > Auction.decode
tvm_linker decode --tvc Certificate.tvc > Certificate.decode
tvm_linker decode --tvc Root.tvc > Root.decode
tvm_linker decode --tvc DeNSDeBot.tvc > DeNSDeBot.decode
```

Common contracts for test
```sh
cd common/contracts
solc IdleV2.sol
solc RootOwner.sol
tvm_linker compile IdleV2.code -o IdleV2.tvc
tvm_linker compile RootOwner.code -o RootOwner.tvc
tvm_linker decode --tvc IdleV2.tvc > IdleV2.decode
tvm_linker decode --tvc RootManager.tvc > RootManager.decode
tvm_linker decode --tvc SafeMultisigWallet.tvc > SafeMultisigWallet.decode
```