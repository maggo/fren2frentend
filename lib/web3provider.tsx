"use client"

import { ReactNode } from "react"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"
import { hardhat } from "viem/chains"
import { WagmiConfig, configureChains, createConfig } from "wagmi"

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  )
}

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID, // or infuraId
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [hardhat],

    // Required
    appName: "PonziRep",
  })
)

export { ConnectKitButton, getDefaultConfig } from "connectkit"
