## Create workspace folder

```
mkdir pancake-swap-testnet
cd pancake-swap-testnet
```


## Preparing source

- Clone `pancake-swap-core`
```
git clone https://github.com/dariuszo/pancake-swap-core.git
cd pancake-swap-core
git checkout -b factory 3b214306770e86bc3a64e67c2b5bdb566b4e94a7
yarn install
yarn compile
cd ..
```

- Clone `pancake-swap-periphery`
```
git clone https://github.com/dariuszo/pancake-swap-periphery.git
cd pancake-swap-periphery
git checkout -b router d769a6d136b74fde82502ec2f9334acc1afc0732
yarn install
yarn add @uniswap/v2-core@"file:../pancake-swap-core"
yarn compile
cd ..
```

- Clone `pancake-swap-interface-v1`
```
git clone https://github.com/dariuszo/pancake-swap-interface-v1.git
cd pancake-swap-interface-v1
git checkout -b v1 0257017f2daaae2f67c24ded70b5829f74a01b3c
yarn install
cd ..
```


## Setup

### Install contract merger: https://www.npmjs.com/package/sol-merger
```
npm install -g sol-merger
```

### Prepare `PancakeFactory` and `PancakeRouter`
```
sol-merger pancake-swap-core/contracts/PancakeFactory.sol ./build
sol-merger pancake-swap-core/contracts/PancakePair.sol ./build
sol-merger pancake-swap-periphery/contracts/PancakeRouter01.sol ./build
sol-merger pancake-swap-periphery/contracts/PancakeRouter.sol ./build
```

### Prepare other tokens in build/tokens(compile->deploy, writedown addresses + hash)

+ New File: `ETHToken.sol` => Copy source from https://bscscan.com/address/0x2170ed0880ac9a755fd29b2688956bd959f933f8#code
+ New File: `BUSDToken.sol` => Copy source from https://bscscan.com/address/0xe9e7cea3dedca5984780bafc599bd69add087d56#code
+ New File: `XRPToken.sol` => Copy source from https://bscscan.com/address/0x1d2f0da169ceb9fc7b3144628db156f3f6c60dbe#code
+ New File: `DAIToken.sol` => Copy source from https://bscscan.com/address/0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3#code
+ New File: `CAKEToken.sol` => Copy source from https://bscscan.com/address/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82#code
+ New File: `USDTToken.sol` => Copy source from https://bscscan.com/address/0x55d398326f99059ff775485246999027b3197955#code
+ New File: `BAKEToken.sol` => Copy source from https://bscscan.com/address/0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5#code

### Deploy `WBNB`, `PancakeFactory` and `PancakeRouter`

- Access: https://remix.ethereum.org/#optimize=false&runs=200&evmVersion=null&version=soljson-v0.5.16+commit.9c3226ce.js

#### Deploy WBNB

+ New File: `WBNB.sol` => Copy source from https://gist.github.com/dariuszo/ec8b72adcad32fb991cf00cb4a98781a
+ Compiler tab => Select compiler: `v0.8.3+commit.8d00100c`
+ Deploy tab => Select `WBNB` -> Deploy

#### Deploy MultiCall

+ New File: `MultiCall.sol` => Copy source from https://bscscan.com/address/0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb#code
+ Compiler tab => Select compiler: `v0.8.3+commit.8d00100c`
+ Deploy tab => Select `MultiCall` -> Deploy

#### Deploy PancakeFactory

+ New File: `PancakeFactory.sol` => Copy source from `./build/PancakeFactory.sol`
+ Compiler tab => Select compiler: `v0.5.16+commit.9c3226ce`
+ Deploy tab => Select `PancakeFactory` -> Fill your address as `feeToSetter` in constructor -> Deploy

#### Deploy PancakeRouter01

+ New File: `PancakeRouter01.sol` => Copy source from `./build/PancakeRouter01.sol`
+ Expand `PancakeFactory` deployed above -> Read `INIT_CODE_PAIR_HASH` -> Copy this hash without prefix `0x`. Ex: `bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539`
+ Edit `PancakeRouter01`: Find `PancakeLibrary` -> `pairFor` function => Replace new hex by `INIT_CODE_PAIR_HASH` above. Ex: `hex'd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'` -> `hex'bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539'`
+ Compiler tab => Select compiler: `v0.6.6+commit.6c089d02`
+ Deploy tab => Select `PancakeRouter01` -> Fill `PancakeFactory` address and `WBNB` address as constructor params -> Deploy

#### Deploy PancakeRouter (Main Router)

+ New File: `PancakeRouter.sol` => Copy source from `./build/PancakeRouter.sol`
+ Expand `PancakeFactory` deployed above -> Read `INIT_CODE_PAIR_HASH` -> Copy this hash without prefix `0x`. Ex: `bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539`
+ Edit `PancakeRouter`: Find `PancakeLibrary` -> `pairFor` function => Replace new hex by `INIT_CODE_PAIR_HASH` above. Ex: `hex'd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66'` -> `hex'bb600ba95884f2c2837114fd2f157d00137e0b65b0fe5226523d720e4a4ce539'`
+ Compiler tab => Select compiler: `v0.6.6+commit.6c089d02`; Check on `Enable optimization: 200` to avoid `Contract code size limit` issue
+ Deploy tab => Select `PancakeRouter` -> Fill `PancakeFactory` address and `WBNB` address as constructor params -> Deploy


#### Setup Frontend

- Update .env
```
cd pancake-swap-interface-v1
cp .env.development .env
```

- Update `PancakeRouter` address to `ROUTER_ADDRESS` at `src/constants/index.ts`
  
- Update support chain to testnet at `src/connectors/index.ts`
	+ Change from `supportedChainIds: [56, 97]` to `supportedChainIds: [97]`
	+ Change from `56` to `97`

- Update `PancakeFactory` address and code hash to `FACTORY_ADDRESS` and `INIT_CODE_HASH` at `node_modules/@pancakeswap-libs/sdk/dist/constants.d.ts`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js` and `node_modules/@pancakeswap-libs/sdk/dist/sdk.esm.js`

- Update `PancakeFactory` address to `v2 factory`; `PancakeRouter01` address to `v2 router 01` and `PancakeRouter` address to `v2 router 02` at `src/state/swap/hooks.ts`

- Update `WBNB` address at `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.development.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.cjs.production.min.js`, `node_modules/@pancakeswap-libs/sdk/dist/sdk.esm.js`

- VERIFY CHANGES by `Find All` old addresses and replace new ones:
	+ WBNB:            0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8
	+ PancakeFactory:  0xBCfCcbde45cE874adCB698cC183deBcF17952812
	+ INIT_CODE_HASH:  0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66
	+ PancakeRouter01: 0xf164fC0Ec4E93095b804a4795bBe1e041497b92a
	+ PancakeRouter:   0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F
	
- Deploy your own tokens
	+ Deploy your own tokens and update info (token address + chainId to 97) to `src/constants/token/pancakeswap.json`
	+ Remember update token icon with name as token address in lowercase mode to `public/images/coins`
	+ Update support network from `ChainId.MAINNET` to `ChainId.BSCTESTNET` at `src/constants/index.ts`
	+ Update coin addresses to your at `src/constants/index.ts`
	+ Update `src/components/Menu/index.tsx`: From `priceData.data[CAKE.address].price` to `priceData.data[CAKE.address]?.price ?? 0`
	+ Update `src/hooks/useGetDocumentTitlePrice.ts`: From `priceData.data[CAKE.address].price` to `priceData.data[CAKE.address]?.price ?? 0`
	
- Custom menu at `src/components/Menu/config.ts`

### Start and Build Frontend

- Start
```
yarn start
```

- Build
```
yarn build
```

### Deployment

- WBNB:            `0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8`	HASH:	`0x73db7dff7e057f572b005bb770c026efd47d25ed686b76f8493d496ee2a4c95f`
- PancakeFactory:  `0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B`	HASH:	`0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B`
- INIT_CODE_HASH:  `0xf0c5074111d5cc4666f5563de193a6a12f43172e3d0d9ee69b96bee0a5761e5c`
- PancakeRouter01: `0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3`	HASH:	`0x442b5bc01e66736ed7d83e07b3475348716762f7415fe3a578e900ca01d80540`
- PancakeRouter:   `0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8`	HASH:	`0x0689273629cd7890d0c5a2cff9e2b6cb4190a406ff497a78fadc6aa2131b5ed1`
- Frontend:        * 

**Tokens**

- BAKE Token: `0xf8e81D47203A594245E36C48e151709F0C19fBe8`	HASH:	`0x003c5cf9698e149ed7e4206e937c2df1212fd4dab2e67f3ab203d03149850f1e`
- BUSD Token: `0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3`	HASH:	`0x88b4c838cade8dc55c23a6a9864d6f87d338c388c767f120e2aafb9275fc2aeb`
- ETH Token:  `0xDA0bab807633f07f013f94DD0E6A4F96F8742B53`	HASH:	`0x64c49460cf92b55d7d4c639d6ab0389ca6708d43f8bdd8e636b038719857885c`
- USDT Token: `0xd9145CCE52D386f254917e481eB44e9943F39138`	HASH:	`0x9d3b34be7465b968fe4d9a65ce2a1aeeb44d744c75621ba3a8231d2a38ba18c1`
- XRP Token:  `0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99`	HASH:	`0xed63d7a1b00e22f6c9cff48c9cfefd0874124939889cf4e4094a3a6b908eaef7`
- DAI Token:  `0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005`	HASH:	`0xe006e2cc37e5b9709a54509c5468ee7a6ef7ec3921450c2b8df2bd3a19a3590f`
- CAKE Token: `0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8`	HASH:	`0xdfcee279669c0661732f17e9b9533f43c832707ab8e49aac6d4343be8deccb93`
