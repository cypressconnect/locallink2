import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase.js'

/*
 * Leads are a customer's name, email and phone, sent to one business through
 * the Send Lead page. They are free for now. The business sees them on its
 * leads page and contacts the customer itself. The first time it opens a lead,
 * the customer gets a "lead viewed" message on their My Leads page.
 */

function toLead(row) {
  return {
    id: row.id,
    businessId: row.business_id,
    business: row.businesses?.name ?? '',
    name: row.name,
    email: row.email,
    phone: row.phone,
    sentAt: row.created_at,
    viewedAt: row.viewed_at,
    messageRead: row.viewed_message_read,
  }
}

export async function getBusiness(id) {
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, verified, description')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function sendLead({ businessId, name, email, phone }) {
  const { error } = await supabase.from('leads').insert({
    business_id: businessId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
  })
  if (error) throw error
}

/* Number of "lead viewed" messages the customer hasn't seen yet. */
export async function countUnreadViews(customerId) {
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('customer_id', customerId)
    .not('viewed_at', 'is', null)
    .eq('viewed_message_read', false)
  if (error) throw error
  return count
}

/* Runs `load` whenever `key` changes and keeps the latest result. */
function useLeadQuery(load, key) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    load()
      .then((result) => {
        if (cancelled) return
        setLeads(result)
        setError('')
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
    // `load` is rebuilt every render; `key` is what it actually depends on.
  }, [key])

  return { leads, loading, error }
}

/* Calls `mark` once for the leads that need it, after they are on screen.
 * Kept apart from loading so a reload never sees them already marked. */
function useMarkOnce(ids, mark) {
  const done = useRef(new Set())
  // Compared by value, since the ids array is rebuilt every render.
  const key = ids.join(',')

  useEffect(() => {
    const fresh = ids.filter((id) => !done.current.has(id))
    if (fresh.length === 0) return
    fresh.forEach((id) => done.current.add(id))
    mark(fresh)
  }, [key])
}

/* Leads sent to one business, newest first. Showing them marks them viewed,
 * which is what sends the customer their "lead viewed" message. Leads keep the
 * viewedAt they had when loaded, so new ones stay highlighted this visit. */
export function useBusinessLeads(businessId) {
  const result = useLeadQuery(async () => {
    if (!businessId) return []
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(toLead)
  }, businessId)

  useMarkOnce(
    result.leads.filter((lead) => !lead.viewedAt).map((lead) => lead.id),
    async (ids) => {
      await supabase.rpc('mark_leads_viewed', { lead_ids: ids })
    },
  )

  return result
}

/* Leads the signed-in customer has sent, newest first. Showing them marks the
 * "lead viewed" messages read; messageRead keeps its loaded value so they stay
 * highlighted this visit. */
export function useCustomerLeads(customerId) {
  const result = useLeadQuery(async () => {
    if (!customerId) return []
    const { data, error } = await supabase
      .from('leads')
      .select('*, businesses(name)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(toLead)
  }, customerId)

  useMarkOnce(
    result.leads.filter((lead) => lead.viewedAt && !lead.messageRead).map((lead) => lead.id),
    async () => {
      await supabase.rpc('read_lead_view_messages')
      // Lets the navbar drop its unread count straight away.
      window.dispatchEvent(new Event(LEAD_MESSAGES_READ))
    },
  )

  return result
}

// Fired once the customer's "lead viewed" messages have been marked read.
export const LEAD_MESSAGES_READ = 'locallink:lead-messages-read'

export function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}
