"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { decodeEventLog, parseEther } from "viem"
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import * as z from "zod"

import { PonziRepABI } from "@/lib/abi"
import { CONTRACT_ADDRESS } from "@/lib/config"

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
import { Input } from "./ui/input"

const formSchema = z.object({
  receive: z.number(),
  send: z.number(),
})

export function RequestForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      send: undefined,
      receive: undefined,
    },
  })

  const { config, isSuccess: canSubmit } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: PonziRepABI,
    functionName: "createTradeOffer",
    value: parseEther(
      (form.watch("send")?.toString() as `${number}` | undefined) ?? "0"
    ),
    args: [
      parseEther(
        (form.watch("send")?.toString() as `${number}` | undefined) ?? "0"
      ),
      parseEther(
        (form.watch("receive")?.toString() as `${number}` | undefined) ?? "0"
      ),
    ],
  })

  const { writeAsync, data, isLoading } = useContractWrite({ ...config })

  const { data: tx } = useWaitForTransaction({ hash: data?.hash })

  useEffect(() => {
    if (!tx) return
    const event = decodeEventLog({
      eventName: "TradeOfferCreated",
      abi: PonziRepABI,
      data: tx.logs[0].data,
      topics: tx.logs[0].topics,
    })

    router.push(`/${event.args.offerer}/${event.args.nonce}`)
  }, [router, tx])

  async function onSubmit() {
    if (!writeAsync) return

    await writeAsync()

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="space-y-8">
          <FormField
            control={form.control}
            name="send"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(+e.currentTarget.value)}
                  />
                </FormControl>
                <FormDescription>
                  The amount of ETH you want to sell
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="receive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receive</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(+e.currentTarget.value)}
                  />
                </FormControl>
                <FormDescription>
                  The amount of BOB you want to receive
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
