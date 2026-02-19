import { useEffect, useState } from 'react'

import { postsApi } from '@/api/apiClient'
import type { ApiPost } from '@/api/types'

/**
 * Fetches a single post by ID from the REST API.
 *
 * Keeps the same signature as the Firebase hook:
 *   useFetchDocument(docCollection, id)
 */
export const useFetchDocument = (_docCollection: string, id: string) => {
  const [document, setDocument] = useState<ApiPost>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const post = await postsApi.getById(id)
        if (!cancelled) setDocument(post)
      } catch (err: any) {
        if (!cancelled) {
          setError(err.status === 404 ? 'Document not found' : (err.message ?? 'Failed to fetch post'))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return { document, loading, error }
}
