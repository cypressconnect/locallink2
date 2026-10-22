import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase.js'
import { findTopic } from './products.js'

/*
 * Businesses and their products, stored in Supabase (see supabase/migrations).
 * Rows are turned into the same shape the pages have always used:
 *
 *   { id, owner, name, topicId, description, verified, products: [...] }
 *
 * Which of its businesses an account is managing is a per-browser preference,
 * so that one stays in localStorage.
 */

const ACTIVE_KEY = 'locallink.activeBusiness'
const IMAGE_BUCKET = 'product-images'

function readActive() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_KEY)) ?? {}
  } catch {
    // A corrupt or blocked store should not break the page.
    return {}
  }
}

export function getActiveBusinessId(email) {
  return readActive()[email] ?? null
}

export function setActiveBusinessId(email, businessId) {
  try {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify({ ...readActive(), [email]: businessId }))
  } catch {
    // Ignore: the switcher still works for this visit without saving.
  }
}

function toProduct(row) {
  return {
    id: String(row.id),
    name: row.name,
    price: row.price,
    description: row.description,
    topicId: row.topic_id,
    image: row.image,
  }
}

function toBusiness(row) {
  return {
    id: row.id,
    owner: row.owner_email,
    name: row.name,
    topicId: row.topic_id,
    description: row.description,
    verified: row.verified,
    products: (row.products ?? []).map(toProduct),
  }
}

export async function getBusinesses() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*, products(*)')
    .order('created_at')
    .order('created_at', { referencedTable: 'products' })
  if (error) throw error
  return data.map(toBusiness)
}

export async function createBusiness({ owner, name, topicId, description = '' }) {
  const { data, error } = await supabase
    .from('businesses')
    .insert({ owner_email: owner, name, topic_id: topicId, description })
    .select()
    .single()
  if (error) throw error
  setActiveBusinessId(owner, data.id)
  return toBusiness(data)
}

/* A product picks its own topic; older products without one use the business's. */
export function productTopicId(business, product) {
  return product.topicId ?? business.topicId
}

/* Every product, flattened with the details of the business that sells it. */
export function listProducts(businesses) {
  return businesses.flatMap((business) =>
    business.products.map((product) => ({
      ...product,
      businessId: business.id,
      business: business.name,
      topic: findTopic(productTopicId(business, product))?.name ?? '',
      verified: business.verified,
    })),
  )
}

/* Uploads a product photo into the account's own folder and returns its URL. */
async function uploadImage(file) {
  const { data: auth } = await supabase.auth.getUser()
  const path = `${auth.user.id}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: 'image/jpeg' })
  if (error) throw error
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

/* Removes an uploaded photo. Built-in pictures (/assets/...) are left alone. */
async function deleteImage(url) {
  const marker = `/${IMAGE_BUCKET}/`
  const at = url.indexOf(marker)
  if (at === -1) return
  await supabase.storage.from(IMAGE_BUCKET).remove([url.slice(at + marker.length)])
}

/* Loads every business once, and reloads after each change made on the page.
 * The change functions throw if Supabase refuses, so forms can show why. */
export function useBusinesses() {
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setBusinesses(await getBusinesses())
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const addBusiness = useCallback(
    async (details) => {
      const business = await createBusiness(details)
      await reload()
      return business
    },
    [reload],
  )

  const updateBusiness = useCallback(
    async (id, changes) => {
      const { error } = await supabase
        .from('businesses')
        .update({ name: changes.name, topic_id: changes.topicId, description: changes.description })
        .eq('id', id)
      if (error) throw error
      await reload()
    },
    [reload],
  )

  // `file` is an uploaded photo; without one, `image` is a built-in picture.
  const addProduct = useCallback(
    async (businessId, { name, price, description, topicId, image, file }) => {
      const { error } = await supabase.from('products').insert({
        business_id: businessId,
        name,
        price,
        description,
        topic_id: topicId,
        image: file ? await uploadImage(file) : image,
      })
      if (error) throw error
      await reload()
    },
    [reload],
  )

  const removeProduct = useCallback(
    async (product) => {
      const { error } = await supabase.from('products').delete().eq('id', product.id)
      if (error) throw error
      await deleteImage(product.image)
      await reload()
    },
    [reload],
  )

  return { businesses, loading, error, addBusiness, updateBusiness, addProduct, removeProduct }
}
