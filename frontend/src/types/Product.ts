export interface Product {
  id: number;
  name: string;
  image_url: string;
  category: string;
  price: number;
  quantity: number;
  expiration_date: string | null; 
  date_added: string; 
  date_modified: string; 
}

