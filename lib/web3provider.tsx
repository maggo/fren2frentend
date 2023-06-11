"use client"

import { ReactNode } from "react"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { Address, zeroAddress } from "viem"
import { gnosis, hardhat, optimism } from "viem/chains"
import { WagmiConfig, configureChains, createConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  )
}

const { chains, publicClient } = configureChains(
  [gnosis, optimism, hardhat],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === gnosis.id) {
          return {
            http: `https://rpc.eu-central-2.gateway.fm/v4/gnosis/non-archival/mainnet?apiKey=64Xy8XraAdiU4ee58S12XDDcNyqOh8lW.kbO0Jt2bsTJouYMK`,
            webSocket: `wss://rpc.eu-central-2.gateway.fm/ws/v4/gnosis/non-archival/mainnet?apiKey=64Xy8XraAdiU4ee58S12XDDcNyqOh8lW.kbO0Jt2bsTJouYMK`,
          }
        }

        if (chain.id === optimism.id) {
          return {
            http: `https://rpc.eu-north-1.gateway.fm/v4/optimism/non-archival/mainnet?apiKey=J2JJ5xXxi8RErQN7aTvNHmT10sxpMgzf.zoSXONqF8RRaKvk1`,
            webSocket: `wss://rpc.eu-north-1.gateway.fm/ws/v4/optimism/non-archival/mainnet?apiKey=J2JJ5xXxi8RErQN7aTvNHmT10sxpMgzf.zoSXONqF8RRaKvk1`,
          }
        }

        if (chain.id === hardhat.id) {
          return {
            http: `http://127.0.0.1:8545`,
            webSocket: `ws://127.0.0.1:8545`,
          }
        }

        return null
      },
    }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID! }),
    publicProvider(),
  ]
)

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains,
    publicClient,

    // Required
    appName: "PonziRep",
  })
)

export const ADDRESSES: Partial<Record<number, Address>> = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosis.id]: "0xAba6d72B2F6530293B2935a0a2A1aE798e125146",
  [optimism.id]: zeroAddress,
}

export { ConnectKitButton, getDefaultConfig } from "connectkit"
