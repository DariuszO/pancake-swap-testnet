import { ChainId } from '@pancakeswap-libs/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.BSCTESTNET]: '0x0659fbd3Dc3076D94D767a22179FAC0b7e144Bb1'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
