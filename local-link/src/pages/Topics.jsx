import { useState } from 'react'
import { useAuth } from '../auth.jsx'
import { topics, productsInTopic, findTopic } from '../data/products.js'
import { useTopicStore } from '../data/topicStore.js'

/*
 * A topic is a subscription. Customers submit their details to a topic, and
 * businesses subscribe to topics so they can see those details and get in
 * touch. Both sides of that live on this page, picked by account type.
 */
export default function Topics() {
  const { user } = useAuth()
  const isBusiness = user?.accountType === 'business'
  const { submissions, subscriptions, submit, toggle } = useTopicStore(user?.email)

  return (
    <>
      <section className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <div className="flex flex-col gap-1">
            <div className="text-fluid-0 font-bold text-accent">Topics</div>
            <h1 className="section-heading text-accent">
              {isBusiness ? 'Subscribe to a topic' : 'Tell businesses what you need'}
            </h1>
            <p>
              {isBusiness
                ? 'Pick the topics your business covers. Every customer who submits to one of them shows up in your list below.'
                : 'Submit your details to a topic once, and student businesses working in that topic can offer you what they make.'}
            </p>
          </div>

          <HowItWorks isBusiness={isBusiness} />

          <div className="grid gap-fluid-4 sm:grid-cols-2 md:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isBusiness={isBusiness}
                subscribed={subscriptions.includes(topic.id)}
                onToggle={() => toggle(topic.id)}
                submissionCount={
                  submissions.filter((entry) => entry.topicId === topic.id).length
                }
                user={user}
                onSubmit={submit}
              />
            ))}
          </div>
        </div>
      </section>

      {isBusiness && (
        <SubmissionsPanel submissions={submissions} subscriptions={subscriptions} />
      )}
    </>
  )
}

/* The three steps, written for whichever side is reading the page. */
function HowItWorks({ isBusiness }) {
  const steps = isBusiness
    ? [
        'Subscribe to the topics your products fit into.',
        'Read the submissions customers send to those topics.',
        'Email them about what you make. No cold lists, no bought data.',
      ]
    : [
        'Choose a topic that matches what you are looking for.',
        'Send your details and say what you need.',
        'Verified businesses in that topic get in touch with you.',
      ]

  return (
    <div className="card flex flex-col gap-fluid-2 sm:flex-row">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-1 flex-col gap-1">
          <div className="text-fluid-1 font-bold text-accent">{index + 1}</div>
          <p>{step}</p>
        </div>
      ))}
    </div>
  )
}

function TopicCard({
  topic,
  isBusiness,
  subscribed,
  onToggle,
  submissionCount,
  user,
  onSubmit,
}) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const productCount = productsInTopic(topic.name).length

  const handleSubmit = (submission) => {
    onSubmit({ ...submission, topicId: topic.id })
    setOpen(false)
    setSent(true)
  }

  return (
    <div className="flex flex-col gap-fluid-2">
      <img
        src={topic.image}
        alt={topic.name}
        width="790"
        height="661"
        className="w-full"
        loading="lazy"
      />

      <div className="flex items-center gap-3">
        <img src={topic.icon} alt="" width="125" height="125" className="h-10 w-10" />
        <h2 className="text-fluid-1 font-bold text-accent">{topic.name}</h2>
      </div>

      <div className="flex flex-col gap-1">
        <p>{topic.blurb}</p>
        <p className="text-fluid-0 text-ink/60">
          {productCount} {productCount === 1 ? 'product' : 'products'} ·{' '}
          {submissionCount} {submissionCount === 1 ? 'submission' : 'submissions'}
        </p>
      </div>

      {isBusiness ? (
        <button
          type="button"
          onClick={onToggle}
          className={subscribed ? 'btn-dark min-w-0 w-full' : 'btn min-w-0 w-full'}
        >
          {subscribed ? 'Subscribed — tap to leave' : 'Subscribe'}
        </button>
      ) : sent ? (
        <p className="border border-accent px-5 py-4 text-center font-bold text-accent">
          Sent to {topic.name}
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="btn min-w-0 w-full cursor-pointer"
        >
          {open ? 'Cancel' : 'Join this topic'}
        </button>
      )}

      {open && !isBusiness && (
        <SubmissionForm topic={topic} user={user} onSubmit={handleSubmit} />
      )}
    </div>
  )
}

/* What a customer sends to a topic. Prefilled when they are logged in. */
function SubmissionForm({ topic, user, onSubmit }) {
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: '',
    note: '',
    shareContact: true,
  })

  const updateField = (event) => {
    const { name, type, checked, value } = event.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-fluid-2">
      <input
        className="field"
        name="name"
        value={form.name}
        onChange={updateField}
        placeholder="Your name"
        required
      />
      <input
        className="field"
        name="email"
        type="email"
        value={form.email}
        onChange={updateField}
        placeholder="Email"
        required
      />
      <input
        className="field"
        name="phone"
        value={form.phone}
        onChange={updateField}
        placeholder="Phone (optional)"
      />
      <textarea
        className="field"
        name="note"
        rows="3"
        value={form.note}
        onChange={updateField}
        placeholder={topic.asks}
        required
      />

      <label className="flex cursor-pointer items-start gap-2">
        <input
          type="checkbox"
          name="shareContact"
          checked={form.shareContact}
          onChange={updateField}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="text-fluid-0">
          Share my contact details with verified businesses in this topic.
        </span>
      </label>

      <p className="text-fluid-0 text-ink/60">
        Only verified businesses subscribed to {topic.name} can see this. You can leave
        the topic at any time, and unverified businesses never see your details.
      </p>

      <button type="submit" className="btn-dark min-w-0 w-full">
        Send my details
      </button>
    </form>
  )
}

/* Business view: every submission sent to a topic this account subscribes to. */
function SubmissionsPanel({ submissions, subscriptions }) {
  const visible = submissions
    .filter((entry) => subscriptions.includes(entry.topicId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <section className="section pt-0">
      <div className="shell flex flex-col gap-fluid-4">
        <div className="flex flex-col gap-1">
          <h2 className="section-heading">Submissions from your topics</h2>
          <p>
            Customers who asked to hear from businesses in the topics you subscribe to.
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <p>Subscribe to a topic above and submissions will appear here.</p>
        ) : visible.length === 0 ? (
          <p>No submissions in your topics yet. New ones show up as they come in.</p>
        ) : (
          <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
            {visible.map((entry) => (
              <SubmissionCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        <p className="text-fluid-0 text-ink/60">
          Marketing a customer outside the topic they submitted to, or passing their
          details on, gets an account removed from Local Link.
        </p>
      </div>
    </section>
  )
}

function SubmissionCard({ entry }) {
  const topic = findTopic(entry.topicId)

  return (
    <div className="card flex flex-col gap-fluid-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h3 className="text-fluid-0 font-bold">{entry.name}</h3>
          <span className="border border-accent px-2 py-[2px] text-[12px] font-bold text-accent">
            {topic?.name ?? 'Topic'}
          </span>
        </div>
        <p className="text-fluid-0 text-ink/60">{formatDate(entry.createdAt)}</p>
      </div>

      <p>{entry.note}</p>

      {entry.shareContact ? (
        <div className="flex flex-col gap-1">
          <a href={`mailto:${entry.email}`} className="nav-link underline">
            {entry.email}
          </a>
          {entry.phone && <p>{entry.phone}</p>}
        </div>
      ) : (
        <p className="text-fluid-0 text-ink/60">
          Contact details withheld. Reply through Local Link and we pass the message on.
        </p>
      )}
    </div>
  )
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
