export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "fren2fren",
  description:
    "invite-only, non-KYC P2P exchange for communities to onramp members into crypto with social points. one fren fks up - he's out and you lose your points.",
  mainNav: [
    {
      title: "Trade Offers",
      href: "/",
    },
    {
      title: "Request Trade",
      href: "/request",
    },
    {
      title: "Invite",
      href: "/invite",
    },
  ],
  links: {
    github: "https://github.com/shadcn/ui",
  },
}
