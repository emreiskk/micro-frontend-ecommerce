import {
  type Product,
  enrichProductWithSpecs,
  PRODUCT_IMAGE_MAP,
  FALLBACK_PRODUCTS,
  TRENDSPHERE_OFFICIAL_SELLER,
} from "@repo/shared-types";

export { PRODUCT_IMAGE_MAP, FALLBACK_PRODUCTS, TRENDSPHERE_OFFICIAL_SELLER };

export function sanitizeProduct(p: Product): Product {
  const reliableImage = PRODUCT_IMAGE_MAP[p.id] || p.image || "/images/fallback/placeholder.svg";
  const sanitized = {
    ...p,
    image: reliableImage,
    seller: p.seller || TRENDSPHERE_OFFICIAL_SELLER,
  };
  return enrichProductWithSpecs(sanitized);
}

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
  if (isNaN(numericId) || numericId <= 0) {
    return null;
  }
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
