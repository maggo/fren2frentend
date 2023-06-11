"use client"

import Link from "next/link"
import { useAccount } from "wagmi"

import { Button } from "@/components/ui/button"

export function HomepageActions() {
  const { isConnected } = useAccount()

  if (!isConnected) return null

  return (
    <div className="space-y-2">
      <Button asChild className="w-full">
        <Link href="/request">Create Trade Offer</Link>
      </Button>
      <Button asChild variant="outline" className="w-full">
        <Link href="/request">Invite user</Link>
      </Button>
      <Button variant="ghost" className="w-full">
        <Link href="/request">
          Found a bad actor?&nbsp;<span className="underline">vote kick</span>.
        </Link>
      </Button>
    </div>
  )
}
