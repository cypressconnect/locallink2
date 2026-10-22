import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth, Loading } from '../auth.jsx'
import { getBusiness, sendLead } from '../data/leadStore.js'
import { VerifiedBadge } from '../components/ProductCard.jsx'

/*
 * A customer sends their name, email and phone to one business. Sending a
 * lead is free for now; the business contacts the customer itself.
 */
export default function SendLead() {
  const { businessId } = useParams()
  const { user } = useAuth()
  const [business, setBusiness] = useState(undefined) // undefined while loading
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    getBusiness(businessId)
      .then(setBusiness)
      .catch((err) => setLoadError(err.message))
  }, [businessId])

  if (loadError) return <Message title="Send a Lead" text={loadError} />
  if (business === undefined) return <Loading />
  if (business === null) {
    return <Message title="Business not found" text="That business may have closed its page." />
  }
  if (user.accountType !== 'customer') {
    return (
      <Message
        title={`Send a lead to ${business.name}`}
        text="Leads can only be sent from a customer account. Log in as a customer to send one."
      />
    )
  }

  return <LeadForm business={business} user={user} />
}

function LeadForm({ business, user }) {
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: '' })
  const [status, setStatus] = useState('idle') // idle, sending, sent
  const [error, setError] = useState('')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await sendLead({ businessId: business.id, ...form })
      setStatus('sent')
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  if (status === 'sent') {
    return (
      <section className="section">
        <div className="shell flex max-w-[620px] flex-col gap-fluid-2">
          <h1 className="section-heading text-accent">Lead sent</h1>
          <p>
            {business.name} now has your details and will contact you by email or phone.
            You&apos;ll get a message on My Leads as soon as they view it.
          </p>
          <div className="flex flex-wrap gap-fluid-2">
            <Link to="/my-leads" className="btn-dark">
              View my leads
            </Link>
            <Link to="/marketplace" className="btn">
              Back to marketplace
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="shell flex max-w-[620px] flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">Send a Lead</div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="section-heading text-accent">{business.name}</h1>
            {business.verified && <VerifiedBadge />}
          </div>
          {business.description && <p>{business.description}</p>}
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
          <p>
            Your details go straight to {business.name} so they can get in touch. Sending a
            lead is free.
          </p>
          <label className="flex flex-col gap-2">
            <span>Name</span>
            <input
              className="field bg-white"
              name="name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Email</span>
            <input
              className="field bg-white"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span>Phone</span>
            <input
              className="field bg-white"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              autoComplete="tel"
              pattern="[0-9+()\- ]{7,}"
              title="At least 7 digits. Spaces, dashes, brackets and + are fine."
              required
            />
          </label>

          {error && <p className="text-coral">{error}</p>}

          <button type="submit" disabled={status === 'sending'} className="btn-dark cursor-pointer self-start disabled:opacity-60">
            {status === 'sending' ? 'Sending…' : 'Send lead'}
          </button>
        </form>
      </div>
    </section>
  )
}

function Message({ title, text }) {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-2">
        <h1 className="section-heading text-accent">{title}</h1>
        <p>{text}</p>
        <Link to="/marketplace" className="btn self-start">
          Back to marketplace
        </Link>
      </div>
    </section>
  )
}
