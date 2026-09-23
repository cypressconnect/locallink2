import { Link } from 'react-router-dom'

// Stand-in for the pages still to be built (contact, leads, topics, admin).
export default function ComingSoon({ title }) {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-2">
        <h1 className="section-heading text-accent">{title}</h1>
        <p>This page has not been built yet.</p>
        <Link to="/" className="btn self-start">
          Back to home
        </Link>
      </div>
    </section>
  )
}
