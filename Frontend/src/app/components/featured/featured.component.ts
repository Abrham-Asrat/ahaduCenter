import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price?: string;
  category?: string;
  image: string;
  alt: string;
}

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss'],
  standalone: false,
})
export class FeaturedComponent {
  laptopProducts: Product[] = [
    {
      id: 1,
      name: 'Gaming Laptop Pro',
      price: '$1299.99',
      image: '/images/movie.png',
      alt: 'Gaming Laptop',
    },
    {
      id: 2,
      name: 'Business UltraSlim',
      price: '$899.99',
      image: '/images/movie.png',
      alt: 'Business Laptop',
    },
    {
      id: 3,
      name: 'Student Essential',
      price: '$599.99',
      image: '/images/movie.png',
      alt: 'Student Laptop',
    },
    {
      id: 4,
      name: 'Designer Workstation',
      price: '$1599.99',
      image: '/images/movie.png',
      alt: 'Designer Laptop',
    },
    {
      id: 5,
      name: 'Budget Friendly',
      price: '$399.99',
      image: '/images/movie.png',
      alt: 'Budget Laptop',
    },
  ];

  bookProducts: Product[] = [
    {
      id: 1,
      name: 'The Midnight Library',
      category: 'Fiction',
      image: '/images/movie.png',
      alt: 'Fiction Bestseller',
    },
    {
      id: 2,
      name: 'Sapiens: A Brief History',
      category: 'Non-Fiction',
      image: '/images/movie.png',
      alt: 'Non-Fiction Bestseller',
    },
    {
      id: 3,
      name: 'The Thursday Murder Club',
      category: 'Mystery',
      image: '/images/movie.png',
      alt: 'Mystery Bestseller',
    },
    {
      id: 4,
      name: 'The Invisible Life',
      category: 'Romance',
      image: '/images/movie.png',
      alt: 'Romance Bestseller',
    },
    {
      id: 5,
      name: 'Project Hail Mary',
      category: 'Sci-Fi',
      image: '/images/movie.png',
      alt: 'Sci-Fi Bestseller',
    },
  ];

  constructor() {}
}
