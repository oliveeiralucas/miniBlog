import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useEffect, useReducer, useState } from 'react'

import { db } from '@/firebase/config'
import { BlogPost } from '@/interface/BlogPostData'
import { getErrorMessage } from '@/utils/ErrorHandling'

interface State {
  loading: boolean
  error: string | null | unknown
}

const initialState: State = {
  loading: false,
  error: null
}

interface Action {
  type: string
  payload?: unknown
}

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

export const useInsertDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(insertReducer, initialState)

  const [cancelled, setCancelled] = useState<boolean>(false)

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action)
    }
  }

  const insertDocument = async (document: BlogPost) => {
    checkCancelBeforeDispatch({ type: 'LOADING' })

    try {
      const newDocument = { ...document, createdAt: Timestamp.now() }

      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      )

      checkCancelBeforeDispatch({
        type: 'INSERTED_DOC',
        payload: insertedDocument
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

  return { insertDocument, response }
}
