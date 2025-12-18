import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  image: string;
}

interface Category {
  value: string;
  label: string;
}

interface Author {
  value: string;
  label: string;
}

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss'],
  standalone: false,
})
export class BooksComponent {
  // Filter properties
  selectedCategory = '';
  selectedAuthor = '';
  searchTerm = '';

  // Categories for dropdown
  categories: Category[] = [
    { value: '', label: 'All Categories' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Science Fiction' },
  ];

  // Authors for dropdown
  authors: Author[] = [
    { value: '', label: 'All Authors' },
    { value: 'stephen-king', label: 'Stephen King' },
    { value: 'jk-rowling', label: 'J.K. Rowling' },
    { value: 'george-orwell', label: 'George Orwell' },
    { value: 'agatha-christie', label: 'Agatha Christie' },
  ];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 3;

  // Sample book data
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
    {
      id: 5,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      category: 'Fiction',
      price: 10.99,
      image: '/images/books/catcher-rye.jpg',
    },
    {
      id: 6,
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      category: 'Fiction',
      price: 13.99,
      image: '/images/books/harry-potter.jpg',
    },
    {
      id: 7,
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      category: 'Fantasy',
      price: 15.99,
      image: '/images/books/hobbit.jpg',
    },
    {
      id: 8,
      title: 'The Da Vinci Code',
      author: 'Dan Brown',
      category: 'Mystery',
      price: 11.99,
      image: '/images/books/davinci.jpg',
    },
    {
      id: 9,
      title: 'The Girl with the Dragon Tattoo',
      author: 'Stieg Larsson',
      category: 'Mystery',
      price: 19.99,
      image: '/images/books/dragon-tattoo.jpg',
    },
    {
      id: 10,
      title: 'Becoming',
      author: 'Michelle Obama',
      category: 'Biography',
      price: 16.99,
      image: '/images/books/becoming.jpg',
    },
    {
      id: 11,
      title: 'Steve Jobs',
      author: 'Walter Isaacson',
      category: 'Biography',
      price: 17.99,
      image: '/images/books/steve-jobs.jpg',
    },
    {
      id: 12,
      title: 'Dune',
      author: 'Frank Herbert',
      category: 'Science Fiction',
      price: 12.99,
      image: '/images/books/dune.jpg',
    },
  ];

  get filteredBooks() {
    return this.books
      .filter((book) => {
        const matchesCategory = this.selectedCategory
          ? book.category
              .toLowerCase()
              .includes(this.selectedCategory.toLowerCase())
          : true;
        const matchesAuthor = this.selectedAuthor
          ? book.author
              .toLowerCase()
              .includes(this.selectedAuthor.toLowerCase())
          : true;
        const matchesSearch = this.searchTerm
          ? book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
          : true;

        return matchesCategory && matchesAuthor && matchesSearch;
      })
      .slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
  }

  addToCart(book: Book) {
    console.log('Added to cart:', book);
    alert(`${book.title} has been added to your cart!`);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
