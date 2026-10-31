import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase.js'
import { summarizeReviews } from './businessStore.js'

/*
 * Product reviews: 1 to 5 stars and an optional comment. Anyone can read them;
 * a customer can leave one review per product and edit or delete it later.
 */

function toReview(row) {
  return {
    id: row.id,
    customerId: row.customer_id,
    name: row.reviewer_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    price: row.price,
    description: row.description,
    image: row.image,
    businessId: row.businesses.id,
    business: row.businesses.name,
    owner: row.businesses.owner_email,
    verified: row.businesses.verified,
  }
}

/* One product with its business and reviews (newest first), or null. */
export async function getProductWithReviews(productId) {
  const { data, error } = await supabase
    .from('products')
    .select('*, businesses(id, name, owner_email, verified), reviews(*)')
    .eq('id', productId)
    .order('created_at', { referencedTable: 'reviews', ascending: false })
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return { product: toProduct(data), reviews: data.reviews.map(toReview) }
}

/* Loads a product and its reviews, and reloads after each change.
 * The change functions throw if Supabase refuses, so the form can show why. */
export function useProductReviews(productId) {
  const [product, setProduct] = useState(undefined) // undefined while loading
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const result = await getProductWithReviews(productId)
      setProduct(result?.product ?? null)
      setReviews(result?.reviews ?? [])
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [productId])

  useEffect(() => {
    reload()
  }, [reload])

  // Posts a new review, or updates the customer's existing one.
  const saveReview = useCallback(
    async ({ existing, rating, comment }) => {
      const { error } = existing
        ? await supabase
            .from('reviews')
            .update({ rating, comment: comment.trim(), updated_at: new Date().toISOString() })
            .eq('id', existing.id)
        : await supabase
            .from('reviews')
            .insert({ product_id: Number(productId), rating, comment: comment.trim() })
      if (error) throw error
      await reload()
    },
    [productId, reload],
  )

  const deleteReview = useCallback(
    async (review) => {
      const { error } = await supabase.from('reviews').delete().eq('id', review.id)
      if (error) throw error
      await reload()
    },
    [reload],
  )

  return { product, reviews, summary: summarizeReviews(reviews), error, saveReview, deleteReview }
}
