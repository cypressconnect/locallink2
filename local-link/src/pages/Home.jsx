import { Link } from 'react-router-dom'
import { products, topics } from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

const testimonials = [
  {
    quote:
      '"I found a tutor two streets away and my grades went up in a month. Booking through Local Link was simple."',
    name: 'Gemma Nolen',
    source: 'Parent',
  },
  {
    quote:
      '"The verification badge is what sold me. I knew I was buying from a real student, not a fake shop."',
    name: 'Daniel Ruiz',
    source: 'Customer',
  },
  {
    quote:
      '"I started my bakery with zero customers. After joining a topic I had eleven leads in my first week."',
    name: 'Bobby Chen',
    source: 'Student Business',
  },
  {
    quote:
      '"Leads come in with the contact details already filled in, so I can reply the same day."',
    name: 'Amy Patel',
    source: 'Student Business',
  },
  {
    quote:
      '"Support answered my question in a few hours when an order was late. That mattered a lot to me."',
    name: 'Rosa Marino',
    source: 'Customer',
  },
  {
    quote:
      '"Being able to see who is verified before I hand over my number makes the whole thing feel safe."',
    name: 'Kevin Osei',
    source: 'Customer',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section">
        <div className="shell grid items-center gap-fluid-4 md:grid-cols-2">
          <div className="flex flex-col gap-fluid-4">
            <div className="flex flex-col gap-1">
              <div className="text-fluid-0 font-bold text-accent">Your Local Marketplace</div>
              <h1 className="text-fluid-3 leading-[1.25] font-bold text-accent">Local Link</h1>
              <p className="text-accent">Build a business to cater to your local community.</p>
            </div>
            <div className="flex flex-wrap gap-fluid-2">
              <Link to="/marketplace" className="btn">
                Browse Marketplace
              </Link>
              <Link to="/login" className="btn-dark">
                Start Selling
              </Link>
            </div>
          </div>

          <img
            src="/assets/header.png"
            alt="Students running their local businesses"
            width="960"
            height="720"
            className="w-full"
          />
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <h2 className="section-heading text-center text-accent">Popular Topics</h2>
          <div className="grid gap-fluid-2 sm:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="flex flex-col items-center justify-between gap-fluid-2 text-center"
              >
                <img src={topic.icon} alt="" width="125" height="125" />
                <h3 className="text-fluid-1 font-bold text-accent">{topic.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <h2 className="section-heading text-center">Popular Products</h2>
          <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <h2 className="section-heading text-center">Testimonials</h2>
          <div className="grid gap-fluid-2 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name + testimonial.quote}
                className="card flex flex-col justify-between gap-fluid-4"
              >
                <p className="font-semibold">{testimonial.quote}</p>
                <div className="flex items-start gap-4">
                  <img
                    src="/assets/client.png"
                    alt=""
                    width="100"
                    height="101"
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex flex-col gap-1">
                    <img src="/assets/stars.svg" alt="5 stars" width="124" height="21" />
                    <div className="mt-2 font-semibold">{testimonial.name}</div>
                    <div>{testimonial.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
