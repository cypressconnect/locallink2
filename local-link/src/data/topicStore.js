import { useCallback, useEffect, useState } from 'react'

/*
 * Front-end only store for the topic system, kept in localStorage so the site
 * can be demoed without a server. Two things are saved:
 *
 *   submissions   - a customer's details sent to one topic
 *   subscriptions - the topics one business account watches
 *
 * Both get swapped for a real API later, same as auth.jsx.
 */

const SUBMISSIONS_KEY = 'locallink.topicSubmissions'
const SUBSCRIPTIONS_KEY = 'locallink.topicSubscriptions'

// Seed submissions so a business account has something to look at on a fresh
// browser. Real submissions are appended after these.
const seedSubmissions = [
  {
    id: 'seed-1',
    topicId: 'tutoring',
    name: 'Gemma Nolen',
    email: 'gemma.nolen@example.com',
    phone: '07700 900123',
    note: 'Year 9 maths, once a week after school.',
    shareContact: true,
    createdAt: '2026-09-14T16:20:00.000Z',
  },
  {
    id: 'seed-2',
    topicId: 'bakery',
    name: 'Daniel Ruiz',
    email: 'd.ruiz@example.com',
    phone: '',
    note: 'A birthday cake for 20 people in three weeks.',
    shareContact: true,
    createdAt: '2026-09-18T09:05:00.000Z',
  },
  {
    id: 'seed-3',
    topicId: 'gardening',
    name: 'Rosa Marino',
    email: 'rosa.marino@example.com',
    phone: '07700 900456',
    note: 'Fortnightly lawn mowing through the autumn.',
    shareContact: false,
    createdAt: '2026-09-22T11:45:00.000Z',
  },
]

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    // A corrupt or blocked store should not break the page.
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore: the page still works for this visit without saving.
  }
}

export function getSubmissions() {
  return read(SUBMISSIONS_KEY, seedSubmissions)
}

export function addSubmission(submission) {
  const next = [
    ...getSubmissions(),
    { ...submission, id: String(Date.now()), createdAt: new Date().toISOString() },
  ]
  write(SUBMISSIONS_KEY, next)
  return next
}

export function getSubscriptions(email) {
  if (!email) return []
  return read(SUBSCRIPTIONS_KEY, {})[email] ?? []
}

export function toggleSubscription(email, topicId) {
  const all = read(SUBSCRIPTIONS_KEY, {})
  const current = all[email] ?? []
  const next = current.includes(topicId)
    ? current.filter((id) => id !== topicId)
    : [...current, topicId]

  write(SUBSCRIPTIONS_KEY, { ...all, [email]: next })
  return next
}

/* Reads both stores once and re-reads them after every change on the page. */
export function useTopicStore(email) {
  const [submissions, setSubmissions] = useState(getSubmissions)
  const [subscriptions, setSubscriptions] = useState(() => getSubscriptions(email))

  // The signed-in account can change while the page is open.
  useEffect(() => {
    setSubscriptions(getSubscriptions(email))
  }, [email])

  const submit = useCallback((submission) => {
    setSubmissions(addSubmission(submission))
  }, [])

  const toggle = useCallback(
    (topicId) => {
      if (!email) return
      setSubscriptions(toggleSubscription(email, topicId))
    },
    [email],
  )

  return { submissions, subscriptions, submit, toggle }
}
