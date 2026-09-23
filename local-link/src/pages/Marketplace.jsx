import { useMemo, useState } from 'react'
import { products, productTopics } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Marketplace() {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('All')
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  const results = useMemo(() => {
    const search = query.trim().toLowerCase()

    return products.filter((product) => {
      if (topic !== 'All' && product.topic !== topic) return false
      if (verifiedOnly && !product.verified) return false
      if (!search) return true
      return (
        product.name.toLowerCase().includes(search) ||
        product.business.toLowerCase().includes(search)
      )
    })
  }, [query, topic, verifiedOnly])

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
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
            {productTopics.map((name) => (
              <TopicChip
                key={name}
                label={name}
                active={topic === name}
                onClick={() => setTopic(name)}
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
          <p>No products matched that search. Try a different topic or keyword.</p>
        )}
      </div>
    </section>
  )
}

function TopicChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border px-4 py-2 transition-colors duration-200 ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-ink bg-white text-ink hover:text-coral'
      }`}
    >
      {label}
    </button>
  )
}
