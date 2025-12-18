import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: false,
})
export class NavbarComponent {
  isComputersDropdownOpen = false;
  isBooksDropdownOpen = false;
  cartCount = 0;

  handleCartClick() {
    this.cartCount++;
  }

  toggleComputersDropdown() {
    this.isComputersDropdownOpen = !this.isComputersDropdownOpen;
  }

  toggleBooksDropdown() {
    this.isBooksDropdownOpen = !this.isBooksDropdownOpen;
  }

  closeDropdowns() {
    this.isComputersDropdownOpen = false;
    this.isBooksDropdownOpen = false;
  }
}
