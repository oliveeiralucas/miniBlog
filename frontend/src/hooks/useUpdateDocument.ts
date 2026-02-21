import { useEffect, useReducer, useState } from 'react'

import { postsApi } from '@/api/apiClient'
import { State } from '@/interface/State'

type Action =
  | { type: 'LOADING' }
  | { type: 'UPDATED_DOC' }
  | { type: 'ERROR'; payload: string }

const initialState: State = { loading: null, error: null }

const updateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }
    case 'UPDATED_DOC':
      return { loading: false, error: null }
    case 'ERROR':
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Updates a post via the REST API.
 *
 * Keeps the same public interface as the Firebase hook:
 *   useUpdateDocument(docCollection)
 *   updateDocument(id, data)
 *
 * Note: `uid` in the original hook referred to the document ID, not the user ID.
 */
export const useUpdateDocument = (_docCollection: string) => {
  const [response, dispatch] = useReducer(updateReducer, initialState)
  const [cancelled, setCancelled] = useState<boolean>(false)

  const safe = (action: Action) => {
    if (!cancelled) dispatch(action)
  }

  const updateDocument = async (id: string, data: any) => {
    safe({ type: 'LOADING' })
    try {
      await postsApi.update(id, {
        title: data.title,
        image: data.image,
        image_data: data.image_data,
        body: data.body,
        tags: data.tags,
      })
      safe({ type: 'UPDATED_DOC' })
    } catch (err: any) {
      safe({ type: 'ERROR', payload: err.message ?? 'Failed to update post' })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { updateDocument, response }
}
