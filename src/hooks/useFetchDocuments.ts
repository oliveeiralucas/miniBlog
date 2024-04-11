import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { getErrorMessage } from '@/utils/ErrorHandling'

import { db } from '../firebase/config'

export const useFetchDocuments = (
  docCollection: string,
  search: string | null = null,
  uid: string | null = null
) => {
  const [documents, setDocuments] = useState<DocumentData[]>()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>()

  // deal with memory leak
  const [cancelled, setCancelled] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      if (cancelled) {
        return
      }

      setLoading(true)

      const collectionRef = await collection(db, docCollection)

      try {
        let q

        if (search) {
          q = await query(
            collectionRef,
            where('tags', 'array-contains', search),
            orderBy('createdAt', 'desc')
          )
        } else if (uid) {
          q = await query(
            collectionRef,
            where('uid', '==', uid),
            orderBy('createdAt', 'desc')
          )
        } else {
          q = await query(collectionRef, orderBy('createdAt', 'desc'))
        }

        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }))
          )
        })
      } catch (error) {
        console.log(error)
        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
      }

      setLoading(false)
    }

    loadData()
  }, [docCollection, search, uid, cancelled])

  console.log(documents)

  useEffect(() => {
    return () => setCancelled(true)
  }, [])

  return { documents, loading, error }
}
