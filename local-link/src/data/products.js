// Topics are the categories customers browse on the topics page and in the
// marketplace filter. Every business belongs to exactly one topic.
export const topics = [
  {
    id: 'baked-goods',
    name: 'Baked Goods',
    icon: '/assets/topic-1.svg',
    image: '/assets/sourdough.jpg',
    blurb: 'Cakes, bread and party orders baked by students near you.',
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: '/assets/topic-2.svg',
    image: '/assets/math.jpg',
    blurb: 'Maths, English and exam help from students a year or two ahead.',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: '/assets/topic-3.svg',
    image: '/assets/planters.jpg',
    blurb: 'Mowing, weeding and planters for your garden.',
  },
  {
    id: 'art',
    name: 'Art',
    icon: '/assets/topic-4.svg',
    image: '/assets/product-2.png',
    blurb: 'Lessons, commissions and prints from student artists.',
  },
  {
    id: 'homemade-goods',
    name: 'Homemade Goods',
    icon: '/assets/topic-5.svg',
    image: '/assets/bracelets.jpg',
    blurb: 'Jewellery, candles, drinks and other things made by hand.',
  },
  {
    id: 'services',
    name: 'Services',
    icon: '/assets/topic-6.svg',
    image: '/assets/babysitting.jpg',
    blurb: 'Babysitting, dog walking, car washing and odd jobs.',
  },
]

export function findTopic(id) {
  return topics.find((topic) => topic.id === id)
}

// Pictures a business can pick from when it adds a product.
export const productImages = [
  { src: '/assets/sourdough.jpg', label: 'Bread' },
  { src: '/assets/cupcakes.jpg', label: 'Cupcakes' },
  { src: '/assets/product-1.png', label: 'Juice' },
  { src: '/assets/math.jpg', label: 'Maths' },
  { src: '/assets/product-5.png', label: 'Books' },
  { src: '/assets/product-4.png', label: 'Classes' },
  { src: '/assets/product-2.png', label: 'Paint' },
  { src: '/assets/planters.jpg', label: 'Plants' },
  { src: '/assets/lawn-mowing.jpg', label: 'Lawn' },
  { src: '/assets/bracelets.jpg', label: 'Jewellery' },
  { src: '/assets/babysitting.jpg', label: 'Kids' },
  { src: '/assets/product-3.png', label: 'Print' },
  { src: '/assets/product-6.png', label: 'Other' },
]

// Account that owns a couple of the seed businesses (see supabase/migrations),
// so the business homepage, switching businesses and leads can be demoed.
export const DEMO_BUSINESS_EMAIL = 'demo@locallink.com'
