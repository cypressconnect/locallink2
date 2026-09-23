import { Link } from 'react-router-dom'

// Shared by the homepage "Popular Products" grid and the marketplace.
export default function ProductCard({ product, showLeadButton = false }) {
  return (
    <div className="flex flex-col gap-fluid-2">
      <img
        src={product.image}
        alt={product.name}
        width="790"
        height="661"
        className="w-full"
        loading="lazy"
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-fluid-0 font-bold">{product.name}</h3>
          {product.verified && <VerifiedBadge />}
        </div>
        <p>{product.business}</p>
        {product.price && <p className="text-ink/60">{product.price}</p>}
      </div>

      {showLeadButton && (
        <Link to={`/lead/${product.id}`} className="btn min-w-0 w-full">
          Send Lead
        </Link>
      )}
    </div>
  )
}

// Businesses that have passed Local Link's verification checks.
function VerifiedBadge() {
  return (
    <span
      title="This business has been verified by Local Link"
      className="border border-accent px-2 py-[2px] text-[12px] font-bold text-accent"
    >
      Verified
    </span>
  )
}
