import { Link } from 'react-router-dom'

// Stand-in for the pages still to be built (contact, admin).
export default function ComingSoon({ title, text = 'This page is still in progress.' }) {
  return (
    <section className="section">
      <div className="shell flex flex-col gap-fluid-2">
        <h1 className="section-heading text-accent">{title}</h1>
        <p>{text}</p>
        <Link to="/" className="btn self-start">
          Back to home
        </Link>
      </div>
    </section>
  )
}
