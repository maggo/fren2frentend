"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Address } from "viem"
import {
  useAccount,
  useBalance,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import * as z from "zod"

import { PonziRepABI } from "@/lib/abi"
import { ADDRESSES } from "@/lib/web3provider"

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
  noob: z.string(),
})

export function InviteForm() {
  const router = useRouter()
  const chainId = useChainId()
  const { address } = useAccount()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      noob: undefined,
    },
  })

  const noob = form.watch("noob") as Address | undefined

  const { config, isSuccess: canSubmit } = usePrepareContractWrite({
    address: ADDRESSES[chainId],
    abi: PonziRepABI,
    functionName: "invite",
    args: [noob!],
    enabled: !!noob,
  })

  const { writeAsync, data, isLoading } = useContractWrite({ ...config })

  const { data: tx } = useWaitForTransaction({ hash: data?.hash })

  const { data: ppBalance, isLoading: ppLoading } = useBalance({
    address,
    token: ADDRESSES[chainId],
  })

  useEffect(() => {
    if (!tx) return

    router.push(`/`)
  }, [router, tx])

  async function onSubmit() {
    if (!writeAsync) return

    await writeAsync()

    form.reset()
  }

  if (ppLoading) {
    return <div className="text-center">Loading…</div>
  }

  if (!ppBalance?.value || ppBalance.value < 10 * 10 ** 18) {
    return (
      <div>
        You need at least 10 PP to invite someone! Come back later when you have
        a bigger PP score.
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="space-y-8">
          <FormField
            control={form.control}
            name="noob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Only invite users you really trust!
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
