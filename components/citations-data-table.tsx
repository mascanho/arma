"use client"

import { useState } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Citation = {
  domain: string
  totalCitations: number
  position: number
}

interface CitationsDataTableProps {
  citations: Citation[]
}

export function CitationsDataTable({ citations }: CitationsDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 1000

  const totalPages = Math.ceil(citations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCitations = citations.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-auto h-[calc(100vh-250px)]">
          <table className="w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Domain</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Total Citations</th>
                <th className="h-12 px-4 text-left align-middle font-medium bg-muted sticky top-0 border-b">Position</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCitations.map((citation) => (
                <tr key={citation.domain} className="border-b">
                  <td className="p-4 align-middle">{citation.domain}</td>
                  <td className="p-4 align-middle">{citation.totalCitations.toLocaleString()}</td>
                  <td className="p-4 align-middle">{citation.position}</td>
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
    </>
  )
}