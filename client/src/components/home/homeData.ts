export const navItems = [
  { label: 'Movies', to: '/movies' },
  { label: 'Books', to: '/books' },
  { label: 'Electronics', to: '/electronics' },
  { label: 'About', to: '/contact' },
  { label: 'How It Works', to: '#how-it-works' },
];

export const stats = [
  { icon: '🎬', value: '50K+', label: 'Movies & Short Films' },
  { icon: '📚', value: '500+', label: 'Books & Manuscripts' },
  { icon: '💻', value: '200+', label: 'Verified Tech Products' },
  { icon: '👥', value: '80+', label: 'Happy Members' },
];

export const categoryCards = [
  {
    title: 'Movie Center',
    tag: 'Cinema Hub',
    icon: 'movie',
    description:
      'Stream Ethiopian blockbusters, award-winning indie cinema, and global 4K releases with native subtitle tracks.',
    gradient: 'from-primary/20 via-primary/10 to-transparent',
    image:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    to: '/movies',
  },
  {
    title: 'Book Sanctum',
    tag: 'Library & Shop',
    icon: 'menu_book',
    description:
      'Borrow physical editions, purchase academic literature, or access digital translations delivered straight to Bole or Kazanchis.',
    gradient: 'from-tertiary/20 via-primary/10 to-transparent',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    to: '/books',
  },
  {
    title: 'Tech Marketplace',
    tag: 'Verified Tech',
    icon: 'devices',
    description:
      'Inspected gadgets, developer workstations, and premium audio backed by our Addis escrow guarantee and local warranties.',
    gradient: 'from-secondary/20 via-primary/10 to-transparent',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    to: '/electronics',
  },
];

export const featuredItems = [
  {
    type: 'Movie',
    title: 'The King of Gondar',
    detail: '4K HDR • 2h 15m',
    description:
      'An epic biographical odyssey exploring Emperor Fasilides and the architectural marvels of 17th-century Abyssinia.',
    price: null,
    button: 'Watch',
    to: '/movies',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
  },
  {
    type: 'Book',
    title: 'Oromia Chronicles & Lore',
    detail: 'Hardcover Edition',
    description:
      'A seminal anthology celebrating the oral histories, democratic governance philosophy, and poetry of Oromia.',
    price: 'ETB 1,250',
    button: 'Get Book',
    to: '/books',
    image:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80',
  },
  {
    type: 'Electronics',
    title: 'Zenith ANC Wireless Pro',
    detail: 'Hi-Fi Audio • 45h Battery',
    description:
      'Audiophile grade active noise cancelling with low-latency lossless streaming codec tuned for studio mixing and daily commute.',
    price: 'ETB 14,800',
    button: 'Order',
    to: '/electronics',
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
  },
  {
    type: 'Book',
    title: 'Addis Architectural Heritage',
    detail: 'Illustrated Collector Volume',
    description:
      'A photographic and archival deep-dive into the distinct 20th-century vernacular and modernist cityscape of Mizan Teferi',
    price: 'ETB 2,400',
    button: 'Borrow',
    to: '/books',
    image:
      'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=900&q=80',
  },
];

export const steps = [
  {
    number: '01',
    icon: 'search',
    title: 'Browse',
    description:
      'Search our unified catalog of cinema, rare literary works, and vetted tech gear from anywhere in Ethiopia or the diaspora.',
  },
  {
    number: '02',
    icon: 'shopping_bag',
    title: 'Choose',
    description:
      'Add to your wishlist, stream instantly, reserve a loan, or checkout securely with Telebirr, CBE Birr, or global cards.',
  },
  {
    number: '03',
    icon: 'local_shipping',
    title: 'Enjoy',
    description:
      'Stream in 4K HDR, pickup from our Bole & Kazanchis cultural hubs, or receive same-day doorstep delivery.',
  },
];

export const testimonials = [
  {
    quote:
      'Streaming local cinema in pristine 4K with Dolby audio is something I\'ve dreamed of in Addis. AhaduCenter nailed it with incredible streaming performance.',
    author: 'Selamawit D.',
    role: 'Film Enthusiast • Bole',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    quote:
      'Bought my mechanical keyboard and borrowed two AI reference books in the same week. The escrow service gave me total peace of mind with CBE transfer.',
    author: 'Dawit Kebede',
    role: 'Software Engineer • Kazanchis',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    quote:
      'The rare book curation is exceptional. Finding architectural monographs delivered to my door in 24 hours is miraculous. An absolute gem for Addis.',
    author: 'Bethelhem T.',
    role: 'Architect & Bibliophile • Sarbet',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
  },
];
