import { getAddress } from "viem"

import { Offer } from "@/components/Offer"

export default function OfferPage({
  params,
}: {
  params: { offerer: string; nonce: string }
}) {
  const address = getAddress(params.offerer)

  return <Offer offerer={address} nonce={BigInt(params.nonce)} />
}
