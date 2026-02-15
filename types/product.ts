export interface ColorOption {
  name: string;
  hex: string;
}

//export interface ProductVariant {
  //sizes: string[];
  //colors: ColorOption[];
  //price: number;
  //mrp?: number;
  //discount?: number;
  //images: string[];
  //stock: number;
  //design?: string;
  
export type ProductVariant = {
  id: string;
  size?: string | null;
  color?: string | null;

  mrp?: number;              // ✅ add
  price?: number;            // selling price
  discount?: number;         // percentage
  discountAmount?: number;   // amount saved

  stock?: number;
  images?: string[];
};



export interface Product {
  id: string;
  name: string;
  brandName?: string;
  siteId: string;  

  description?: string;
  category?: string;
  subCategory?: string;
  subSubCategory?: string;

  price: number;     // default/base price
  mrp?: number;
  discount?: number;

  images: string[];

  sizes?: string[];

  variants?: ProductVariant[];   // ✅ IMPORTANT

  createdAt: string;
  rating?: number;
  reviewCount: number; 
  reviews?: Review[];
}

export interface Review {
  id?: string;           // Review ID
  name?: string;         // User name
  rating: number;        // 1-5
  comment?: string;      // Optional comment
  images?: string[];     // Optional images array
  createdAt:string;
  userName:string;
}

