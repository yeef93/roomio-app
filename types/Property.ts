// types/Property.ts
export interface Property {
    id: number;
    images: { id: number; imageUrl: string }[]; // Make sure images include id
    name: string;
    location: string | null;
    city: string | null;
    category: string;
    tenant: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      avatar: string;
    };
    price: number;
  }
  