import { deleteDoc, doc } from 'firebase/firestore'
import { useEffect, useReducer, useState } from 'react'

import { db } from '@/firebase/config'
import { State } from '@/interface/State'
import { getErrorMessage } from '@/utils/ErrorHandling'

type Action =
  | { type: 'LOADING' }
  | { type: 'DELETED_DOC'; payload: void }
  | { type: 'ERROR'; payload: string }

const initialState: State = {
  loading: null,
  error: null
}

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

export const useDeleteDocument = (docColletion: string) => {
  const [response, dispatch] = useReducer(deleteReducer, initialState)

  const [cancelled, setCancelled] = useState<boolean>(false)

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action)
    }
  }

  const deleteDocument = async (id: string) => {
    checkCancelBeforeDispatch({ type: 'LOADING' })

    try {
      const deletedDocument = await deleteDoc(doc(db, docColletion, id))

      checkCancelBeforeDispatch({
        type: 'DELETED_DOC',
        payload: deletedDocument
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      checkCancelBeforeDispatch({
        type: 'ERROR',
        payload: errorMessage
      })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { deleteDocument, response }
}
