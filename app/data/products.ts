import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "perfume-elegance",
    name: "Perfume Elegance",
    price: 89,
    image: "/images/perfume.png",
    category: "Perfumes",
    badge: "Nuevo",
    description: "Fragancia elegante y sofisticada.",
    stock: 10,
  },

  {
    id: "bolso-premium",
    name: "Bolso Premium",
    price: 149,
    image: "/images/bolso.png",
    category: "Accesorios",
    badge: "Top ventas",
    description: "Bolso de diseño premium.",
    stock: 10,
  },

  {
    id: "crema-luxury",
    name: "Crema Luxury",
    price: 59,
    image: "/images/crema.jpg",
    category: "Belleza",
    badge: "Exclusivo",
    description: "Crema de lujo para el cuidado de la piel.",
    stock: 10,
  },

  {
    id: "reloj-classic",
    name: "Reloj Classic",
    price: 199,
    image: "/images/reloj.jpg.JPG",
    category: "Relojes",
    badge: "Nuevo",
    description: "Reloj clásico con diseño elegante.",
    stock: 10,
  },
];