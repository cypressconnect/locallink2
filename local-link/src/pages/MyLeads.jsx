import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { formatDate, useCustomerLeads } from '../data/leadStore.js'

/*
 * The leads a customer has sent, each with a "viewed" message once the
 * business has opened it.
 */
export default function MyLeads() {
  const { user } = useAuth()
  const { leads, loading, error } = useCustomerLeads(user.id)

  if (user.accountType === 'business') return <Navigate to="/leads" replace />

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">My Leads</div>
          <h1 className="section-heading text-accent">Leads you have sent</h1>
          <p>Each business contacts you directly. You&apos;ll see here when one has viewed your lead.</p>
        </div>

        {loading && <p className="text-ink/60">Loading leads…</p>}
        {error && <p className="text-coral">{error}</p>}

        {!loading && !error && leads.length === 0 && (
          <div className="flex flex-col items-start gap-fluid-2">
            <p>You haven&apos;t sent any leads yet.</p>
            <Link to="/marketplace" className="btn-dark">
              Browse the marketplace
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-fluid-2">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`card flex flex-col gap-1 ${
                lead.viewedAt && !lead.messageRead ? 'border-l-4 border-accent' : ''
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-fluid-1 font-bold">{lead.business}</h2>
                <span className="text-fluid-0 text-ink/60">Sent {formatDate(lead.sentAt)}</span>
              </div>
              {lead.viewedAt ? (
                <p className="text-accent">
                  {lead.business} viewed your lead on {formatDate(lead.viewedAt)}. Expect to hear
                  from them soon.
                </p>
              ) : (
                <p className="text-ink/60">Not viewed yet.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
