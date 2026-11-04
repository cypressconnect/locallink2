import { Link } from 'react-router-dom'

// Shared by the homepage "Popular Products" grid and the marketplace.
export default function ProductCard({
  product,
  showLeadButton = false,
  showTopic = false,
  onDelete,
  onChangePhoto,
  changingPhoto = false,
}) {
  return (
    <div className="flex flex-col gap-fluid-2">
      {/* The picture and name open the product page, where its reviews are. */}
      <Link to={`/product/${product.id}`} className="group flex flex-col gap-fluid-2 text-ink no-underline">
        <img
          src={product.image}
          alt={product.name}
          width="790"
          height="661"
          className="aspect-[790/661] w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
          loading="lazy"
        />
        <div className="flex items-center gap-2">
          <h3 className="text-fluid-0 font-bold group-hover:text-coral">{product.name}</h3>
          {product.verified && <VerifiedBadge />}
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <p>{product.business}</p>
        <RatingSummary rating={product.rating} count={product.reviewCount} />
        {showTopic && product.topic && <p className="text-fluid-0 text-accent">{product.topic}</p>}
        {product.description && <p className="text-fluid-0">{product.description}</p>}
        {product.price && <p className="text-ink/60">{product.price}</p>}
      </div>

      {showLeadButton && (
        <Link to={`/lead/${product.businessId}`} className="btn min-w-0 w-full">
          Send Lead
        </Link>
      )}

      {/* Only passed on the business homepage, for the business's own products. */}
      {(onChangePhoto || onDelete) && (
        <div className="flex flex-wrap gap-fluid-2">
          {onChangePhoto && (
            <label className={`nav-link cursor-pointer underline ${changingPhoto ? 'opacity-60' : ''}`}>
              {changingPhoto ? 'Uploading…' : 'Change photo'}
              <input
                type="file"
                accept="image/*"
                disabled={changingPhoto}
                onChange={(event) => {
                  const file = event.target.files[0]
                  // Cleared so picking the same file again still fires.
                  event.target.value = ''
                  if (file) onChangePhoto(file)
                }}
                className="sr-only"
              />
            </label>
          )}
          {onDelete && (
            <button type="button" onClick={onDelete} className="nav-link cursor-pointer underline">
              Delete product
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Businesses that have passed Local Link's verification checks.
export function VerifiedBadge() {
  return (
    <span
      title="This business has been verified by Local Link"
      className="border border-accent px-2 py-[2px] text-[12px] font-bold text-accent"
    >
      Verified
    </span>
  )
}

/* Read-only stars, e.g. ★★★★☆ for 4. Half stars round to the nearest whole. */
export function Stars({ rating, className = '' }) {
  const filled = Math.round(rating ?? 0)
  return (
    <span className={`tracking-[2px] text-accent ${className}`} aria-label={`${rating ?? 0} out of 5 stars`}>
      {'★'.repeat(filled)}
      <span className="text-ink/25">{'★'.repeat(5 - filled)}</span>
    </span>
  )
}

/* Average stars and how many reviews, or "No reviews yet". */
export function RatingSummary({ rating, count }) {
  if (!count) return <p className="text-fluid-0 text-ink/60">No reviews yet</p>
  return (
    <p className="flex items-center gap-2 text-fluid-0">
      <Stars rating={rating} />
      <span>
        {rating.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
      </span>
    </p>
  )
}
