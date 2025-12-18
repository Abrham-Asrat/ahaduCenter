import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

interface ProductType {
  value: string;
  label: string;
}

interface Brand {
  value: string;
  label: string;
}

@Component({
  selector: 'app-computers',
  templateUrl: './computers.component.html',
  styleUrls: ['./computers.component.scss'],
  standalone: false,
})
export class ComputersComponent {
  // Filter properties
  selectedType = '';
  selectedBrand = '';
  searchTerm = '';

  // Product types for dropdown
  productTypes: ProductType[] = [
    { value: '', label: 'All Types' },
    { value: 'laptop', label: 'Laptops' },
    { value: 'desktop', label: 'Desktops' },
    { value: 'tablet', label: 'Tablets' },
    { value: 'accessory', label: 'Accessories' },
  ];

  // Brands for dropdown
  brands: Brand[] = [
    { value: '', label: 'All Brands' },
    { value: 'apple', label: 'Apple' },
    { value: 'dell', label: 'Dell' },
    { value: 'hp', label: 'HP' },
    { value: 'lenovo', label: 'Lenovo' },
    { value: 'asus', label: 'ASUS' },
  ];

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 3;

  // Selected product for details view
  selectedProduct: Product | null = null;

  // Sample product data
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
    {
      id: 5,
      name: 'Lenovo ThinkPad',
      brand: 'Lenovo',
      type: 'laptop',
      price: 899.99,
      image: '/images/computers/thinkpad.jpg',
      processor: 'Intel i7',
      ram: '16GB',
      storage: '512GB SSD',
    },
    {
      id: 6,
      name: 'ASUS ROG Gaming Desktop',
      brand: 'ASUS',
      type: 'desktop',
      price: 1499.99,
      image: '/images/computers/asus-rog.jpg',
      processor: 'Intel i9',
      ram: '32GB',
      storage: '1TB SSD',
    },
    {
      id: 7,
      name: 'Microsoft Surface Pro',
      brand: 'Microsoft',
      type: 'tablet',
      price: 899.99,
      image: '/images/computers/surface-pro.jpg',
      processor: 'Intel i5',
      ram: '8GB',
      storage: '256GB SSD',
    },
    {
      id: 8,
      name: 'Alienware Aurora',
      brand: 'Dell',
      type: 'desktop',
      price: 1999.99,
      image: '/images/computers/alienware.jpg',
      processor: 'Intel i9',
      ram: '32GB',
      storage: '2TB SSD',
    },
    {
      id: 9,
      name: 'Mac Studio',
      brand: 'Apple',
      type: 'desktop',
      price: 1999.99,
      image: '/images/computers/mac-studio.jpg',
      processor: 'M1 Ultra',
      ram: '32GB',
      storage: '512GB SSD',
    },
    {
      id: 10,
      name: 'Wireless Keyboard',
      brand: 'Logitech',
      type: 'accessory',
      price: 49.99,
      image: '/images/computers/keyboard.jpg',
    },
    {
      id: 11,
      name: 'Bluetooth Mouse',
      brand: 'Apple',
      type: 'accessory',
      price: 79.99,
      image: '/images/computers/mouse.jpg',
    },
    {
      id: 12,
      name: '4K Monitor',
      brand: 'Dell',
      type: 'accessory',
      price: 299.99,
      image: '/images/computers/monitor.jpg',
      size: '27"',
    },
  ];

  get filteredProducts() {
    return this.products
      .filter((product) => {
        const matchesType = this.selectedType
          ? product.type.toLowerCase().includes(this.selectedType.toLowerCase())
          : true;
        const matchesBrand = this.selectedBrand
          ? product.brand
              .toLowerCase()
              .includes(this.selectedBrand.toLowerCase())
          : true;
        const matchesSearch = this.searchTerm
          ? product.name
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(this.searchTerm.toLowerCase())
          : true;

        return matchesType && matchesBrand && matchesSearch;
      })
      .slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
  }

  addToCart(product: Product) {
    console.log('Added to cart:', product);
    alert(`${product.name} has been added to your cart!`);
  }

  viewProductDetails(product: Product) {
    this.selectedProduct = product;
    // Trigger the modal using Bootstrap's JavaScript API
    const modalElement = document.getElementById('productDetailsModal');
    if (modalElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modal = (window as any).bootstrap.Modal.getOrCreateInstance(
        modalElement
      );
      modal.show();
    }
  }

  getProductUseCase(type: string): string {
    switch (type.toLowerCase()) {
      case 'laptop':
        return 'work, study, and entertainment on the go';
      case 'desktop':
        return 'powerful computing for demanding tasks';
      case 'tablet':
        return 'portable productivity and media consumption';
      case 'accessory':
        return 'enhancing your computing experience';
      default:
        return 'various computing needs';
    }
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
