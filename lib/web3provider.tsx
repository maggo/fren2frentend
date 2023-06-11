"use client"

import { ReactNode } from "react"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { Address } from "viem"
import { gnosis, hardhat, optimism, scrollTestnet } from "viem/chains"
import { Chain, WagmiConfig, configureChains, createConfig } from "wagmi"
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

export const mantle = {
  id: 5001,
  name: "Mantle Testnet",
  network: "mantle",
  nativeCurrency: {
    decimals: 18,
    name: "Mantle",
    symbol: "MNT",
  },
  rpcUrls: {
    public: { http: ["https://rpc.testnet.mantle.xyz"] },
    default: { http: ["https://rpc.testnet.mantle.xyz"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Mantlescan",
      url: "https://testnet.mantlescan.org",
    },
    default: {
      name: "Mantlescan",
      url: "https://testnet.mantlescan.org",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 561_333,
    },
  },
} as const satisfies Chain

export const taiko = {
  id: 167_005,
  name: "Taiko Testnet",
  network: "taiko",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.test.taiko.xyz"] },
    default: { http: ["https://rpc.test.taiko.xyz"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Taiko Explorer",
      url: "https://explorer.test.taiko.xyz",
    },
    default: {
      name: "Taiko Explorer",
      url: "https://explorer.test.taiko.xyz",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 73_140,
    },
  },
} as const satisfies Chain

const { chains, publicClient } = configureChains(
  [gnosis, optimism, scrollTestnet, mantle, taiko, hardhat],
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
    appName: "fren2fren",
  })
)

// All the chains!
export const ADDRESSES: Partial<Record<number, Address>> = {
  [hardhat.id]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [gnosis.id]: "0xAba6d72B2F6530293B2935a0a2A1aE798e125146",
  [optimism.id]: "0xdA7b125147Eb16c27Ce215b15b6F4077B3411deA",
  [scrollTestnet.id]: "0x8d6C76d6E225b609228b9C08F2A4dAb5f8652212",
  [mantle.id]: "0x0841dEF9362c205a5F59A5e232d925fC7A8d8537",
  [taiko.id]: "0x9309bd93a8b662d315Ce0D43bb95984694F120Cb",
}

export { ConnectKitButton, getDefaultConfig } from "connectkit"
