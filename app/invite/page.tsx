import { InviteForm } from "@/components/InviteForm"
import { RequestForm } from "@/components/RequestForm"

import { Title } from "../page"

export default function RequestPage() {
  return (
    <>
      <header>
        <Title>Invite a user</Title>
        <p className="text-muted-foreground">
          Invite a user to join the PP club.
        </p>
      </header>
      <InviteForm />
    </>
  )
}
