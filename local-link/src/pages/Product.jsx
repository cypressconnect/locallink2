import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth, Loading } from '../auth.jsx'
import { useProductReviews } from '../data/reviewStore.js'
import { formatDate } from '../data/leadStore.js'
import { RatingSummary, Stars, VerifiedBadge } from '../components/ProductCard.jsx'

/*
 * One product and its reviews. Customers can leave a review (1 to 5 stars and
 * an optional comment), then edit or delete it. Business accounts only read.
 */
export default function Product() {
  const { productId } = useParams()
  const { user } = useAuth()
  const { product, reviews, summary, error, saveReview, deleteReview } = useProductReviews(productId)

  if (error && product === undefined) return <Message title="Product" text={error} />
  if (product === undefined) return <Loading />
  if (product === null) {
    return <Message title="Product not found" text="That product may have been removed by its business." />
  }

  const mine = reviews.find((review) => review.customerId === user.id)
  const canReview = user.accountType === 'customer' && product.owner !== user.email

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="grid items-start gap-fluid-4 md:grid-cols-2">
          <img
            src={product.image}
            alt={product.name}
            width="790"
            height="661"
            className="aspect-[790/661] w-full object-cover"
          />

          <div className="flex flex-col gap-fluid-2">
            <div className="flex flex-col gap-1">
              <div className="text-fluid-0 font-bold text-accent">{product.business}</div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="section-heading text-accent">{product.name}</h1>
                {product.verified && <VerifiedBadge />}
              </div>
              <RatingSummary rating={summary.rating} count={summary.reviewCount} />
            </div>
            {product.description && <p>{product.description}</p>}
            {product.price && <p className="text-ink/60">{product.price}</p>}
            <div className="flex flex-wrap gap-fluid-2">
              <Link to={`/lead/${product.businessId}`} className="btn">
                Send Lead
              </Link>
              <Link to="/marketplace" className="btn-dark">
                Back to marketplace
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-fluid-2">
          <h2 className="section-heading text-accent">Reviews</h2>

          {canReview ? (
            // Keyed so the form resets to the saved review after each change.
            <ReviewForm
              key={mine ? `${mine.id}-${mine.updatedAt}` : 'new'}
              existing={mine}
              onSave={saveReview}
              onDelete={deleteReview}
            />
          ) : (
            <p className="text-ink/60">
              {user.accountType === 'customer'
                ? 'You cannot review a product from your own business.'
                : 'Only customer accounts can leave reviews.'}
            </p>
          )}

          {reviews.length > 0 ? (
            <ul className="flex flex-col gap-fluid-2">
              {reviews.map((review) => (
                <ReviewItem key={review.id} review={review} isMine={review.customerId === user.id} />
              ))}
            </ul>
          ) : (
            <p>No reviews yet. Be the first to say what you thought.</p>
          )}
        </div>
      </div>
    </section>
  )
}

function ReviewForm({ existing, onSave, onDelete }) {
  const [rating, setRating] = useState(existing?.rating ?? 0)
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (action) => {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!rating) {
      setError('Pick between 1 and 5 stars.')
      return
    }
    run(() => onSave({ existing, rating, comment }))
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
      <h3 className="text-fluid-1 font-bold text-accent">
        {existing ? 'Your review' : 'Leave a review'}
      </h3>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2">Rating</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
              aria-pressed={rating === star}
              className={`cursor-pointer text-[32px] leading-none transition-colors duration-200 hover:text-coral ${
                star <= rating ? 'text-accent' : 'text-ink/25'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span>Comment (optional)</span>
        <textarea
          className="field min-h-[120px] bg-white"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={1000}
          placeholder="What did you think of it?"
        />
      </label>

      {error && <p className="text-coral">{error}</p>}

      <div className="flex flex-wrap items-center gap-fluid-2">
        <button type="submit" disabled={busy} className="btn-dark cursor-pointer disabled:opacity-60">
          {busy ? 'Saving…' : existing ? 'Update review' : 'Post review'}
        </button>
        {existing && (
          <button
            type="button"
            disabled={busy}
            onClick={() => run(() => onDelete(existing))}
            className="nav-link cursor-pointer underline disabled:opacity-60"
          >
            Delete review
          </button>
        )}
      </div>
    </form>
  )
}

function ReviewItem({ review, isMine }) {
  const edited = review.updatedAt !== review.createdAt
  return (
    <li className="flex flex-col gap-1 border-b border-ink/15 pb-fluid-2">
      <div className="flex flex-wrap items-center gap-2">
        <Stars rating={review.rating} />
        <span className="font-bold">{review.name}</span>
        {isMine && <span className="text-fluid-0 text-accent">(you)</span>}
      </div>
      {review.comment && <p>{review.comment}</p>}
      <p className="text-fluid-0 text-ink/60">
        {formatDate(review.createdAt)}
        {edited && ' · edited'}
      </p>
    </li>
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
