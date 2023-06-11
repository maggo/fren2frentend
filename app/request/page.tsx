import { RequestForm } from "@/components/RequestForm"

import { Title } from "../page"

export default function RequestPage() {
  return (
    <>
      <header>
        <Title>Request a new trade</Title>
        <p className="text-muted-foreground">
          Create a trade request that others can accept
        </p>
      </header>
      <RequestForm />
    </>
  )
}
