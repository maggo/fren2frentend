"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { solidityPack, splitSignature } from "ethers/lib/utils"
import { useForm } from "react-hook-form"
import { Address } from "viem"
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi"
import { z } from "zod"

import { PonziRepABI } from "@/lib/abi"
import { ADDRESSES } from "@/lib/web3provider"
import { Title } from "@/app/page"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./Form"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"

function splitAndCombineSigs(sig: string) {
  const { v, r, s } = splitSignature(sig)
  return solidityPack(["uint8", "bytes32", "bytes32"], [v, r, s])
}

export function AcceptOffer({
  offerer,
  nonce,
}: {
  offerer: Address
  nonce: bigint
}) {
  const { address } = useAccount()
  const chainId = useChainId()
  const { data, signTypedData, isLoading } = useSignTypedData({
    primaryType: "FinaliseTrade",
    domain: {
      name: "PonziRep",
      version: "1",
      chainId,
      verifyingContract: ADDRESSES[chainId],
    },
    types: {
      FinaliseTrade: [
        { name: "offerCreator", type: "address" },
        { name: "offerCreatorNonce", type: "uint256" },
      ],
    } as const,
    message: {
      offerCreator: offerer,
      offerCreatorNonce: nonce,
    },
  })

  const isOwner = address === offerer

  if (isOwner) {
    return <FinalizeForm offerer={offerer} nonce={nonce} />
  }

  return (
    <div className="space-y-8">
      <header>
        <Title>Seal the deal</Title>
      </header>
      <Button
        className="w-full"
        onClick={() => signTypedData()}
        disabled={isLoading}
      >
        Sign Offer
      </Button>
      <div className="space-y-4">
        <Label className="w-full">Output</Label>
        <Textarea
          className="w-full"
          rows={10}
          readOnly
          value={data ? splitAndCombineSigs(data) : ""}
        />
      </div>
    </div>
  )
}

const formSchema = z.object({
  buyerSignature: z.string(),
})

function FinalizeForm({ offerer, nonce }: { offerer: Address; nonce: bigint }) {
  const chainId = useChainId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyerSignature: "",
    },
  })

  const {
    data: offererSignature,
    signTypedData,
    isLoading,
  } = useSignTypedData({
    primaryType: "FinaliseTrade",
    domain: {
      name: "PonziRep",
      version: "1",
      chainId,
      verifyingContract: ADDRESSES[chainId],
    },
    types: {
      FinaliseTrade: [
        { name: "offerCreator", type: "address" },
        { name: "offerCreatorNonce", type: "uint256" },
      ],
    } as const,
    message: {
      offerCreator: offerer,
      offerCreatorNonce: nonce,
    },
  })

  const buyerSignature = form.watch("buyerSignature") as
    | `0x${string}`
    | undefined

  const { config, isSuccess: canSubmit } = usePrepareContractWrite({
    address: ADDRESSES[chainId],
    abi: PonziRepABI,
    functionName: "finaliseTrade",
    args: [offerer, nonce, offererSignature!, buyerSignature!],
    enabled: !!offererSignature && !!buyerSignature,
  })

  const { writeAsync: finalizeTx } = useContractWrite(config)

  async function onSubmit() {
    if (!finalizeTx) return

    await finalizeTx()

    form.reset()
  }

  if (!offererSignature) {
    return (
      <>
        <header>
          <Title>Seal the deal</Title>
          <p className="text-muted-foreground">
            First sign the offer, then you can enter your buyers signature and
            finalize the trade.
          </p>
        </header>
        <Button className="w-full" onClick={() => signTypedData()}>
          Sign Offer
        </Button>
      </>
    )
  }

  return (
    <Form {...form}>
      <header>
        <Title>Seal the deal</Title>
        <p className="text-muted-foreground">
          Enter your buyers signature and then finalize the trade!
        </p>
      </header>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset
          disabled={!offererSignature || isLoading}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="buyerSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buyer Signature</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Paste the signature your buyer sent you!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={!canSubmit}>
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  )
}
