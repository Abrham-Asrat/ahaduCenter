import { Component } from '@angular/core';

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

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false,
})
export class AboutComponent {
  // Page title
  pageTitle = 'Our Story & Mission';
  
  // Mission section data
  missionTitle = 'Our Journey & Mission';
  missionDescription = `Ahadu Center was founded with a vision to provide quality educational
and entertainment resources to our community. Our mission is to make
knowledge and entertainment accessible to everyone, regardless of their
background or economic status.`;
  
  missionDetails = `We believe in the power of learning and the importance of having access
to diverse forms of media and technology. Through our extensive
collection of books, movies, and computer resources, we strive to foster
a culture of continuous learning and growth.`;
  
  // Values section data
  valuesTitle = 'Our Core Values';
  values = [
    {
      icon: 'bi-book',
      title: 'Accessibility',
      description: 'We believe everyone deserves access to quality educational and entertainment resources, regardless of their background or economic status.'
    },
    {
      icon: 'bi-people',
      title: 'Community',
      description: 'We foster a sense of community by bringing people together through shared interests in learning and media.'
    },
    {
      icon: 'bi-lightbulb',
      title: 'Innovation',
      description: 'We continuously seek new and better ways to serve our community through technology and creative programming.'
    },
    {
      icon: 'bi-heart',
      title: 'Integrity',
      description: 'We operate with honesty and transparency in all our dealings with the community and each other.'
    }
  ];
  
  // History section data
  historyTitle = 'Our History';
  historyDescription = `Founded in 2010, Ahadu Center began as a small community initiative with
just 500 books and a handful of volunteers. Today, we've grown to serve
over 10,000 members with:`;
  
  historyList = [
    'Over 50,000 books in various languages and genres',
    'A comprehensive movie and documentary collection',
    'Modern computer lab with internet access',
    'Regular workshops and educational programs',
    'Community events and book clubs'
  ];
  
  quote = 'Education is the most powerful weapon which you can use to change the world.';
  author = 'Nelson Mandela';
  
  
 
  constructor() {}
}
