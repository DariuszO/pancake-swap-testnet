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
	+ WBNB:            0xaE8E19eFB41e7b96815649A6a60785e1fbA84C1e
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

- WBNB:            0xDC847aFEf098a9A516Ce5220B0F0f83E7D698834
- PancakeFactory:  0xb033708F0925133ab18d7Acf38dfe14b1E26119C
- INIT_CODE_HASH:  0x4c8254230ea5ad8d677c8f0badce0d9365c522676f3572773e9518f46589ab67
- PancakeRouter01: 0x008934F119cbb00EDE989219dfA2038B699e075B
- PancakeRouter:   0x81Ed9A1c1f422764Be220BED697132674e147D85
- Frontend:        * 

**Tokens**

- BAKE Token: 0x0503621621F02aD52c2A6148DbA3aB8dCD61b400	HASH:	0xd4e71861df3ecdab4bdac737dc4534439353af2d2740203cf832a7b22b332bab
- BUSD Token: 0xA46f60e4448C62cAF6dC304aD68084b7F6c9A114	HASH:	0xc8f3baa2acc840dfd7999a0747e0f5c4a9b046f16f61642a9fdcd051b0c40596
- ETH Token:  0x7ef6824AfF39Bd876b238a9a699C321bA6F17256	HASH:	0xd7a4c59577b368978c2e5da3b9b777026edc50fad01c0362257b85e99557a982
- USDT Token: 0xBF426F8C2f46A2b6b5F26253bBFd0F8811A0E58F	HASH:	0xb1ae40f9f1524c43e971ba7d03207e784b033d9abad897b63fe9bbdeeef876c2
- XRP Token:  0x813c9A46CEa0E9482887cF3EfC53B4d7B73188Fd	HASH:	0x9aebfba852e9014e5874f0c295400f18ef4a797b8c89121e10b1fc8a13757de8
- DAI Token:  0xBD3E3Ef3e06c97eb6c0ccA723Ee3Ee7D07d8dE80	HASH:	0x998153425a2d06e8c5029148f361b084d89e02abfe4f021a999758c0cea68f00
- CAKE Token: 0xC642e73195975Cf5e5697f3F73bb2Fa8C2f032a1	HASH:	0x677be86d803085f790f2f4248f9a2934ae5d080b34df31e30413ddd37bac5083
