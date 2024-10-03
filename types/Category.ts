interface CategoryImage {
    id: number;
    imageUrl: string;
  }
  
  interface CategoryTenant {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
    createdAt: string;
  }
  
 export interface Category {
    id: number;
    name: string;
    description: string;
    image?: CategoryImage;
    tenant?: CategoryTenant;
  }
  