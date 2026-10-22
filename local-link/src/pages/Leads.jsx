import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth, Loading } from '../auth.jsx'
import { getActiveBusinessId, setActiveBusinessId, useBusinesses } from '../data/businessStore.js'
import { formatDate, useBusinessLeads } from '../data/leadStore.js'

/*
 * Leads customers have sent to the business picked in the switcher. Opening
 * this page marks them viewed, which lets each customer know.
 */
export default function Leads() {
  const { user } = useAuth()
  const { businesses, loading } = useBusinesses()
  const [activeId, setActiveId] = useState(() => getActiveBusinessId(user.email))

  if (user.accountType !== 'business') return <Navigate to="/my-leads" replace />
  if (loading) return <Loading />

  const owned = businesses.filter((business) => business.owner === user.email)
  const active = owned.find((business) => business.id === activeId) ?? owned[0]

  const switchTo = (id) => {
    setActiveId(id)
    setActiveBusinessId(user.email, id)
  }

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">Leads</div>
          <h1 className="section-heading text-accent">{active ? active.name : 'Your leads'}</h1>
          <p>
            Customers who want to hear from you. Get in touch with them yourself by email or
            phone. Leads are free for now.
          </p>
        </div>

        {owned.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            {owned.map((business) => (
              <button
                key={business.id}
                type="button"
                onClick={() => switchTo(business.id)}
                className={`cursor-pointer border px-4 py-2 transition-colors duration-200 ${
                  business.id === active.id
                    ? 'border-accent bg-accent text-white'
                    : 'border-ink bg-white text-ink hover:text-coral'
                }`}
              >
                {business.name}
              </button>
            ))}
          </div>
        )}

        {active ? (
          <LeadList key={active.id} businessId={active.id} />
        ) : (
          <div className="flex flex-col items-start gap-fluid-2">
            <p>Set up a business first, then customers can send it leads.</p>
            <Link to="/business" className="btn-dark">
              Go to My Business
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function LeadList({ businessId }) {
  const { leads, loading, error } = useBusinessLeads(businessId)

  if (loading) return <p className="text-ink/60">Loading leads…</p>
  if (error) return <p className="text-coral">{error}</p>
  if (leads.length === 0) {
    return <p>No leads yet. They show up here as soon as a customer sends one.</p>
  }

  const fresh = leads.filter((lead) => !lead.viewedAt).length

  return (
    <div className="flex flex-col gap-fluid-2">
      <p className="text-ink/60">
        {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        {fresh > 0 && `, ${fresh} new`}
      </p>
      <div className="grid gap-fluid-2 md:grid-cols-2">
        {leads.map((lead) => (
          <div key={lead.id} className="card flex flex-col gap-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-fluid-1 font-bold">{lead.name}</h2>
              {!lead.viewedAt && (
                <span className="border border-coral px-2 py-[2px] text-[12px] font-bold text-coral">
                  New
                </span>
              )}
            </div>
            <a href={`mailto:${lead.email}`} className="nav-link break-all">
              {lead.email}
            </a>
            <a href={`tel:${lead.phone}`} className="nav-link">
              {lead.phone}
            </a>
            <p className="text-fluid-0 text-ink/60">Sent {formatDate(lead.sentAt)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
