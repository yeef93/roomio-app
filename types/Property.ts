// types/Property.ts
export interface Property {
  id: number;
  images: { id: number; imageUrl: string }[]; // Make sure images include id
  name: string;
  description: string;
  location: string | null;
  city: string | null;
  category: { name: string; imageUrl: string };
  tenant: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  price: number;
  rooms: {
    id: number;
    name: string;
    description: string;
    capacity: string;
    size: string;
    bedType: string;
    totalBed: string;
    qty: string;
    basePrice: string;
    totalBathroom: string;
    isActive: string;
    currentPrice: string;
    actualPrice: string;
    images: { id: number; imageUrl: string }[];
  }[];
}
