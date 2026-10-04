import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { topics } from '../data/products.js'
import { listProducts, useBusinesses } from '../data/businessStore.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Marketplace() {
  // A topic card can link straight into a filtered marketplace (?topic=Bakery).
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const { businesses } = useBusinesses()

  const topic = params.get('topic') ?? 'All'

  const setTopic = (name) => {
    if (name === 'All') {
      setParams({}, { replace: true })
    } else {
      setParams({ topic: name }, { replace: true })
    }
  }

  const results = useMemo(() => {
    const search = query.trim().toLowerCase()

    return listProducts(businesses).filter((product) => {
      if (topic !== 'All' && product.topic !== topic) return false
      if (verifiedOnly && !product.verified) return false
      if (!search) return true
      return (
        product.name.toLowerCase().includes(search) ||
        product.business.toLowerCase().includes(search)
      )
    })
  }, [businesses, query, topic, verifiedOnly])

  const current = topics.find((entry) => entry.name === topic)

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">Your Local Marketplace</div>
          <h1 className="section-heading text-accent">Online Marketplace</h1>
          <p>Browse products from student businesses and send a lead to the ones you like.</p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-fluid-2">
          <input
            className="field"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or businesses"
          />

          <div className="flex flex-wrap items-center gap-2">
            <TopicChip label="All" active={topic === 'All'} onClick={() => setTopic('All')} />
            {topics.map((entry) => (
              <TopicChip
                key={entry.id}
                label={entry.name}
                icon={entry.icon}
                active={topic === entry.name}
                onClick={() => setTopic(entry.name)}
              />
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(event) => setVerifiedOnly(event.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            <span>Only show verified businesses</span>
          </label>
        </div>

        {/* Shown once a topic is picked, so the topic page is one click away. */}
        {current && (
          <div className="card flex flex-col gap-fluid-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img src={current.icon} alt="" width="125" height="125" className="h-12 w-12" />
              <div className="flex flex-col gap-1">
                <h2 className="text-fluid-1 font-bold text-accent">{current.name}</h2>
                <p>{current.blurb}</p>
              </div>
            </div>
            <Link to={`/topics?topic=${current.id}`} className="btn shrink-0">
              See businesses
            </Link>
          </div>
        )}

        <p className="text-ink/60">
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </p>

        {results.length > 0 ? (
          <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} showLeadButton />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-fluid-2">
            <p>No products matched that search. Try a different topic or keyword.</p>
            <Link to="/topics" className="btn-dark">
              Browse topics
            </Link>
          </div>
        )}

        {/* Customer protection, the thing the research said people care most about. */}
        <div className="card flex flex-col gap-1">
          <h2 className="text-fluid-1 font-bold text-accent">Buying safely</h2>
          <p>
            A Verified badge means Local Link has checked the student&apos;s school email
            and identity. Your contact details only reach a business when you send it a
            lead.
          </p>
        </div>
      </div>
    </section>
  )
}

function TopicChip({ label, icon, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 border px-4 py-2 transition-colors duration-200 ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-ink bg-white text-ink hover:text-coral'
      }`}
    >
      {icon && <img src={icon} alt="" width="125" height="125" className="h-5 w-5" />}
      {label}
    </button>
  )
}
