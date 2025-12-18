import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
  standalone: false,
})
export class CartsComponent {
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

  shipping = 5.99;

  get subtotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get tax(): number {
    return this.subtotal * 0.08; // 8% tax
  }

  get total(): number {
    return this.subtotal + this.tax + this.shipping;
  }

  increaseQuantity(index: number) {
    this.cartItems[index].quantity++;
  }

  decreaseQuantity(index: number) {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
    }
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
  }

  checkout() {
    alert(`Order placed successfully! Total: $${this.total.toFixed(2)}`);
    this.cartItems = [];
  }
}
