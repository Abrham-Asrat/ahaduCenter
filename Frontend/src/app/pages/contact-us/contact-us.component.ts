import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  standalone: false,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
})
export class ContactUsComponent {
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  onSubmit() {
    if (
      this.contactData.name &&
      this.contactData.email &&
      this.contactData.subject &&
      this.contactData.message
    ) {
      console.log('Form submitted:', this.contactData);
      alert('Thank you for your message! We will get back to you soon.');
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
}
