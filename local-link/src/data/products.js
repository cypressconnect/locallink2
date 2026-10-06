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

// Account that owns a couple of the seed businesses, so the business homepage
// (including switching between businesses) can be demoed on a fresh browser.
export const DEMO_BUSINESS_EMAIL = 'demo@locallink.com'

// Starting data for businessStore.js. Saved changes are layered on top.
export const seedBusinesses = [
  {
    id: 'amys-artistic-classes',
    owner: '',
    name: "Amy's Artistic Classes",
    topicId: 'art',
    verified: true,
    description: 'Small-group painting lessons for beginners, held on weekends at the community centre.',
    products: [
      { id: '1', name: 'Painting Classes', price: '$25 / lesson', image: '/assets/product-2.png' },
    ],
  },
  {
    id: 'rayvans-kitchen',
    owner: '',
    name: "Rayvan's Kitchen",
    topicId: 'homemade-goods',
    verified: true,
    description: 'Fresh juices squeezed every morning and delivered around the neighbourhood.',
    products: [
      { id: '2', name: 'Fresh Orange Juice', price: '$4 / bottle', image: '/assets/product-1.png' },
    ],
  },
  {
    id: 'tonys-gazette',
    owner: '',
    name: "Tony's Gazette",
    topicId: 'homemade-goods',
    verified: false,
    description: 'A weekly newspaper covering local events, sport and school news in Bridgeland.',
    products: [
      { id: '3', name: 'Bridgeland Newspaper', price: '$2 / issue', image: '/assets/product-3.png' },
    ],
  },
  {
    id: 'gabriels-sunday-school',
    owner: '',
    name: "Gabriel's Sunday School",
    topicId: 'tutoring',
    verified: true,
    description: 'Friendly Bible classes for younger children every Sunday afternoon.',
    products: [
      { id: '4', name: 'Bible Classes', price: 'Free', image: '/assets/product-4.png' },
    ],
  },
  {
    id: 'jays-tutoring-zone',
    owner: '',
    name: "Jay's Tutoring Zone",
    topicId: 'tutoring',
    verified: true,
    description: 'English essay and reading help for years 7 to 10, online or in person.',
    products: [
      { id: '5', name: 'English Tutoring', price: '$20 / hour', image: '/assets/product-5.png' },
    ],
  },
  {
    id: 'natashas-babysitting',
    owner: '',
    name: "Natasha's Babysitting",
    topicId: 'services',
    verified: false,
    description: 'First-aid trained babysitter available on weekday evenings and weekends.',
    products: [
      { id: '6', name: 'Babysitting', price: '$15 / hour', image: '/assets/babysitting.jpg' },
    ],
  },
  {
    id: 'bobbys-bakery',
    owner: DEMO_BUSINESS_EMAIL,
    name: "Bobby's Bakery",
    topicId: 'baked-goods',
    verified: true,
    description: 'Slow-proved sourdough and seasonal bakes, ready for pickup every Saturday.',
    products: [
      { id: '7', name: 'Sourdough Loaves', price: '$8 / loaf', image: '/assets/sourdough.jpg' },
    ],
  },
  {
    id: 'priya-study-hall',
    owner: '',
    name: 'Priya Study Hall',
    topicId: 'tutoring',
    verified: true,
    description: 'Maths tutoring from GCSE to A-level, with past-paper practice every session.',
    products: [
      { id: '8', name: 'Math Tutoring', price: '$22 / hour', image: '/assets/math.jpg' },
    ],
  },
  {
    id: 'leos-woodshop',
    owner: '',
    name: "Leo's Woodshop",
    topicId: 'gardening',
    verified: false,
    description: 'Hand-built cedar planters made to order in any size.',
    products: [
      { id: '9', name: 'Garden Planters', price: '$30 each', image: '/assets/planters.jpg' },
    ],
  },
  {
    id: 'green-street-crew',
    owner: '',
    name: 'Green Street Crew',
    topicId: 'gardening',
    verified: true,
    description: 'Three friends who mow, edge and tidy lawns all through spring and summer.',
    products: [
      { id: '10', name: 'Lawn Mowing', price: '$25 / visit', image: '/assets/lawn-mowing.jpg' },
    ],
  },
  {
    id: 'mias-craft-corner',
    owner: '',
    name: "Mia's Craft Corner",
    topicId: 'homemade-goods',
    verified: true,
    description: 'Beaded bracelets and keychains in custom colours and names.',
    products: [
      { id: '11', name: 'Beaded Bracelets', price: '$6 each', image: '/assets/bracelets.jpg' },
    ],
  },
  {
    id: 'sweet-sixteen-bakes',
    owner: DEMO_BUSINESS_EMAIL,
    name: 'Sweet Sixteen Bakes',
    topicId: 'baked-goods',
    verified: false,
    description: 'Decorated cupcakes and birthday cakes for parties of any size.',
    products: [
      { id: '12', name: 'Birthday Cupcakes', price: '$18 / dozen', image: '/assets/cupcakes.jpg' },
    ],
  },
]
