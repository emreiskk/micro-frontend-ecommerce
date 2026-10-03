import { type Product, enrichProductWithSpecs } from "@repo/shared-types";

export const PRODUCT_IMAGE_MAP: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80", // Fjallraven Backpack
  2: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=800&q=80", // Mens Casual Slim Fit T-Shirts
  3: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&h=800&q=80", // Mens Cotton Jacket
  4: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&h=800&q=80", // Mens Casual Slim Fit
  5: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&h=800&q=80", // Dragon Chain Bracelet / Jewelry
  6: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&h=800&q=80", // Solid Gold Petite Micropave
  7: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&h=800&q=80", // White Gold Plated Princess Ring
  8: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&h=800&q=80", // Pierced Owl Rose Gold Plated Earrings
  9: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&h=800&q=80", // WD 2TB Elements Portable Hard Drive
  10: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&h=800&q=80", // SanDisk SSD PLUS 1TB Internal SSD
  11: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=800&q=80", // Silicon Power 256GB SSD
  12: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&h=800&q=80", // WD 4TB Gaming Drive
  13: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&h=800&q=80", // Acer 21.5 Inches Full HD IPS Monitor
  14: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&h=800&q=80", // Samsung Ultrawide Gaming Monitor
  15: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&h=800&q=80", // Snowboard Jacket Winter Coats
  16: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&h=800&q=80", // Removable Hooded Moto Biker Jacket
  17: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&h=800&q=80", // Rain Jacket Women Windbreaker
  18: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&h=800&q=80", // Solid Short Sleeve Boat Neck V
  19: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&h=800&q=80", // Opna Women's Short Sleeve Moisture
  20: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=800&q=80", // Casual Cotton Short Sleeve Tee
};

export function sanitizeProduct(p: Product): Product {
  const reliableImage = PRODUCT_IMAGE_MAP[p.id] || p.image || "/images/fallback/placeholder.svg";
  const sanitized = {
    ...p,
    image: reliableImage,
  };
  return enrichProductWithSpecs(sanitized);
}

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    price: 109.95,
    description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[1],
    rating: { rate: 3.9, count: 120 }
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[2],
    rating: { rate: 4.1, count: 259 }
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description: "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling.",
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[3],
    rating: { rate: 4.7, count: 500 }
  },
  {
    id: 4,
    title: "Mens Casual Slim Fit",
    price: 15.99,
    description: "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person.",
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[4],
    rating: { rate: 2.1, count: 430 }
  },
  {
    id: 5,
    title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[5],
    rating: { rate: 4.6, count: 400 }
  },
  {
    id: 6,
    title: "Solid Gold Petite Micropave",
    price: 168,
    description: "Satisfaction Guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.",
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[6],
    rating: { rate: 3.9, count: 70 }
  },
  {
    id: 7,
    title: "White Gold Plated Princess",
    price: 9.99,
    description: "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[7],
    rating: { rate: 3, count: 400 }
  },
  {
    id: 8,
    title: "Pierced Owl Rose Gold Plated Stainless Steel Double",
    price: 10.99,
    description: "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[8],
    rating: { rate: 1.9, count: 100 }
  },
  {
    id: 9,
    title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
    price: 64,
    description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[9],
    rating: { rate: 3.3, count: 203 }
  },
  {
    id: 10,
    title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
    price: 109,
    description: "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5 hard drive; Based on published specifications)",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[10],
    rating: { rate: 2.9, count: 470 }
  },
  {
    id: 11,
    title: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
    price: 109,
    description: "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance.",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[11],
    rating: { rate: 4.8, count: 319 }
  },
  {
    id: 12,
    title: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
    price: 114,
    description: "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[12],
    rating: { rate: 4.8, count: 400 }
  },
  {
    id: 13,
    title: "Acer SB220Q bi 21.5 Inches Full HD (1920 x 1080) IPS Ultra-Thin",
    price: 599,
    description: "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No display port",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[13],
    rating: { rate: 2.9, count: 250 }
  },
  {
    id: 14,
    title: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
    price: 999.99,
    description: "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration",
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[14],
    rating: { rate: 2.2, count: 140 }
  },
  {
    id: 15,
    title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    price: 56.99,
    description: "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece.",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[15],
    rating: { rate: 2.6, count: 235 }
  },
  {
    id: 16,
    title: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    description: "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[16],
    rating: { rate: 2.9, count: 340 }
  },
  {
    id: 17,
    title: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    description: "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[17],
    rating: { rate: 3.8, count: 679 }
  },
  {
    id: 18,
    title: "MBJ Women's Solid Short Sleeve Boat Neck V",
    price: 9.85,
    description: "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[18],
    rating: { rate: 4.7, count: 130 }
  },
  {
    id: 19,
    title: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    description: "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[19],
    rating: { rate: 4.5, count: 146 }
  },
  {
    id: 20,
    title: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    description: "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch.",
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[20],
    rating: { rate: 3.6, count: 145 }
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch("https://fakestoreapi.com/products", {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map(sanitizeProduct);
      }
    }
  } catch (error) {
    // Graceful fallback
  }
  return FALLBACK_PRODUCTS.map(sanitizeProduct);
}

export async function fetchProductById(id: string | number): Promise<Product | null> {
  const numericId = Number(id);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`https://fakestoreapi.com/products/${numericId}`, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return sanitizeProduct(data);
      }
    }
  } catch (error) {
    // Graceful fallback
  }

  const found = FALLBACK_PRODUCTS.find((p) => p.id === numericId);
  return found ? sanitizeProduct(found) : null;
}
