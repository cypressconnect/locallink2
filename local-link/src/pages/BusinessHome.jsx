import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { findTopic, productImages, topics } from '../data/products.js'
import {
  getActiveBusinessId,
  listProducts,
  setActiveBusinessId,
  useBusinesses,
} from '../data/businessStore.js'
import ProductCard, { VerifiedBadge } from '../components/ProductCard.jsx'

/*
 * Where a business account lands after logging in. One account can run several
 * businesses; this page manages whichever one is picked in the switcher.
 */
export default function BusinessHome() {
  const { user } = useAuth()
  const { businesses, addBusiness, updateBusiness, addProduct } = useBusinesses()
  const [activeId, setActiveId] = useState(() => getActiveBusinessId(user?.email))
  const [adding, setAdding] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (user.accountType !== 'business') return <Navigate to="/marketplace" replace />

  const owned = businesses.filter((business) => business.owner === user.email)
  // Fall back to the first business if the saved one no longer exists.
  const active = owned.find((business) => business.id === activeId) ?? owned[0]

  const switchTo = (id) => {
    setActiveId(id)
    setActiveBusinessId(user.email, id)
    setAdding(false)
  }

  const handleAdd = (details) => {
    const business = addBusiness({ ...details, owner: user.email })
    switchTo(business.id)
  }

  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <div className="text-fluid-0 font-bold text-accent">Business Homepage</div>
          <h1 className="section-heading text-accent">
            {active ? active.name : 'Set up your business'}
          </h1>
          {active && (
            <div className="flex flex-wrap items-center gap-2">
              <span>{findTopic(active.topicId)?.name}</span>
              {active.verified ? (
                <VerifiedBadge />
              ) : (
                <span className="text-fluid-0 text-ink/60">Verification pending</span>
              )}
            </div>
          )}
        </div>

        <BusinessSwitcher
          owned={owned}
          activeId={active?.id}
          adding={adding || !active}
          onSwitch={switchTo}
          onAddClick={() => setAdding(!adding)}
        />

        {(adding || !active) && (
          <NewBusinessForm
            onSubmit={handleAdd}
            onCancel={active ? () => setAdding(false) : null}
          />
        )}

        {active && !adding && (
          <>
            {/* Keyed so the editors reset when switching business. */}
            <DescriptionCard
              key={`description-${active.id}`}
              business={active}
              onSave={(description) => updateBusiness(active.id, { description })}
            />
            <ProductsSection
              key={`products-${active.id}`}
              business={active}
              onAdd={(product) => addProduct(active.id, product)}
            />
            <LeadsCard />
          </>
        )}
      </div>
    </section>
  )
}

function BusinessSwitcher({ owned, activeId, adding, onSwitch, onAddClick }) {
  return (
    <div className="flex flex-col gap-fluid-2">
      <h2 className="text-fluid-1 font-bold">Your businesses</h2>
      <div className="flex flex-wrap items-center gap-2">
        {owned.map((business) => (
          <Chip
            key={business.id}
            label={business.name}
            active={!adding && business.id === activeId}
            onClick={() => onSwitch(business.id)}
          />
        ))}
        {owned.length > 0 && (
          <Chip label="+ Add a business" active={adding} onClick={onAddClick} />
        )}
      </div>
    </div>
  )
}

function NewBusinessForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', topicId: topics[0].id, description: '' })

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
      <h2 className="text-fluid-1 font-bold text-accent">Add a new business</h2>
      <input
        className="field bg-white"
        name="name"
        value={form.name}
        onChange={updateField}
        placeholder="Business name"
        required
      />
      <select
        className="field bg-white"
        name="topicId"
        value={form.topicId}
        onChange={updateField}
        aria-label="Topic"
      >
        {topics.map((topic) => (
          <option key={topic.id} value={topic.id}>
            {topic.name}
          </option>
        ))}
      </select>
      <textarea
        className="field bg-white"
        name="description"
        rows="3"
        value={form.description}
        onChange={updateField}
        placeholder="What does your business offer?"
        required
      />
      <div className="flex flex-wrap gap-fluid-2">
        <button type="submit" className="btn-dark cursor-pointer">
          Create business
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="nav-link cursor-pointer underline">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function DescriptionCard({ business, onSave }) {
  const [shown, setShown] = useState(true)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(business.description)

  const startEditing = () => {
    setDraft(business.description)
    setShown(true)
    setEditing(true)
  }

  const handleSave = (event) => {
    event.preventDefault()
    onSave(draft.trim())
    setEditing(false)
  }

  return (
    <div className="card flex flex-col gap-fluid-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-fluid-1 font-bold text-accent">Description</h2>
        <div className="flex gap-fluid-2">
          {!editing && (
            <button
              type="button"
              onClick={() => setShown(!shown)}
              className="nav-link cursor-pointer underline"
            >
              {shown ? 'Hide description' : 'Show description'}
            </button>
          )}
          {!editing && (
            <button type="button" onClick={startEditing} className="nav-link cursor-pointer underline">
              Edit
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-fluid-2">
          <textarea
            className="field bg-white"
            rows="4"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Business description"
            required
          />
          <div className="flex flex-wrap gap-fluid-2">
            <button type="submit" className="btn-dark cursor-pointer">
              Save description
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="nav-link cursor-pointer underline"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        shown && <p>{business.description || 'No description yet. Add one so customers know what you offer.'}</p>
      )}
    </div>
  )
}

// Uploaded photos are shrunk to this width so they fit in localStorage.
const MAX_IMAGE_WIDTH = 800

/* Reads an uploaded photo and returns it as a small JPEG data URL. */
function shrinkImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_IMAGE_WIDTH / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read that image.'))
    }
    img.src = url
  })
}

function emptyProduct(business) {
  return {
    name: '',
    price: '',
    description: '',
    topicId: business.topicId,
    image: productImages[0].src,
  }
}

function ProductsSection({ business, onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(() => emptyProduct(business))
  const [error, setError] = useState('')
  const products = listProducts([business])
  const uploaded = form.image.startsWith('data:')

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    try {
      setForm({ ...form, image: await shrinkImage(file) })
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const close = () => {
    setForm(emptyProduct(business))
    setError('')
    setOpen(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const saved = onAdd({ ...form, name: form.name.trim(), description: form.description.trim() })
    if (!saved) {
      setError('Added for now, but your browser ran out of space to save it. Try a smaller picture.')
      return
    }
    close()
  }

  return (
    <div className="flex flex-col gap-fluid-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-heading">Products</h2>
        <button
          type="button"
          onClick={() => (open ? close() : setOpen(true))}
          className="btn cursor-pointer"
        >
          {open ? 'Cancel' : 'Add a product'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
          <h3 className="text-fluid-1 font-bold text-accent">Add a product to the marketplace</h3>
          <input
            className="field bg-white"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Product name"
            required
          />
          <input
            className="field bg-white"
            name="price"
            value={form.price}
            onChange={updateField}
            placeholder="Price, e.g. $10 / hour"
            required
          />
          <textarea
            className="field bg-white"
            name="description"
            rows="3"
            value={form.description}
            onChange={updateField}
            placeholder="Describe the product so customers know what they are getting"
            required
          />
          <label className="flex flex-col gap-2">
            <span>Topic</span>
            <select
              className="field bg-white"
              name="topicId"
              value={form.topicId}
              onChange={updateField}
            >
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">Picture</legend>
            <div className="flex flex-wrap items-center gap-fluid-2">
              <label className="btn cursor-pointer">
                Upload a photo
                <input type="file" accept="image/*" onChange={handleUpload} className="sr-only" />
              </label>
              {uploaded && (
                <img
                  src={form.image}
                  alt="Your uploaded product photo"
                  className="h-24 w-auto border-4 border-accent"
                />
              )}
            </div>
            <p className="text-fluid-0 text-ink/60">Or pick one of ours:</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {productImages.map(({ src, label }) => (
                <label key={src} className="flex cursor-pointer flex-col gap-1 text-center text-fluid-0">
                  <input
                    type="radio"
                    name="image"
                    value={src}
                    checked={form.image === src}
                    onChange={updateField}
                    className="sr-only"
                  />
                  <img
                    src={src}
                    alt=""
                    width="790"
                    height="661"
                    className={`w-full border-4 ${
                      form.image === src ? 'border-accent' : 'border-transparent'
                    }`}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-coral">{error}</p>}

          <button type="submit" className="btn-dark cursor-pointer self-start">
            Add to marketplace
          </button>
        </form>
      )}

      {products.length > 0 ? (
        <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showTopic />
          ))}
        </div>
      ) : (
        <p>No products yet. Add one and it shows up in the marketplace straight away.</p>
      )}
    </div>
  )
}

function LeadsCard() {
  return (
    <div className="card flex flex-col gap-fluid-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-fluid-1 font-bold text-accent">Leads</h2>
        <p>Customers who send you a lead will be listed here. This part is still in progress.</p>
      </div>
      <Link to="/leads" className="btn-dark shrink-0">
        View leads
      </Link>
    </div>
  )
}

function Chip({ label, active, onClick }) {
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
