import { Component } from '@angular/core';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  imageClass?: string; // Optional property for image-specific classes
}

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
  standalone: false,
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: 'movies',
      title: 'Movies',
      description:
        'High-quality movie copying services with a vast collection of classics and new releases.',
      image: '/images/movie.png',
      buttonText: 'Browse Movies',
      imageClass: 'movies-img',
    },
    {
      id: 'computers',
      title: 'Computers',
      description:
        'New and refurbished computers, laptops, and accessories with buyback programs.',
      image: '/images/pc.png',
      buttonText: 'Shop Computers',
      imageClass: 'computers-img',
    },
    {
      id: 'books',
      title: 'Books',
      description:
        'Extensive collection of books across all genres with competitive pricing.',
      image: '/images/book.png',
      buttonText: 'Discover Books',
      imageClass: 'books-img',
    },
  ];

  constructor() {}
}
