"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type PromptData = {
  prompt: string
  country: string
  language: string
  responses: number
  mentions: number
  visibility: string
  citations: number
  position: number
  lastUpdate: string
  creationDate: string
}

const samplePrompts: PromptData[] = [
  {
    prompt: "What do you know about AI?",
    country: "US",
    language: "English",
    responses: 1234,
    mentions: 567,
    visibility: "Public",
    citations: 89,
    position: 1,
    lastUpdate: "2024-01-15",
    creationDate: "2023-12-01",
  },
  {
    prompt: "How does machine learning work?",
    country: "UK",
    language: "English",
    responses: 987,
    mentions: 432,
    visibility: "Public",
    citations: 76,
    position: 2,
    lastUpdate: "2024-01-14",
    creationDate: "2023-11-15",
  },
  {
    prompt: "¿Qué sabes sobre la IA?",
    country: "Spain",
    language: "Spanish",
    responses: 765,
    mentions: 321,
    visibility: "Public",
    citations: 54,
    position: 3,
    lastUpdate: "2024-01-13",
    creationDate: "2023-10-20",
  },
  // Add more sample data
]

for (let i = 4; i <= 500; i++) {
  samplePrompts.push({
    prompt: `Sample prompt ${i}`,
    country: ["US", "UK", "Germany", "France", "Japan"][Math.floor(Math.random() * 5)],
    language: ["English", "German", "French", "Japanese", "Spanish"][Math.floor(Math.random() * 5)],
    responses: Math.floor(Math.random() * 2000) + 100,
    mentions: Math.floor(Math.random() * 1000) + 50,
    visibility: Math.random() > 0.5 ? "Public" : "Private",
    citations: Math.floor(Math.random() * 200) + 10,
    position: i,
    lastUpdate: `2024-01-${Math.floor(Math.random() * 15) + 1}`,
    creationDate: `2023-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
  })
}

export function PromptsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 1000

  const filteredPrompts = samplePrompts.filter((prompt) =>
    prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.language.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Prompts Table</h2>
        <Input
          placeholder="Search prompts, countries, languages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-auto h-[calc(100vh-250px)]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Prompt</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Country</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Language</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Responses</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Mentions</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Visibility</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Citations</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Position</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Last Update</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Creation Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPrompts.map((prompt, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4 align-middle">{prompt.prompt}</td>
                  <td className="p-4 align-middle">{prompt.country}</td>
                  <td className="p-4 align-middle">{prompt.language}</td>
                  <td className="p-4 align-middle">{prompt.responses.toLocaleString()}</td>
                  <td className="p-4 align-middle">{prompt.mentions.toLocaleString()}</td>
                  <td className="p-4 align-middle">{prompt.visibility}</td>
                  <td className="p-4 align-middle">{prompt.citations.toLocaleString()}</td>
                  <td className="p-4 align-middle">{prompt.position}</td>
                  <td className="p-4 align-middle">{prompt.lastUpdate}</td>
                  <td className="p-4 align-middle">{prompt.creationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}