import { ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PPBalance } from "@/components/PPBalance"
import { TradeOffers } from "@/components/TradeOffers"

export default function IndexPage() {
  return (
    <>
      <header>
        <Title>Ethereum Bolivia</Title>
        <p className="text-muted-foreground">123 members</p>
      </header>
      <PPBalance />
      <header className="rounded bg-[#D34B45] p-2 text-center text-2xl font-semibold uppercase text-white">
        <span className="font-[sans-serif]">⚠️</span>Trade Offers
        <span className="font-[sans-serif]">⚠️</span>
      </header>
      <TradeOffers />
      <div className="space-y-2">
        <Button asChild className="w-full">
          <Link href="/request">Create Trade Offer</Link>
        </Button>
        <Button variant="outline" className="w-full">
          Invite User
        </Button>
        <Button variant="ghost" className="w-full">
          Found a bad actor?&nbsp;<span className="underline">vote kick</span>.
        </Button>
      </div>
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
