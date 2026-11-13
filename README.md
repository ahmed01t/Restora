# Restora · Editorial Luxury Real Estate

> *A more considered way home. Handpicked architectural residences defined by material honesty, desert serenity, and a deep respect for light.*

Restora is a full-stack, modern real estate platform built with **Next.js 16 (Turbopack)**, **React 19**, **TypeScript**, and **Framer Motion**. It combines a warm desert modern editorial frontend with a secure, production-ready administrative workspace for property directors.

---

## ✨ Features

### 🏡 Public Experience
- **Editorial Brand Aesthetic**: Warm desert palette (terracotta clay, desert sand, deep ink, and warm parchment) with bespoke serif accents.
- **Glassmorphic Sticky Navbar**: Features smooth scroll transitions, hover underline animations, a mobile drawer menu, and a live **Admin Portal** access badge.
- **Dynamic Property Filtering**:
  - Live keyword search by title, city, or neighborhood.
  - Category filter pills (*All homes, House, Villa, Apartment, Estate*).
  - Monthly lease price range filter (*Under \$2,000, \$2,000–\$3,000, \$3,000+*).
  - Mode toggle (*Buy, Rent, Sell*).
- **Interactive Property Cards**:
  - 3D-like hover elevation and subtle shadow depth.
  - Image zoom inside an overflow-contained container.
  - Favorite / heart toggle with bounce animation.
  - Rotating arrow buttons and floating *"Inspect residence"* badge on hover.
- **Responsive Property Details Modal**:
  - **Desktop (Split Layout)**: High-resolution image on the left, architectural details and booking form on the right.
  - **Mobile (< 860px)**: Seamless, single-column stacked layout with touch-friendly controls.
  - Zero horizontal overflow (`overflow-x: hidden`).
  - Full specs (*Beds, Baths, Sqft*), signature amenities list, and working **"Schedule a Private Golden-Hour Viewing"** form with confirmation alert.
- **Interactive Editorial Sections**:
  - **The Restora Way**: Step cards with expanding terracotta progress lines on hover.
  - **Services Grid**: Structured cards with flexbox top rows, hover elevation, and dark icon inversions.
  - **Stories & Testimonials**: Working interactive slider with next/previous controls and progress indicators.
  - **FAQ Accordion**: Smooth expansion/collapse with rotating plus-to-minus icons.
  - **Newsletter**: Subscription form with instant feedback alert.

### 🛡️ Admin Workspace (`/admin`)
- **Next.js 16 Proxy Authentication (`proxy.ts`)**: Server-level route guard protecting `/admin` routes using HMAC-SHA256 encrypted sessions and `timingSafeEqual` side-channel protection.
- **Demo Credentials Auto-Fill**: One-click credential filler on the login screen for testing and client walkthroughs.
- **Full Property CRUD**:
  - **Add Property**: Modal supporting Name, Location, Monthly Rent, Property Type, Beds, Baths, Sqft, Ribbon Tag, Publication Status, and Description.
  - **Edit Property**: In-place modification of existing listings.
  - **Quick Status Toggle**: 1-click toggle between `Published`, `Draft`, and `Under review`.
  - **Delete Property**: Deletion with confirmation safeguard.
- **Dynamic Portfolio Metrics**: Real-time stats recalculating total residences, published properties, drafts, and combined monthly asking rent.
- **Sort & Search**: Instant table search and sorting by price (*low/high*), name, or recent updates.
- **Secure Sign Out**: Clears the session cookie and redirects cleanly to `/admin/login`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Components & Proxy)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Custom Modern CSS with CSS Variables, Flexbox, CSS Grid, and KaTeX math readiness.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18.17+** (or Node 20+) installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```


```

> **Note**: For local development, safe fallbacks are already configured so the app runs out of the box.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm start
```

---


## 📂 Project Structure

```
├── app/
│   ├── admin/
│   │   ├── admin-dashboard.tsx    # Interactive Admin Dashboard client component
│   │   ├── layout.tsx             # Admin route layout wrapper
│   │   ├── page.tsx               # Server-side auth check & dashboard entry point
│   │   ├── login/
│   │   │   ├── login-form.tsx     # Admin sign-in form with demo helper
│   │   │   └── page.tsx           # Login page
│   │   └── signup/
│   │       └── page.tsx           # Invitation-only signup request page
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts     # Admin authentication & session creation endpoint
│   │   │   └── logout/route.ts    # Session destruction & sign-out endpoint
│   │   └── properties/route.ts    # REST API for property listings (GET, POST, PUT, DELETE)
│   ├── globals.css                # Global stylesheet with design system & animations
│   ├── layout.tsx                 # Root layout with font imports and metadata
│   └── page.tsx                   # Main editorial homepage & interactive property modals
├── lib/
│   ├── admin-auth.ts              # HMAC-SHA256 session signer, verifier & cookie manager
│   └── properties.ts              # Property data models, initial listings & helpers
├── proxy.ts                       # Next.js 16 server-level auth proxy (middleware guard)
├── .env.local                     # Local environment configuration
└── package.json                   # Project scripts and dependencies
```

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).

