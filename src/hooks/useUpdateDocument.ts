import { doc, updateDoc } from 'firebase/firestore'
import { useEffect, useReducer, useState } from 'react'

import { State } from '@/interface/State'
import { getErrorMessage } from '@/utils/ErrorHandling'

import { db } from '../firebase/config'

type Action =
  | { type: 'LOADING' }
  | { type: 'UPDATED_DOC'; payload: void }
  | { type: 'ERROR'; payload: string }

const initialState: State = {
  loading: null,
  error: null
}

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

export const useUpdateDocument = (docCollection: string) => {
  const [response, dispatch] = useReducer(updateReducer, initialState)

  // deal with memory leak
  const [cancelled, setCancelled] = useState<boolean>(false)

  const checkCancelBeforeDispatch = (action: Action) => {
    if (!cancelled) {
      dispatch(action)
    }
  }

  const updateDocument = async (uid: string, data: any) => {
    checkCancelBeforeDispatch({ type: 'LOADING' })

    try {
      const docRef = await doc(db, docCollection, uid)

      console.log(docRef)

      const updatedDocument = await updateDoc(docRef, data)

      console.log(updateDocument)

      checkCancelBeforeDispatch({
        type: 'UPDATED_DOC',
        payload: updatedDocument
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      console.log(error)
      checkCancelBeforeDispatch({ type: 'ERROR', payload: errorMessage })
    }
  }

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { updateDocument, response }
}
