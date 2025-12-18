import { Component } from '@angular/core';

interface ContactInfo {
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface Hours {
  days: string;
  hours: string;
}

interface SocialMedia {
  name: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent {
  contactInfo: ContactInfo = {
    address: '123 Ahadu Street',
    city: 'Addis Ababa, Ethiopia',
    phone: '+251 11 123 4567',
    email: 'info@ahaducenter.com',
  };

  hours: Hours[] = [
    { days: 'Monday-Friday', hours: '9AM-7PM' },
    { days: 'Saturday', hours: '10AM-6PM' },
    { days: 'Sunday', hours: '12PM-5PM' },
  ];

  socialMedia: SocialMedia[] = [
    { name: 'Facebook', icon: 'bi bi-facebook', url: '#' },
    { name: 'TikTok', icon: 'bi bi-tiktok', url: '#' },
    { name: 'Instagram', icon: 'bi bi-instagram', url: '#' },
  ];

  currentYear: number = new Date().getFullYear();

  constructor() {}
}
