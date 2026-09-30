// Topics double as the marketplace filter and as the subscription list
// businesses sign up to. Every topic name here also appears on a product.
export const topics = [
  {
    id: 'bakery',
    name: 'Bakery',
    icon: '/assets/topic-1.svg',
    image: '/assets/product-2.png',
    blurb: 'Cakes, bread and party orders baked by students near you.',
    asks: 'What would you like baked, and when do you need it?',
  },
  {
    id: 'tutoring',
    name: 'Tutoring',
    icon: '/assets/topic-2.svg',
    image: '/assets/product-5.png',
    blurb: 'Maths, English and exam help from students a year or two ahead.',
    asks: 'Which subject and year group do you need help with?',
  },
  {
    id: 'gardening',
    name: 'Gardening',
    icon: '/assets/topic-3.svg',
    image: '/assets/product-3.png',
    blurb: 'Mowing, weeding and planters for your garden.',
    asks: 'What does your garden need doing?',
  },
  {
    id: 'art',
    name: 'Art',
    icon: '/assets/topic-4.svg',
    image: '/assets/product-1.png',
    blurb: 'Lessons, commissions and prints from student artists.',
    asks: 'What kind of art or lesson are you after?',
  },
  {
    id: 'homemade-goods',
    name: 'Homemade Goods',
    icon: '/assets/topic-5.svg',
    image: '/assets/product-6.png',
    blurb: 'Jewellery, candles, drinks and other things made by hand.',
    asks: 'What sort of handmade item are you looking for?',
  },
  {
    id: 'services',
    name: 'Services',
    icon: '/assets/topic-6.svg',
    image: '/assets/product-4.png',
    blurb: 'Babysitting, dog walking, car washing and odd jobs.',
    asks: 'Which service do you need, and how often?',
  },
]

export function findTopic(id) {
  return topics.find((topic) => topic.id === id)
}

export const products = [
  {
    id: 1,
    name: 'Painting Classes',
    business: "Amy's Artistic Classes",
    topic: 'Art',
    price: '$25 / lesson',
    image: '/assets/product-1.png',
    verified: true,
  },
  {
    id: 2,
    name: 'Fresh Orange Juice',
    business: "Rayvan's Kitchen",
    topic: 'Homemade Goods',
    price: '$4 / bottle',
    image: '/assets/product-2.png',
    verified: true,
  },
  {
    id: 3,
    name: 'Bridgeland Newspaper',
    business: "Tony's Gazette",
    topic: 'Homemade Goods',
    price: '$2 / issue',
    image: '/assets/product-3.png',
    verified: false,
  },
  {
    id: 4,
    name: 'Bible Classes',
    business: "Gabriel's Sunday School",
    topic: 'Tutoring',
    price: 'Free',
    image: '/assets/product-4.png',
    verified: true,
  },
  {
    id: 5,
    name: 'English Tutoring',
    business: "Jay's Tutoring Zone",
    topic: 'Tutoring',
    price: '$20 / hour',
    image: '/assets/product-5.png',
    verified: true,
  },
  {
    id: 6,
    name: 'Babysitting',
    business: "Natasha's Babysitting",
    topic: 'Services',
    price: '$15 / hour',
    image: '/assets/product-6.png',
    verified: false,
  },
  {
    id: 7,
    name: 'Sourdough Loaves',
    business: "Bobby's Bakery",
    topic: 'Bakery',
    price: '$8 / loaf',
    image: '/assets/product-2.png',
    verified: true,
  },
  {
    id: 8,
    name: 'Math Tutoring',
    business: 'Priya Study Hall',
    topic: 'Tutoring',
    price: '$22 / hour',
    image: '/assets/product-5.png',
    verified: true,
  },
  {
    id: 9,
    name: 'Garden Planters',
    business: "Leo's Woodshop",
    topic: 'Gardening',
    price: '$30 each',
    image: '/assets/product-1.png',
    verified: false,
  },
  {
    id: 10,
    name: 'Lawn Mowing',
    business: 'Green Street Crew',
    topic: 'Gardening',
    price: '$25 / visit',
    image: '/assets/product-3.png',
    verified: true,
  },
  {
    id: 11,
    name: 'Beaded Bracelets',
    business: "Mia's Craft Corner",
    topic: 'Homemade Goods',
    price: '$6 each',
    image: '/assets/product-6.png',
    verified: true,
  },
  {
    id: 12,
    name: 'Birthday Cupcakes',
    business: 'Sweet Sixteen Bakes',
    topic: 'Bakery',
    price: '$18 / dozen',
    image: '/assets/product-4.png',
    verified: false,
  },
]

// Every topic that appears on a product, for the marketplace filter bar.
export const productTopics = [...new Set(products.map((p) => p.topic))].sort()

export function productsInTopic(topicName) {
  return products.filter((product) => product.topic === topicName)
}
