import { getAddress } from "viem"

import { AcceptOffer } from "@/components/AcceptOffer"

export default function AcceptPage({
  params,
}: {
  params: { offerer: string; nonce: string }
}) {
  const address = getAddress(params.offerer)

  return <AcceptOffer offerer={address} nonce={BigInt(params.nonce)} />
}
