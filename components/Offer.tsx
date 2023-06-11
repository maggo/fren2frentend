"use client"

import Image from "next/image"
import { Address, formatEther } from "viem"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"

import { PonziRepABI } from "@/lib/abi"
import { CONTRACT_ADDRESS } from "@/lib/config"
import { shortAddress } from "@/app/page"

import { Button } from "./ui/button"

export function Offer({ offerer, nonce }: { offerer: Address; nonce: bigint }) {
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: PonziRepABI,
    functionName: "withdrawTradeOffer",
  })
  const { write, isLoading } = useContractWrite(config)
  const { address } = useAccount()
  const { data } = useContractRead({
    abi: PonziRepABI,
    functionName: "tradeOffers",
    address: CONTRACT_ADDRESS,
    args: [offerer, nonce],
  })

  const isOwner = address === offerer

  if (!data) {
    return "Nope."
  }

  const [uReceive, iReceive, isFinalised] = data

  return (
    <div className="relative aspect-[500/654]">
      <Image alt="" src="/meme.png" fill />
      <div className="relative top-[12%] z-10 w-full text-center text-lg font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
        <div>from {shortAddress(offerer)}</div>
        <div className="-ml-10 mt-[7%] flex justify-around text-center text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
          <div>{formatEther(iReceive)} BOB</div>
          <div className="relative -left-5">{formatEther(uReceive)} ETH</div>
        </div>
      </div>
      <div className="absolute inset-x-2 bottom-2 space-y-2">
        {isOwner ? (
          <Button
            disabled={isLoading}
            onClick={write}
            variant="destructive"
            className="w-full"
          >
            Cancel Offer
          </Button>
        ) : (
          <Button className="w-full bg-green-500 font-semibold hover:bg-green-400">
            Accept
          </Button>
        )}
      </div>
    </div>
  )
}
