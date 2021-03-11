# Deploy
![deploy.png](images/covers/deploy.png)

## Local
```sh
yarn deploy:local
```

1. Deploy three wallets with 1000 crystals.
2. Save wallets keys into "keys" directory.
3. Deploy Root, RootManager DeNSDeBot.
4. Save RootManager keys into "keys" directory.
5. Output command for deBot.

Example
```sh
2021-03-10 18:05:23 [INFO]: Wallet 0:a5b98583ea5962b1ae557450d95efa77058927621410e718eb2fbdb5d86e8b26 
2021-03-10 18:05:23 [INFO]: Keys saved into keys/wallet0.json 
2021-03-10 18:05:24 [INFO]: Wallet 0:bafe1ac938cfbc9f9d94c446310e30167600ae0b63849afe62d510b104f3a430 
2021-03-10 18:05:24 [INFO]: Keys saved into keys/wallet1.json 
2021-03-10 18:05:24 [INFO]: Wallet 0:2a12101f80881addfcc694e2141e9f1d4ac5fd49f2a80e753f235c0e40627500 
2021-03-10 18:05:24 [INFO]: Keys saved into keys/wallet2.json 
2021-03-10 18:05:32 [INFO]: Root 0:2ae184747d88b1e791509c27266ea3b003bc3d1e0000a95a30c26bf77487dc1b 
2021-03-10 18:05:32 [INFO]: Root manager safeMultiSig 0:5831bc8068b486c2f70d4b9d75e23837f7f3dd343894db003fb412407091cd01 
2021-03-10 18:05:32 [INFO]: Root manager safeMultiSig keys saved into keys/root-manager.json 
2021-03-10 18:05:32 [INFO]: tonos-cli config --url http://localhost:8080 
2021-03-10 18:05:32 [INFO]: tonos-cli debot fetch 0:c66bf587afc63b923719b2927053ba4dc5895b3038f417ca21f0fc9300656341 
 
```