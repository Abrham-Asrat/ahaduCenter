# Ahadu Center - Client Interface

Welcome to the frontend client for **Ahadu Center**, a premier hybrid platform for exploring movies, browsing books, and purchasing electronics. This platform is designed to provide users with a stunning, interactive, and dark-themed digital catalog that seamlessly integrates with Ahadu Center's physical store location.

## 🌟 Key Features

### 🛒 Physical Store Integration
- **No Online Payments**: Users can browse the catalog, build a cart or wishlist, and finalize their purchases/borrows in-person at our physical store location (Bole Road, Addis Ababa).
- **Borrow & Reserve**: Users can borrow movies or reserve books digitally and pick them up at the front desk.

### 🎬 Movies, 📚 Books & 💻 Electronics
- **Categorized Catalogs**: Dedicated marketplaces for movies, electronics, and books.
- **Dynamic Search**: Instantly search for products across the entire catalog.
- **Wishlist & Cart**: Persistent saving of items for later viewing or immediate in-store pickup.

### 🛡️ Interactive User & Admin Portals
- **User Dashboard**: Manage profile details, view borrowing history, and track active orders.
- **Admin Terminal**: A comprehensive admin dashboard to manage inventory (movies, books, electronics), view analytics, and manage users.
- **Authentication**: Dynamic Navbar rendering based on user login state.

### 🎨 Premium Design System
- **Dark Mode Native**: A beautiful, glassmorphism-inspired dark mode UI.
- **Micro-Animations**: Hover effects, dynamic drop-shadows, and smooth transitions built purely with Vanilla CSS.
- **Responsive Navigation**: Fully mobile-optimized navigation drawers and bottom sheets.

---

## 🛠️ Technologies Used

- **Framework**: [React](https://reactjs.org/) (Functional Components, Hooks)
- **Build Tool**: [Vite](https://vitejs.dev/) for blazing fast HMR and optimized builds.
- **Routing**: `react-router-dom` (Client-side routing and protected routes).
- **Styling**: Vanilla CSS (`index.css`) utilizing modern CSS variables for a comprehensive Design System. No heavy CSS frameworks.
- **Icons**: [Google Material Symbols](https://fonts.google.com/icons).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```text
client/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Navbar, Footer, BentoGrid, HeroSection, etc.
│   ├── pages/              # Application views/routes
│   │   ├── admin/          # Admin Terminal pages (Manage Movies, Users, Orders)
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── LoginPage.jsx   # Authentication
│   │   └── ...             # Feature pages (Wishlist, Cart, Catalogs)
│   ├── App.jsx             # Main Router configuration
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global design system & utility classes
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

---

## 📍 Physical Location
**Ahadu Center HQ**
Bole Road (Next to Friendship HyperMarket)
Addis Ababa, Ethiopia

*Developed for Ahadu Center.*
