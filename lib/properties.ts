export type PropertyStatus = 'Published' | 'Draft' | 'Under review';
export type PropertyType = 'House' | 'Villa' | 'Apartment' | 'Estate';

export interface Property {
  id: number;
  name: string;
  location: string;
  price: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: PropertyStatus;
  image: string;
  tag: string;
  updated: string;
  description: string;
  amenities: string[];
}

export const initialProperties: Property[] = [
  {
    id: 1,
    name: 'Rosewood Manor',
    location: 'Palm Springs, California',
    price: 2400,
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    size: 2850,
    status: 'Published',
    image: 'photo-1600210492486-724fe5c67fb0',
    tag: 'Just listed',
    updated: 'Today, 10:42 am',
    description: 'A serene mid-century desert retreat blending rammed earth textures with sun-drenched courtyards, floor-to-ceiling glass, and an infinity plunge pool framed by native fan palms.',
    amenities: ['Private Saltwater Pool', 'Mountain Views', 'Solar Array', 'Outdoor Fireplace', 'Chef’s Kitchen', 'Original Terrazzo Floors']
  },
  {
    id: 2,
    name: 'Seabreeze Villa',
    location: 'Joshua Tree, California',
    price: 1500,
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    size: 1920,
    status: 'Published',
    image: 'photo-1600607687939-ce8a6c25118c',
    tag: 'Open house',
    updated: 'Today, 9:18 am',
    description: 'An architectural oasis positioned among ancient monzogranite boulders, offering tranquil panoramic stargazing decks, custom lime-wash walls, and curated earthen ceramics.',
    amenities: ['Panoramic Stargazing Deck', 'Japanese Soaking Tub', 'Off-Grid Passive Cooling', 'Zen Garden', 'High-Speed Fiber']
  },
  {
    id: 3,
    name: 'Willow Cottage',
    location: 'Scottsdale, Arizona',
    price: 1600,
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    size: 2140,
    status: 'Under review',
    image: 'photo-1600566753086-00f18fb6b3ea',
    tag: 'New price',
    updated: 'Yesterday',
    description: 'A warm adobe sanctuary featuring hand-carved cedar beams, shaded deep portales, fragrant citrus groves, and open-hearth living spaces crafted for slow desert living.',
    amenities: ['Citrus Orchard', 'Adobe Fireplace', 'Covered Veranda', 'Handmade Tilework', 'Wine Cellar']
  },
  {
    id: 4,
    name: 'The Sol House',
    location: 'Ojai, California',
    price: 3200,
    type: 'House',
    bedrooms: 5,
    bathrooms: 4,
    size: 3420,
    status: 'Published',
    image: 'photo-1600607687920-4e2a09cf159d',
    tag: 'Featured',
    updated: 'Nov 11, 2026',
    description: 'Bathed in the famous Ojai pink moment light, this contemporary estate marries reclaimed timber, raw travertine slabs, and expansive organic gardens yielding heirloom olives.',
    amenities: ['Olive Grove', 'Travertine Infinity Pool', 'Guest Casita', 'Outdoor Pizza Oven', 'EV Charging Station']
  },
  {
    id: 5,
    name: 'Casa de Cobre',
    location: 'Santa Fe, New Mexico',
    price: 2100,
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    size: 2560,
    status: 'Draft',
    image: 'photo-1600047509807-ba8f99d2cdde',
    tag: 'Just listed',
    updated: 'Nov 10, 2026',
    description: 'Honoring historic Pueblo Revival architecture with natural mud plaster, radiant copper fixtures, kiva fireplaces in every bedroom, and tranquil mountain vistas.',
    amenities: ['Traditional Kiva Fireplaces', 'Courtyard Fountain', 'Radiant Heating', 'Artist Studio', 'Custom Ironwork']
  },
  {
    id: 6,
    name: 'Dune Residence',
    location: 'Palm Desert, California',
    price: 2800,
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    size: 2200,
    status: 'Published',
    image: 'photo-1600607687644-c7171b42498f',
    tag: 'Open house',
    updated: 'Nov 9, 2026',
    description: 'Minimalist low-profile desert dwelling boasting cantilevered overhangs, motorized pocket doors that disappear completely into walls, and a private sunken lounge.',
    amenities: ['Motorized Pocket Glass Walls', 'Sunken Conversation Pit', 'Desert Native Landscaping', 'Spa Tub', 'Security Concierge']
  }
];

// Helper to format currency
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

// Helper to format image URL
export function getUnsplashUrl(id: string, width = 1200): string {
  if (id.startsWith('http://') || id.startsWith('https://')) {
    return id;
  }
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
}

