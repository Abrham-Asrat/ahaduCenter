import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Movie {
  id: number;
  title: string;
  year: number;
  genre: string;
  price: number;
  image: string;
}

interface Genre {
  value: string;
  label: string;
}

interface Year {
  value: string;
  label: string;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  standalone: false,
})
export class MoviesComponent {
  // Filter properties
  selectedGenre = '';
  selectedYear = '';
  searchTerm = '';

  // Genres for dropdown
  genres: Genre[] = [
    { value: '', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'horror', label: 'Horror' },
  ];

  // Years for dropdown
  years: Year[] = [
    { value: '', label: 'Any Year' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
  ];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 3;

  // Sample movie data
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
    {
      id: 5,
      title: 'Forrest Gump',
      year: 1994,
      genre: 'Drama',
      price: 10.99,
      image: '/images/movies/forrest-gump.jpg',
    },
    {
      id: 6,
      title: 'The Godfather',
      year: 1972,
      genre: 'Drama',
      price: 13.99,
      image: '/images/movies/godfather.jpg',
    },
    {
      id: 7,
      title: 'Interstellar',
      year: 2014,
      genre: 'Sci-Fi',
      price: 15.99,
      image: '/images/movies/interstellar.jpg',
    },
    {
      id: 8,
      title: 'Fight Club',
      year: 1999,
      genre: 'Drama',
      price: 11.99,
      image: '/images/movies/fight-club.jpg',
    },
    {
      id: 9,
      title: 'Avengers: Endgame',
      year: 2019,
      genre: 'Action',
      price: 19.99,
      image: '/images/movies/endgame.jpg',
    },
    {
      id: 10,
      title: 'Parasite',
      year: 2019,
      genre: 'Drama',
      price: 16.99,
      image: '/images/movies/parasite.jpg',
    },
    {
      id: 11,
      title: 'Joker',
      year: 2019,
      genre: 'Drama',
      price: 17.99,
      image: '/images/movies/joker.jpg',
    },
    {
      id: 12,
      title: 'John Wick',
      year: 2014,
      genre: 'Action',
      price: 12.99,
      image: '/images/movies/john-wick.jpg',
    },
  ];

  get filteredMovies() {
    return this.movies
      .filter((movie) => {
        const matchesGenre = this.selectedGenre
          ? movie.genre.toLowerCase().includes(this.selectedGenre.toLowerCase())
          : true;
        const matchesYear = this.selectedYear
          ? movie.year.toString() === this.selectedYear
          : true;
        const matchesSearch = this.searchTerm
          ? movie.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            movie.genre.toLowerCase().includes(this.searchTerm.toLowerCase())
          : true;

        return matchesGenre && matchesYear && matchesSearch;
      })
      .slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
  }

  addToCart(movie: Movie) {
    console.log('Added to cart:', movie);
    alert(`${movie.title} has been added to your cart!`);
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
