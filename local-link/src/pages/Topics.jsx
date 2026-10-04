import { Link, useSearchParams } from 'react-router-dom'
import { findTopic, topics } from '../data/products.js'
import { useBusinesses } from '../data/businessStore.js'
import { VerifiedBadge } from '../components/ProductCard.jsx'

/*
 * Topics are categories of businesses. Picking one (?topic=baked-goods) lists
 * every business in it, and a customer can send any of them a lead.
 */
export default function Topics() {
  const [params, setParams] = useSearchParams()
  const { businesses } = useBusinesses()
  const current = findTopic(params.get('topic'))

  if (current) {
    return (
      <TopicBusinesses
        topic={current}
        businesses={businesses.filter((business) => business.topicId === current.id)}
        onBack={() => setParams({})}
      />
    )
  }

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">Topics</div>
          <h1 className="section-heading text-accent">Browse by category</h1>
          <p>Pick a topic to see every student business in it and send a lead to the ones you like.</p>
        </div>

        <div className="grid gap-fluid-4 sm:grid-cols-2 md:grid-cols-3">
          {topics.map((topic) => {
            const count = businesses.filter((business) => business.topicId === topic.id).length
            return (
              <Link
                key={topic.id}
                to={`/topics?topic=${topic.id}`}
                className="group flex flex-col gap-fluid-2 text-ink no-underline"
              >
                <img
                  src={topic.image}
                  alt=""
                  width="790"
                  height="661"
                  className="w-full transition-opacity duration-200 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="flex items-center gap-3">
                  <img src={topic.icon} alt="" width="125" height="125" className="h-10 w-10" />
                  <h2 className="text-fluid-1 font-bold text-accent group-hover:text-coral">
                    {topic.name}
                  </h2>
                </div>
                <p>{topic.blurb}</p>
                <p className="text-fluid-0 text-ink/60">
                  {count} {count === 1 ? 'business' : 'businesses'}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TopicBusinesses({ topic, businesses, onBack }) {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <button type="button" onClick={onBack} className="nav-link cursor-pointer self-start underline">
          ← All topics
        </button>

        <div className="flex items-center gap-3">
          <img src={topic.icon} alt="" width="125" height="125" className="h-14 w-14" />
          <div className="flex flex-col gap-1">
            <h1 className="section-heading text-accent">{topic.name}</h1>
            <p>{topic.blurb}</p>
          </div>
        </div>

        {businesses.length > 0 ? (
          <div className="grid gap-fluid-2 md:grid-cols-2">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p>No businesses in {topic.name} yet. Check back soon.</p>
        )}
      </div>
    </section>
  )
}

function BusinessCard({ business }) {
  return (
    <div className="card flex flex-col justify-between gap-fluid-2">
      <div className="flex flex-col gap-fluid-2">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-fluid-1 font-bold">{business.name}</h2>
          {business.verified && <VerifiedBadge />}
        </div>
        <p>{business.description}</p>

        {business.products.length > 0 && (
          <ul className="flex flex-col gap-1">
            {business.products.map((product) => (
              <li key={product.id} className="flex justify-between gap-2 border-t border-ink/10 pt-1">
                <span>{product.name}</span>
                <span className="text-ink/60">{product.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to={`/lead/${business.id}`} className="btn min-w-0 w-full">
        Send Lead
      </Link>
    </div>
  )
}
