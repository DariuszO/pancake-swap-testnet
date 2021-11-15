import { ChainId, JSBI, Percent, Token, WETH } from '@pancakeswap-libs/sdk'

export const ROUTER_ADDRESS = '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const CAKE = new Token(ChainId.BSCTESTNET, '0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005', 18, 'CAKE', 'PancakeSwap Token')
export const WBNB = new Token(ChainId.BSCTESTNET, '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8', 18, 'WBNB', 'Wrapped BNB')
export const DAI = new Token(ChainId.BSCTESTNET, '0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005', 18, 'DAI', 'Dai Stablecoin')
export const BUSD = new Token(ChainId.BSCTESTNET, '0x358AA13c52544ECCEF6B0ADD0f801012ADAD5eE3', 18, 'BUSD', 'Binance USD')
// export const BTCB = new Token(ChainId.BSCTESTNET, '0xC61b98C4a9A0f3D564B4D4E71F24Fba464C167a4', 18, 'BTCB', 'Binance-Peg BTC Token')
export const USDT = new Token(ChainId.BSCTESTNET, '0xd9145CCE52D386f254917e481eB44e9943F39138', 18, 'USDT', 'Tether USD')
export const ETH = new Token(ChainId.BSCTESTNET, '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53', 18, 'ETH', 'Binance-Peg Ethereum Token')


const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.BSCTESTNET]: [WETH[ChainId.BSCTESTNET]],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSCTESTNET]: [...WETH_ONLY[ChainId.BSCTESTNET], DAI, BUSD, BTCB, USDT, ETH],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSCTESTNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSCTESTNET]: [...WETH_ONLY[ChainId.BSCTESTNET], DAI, BUSD, USDT],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.BSCTESTNET]: [...WETH_ONLY[ChainId.BSCTESTNET], DAI, BUSD, BTCB, USDT],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.BSCTESTNET]: [
    [CAKE, WBNB],
    [BUSD, USDT],
    [DAI, USDT],
  ],
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
