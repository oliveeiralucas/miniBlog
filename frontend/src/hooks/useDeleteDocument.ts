import { useEffect, useReducer, useState } from 'react'

import { postsApi } from '@/api/apiClient'
import { State } from '@/interface/State'

type Action =
  | { type: 'LOADING' }
  | { type: 'DELETED_DOC' }
  | { type: 'ERROR'; payload: string }

const initialState: State = { loading: null, error: null }

const deleteReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOADING':
      return { loading: true, error: null }
    case 'DELETED_DOC':
      return { loading: false, error: null }
    case 'ERROR':
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

/**
 * Deletes a post via the REST API.
 *
 * Keeps the same public interface as the Firebase hook:
 *   useDeleteDocument(docCollection)
 *   deleteDocument(id)
 */
export const useDeleteDocument = (_docCollection: string) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState)
  const [cancelled, setCancelled] = useState<boolean>(false)

  const safe = (action: Action) => {
    if (!cancelled) dispatch(action)
  }

  const deleteDocument = async (id: string) => {
    safe({ type: 'LOADING' })
    try {
      await postsApi.delete(id)
      safe({ type: 'DELETED_DOC' })
    } catch (err: any) {
      safe({ type: 'ERROR', payload: err.message ?? 'Failed to delete post' })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { deleteDocument, response }
}
