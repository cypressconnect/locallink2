import { Link } from 'react-router-dom'
import { topics } from '../data/products.js'
import { listProducts, useBusinesses } from '../data/businessStore.js'
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

// Steps for the "How Local Link works" section under the hero.
const guides = [
  {
    title: 'For customers',
    steps: [
      'Click Login/Signup, choose Customer and create an account (or use the demo customer account).',
      'Open the Online Marketplace to see every product. Search by name, filter by topic, or tick "Only show verified businesses".',
      'Or open Topics to browse by category and see every business in that topic.',
      'Found something you like? Press Send Lead to pass your contact details to that business (coming soon).',
    ],
  },
  {
    title: 'For student businesses',
    steps: [
      'Click Login/Signup, choose Student Business and sign up with your school email, business name and topic.',
      'You land on My Business, your business homepage. Edit your description there so customers know what you do.',
      'Press Add a product, then give it a name, price, description, picture and topic. It appears in the marketplace straight away.',
      'Delete products you no longer sell, add more businesses with "+ Add a business", and check your leads when they arrive.',
    ],
  },
]

// What each link in the navbar does.
const navGuide = [
  { label: 'Online Marketplace', text: 'Every product on the site, with search and filters.' },
  { label: 'Topics', text: 'Businesses grouped by category.' },
  { label: 'My Business', text: 'Only shown to business accounts. Manage your businesses and products.' },
  { label: 'Login/Signup', text: 'Create an account or log in. You need one to see the marketplace and topics.' },
]

export default function Home() {
  const { businesses } = useBusinesses()
  const products = listProducts(businesses)

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
            src="/assets/hero.jpg"
            alt="People browsing stalls at an outdoor community market"
            width="960"
            height="720"
            className="w-full"
          />
        </div>
      </section>

      {/* How to use the site */}
      <section id="how-it-works" className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <div className="flex flex-col gap-1 text-center">
            <h2 className="section-heading text-accent">How Local Link works</h2>
            <p>New here? This is how to get around the site.</p>
          </div>

          <div className="grid gap-fluid-2 md:grid-cols-2">
            {guides.map((guide) => (
              <div key={guide.title} className="card flex flex-col gap-fluid-2">
                <h3 className="text-fluid-1 font-bold text-accent">{guide.title}</h3>
                <ol className="flex list-decimal flex-col gap-2 pl-5">
                  {guide.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="card flex flex-col gap-fluid-2">
            <h3 className="text-fluid-1 font-bold text-accent">Finding your way around</h3>
            <p>Use the links at the top of every page. Click the Local Link logo to come back here.</p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {navGuide.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <dt className="font-bold">{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section id="topics" className="section">
        <div className="shell flex flex-col gap-fluid-4">
          <h2 className="section-heading text-center text-accent">Popular Topics</h2>
          <div className="grid gap-fluid-2 sm:grid-cols-3">
            {topics.slice(0, 3).map((topic) => (
              <Link
                key={topic.id}
                to={`/topics?topic=${topic.id}`}
                className="group flex flex-col gap-fluid-2 text-center no-underline"
              >
                <img
                  src={topic.image}
                  alt=""
                  width="790"
                  height="661"
                  className="w-full transition-opacity duration-200 group-hover:opacity-90"
                  loading="lazy"
                />
                <h3 className="text-fluid-1 font-bold text-accent group-hover:text-coral">
                  {topic.name}
                </h3>
              </Link>
            ))}
          </div>
          <Link to="/topics" className="btn self-center">
            See all topics
          </Link>
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
