import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Define interfaces for all data types
interface AdminStats {
  users: number;
  books: number;
  movies: number;
  computers: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
}

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  price: number;
  image: string;
}

interface Product {
  id: number;
  name: string;
  brand: string;
  type: string;
  price: number;
  image: string;
  processor?: string;
  ram?: string;
  storage?: string;
  size?: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
}

interface Statistic {
  value: number;
  label: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface AboutData {
  pageTitle: string;
  missionTitle: string;
  missionDescription: string;
  missionDetails: string;
  valuesTitle: string;
  values: Value[];
  historyTitle: string;
  historyDescription: string;
  historyList: string[];
  quote: string;
  author: string;
  statistics: Statistic[];
  teamMembers: TeamMember[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: false,
})
export class AdminComponent {
  // Active tab for navigation
  activeTab = 'dashboard';

  // Dashboard stats
  stats: AdminStats = {
    users: 10240,
    books: 52300,
    movies: 4800,
    computers: 45,
  };

  // Books data
  books: Book[] = [
    {
      id: 1,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      category: 'Fiction',
      price: 12.99,
      image: '/images/books/gatsby.jpg',
    },
    {
      id: 2,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      category: 'Fiction',
      price: 14.99,
      image: '/images/books/mockingbird.jpg',
    },
    {
      id: 3,
      title: '1984',
      author: 'George Orwell',
      category: 'Fiction',
      price: 9.99,
      image: '/images/books/1984.jpg',
    },
    {
      id: 4,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      category: 'Romance',
      price: 11.99,
      image: '/images/books/pride-prejudice.jpg',
    },
  ];

  // Movies data
  movies: Movie[] = [
    {
      id: 1,
      title: 'Inception',
      year: 2010,
      genre: 'Sci-Fi',
      price: 12.99,
      image: '/images/movies/inception.jpg',
    },
    {
      id: 2,
      title: 'The Dark Knight',
      year: 2008,
      genre: 'Action',
      price: 14.99,
      image: '/images/movies/dark-knight.jpg',
    },
    {
      id: 3,
      title: 'Pulp Fiction',
      year: 1994,
      genre: 'Drama',
      price: 9.99,
      image: '/images/movies/pulp-fiction.jpg',
    },
    {
      id: 4,
      title: 'The Matrix',
      year: 1999,
      genre: 'Sci-Fi',
      price: 11.99,
      image: '/images/movies/matrix.jpg',
    },
  ];

  // Computers data
  products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro',
      brand: 'Apple',
      type: 'laptop',
      price: 1299.99,
      image: '/images/computers/macbook-pro.jpg',
      processor: 'M1 Chip',
      ram: '8GB',
      storage: '256GB SSD',
    },
    {
      id: 2,
      name: 'Dell XPS 13',
      brand: 'Dell',
      type: 'laptop',
      price: 999.99,
      image: '/images/computers/dell-xps.jpg',
      processor: 'Intel i5',
      ram: '8GB',
      storage: '512GB SSD',
    },
    {
      id: 3,
      name: 'HP Pavilion',
      brand: 'HP',
      type: 'desktop',
      price: 799.99,
      image: '/images/computers/hp-pavilion.jpg',
      processor: 'AMD Ryzen 5',
      ram: '16GB',
      storage: '1TB HDD',
    },
    {
      id: 4,
      name: 'iPad Pro',
      brand: 'Apple',
      type: 'tablet',
      price: 799.99,
      image: '/images/computers/ipad-pro.jpg',
      processor: 'M1 Chip',
      ram: '8GB',
      storage: '128GB',
    },
  ];

  // About page data
  aboutData: AboutData = {
    pageTitle: 'Our Story & Mission',
    missionTitle: 'Our Journey & Mission',
    missionDescription: `Ahadu Center was founded with a vision to provide quality educational
and entertainment resources to our community. Our mission is to make
knowledge and entertainment accessible to everyone, regardless of their
background or economic status.`,
    missionDetails: `We believe in the power of learning and the importance of having access
to diverse forms of media and technology. Through our extensive
collection of books, movies and computer resources, we strive to foster
a culture of continuous learning and growth.`,
    valuesTitle: 'Our Core Values',
    values: [
      {
        icon: 'bi-book',
        title: 'Accessibility',
        description:
          'We believe everyone deserves access to quality educational and entertainment resources, regardless of their background or economic status.',
      },
      {
        icon: 'bi-people',
        title: 'Community',
        description:
          'We foster a sense of community by bringing people together through shared interests in learning and media.',
      },
      {
        icon: 'bi-lightbulb',
        title: 'Innovation',
        description:
          'We continuously seek new and better ways to serve our community through technology and creative programming.',
      },
      {
        icon: 'bi-heart',
        title: 'Integrity',
        description:
          'We operate with honesty and transparency in all our dealings with the community and each other.',
      },
    ],
    historyTitle: 'Our History',
    historyDescription: `Founded in 2010, Ahadu Center began as a small community initiative with
just 500 books and a handful of volunteers. Today, we've grown to serve
over 10,000 members with:`,
    historyList: [
      'Over 50,000 books in various languages and genres',
      'A comprehensive movie and documentary collection',
      'Modern computer lab with internet access',
      'Regular workshops and educational programs',
      'Community events and book clubs',
    ],
    quote:
      'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
    statistics: [
      { value: 10000, label: 'Members Served' },
      { value: 50000, label: 'Books Available' },
      { value: 5000, label: 'Movies & Docs' },
      { value: 13, label: 'Years of Service' },
    ],
    teamMembers: [
      {
        id: 1,
        name: 'Alex Morgan',
        position: 'Founder & Director',
        bio: 'Started Ahadu Center with a passion for making education accessible to all.',
        imageUrl: '/images/team1.jpg',
      },
      {
        id: 2,
        name: 'Samuel Tesfaye',
        position: 'Head Librarian',
        bio: 'Manages our vast collection of books and resources.',
        imageUrl: '/images/team2.jpg',
      },
      {
        id: 3,
        name: 'Lena Alemu',
        position: 'Technology Coordinator',
        bio: 'Oversees our computer labs and digital resources.',
        imageUrl: '/images/team3.jpg',
      },
    ],
  };

  // Cart data
  cartItems: CartItem[] = [
    {
      id: 1,
      name: 'Inception',
      category: 'Movie',
      price: 12.99,
      image: '/images/movies/inception.jpg',
      quantity: 1,
    },
    {
      id: 2,
      name: 'The Great Gatsby',
      category: 'Book',
      price: 14.99,
      image: '/images/books/gatsby.jpg',
      quantity: 2,
    },
    {
      id: 3,
      name: 'MacBook Pro',
      category: 'Computer',
      price: 1299.99,
      image: '/images/computers/macbook-pro.jpg',
      quantity: 1,
    },
  ];

  // Contact data
  contactData: ContactData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  // Form models
  newBook: Book = {
    id: 0,
    title: '',
    author: '',
    category: '',
    price: 0,
    image: '',
  };

  newMovie: Movie = {
    id: 0,
    title: '',
    year: new Date().getFullYear(),
    genre: '',
    price: 0,
    image: '',
  };

  newProduct: Product = {
    id: 0,
    name: '',
    brand: '',
    type: '',
    price: 0,
    image: '',
  };

  constructor(private router: Router) {
    // Check if user is logged in
    if (localStorage.getItem('isAdminLoggedIn') !== 'true') {
      this.router.navigate(['/admin-login']);
    }
  }

  // Tab navigation
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Logout functionality
  logout() {
    localStorage.removeItem('isAdminLoggedIn');
    this.router.navigate(['/admin-login']);
  }

  // Methods for book management
  addBook() {
    if (this.newBook.title && this.newBook.author) {
      const newId = Math.max(...this.books.map((b) => b.id)) + 1;
      this.books.push({
        ...this.newBook,
        id: newId,
      });

      // Reset form
      this.newBook = {
        id: 0,
        title: '',
        author: '',
        category: '',
        price: 0,
        image: '',
      };

      // Hide modal
      const modalElement = document.getElementById('addBookModal');
      if (modalElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  deleteBook(id: number) {
    this.books = this.books.filter((book) => book.id !== id);
  }

  // Methods for movie management
  addMovie() {
    if (this.newMovie.title && this.newMovie.genre) {
      const newId = Math.max(...this.movies.map((m) => m.id)) + 1;
      this.movies.push({
        ...this.newMovie,
        id: newId,
      });

      // Reset form
      this.newMovie = {
        id: 0,
        title: '',
        year: new Date().getFullYear(),
        genre: '',
        price: 0,
        image: '',
      };

      // Hide modal
      const modalElement = document.getElementById('addMovieModal');
      if (modalElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  deleteMovie(id: number) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
  }

  // Methods for product management
  addProduct() {
    if (this.newProduct.name && this.newProduct.brand) {
      const newId = Math.max(...this.products.map((p) => p.id)) + 1;
      this.products.push({
        ...this.newProduct,
        id: newId,
      });

      // Reset form
      this.newProduct = {
        id: 0,
        name: '',
        brand: '',
        type: '',
        price: 0,
        image: '',
      };

      // Hide modal
      const modalElement = document.getElementById('addProductModal');
      if (modalElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  deleteProduct(id: number) {
    this.products = this.products.filter((product) => product.id !== id);
  }

  // Method for contact form submission
  submitContactForm() {
    if (
      this.contactData.name &&
      this.contactData.email &&
      this.contactData.subject &&
      this.contactData.message
    ) {
      console.log('Contact form submitted:', this.contactData);
      alert('Message sent successfully!');
      // Reset form
      this.contactData = {
        name: '',
        email: '',
        subject: '',
        message: '',
      };
    } else {
      alert('Please fill in all fields.');
    }
  }

  // Method for cart management
  removeCartItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  // Method to update about page data
  updateAboutData() {
    console.log('About page data updated');
    alert('About page data saved successfully!');
  }
}
