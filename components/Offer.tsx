"use client"

import Image from "next/image"

import "ethers"
import { useState } from "react"
import Link from "next/link"
import { solidityPack, splitSignature } from "ethers/lib/utils"
import {
  Address,
  encodeAbiParameters,
  formatEther,
  keccak256,
  parseAbiParameters,
} from "viem"
import {
  useAccount,
  useChainId,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi"

import { PonziRepABI } from "@/lib/abi"
import { ADDRESSES } from "@/lib/web3provider"
import { shortAddress } from "@/app/page"

import { FormControl, FormDescription, FormItem, FormLabel } from "./Form"
import { Button } from "./ui/button"

export enum TradeOfferStatus {
  Uninitialised /** Empty state; trade does not exist */,
  Initialised /** Initialised and waiting for counterparty to commit */,
  Finalised /** Done */,
  Cancelled,
}

export function Offer({ offerer, nonce }: { offerer: Address; nonce: bigint }) {
  const chainId = useChainId()
  const { chain } = useNetwork()
  const { config } = usePrepareContractWrite({
    address: ADDRESSES[chainId],
    abi: PonziRepABI,
    functionName: "withdrawTradeOffer",
    args: [nonce],
  })

  const { write: withdrawOffer, isLoading: isCancelling } =
    useContractWrite(config)

  const { address } = useAccount()
  const { data } = useContractRead({
    abi: PonziRepABI,
    functionName: "tradeOffers",
    address: ADDRESSES[chainId],
    args: [
      keccak256(
        encodeAbiParameters(
          parseAbiParameters("address offerer, uint256 nonce"),
          [offerer, nonce]
        )
      ),
    ],
  })

  const isOwner = address === offerer

  if (!data) {
    return <>Nope.</>
  }

  const [uReceive, iReceive, status] = data as [
    bigint,
    bigint,
    TradeOfferStatus
  ]

  return (
    <div className="relative aspect-[500/654]">
      <Image alt="" src="/meme.png" fill />
      <div className="relative top-[12%] z-10 w-full text-center text-lg font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
        <div>from {shortAddress(offerer)}</div>
        <div className="-ml-10 mt-[7%] flex justify-around text-center text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
          <div>{formatEther(iReceive)} BOB</div>
          <div className="relative -left-5">
            {formatEther(uReceive)} {chain?.nativeCurrency.symbol}
          </div>
        </div>
      </div>
      {status === TradeOfferStatus.Cancelled && (
        <>
          <span className="absolute left-1/2 top-[39%] z-10 -translate-x-1/2 text-[180px] leading-none">
            😔
          </span>
          <span className="absolute left-1/2 top-[66%] z-20 -translate-x-1/2 rotate-[-30deg] rounded border-4 border-red-600 bg-black/50 p-1 text-5xl font-bold uppercase text-red-600">
            Cancelled
          </span>
        </>
      )}
      {status === TradeOfferStatus.Finalised && (
        <>
          <span className="absolute left-1/2 top-[66%] z-20 -translate-x-1/2 rotate-[-30deg] rounded border-4 border-green-600 bg-black/50 p-1 text-5xl font-bold uppercase text-green-600">
            Completed!
          </span>
        </>
      )}
      {status === TradeOfferStatus.Initialised && (
        <div className="absolute inset-x-2 bottom-2 space-y-2">
          {isOwner ? (
            <>
              <Button
                asChild
                className="w-full bg-green-500 font-semibold hover:bg-green-400"
              >
                <Link href={`/${offerer}/${nonce}/accept`}>Finalize Offer</Link>
              </Button>
              <Button
                disabled={isCancelling}
                onClick={withdrawOffer}
                variant="destructive"
                className="w-full"
              >
                {isCancelling ? "Withdrawing…" : "Withdraw Offer"}
              </Button>
            </>
          ) : (
            <Button className="w-full bg-green-500 font-semibold hover:bg-green-400">
              Accept
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
