export interface Category {
  id: string;
  name: string;
  image: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageBase64?: string; // Firestore'da bu isimle de saklanabilir
  categoryId: string;
  stock?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  receiptBase64: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
}
