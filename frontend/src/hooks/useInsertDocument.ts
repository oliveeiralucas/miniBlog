import { useEffect, useReducer, useState } from 'react'

import { postsApi } from '@/api/apiClient'
import { BlogPost } from '@/interface/BlogPostData'
import { State } from '@/interface/State'

type Action =
  | { type: 'LOADING' }
  | { type: 'INSERTED_DOC' }
  | { type: 'ERROR'; payload: string }

const initialState: State = { loading: null, error: null }

const insertReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }
    case 'INSERTED_DOC':
      return { loading: false, error: null }
    case 'ERROR':
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Inserts a post via the REST API.
 *
 * Keeps the same public interface as the Firebase hook:
 *   useInsertDocument(docCollection)
 *
 * The `docCollection` parameter is retained for compatibility but unused —
 * all posts go to the /posts endpoint.
 */
export const useInsertDocument = (_docCollection: string) => {
  const [response, dispatch] = useReducer(insertReducer, initialState)
  const [cancelled, setCancelled] = useState<boolean>(false)

  const safe = (action: Action) => {
    if (!cancelled) dispatch(action)
  }

  const insertDocument = async (document: BlogPost): Promise<boolean> => {
    safe({ type: 'LOADING' })
    try {
      await postsApi.create({
        title: document.title,
        image: document.image,
        image_data: document.image_data,
        body: document.body,
        tags: document.tags,
      })
      safe({ type: 'INSERTED_DOC' })
      return true
    } catch (err: any) {
      safe({ type: 'ERROR', payload: err.message ?? 'Failed to create post' })
      return false
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { insertDocument, response }
}
