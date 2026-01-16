"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CitationsDataTable } from "@/components/citations-data-table"

type Citation = {
  domain: string
  totalCitations: number
  position: number
}

const domains = [
  "openai.com",
  "anthropic.com",
  "google.com",
  "x.ai",
  "perplexity.ai",
  "mistral.ai",
  "cohere.com",
  "stability.ai",
  "huggingface.co",
  "replicate.com",
  "meta.ai",
  "microsoft.com",
  "apple.com",
  "amazon.com",
  "tesla.com",
  "nvidia.com",
  "intel.com",
  "ibm.com",
  "oracle.com",
  "salesforce.com",
  "adobe.com",
  "spotify.com",
  "netflix.com",
  "twitter.com",
  "linkedin.com",
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "snapchat.com",
  "pinterest.com",
  "reddit.com",
  "quora.com",
  "stackoverflow.com",
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "heroku.com",
  "vercel.com",
  "netlify.com",
  "aws.amazon.com",
  "azure.microsoft.com",
  "gcp.google.com",
  "digitalocean.com",
  "linode.com",
  "vultr.com",
  "hetzner.com",
  "ovh.com",
  "godaddy.com",
  "namecheap.com",
  "cloudflare.com",
  "fastly.com",
  "akamai.com",
  "cdnjs.com",
  "unpkg.com",
  "jsdelivr.net",
  "esm.sh",
  "skypack.dev",
  "jspm.org",
  "deno.land",
  "bun.sh",
  "node.js",
  "npmjs.com",
  "yarnpkg.com",
  "pnpm.io",
  "rushjs.io",
  "lerna.js.org",
  "nx.dev",
  "turborepo.com",
  "parceljs.org",
  "webpack.js.org",
  "vitejs.dev",
  "rollupjs.org",
  "esbuild.github.io",
  "swc.rs",
  "babeljs.io",
  "typescriptlang.org",
  "eslint.org",
  "prettier.io",
  "stylelint.io",
  "jestjs.io",
  "vitest.dev",
  "cypress.io",
  "playwright.dev",
  "selenium.dev",
  "puppeteer.dev",
  "cheerio.js.org",
  "axios-http.com",
  "gotjs.github.io",
  "node-fetch.netlify.app",
  "undici.nodejs.org",
  "superagent-http.com",
  "request.mitre.org",
  "urllib3.readthedocs.io",
  "requests.readthedocs.io",
  "httpx.readthedocs.io",
]

const initialCitations: Citation[] = domains.map((domain, index) => ({
  domain,
  totalCitations: Math.floor(Math.random() * 20000) + 1000,
  position: index + 1,
}))

export function CitationsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeView, setActiveView] = useState("domain")

  const domainCitations = initialCitations.filter((citation) =>
    citation.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hostCitations = initialCitations
    .filter((citation) => citation.domain.includes('.com') || citation.domain.includes('.ai'))
    .filter((citation) => citation.domain.toLowerCase().includes(searchTerm.toLowerCase()))

  const pageCitations = initialCitations.map((citation) => ({
    ...citation,
    domain: `https://${citation.domain}/page/${citation.position}`,
  })).filter((citation) =>
    citation.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Citations</h2>
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col">
        <TabsList>
          <TabsTrigger value="domain">By Domain</TabsTrigger>
          <TabsTrigger value="host">By Host</TabsTrigger>
          <TabsTrigger value="page">By Page</TabsTrigger>
        </TabsList>
        <TabsContent value="domain" className="flex-1 flex flex-col mt-4">
          <CitationsDataTable citations={domainCitations} />
        </TabsContent>
        <TabsContent value="host" className="flex-1 flex flex-col mt-4">
          <CitationsDataTable citations={hostCitations} />
        </TabsContent>
        <TabsContent value="page" className="flex-1 flex flex-col mt-4">
          <CitationsDataTable citations={pageCitations} />
        </TabsContent>
      </Tabs>
    </div>
  )
}