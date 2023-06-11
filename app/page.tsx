import { ReactNode } from "react"

import { PPBalance } from "@/components/PPBalance"
import { TradeOffers } from "@/components/TradeOffers"

import { HomepageActions } from "../components/HomepageActions"

export default function IndexPage() {
  return (
    <>
      <header>
        <Title>Ethereum Bolivia</Title>
      </header>
      <PPBalance />
      <TradeOffers />
      <HomepageActions />
    </>
  )
}

export function shortAddress(address: string) {
  return address.slice(0, 6) + "…" + address.slice(-4)
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
      {children}
    </h1>
  )
}
