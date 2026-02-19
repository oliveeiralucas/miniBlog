import { useEffect, useState } from 'react'

import { postsApi } from '@/api/apiClient'
import type { ApiPost } from '@/api/types'

/**
 * Fetches multiple posts from the REST API.
 *
 * Mirrors the original Firebase hook's signature:
 *   useFetchDocuments(docCollection, search?, uid?)
 *
 * The `docCollection` parameter is kept for backwards compatibility but is
 * unused — all data comes from the /posts endpoint.
 */
export const useFetchDocuments = (
  _docCollection: string,
  search: string | null = null,
  uid: string | null = null
) => {
  const [documents, setDocuments] = useState<ApiPost[]>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await postsApi.getAll({
          q: search ?? undefined,
          uid: uid ?? undefined,
        })
        if (!cancelled) setDocuments(data.items)
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to fetch posts')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [search, uid])

  return { documents, loading, error }
}
