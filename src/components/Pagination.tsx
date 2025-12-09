'use client'

import Button from '@/components/ui/Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
}

/**
 * Pagination Component
 * 
 * Provides navigation between pages of results
 * 
 * @example
 * ```tsx
 * const [page, setPage] = useState(1)
 * 
 * return (
 *   <>
 *     <ListingsGrid listings={listings} />
 *     <Pagination
 *       currentPage={page}
 *       totalPages={10}
 *       onPageChange={setPage}
 *     />
 *   </>
 * )
 * ```
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
}: PaginationProps) {
  const getPageNumbers = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i == 1 ||
        i == totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        variant="outline"
        size="sm"
      >
        ← Previous
      </Button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => {
            if (typeof page === 'number') {
              onPageChange(page)
            }
          }}
          disabled={page === '...' || loading}
          className={`px-3 py-2 rounded font-medium transition-colors text-sm ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        variant="outline"
        size="sm"
      >
        Next →
      </Button>

      <span className="text-sm text-gray-600 ml-4">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  )
}

export default Pagination
