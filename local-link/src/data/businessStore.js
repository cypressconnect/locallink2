import { useCallback, useState } from 'react'
import { findTopic, seedBusinesses } from './products.js'

/*
 * Front-end only store for businesses and their products, kept in localStorage
 * so the site can be demoed without a server. Two things are saved:
 *
 *   businesses - every business, each owned by one account email
 *   active     - which of its businesses each account is currently managing
 *
 * Both get swapped for a real API later, same as auth.jsx.
 */

const BUSINESSES_KEY = 'locallink.businesses'
const ACTIVE_KEY = 'locallink.activeBusiness'

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    // A corrupt or blocked store should not break the page.
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the page still works for this visit without saving.
  }
}

export function getBusinesses() {
  return read(BUSINESSES_KEY, seedBusinesses)
}

function save(businesses) {
  write(BUSINESSES_KEY, businesses)
  return businesses
}

function makeId(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${slug || 'business'}-${Date.now()}`
}

export function createBusiness({ owner, name, topicId, description = '' }) {
  const business = {
    id: makeId(name),
    owner,
    name,
    topicId,
    description,
    // New businesses are reviewed before they get the Verified badge.
    verified: false,
    products: [],
  }
  save([...getBusinesses(), business])
  setActiveBusinessId(owner, business.id)
  return business
}

export function getActiveBusinessId(email) {
  return read(ACTIVE_KEY, {})[email] ?? null
}

export function setActiveBusinessId(email, businessId) {
  write(ACTIVE_KEY, { ...read(ACTIVE_KEY, {}), [email]: businessId })
}

/* Every product, flattened with the details of the business that sells it. */
export function listProducts(businesses) {
  return businesses.flatMap((business) =>
    business.products.map((product) => ({
      ...product,
      businessId: business.id,
      business: business.name,
      topic: findTopic(business.topicId)?.name ?? '',
      verified: business.verified,
    })),
  )
}

/* Reads the store once and re-reads it after every change on the page. */
export function useBusinesses() {
  const [businesses, setBusinesses] = useState(getBusinesses)

  const addBusiness = useCallback((details) => {
    const business = createBusiness(details)
    setBusinesses(getBusinesses())
    return business
  }, [])

  const updateBusiness = useCallback((id, changes) => {
    setBusinesses(
      save(getBusinesses().map((business) =>
        business.id === id ? { ...business, ...changes } : business,
      )),
    )
  }, [])

  const addProduct = useCallback((businessId, product) => {
    setBusinesses(
      save(getBusinesses().map((business) =>
        business.id === businessId
          ? {
              ...business,
              products: [...business.products, { ...product, id: String(Date.now()) }],
            }
          : business,
      )),
    )
  }, [])

  return { businesses, addBusiness, updateBusiness, addProduct }
}
