export interface Rating {
  rate: number;
  count: number;
}

export interface ProductAttribute {
  name: string;
  options: string[];
  defaultValue: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface SelectedAttributes {
  [attributeName: string]: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  attributes?: ProductAttribute[];
  specifications?: ProductSpecification[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedAttributes?: SelectedAttributes;
  needsAttributeConfirmation?: boolean;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  totalCount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

export type CartActionType = 'SYNC' | 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'UPDATE_ATTRIBUTES' | 'CLEAR_CART';

export interface CartSyncMessage {
  type: CartActionType;
  items: CartItem[];
  timestamp: number;
  source: 'home' | 'cart';
}

export function getProductAttributes(product: Product): ProductAttribute[] {
  const cat = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  if (cat.includes("clothing")) {
    return [
      {
        name: "Beden",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        defaultValue: "M",
      },
    ];
  }

  if (cat.includes("electronics")) {
    if (title.includes("drive") || title.includes("ssd") || title.includes("hard")) {
      return [
        {
          name: "Kapasite",
          options: ["500 GB", "1 TB", "2 TB"],
          defaultValue: "1 TB",
        },
      ];
    }
    if (title.includes("screen") || title.includes("monitor") || title.includes("inch")) {
      return [
        {
          name: "Ekran Boyutu",
          options: ['27" QHD (165Hz)', '32" 4K UHD', '49" Kavisli Ultra'],
          defaultValue: '27" QHD (165Hz)',
        },
      ];
    }
    return [
      {
        name: "Model / Versiyon",
        options: ["Standart Sürüm", "Pro Versiyon"],
        defaultValue: "Standart Sürüm",
      },
    ];
  }

  if (cat.includes("jewelery")) {
    return [
      {
        name: "Boyut / Ölçü",
        options: ["45 cm (Zarif)", "50 cm (Klasik)", "55 cm (Geniş)"],
        defaultValue: "50 cm (Klasik)",
      },
    ];
  }

  return [];
}

export function getProductSpecifications(product: Product): ProductSpecification[] {
  const cat = (product.category || "").toLowerCase();

  if (cat.includes("clothing")) {
    return [
      { label: "Materyal", value: "%100 Taranmış Organik Pamuk" },
      { label: "Kalıp (Fit)", value: "Modern Regular Fit" },
      { label: "Kumaş Gramajı", value: "280 gr/m² Premium Doku" },
      { label: "Yıkama Talimatı", value: "30°C Makinede Hassas Yıkama" },
      { label: "Menşei", value: "Türkiye (TrendSphere Özel Üretim)" },
      { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100" },
    ];
  }

  if (cat.includes("electronics")) {
    return [
      { label: "Garanti Süresi", value: "2 Yıl Resmi Distribütör Garantili" },
      { label: "Bağlantı & Arayüz", value: "USB-C 3.2 Gen2 / Yüksek Hızlı Veri" },
      { label: "Cihaz Ağırlığı", value: "145 gram (Taşınabilir Hafif Tasarım)" },
      { label: "Kutu İçeriği", value: "Cihaz, Yüksek Dayanımlı Kablo, Kılavuz" },
      { label: "Uyumluluk", value: "macOS, Windows, Linux, iOS & Android" },
      { label: "Enerji Tüketimi", value: "Düşük Güç Tüketimi (Eco-Smart)" },
    ];
  }

  if (cat.includes("jewelery")) {
    return [
      { label: "Maden Türü", value: "925 Ayar Hakiki Gümüş Üzeri Rodyum" },
      { label: "Net Ağırlık / Gramaj", value: "8.6 gr Hassas El İşçiliği" },
      { label: "Taş Özelliği", value: "Özel Işıltılı Zirkon Kristal" },
      { label: "Cilt Uyumu", value: "%100 Nikelsiz, Hipoalerjenik" },
      { label: "Kutu & Paketleme", value: "TrendSphere Kadife Işıklı Hediye Kutusu" },
      { label: "Bakım", value: "Kimyasallardan Uzak Tutulmalıdır" },
    ];
  }

  return [
    { label: "Garanti", value: "1 Yıl Standart Üretici Garantisi" },
    { label: "Menşei", value: "İthal / Orijinal Lisanslı Ürün" },
    { label: "Paketleme", value: "Özel Koruyucu Ambalaj" },
  ];
}

export function enrichProductWithSpecs(product: Product): Product {
  return {
    ...product,
    attributes: getProductAttributes(product),
    specifications: getProductSpecifications(product),
  };
}
