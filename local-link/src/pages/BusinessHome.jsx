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

const emptyProduct = { name: '', price: '', image: productImages[0] }

function ProductsSection({ business, onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyProduct)
  const products = listProducts([business])

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onAdd(form)
    setForm(emptyProduct)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-fluid-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-heading">Products</h2>
        <button type="button" onClick={() => setOpen(!open)} className="btn cursor-pointer">
          {open ? 'Cancel' : 'Add a product'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
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
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2">Picture</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {productImages.map((image) => (
                <label key={image} className="cursor-pointer">
                  <input
                    type="radio"
                    name="image"
                    value={image}
                    checked={form.image === image}
                    onChange={updateField}
                    className="sr-only"
                  />
                  <img
                    src={image}
                    alt=""
                    width="790"
                    height="661"
                    className={`w-full border-4 ${
                      form.image === image ? 'border-accent' : 'border-transparent'
                    }`}
                  />
                </label>
              ))}
            </div>
          </fieldset>
          <button type="submit" className="btn-dark cursor-pointer self-start">
            Save product
          </button>
        </form>
      )}

      {products.length > 0 ? (
        <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
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
