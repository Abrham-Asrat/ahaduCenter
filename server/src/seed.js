require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');
const Movie = require('./models/Movie');
const Product = require('./models/Product');

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@ahaducenter.com',
    plainPassword: 'admin123',
    role: 'admin',
    phone: '+251911000001',
  },
  {
    name: 'Regular User',
    email: 'user@ahaducenter.com',
    plainPassword: 'user123',
    role: 'user',
    phone: '+251911000002',
  },
];

const booksData = [
  {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    isbn: '978-0-684-80122-3',
    category: 'Fiction',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
    description:
      'A timeless story of an aging Cuban fisherman who struggles with a giant marlin far out in the Gulf Stream.',
    availability: 'Available',
    availableCopies: 3,
    totalCopies: 3,
    format: 'Paperback',
    year: 1952,
    rating: 4.5,
    publisher: 'Scribner',
    pages: 128,
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    isbn: '978-0-06-085052-4',
    category: 'Fiction',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739264-L.jpg',
    description:
      'A dystopian novel set in a futuristic World State of genetically modified citizens and an intelligence-based social hierarchy.',
    availability: 'Borrowed',
    availableCopies: 0,
    totalCopies: 2,
    format: 'Hardcover',
    year: 1932,
    rating: 4.3,
    publisher: 'Chatto & Windus',
    pages: 311,
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '978-0-553-38016-3',
    category: 'Science',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739287-L.jpg',
    description:
      'An exploration of cosmology, from the Big Bang to black holes, written for general audiences.',
    availability: 'Available',
    availableCopies: 2,
    totalCopies: 2,
    format: 'Paperback',
    year: 1988,
    rating: 4.7,
    publisher: 'Bantam Books',
    pages: 212,
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '978-0-06-231609-7',
    category: 'History',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/10522307-L.jpg',
    description:
      'A sweeping narrative of human history from the Stone Age to the twenty-first century.',
    availability: 'Reserved',
    availableCopies: 0,
    totalCopies: 2,
    format: 'Hardcover',
    year: 2011,
    rating: 4.6,
    publisher: 'Harvill Secker',
    pages: 443,
  },
  {
    title: 'The Guns of August',
    author: 'Barbara W. Tuchman',
    isbn: '978-0-345-47609-8',
    category: 'History',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739100-L.jpg',
    description:
      'Pulitzer Prize-winning account of the first month of World War I and the catastrophic miscalculations that led to it.',
    availability: 'Available',
    availableCopies: 1,
    totalCopies: 1,
    format: 'Paperback',
    year: 1962,
    rating: 4.4,
    publisher: 'Macmillan',
    pages: 511,
  },
  {
    title: 'Ye-Ethiopia Tarik',
    author: 'Tekle Tsadik Mekuria',
    isbn: '978-99944-2-023-5',
    category: 'History',
    language: 'Amharic',
    coverUrl: 'https://via.placeholder.com/200x300/2d6a4f/ffffff?text=Ye-Ethiopia+Tarik',
    description:
      'An authoritative history of Ethiopia from ancient Axum through the modern era, written in Amharic.',
    availability: 'Available',
    availableCopies: 4,
    totalCopies: 4,
    format: 'Hardcover',
    year: 1966,
    rating: 4.8,
    publisher: 'Berhanenna Selam',
    pages: 620,
  },
  {
    title: 'Fiker Eske Meqabir',
    author: 'Haddis Alemayehu',
    isbn: '978-99944-2-045-7',
    category: 'Fiction',
    language: 'Amharic',
    coverUrl: 'https://via.placeholder.com/200x300/457b9d/ffffff?text=Fiker+Eske+Meqabir',
    description:
      'One of the most celebrated Ethiopian novels, a timeless love story set against the backdrop of Ethiopian society and tradition.',
    availability: 'Borrowed',
    availableCopies: 0,
    totalCopies: 3,
    format: 'Paperback',
    year: 1966,
    rating: 4.9,
    publisher: 'Mega Publishing',
    pages: 382,
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    isbn: '978-0-19-929114-4',
    category: 'Science',
    language: 'English',
    coverUrl: 'https://covers.openlibrary.org/b/id/8739222-L.jpg',
    description:
      'A landmark work in evolutionary biology that introduced the concept of the gene as the primary unit of natural selection.',
    availability: 'Available',
    availableCopies: 2,
    totalCopies: 2,
    format: 'Paperback',
    year: 1976,
    rating: 4.5,
    publisher: 'Oxford University Press',
    pages: 360,
  },
];

const moviesData = [
  {
    title: 'Lamb (Lij)',
    year: 2015,
    country: 'Ethiopia',
    runtime: '1h 34m',
    quality: 'HD',
    language: 'Amharic',
    genres: ['Drama'],
    rating: 4.2,
    reviewCount: 980,
    director: 'Yared Zeleke',
    description:
      'A young Ethiopian boy and his beloved pet lamb journey across the highlands in a moving story about identity, belonging, and sacrifice.',
    posterUrl: 'https://via.placeholder.com/300x450/2d6a4f/ffffff?text=Lamb',
    studio: 'Uzuri Films',
  },
  {
    title: 'Difret',
    year: 2014,
    country: 'Ethiopia',
    runtime: '1h 39m',
    quality: 'HD',
    language: 'Amharic',
    genres: ['Drama'],
    rating: 4.4,
    reviewCount: 1540,
    director: 'Zeresenay Berhane Mehari',
    description:
      'Based on a true story, a young Ethiopian girl fights for her right to determine her own destiny after being abducted for a forced marriage.',
    posterUrl: 'https://via.placeholder.com/300x450/457b9d/ffffff?text=Difret',
    studio: 'Haile Entertainment',
  },
  {
    title: 'Inception',
    year: 2010,
    country: 'USA',
    runtime: '2h 28m',
    quality: '4K',
    language: 'English',
    genres: ['Action', 'Drama'],
    rating: 4.8,
    reviewCount: 48200,
    director: 'Christopher Nolan',
    description:
      'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea in the mind of a CEO.',
    posterUrl: 'https://via.placeholder.com/300x450/1d3557/ffffff?text=Inception',
    studio: 'Warner Bros.',
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    country: 'USA',
    runtime: '2h 32m',
    quality: '4K',
    language: 'English',
    genres: ['Action'],
    rating: 4.9,
    reviewCount: 62500,
    director: 'Christopher Nolan',
    description:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    posterUrl: 'https://via.placeholder.com/300x450/e63946/ffffff?text=The+Dark+Knight',
    studio: 'Warner Bros.',
  },
  {
    title: 'Anthropocene: The Human Epoch',
    year: 2018,
    country: 'USA',
    runtime: '1h 27m',
    quality: 'HD',
    language: 'English',
    genres: ['Documentary'],
    rating: 4.3,
    reviewCount: 2100,
    director: 'Jennifer Baichwal',
    description:
      'A cinematic meditation on humanity\'s massive reengineering of the planet, chronicling evidence from around the world of how humans have altered nature.',
    posterUrl: 'https://via.placeholder.com/300x450/6b705c/ffffff?text=Anthropocene',
    studio: 'Foundry Films',
  },
  {
    title: 'Haile: The Real Story',
    year: 2012,
    country: 'Ethiopia',
    runtime: '1h 20m',
    quality: 'HD',
    language: 'Amharic',
    genres: ['Documentary'],
    rating: 4.6,
    reviewCount: 3200,
    director: 'Sybil Robson Orr',
    description:
      'An intimate documentary portrait of legendary Ethiopian distance runner Haile Gebrselassie, tracing his journey from a barefoot boy in rural Ethiopia to a two-time Olympic champion.',
    posterUrl: 'https://via.placeholder.com/300x450/a8dadc/333333?text=Haile',
    studio: 'Blakeway Productions',
  },
  {
    title: 'Mad Max: Fury Road',
    year: 2015,
    country: 'USA',
    runtime: '2h 0m',
    quality: '4K',
    language: 'English',
    genres: ['Action'],
    rating: 4.7,
    reviewCount: 41000,
    director: 'George Miller',
    description:
      'In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiosa, to try and survive against a tyrannical warlord and his armada of followers.',
    posterUrl: 'https://via.placeholder.com/300x450/e9c46a/333333?text=Mad+Max',
    studio: 'Village Roadshow Pictures',
  },
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    country: 'USA',
    runtime: '2h 22m',
    quality: 'HD',
    language: 'English',
    genres: ['Drama'],
    rating: 4.9,
    reviewCount: 58000,
    director: 'Frank Darabont',
    description:
      'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    posterUrl: 'https://via.placeholder.com/300x450/264653/ffffff?text=Shawshank',
    studio: 'Castle Rock Entertainment',
  },
];

const productsData = [
  {
    name: 'Dell XPS 15 Laptop',
    brand: 'Dell',
    category: 'Laptops',
    condition: 'New',
    price: 1299.99,
    originalPrice: 1499.99,
    discount: 13,
    description:
      'The Dell XPS 15 features a stunning InfinityEdge display, powerful Intel Core i7 processor, and NVIDIA GeForce RTX graphics for professionals and creators.',
    highlights: [
      '15.6" OLED 3.5K display',
      'Intel Core i7-13700H processor',
      '16GB DDR5 RAM, 512GB NVMe SSD',
      'NVIDIA GeForce RTX 4060',
      'Up to 13 hours battery life',
    ],
    images: [
      'https://via.placeholder.com/600x400/1d3557/ffffff?text=Dell+XPS+15',
    ],
    rating: 4.6,
    reviewCount: 320,
    inStock: true,
  },
  {
    name: 'MacBook Pro 14-inch',
    brand: 'Apple',
    category: 'Laptops',
    condition: 'New',
    price: 1999.99,
    originalPrice: 1999.99,
    discount: 0,
    description:
      'The MacBook Pro 14-inch with Apple M3 Pro chip delivers exceptional performance and battery life in a compact, portable design.',
    highlights: [
      'Apple M3 Pro chip (11-core CPU)',
      '18GB unified memory',
      '512GB SSD storage',
      'Liquid Retina XDR display',
      'Up to 18 hours battery',
    ],
    images: [
      'https://via.placeholder.com/600x400/6b705c/ffffff?text=MacBook+Pro',
    ],
    rating: 4.9,
    reviewCount: 875,
    inStock: true,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    brand: 'Sony',
    category: 'Audio',
    condition: 'New',
    price: 349.99,
    originalPrice: 399.99,
    discount: 13,
    description:
      'Industry-leading noise canceling headphones with exceptional sound quality, 30-hour battery life, and comfortable over-ear design.',
    highlights: [
      'Industry-leading ANC technology',
      '30-hour battery life',
      'Multipoint Bluetooth connection',
      'Speak-to-chat feature',
      'Foldable, travel-friendly design',
    ],
    images: [
      'https://via.placeholder.com/600x400/264653/ffffff?text=Sony+WH-1000XM5',
    ],
    rating: 4.8,
    reviewCount: 1240,
    inStock: true,
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    brand: 'JBL',
    category: 'Audio',
    condition: 'New',
    price: 129.99,
    originalPrice: 149.99,
    discount: 13,
    description:
      'The JBL Flip 6 delivers bold JBL Pro Sound with exceptional clarity and deep bass. IP67 waterproof and dustproof for outdoor adventures.',
    highlights: [
      'Bold JBL Pro Sound',
      'IP67 waterproof & dustproof',
      '12-hour playtime',
      'PartyBoost compatible',
      'USB-C charging',
    ],
    images: [
      'https://via.placeholder.com/600x400/e63946/ffffff?text=JBL+Flip+6',
    ],
    rating: 4.7,
    reviewCount: 680,
    inStock: true,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    category: 'Accessories',
    condition: 'New',
    price: 99.99,
    originalPrice: 99.99,
    discount: 0,
    description:
      'The Logitech MX Master 3S is an advanced wireless mouse with an 8K DPI sensor, ultra-fast MagSpeed scrolling, and quiet clicks for silent work environments.',
    highlights: [
      '8000 DPI high-precision sensor',
      'MagSpeed electromagnetic scrolling',
      'Quiet clicks (-90% click noise)',
      'USB-C quick charge',
      'Up to 70 days battery',
    ],
    images: [
      'https://via.placeholder.com/600x400/457b9d/ffffff?text=MX+Master+3S',
    ],
    rating: 4.8,
    reviewCount: 2100,
    inStock: true,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    brand: 'Lenovo',
    category: 'Laptops',
    condition: 'Refurbished',
    price: 749.99,
    originalPrice: 1399.99,
    discount: 46,
    description:
      'A certified refurbished Lenovo ThinkPad X1 Carbon — the legendary business ultrabook with military-grade durability, lightweight design, and all-day battery life.',
    highlights: [
      'Intel Core i5-10th Gen processor',
      '16GB LPDDR3 RAM',
      '256GB NVMe SSD',
      '14" FHD IPS display',
      'MIL-STD-810G certified',
    ],
    images: [
      'https://via.placeholder.com/600x400/2d6a4f/ffffff?text=ThinkPad+X1',
    ],
    rating: 4.4,
    reviewCount: 430,
    inStock: true,
  },
  {
    name: 'Anker USB-C Hub 7-in-1',
    brand: 'Anker',
    category: 'Accessories',
    condition: 'New',
    price: 35.99,
    originalPrice: 45.99,
    discount: 22,
    description:
      'Expand your laptop\'s connectivity with Anker\'s 7-in-1 USB-C hub featuring 4K HDMI, USB-A 3.0 ports, SD/microSD card readers, and 100W Power Delivery.',
    highlights: [
      '4K@30Hz HDMI output',
      '3x USB-A 3.0 ports',
      'SD & microSD card slots',
      '100W Power Delivery pass-through',
      'Compact plug-and-play design',
    ],
    images: [
      'https://via.placeholder.com/600x400/a8dadc/333333?text=Anker+Hub',
    ],
    rating: 4.5,
    reviewCount: 3200,
    inStock: true,
  },
];

// ---------------------------------------------------------------------------
// Seed function
// ---------------------------------------------------------------------------

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB');

    const results = {};

    // ------ Users ------
    let usersCreated = 0;
    for (const u of usersData) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const passwordHash = await bcrypt.hash(u.plainPassword, 10);
        await User.create({
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          phone: u.phone,
        });
        usersCreated++;
      }
    }
    results.users = usersCreated > 0 ? `created ${usersCreated}` : 'already exist, skipped';

    // ------ Books ------
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      await Book.insertMany(booksData);
      results.books = `created ${booksData.length}`;
    } else {
      results.books = `already exist (${bookCount} docs), skipped`;
    }

    // ------ Movies ------
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      await Movie.insertMany(moviesData);
      results.movies = `created ${moviesData.length}`;
    } else {
      results.movies = `already exist (${movieCount} docs), skipped`;
    }

    // ------ Products ------
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(productsData);
      results.products = `created ${productsData.length}`;
    } else {
      results.products = `already exist (${productCount} docs), skipped`;
    }

    console.log('[seed] Summary:', results);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err);
    process.exit(1);
  }
}

seed();
