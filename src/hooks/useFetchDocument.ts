import { doc, DocumentData, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { getErrorMessage } from '@/utils/ErrorHandling'

import { db } from '../firebase/config'

export const useFetchDocument = (docCollection: string, id: string) => {
  const [document, setDocument] = useState<DocumentData>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>()

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true)

      try {
        const docRef = await doc(db, docCollection, id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setDocument(docSnap.data())
        } else {
          setError('Document not found')
        }
      } catch (error) {
        console.log(error)
        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
      }

      setLoading(false)
    }

    loadDocument()
  }, [docCollection, id])

  console.log(document)

  return { document, loading, error }
}
