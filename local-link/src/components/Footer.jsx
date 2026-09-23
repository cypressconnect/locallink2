import { useState } from 'react'

const socials = [
  { label: 'Discord', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'Instagram', href: '#' },
]

export default function Footer() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
  }

  return (
    <footer id="contact" className="section">
      <div className="shell flex flex-col gap-fluid-2">
        <h2 className="section-heading">Contact Us</h2>

        <div className="grid gap-fluid-2 md:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-fluid-4">
            <p className="max-w-[45ch]">
              Have a question or concern? We will reach back within 48 hours.
            </p>
            <div className="flex items-center gap-fluid-2">
              {socials.map((social) => (
                <a key={social.label} href={social.href} className="nav-link underline">
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-fluid-4">
            <div className="flex flex-col gap-fluid-2">
              <input className="field" name="name" placeholder="Name" required />
              <input className="field" name="email" type="email" placeholder="Email" required />
            </div>
            <button type="submit" className="btn-dark self-start">
              {sent ? 'Thanks — we got it' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </footer>
  )
}
