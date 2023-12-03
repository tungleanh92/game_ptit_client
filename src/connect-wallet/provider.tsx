
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { avalanche, avalancheFuji } from 'viem/chains'
import { ReactNode } from 'react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '4142b1deac1e79da47b6f9b31f81efff'

// 2. Create wagmiConfig
const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [avalanche, avalancheFuji]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata, })
createWeb3Modal({
    wagmiConfig, projectId, chains,
    themeMode: 'light'
})

const WagmiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>

    )
}

export default WagmiProvider
