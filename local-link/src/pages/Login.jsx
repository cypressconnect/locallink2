import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth.jsx'
import { DEMO_BUSINESS_EMAIL, topics } from '../data/products.js'
import { createBusiness } from '../data/businessStore.js'

// Shown on the page so the site can be tried without signing up. The business
// one owns two seed businesses, so switching between them can be demoed.
const demoAccounts = [
  {
    accountType: 'customer',
    label: 'Customer',
    name: 'Demo Customer',
    email: 'customer@locallink.com',
    password: 'customer123',
  },
  {
    accountType: 'business',
    label: 'Student Business',
    name: 'Bobby Chen',
    email: DEMO_BUSINESS_EMAIL,
    password: 'business123',
  },
]

const emptyForm = {
  name: '',
  businessName: '',
  topicId: topics[0].id,
  email: '',
  password: '',
  confirmPassword: '',
}

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [accountType, setAccountType] = useState('customer')
  const [mode, setMode] = useState('login') // "login" or "signup"
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const isBusiness = accountType === 'business'
  const isSignup = mode === 'signup'

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSignup && form.password !== form.confirmPassword) {
      setError('Those passwords do not match.')
      return
    }

    const demo = demoAccounts.find((account) => account.email === form.email)
    if (demo && !isSignup && form.password !== demo.password) {
      setError('That is not the password for this demo account.')
      return
    }

    // A demo email always signs in as its own account type, whichever tab is picked.
    const type = demo?.accountType ?? accountType

    setError('')
    signIn({
      name: demo?.name || form.name || form.email,
      email: form.email,
      accountType: type,
    })

    // A business signup starts with its first business already set up.
    if (isSignup && isBusiness) {
      createBusiness({ owner: form.email, name: form.businessName, topicId: form.topicId })
    }

    // Each account type lands on its own homepage.
    navigate(type === 'business' ? '/business' : '/marketplace')
  }

  return (
    <section className="section">
      <div className="shell flex max-w-[520px] flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <h1 className="section-heading text-accent">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h1>
          <p>
            {isBusiness
              ? 'Reach customers in your area and collect leads for your products.'
              : 'Find student businesses near you and send them your details.'}
          </p>
        </div>

        {/* Customer vs student business */}
        <div className="grid grid-cols-2">
          <TypeTab
            label="Customer"
            active={!isBusiness}
            onClick={() => setAccountType('customer')}
          />
          <TypeTab
            label="Student Business"
            active={isBusiness}
            onClick={() => setAccountType('business')}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-fluid-2">
          {isSignup && (
            <input
              className="field"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Full name"
              required
            />
          )}

          {isSignup && isBusiness && (
            <input
              className="field"
              name="businessName"
              value={form.businessName}
              onChange={updateField}
              placeholder="Business name"
              required
            />
          )}

          {isSignup && isBusiness && (
            <select
              className="field"
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
          )}

          <input
            className="field"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder={isBusiness ? 'School email' : 'Email'}
            required
          />

          <input
            className="field"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Password"
            required
          />

          {isSignup && (
            <input
              className="field"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              placeholder="Confirm password"
              required
            />
          )}

          {error && <p className="text-coral">{error}</p>}

          {isSignup && isBusiness && (
            <p className="text-fluid-0 text-ink/60">
              New businesses are reviewed before they get a Verified badge. You can list
              products right away, but the badge only appears once your school email and
              identity are confirmed.
            </p>
          )}

          <button type="submit" className="btn-dark">
            {isSignup ? 'Create account' : 'Log in'}
          </button>
        </form>

        {!isSignup && (
          <div className="card flex flex-col gap-fluid-2">
            <h2 className="text-fluid-1 font-bold text-accent">Demo accounts</h2>
            {demoAccounts.map((account) => (
              <div
                key={account.email}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <div className="flex flex-col">
                  <span className="font-bold">{account.label}</span>
                  <span className="text-fluid-0">{account.email}</span>
                  <span className="text-fluid-0">Password: {account.password}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAccountType(account.accountType)
                    setForm({ ...emptyForm, email: account.email, password: account.password })
                    setError('')
                  }}
                  className="nav-link cursor-pointer underline"
                >
                  Use this account
                </button>
              </div>
            ))}
          </div>
        )}

        <p>
          {isSignup ? 'Already have an account?' : 'New to Local Link?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup')
              setError('')
            }}
            className="nav-link cursor-pointer underline"
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </section>
  )
}

function TypeTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer border px-5 py-3 transition-colors duration-200 ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-ink bg-white text-ink hover:text-coral'
      }`}
    >
      {label}
    </button>
  )
}
