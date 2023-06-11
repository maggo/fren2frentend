"use client"

import { InfoIcon } from "lucide-react"
import { Address, useAccount, useBalance, useChainId } from "wagmi"

import { ADDRESSES } from "@/lib/web3provider"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

export function PPBalance() {
  const chainId = useChainId()

  const { address } = useAccount()

  const { data } = useBalance({
    address,
    token: ADDRESSES[chainId],
  })

  if (!address) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Your PP</span>
          <span className="text-muted-foreground">
            <HoverCard>
              <HoverCardTrigger>
                <InfoIcon size="1em" />
              </HoverCardTrigger>
              <HoverCardContent
                align="end"
                className="text-sm font-normal leading-normal"
              >
                You receive ponzi points (PP) by executing trades or vote on
                disputes.
                <br />
                You will also receive 0.5 PP when people you invited do
                something!
              </HoverCardContent>
            </HoverCard>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-4xl font-bold">{data?.formatted ?? "…"}</span>
        <span className="text-lg font-semibold">PP</span>
      </CardContent>
    </Card>
  )
}
