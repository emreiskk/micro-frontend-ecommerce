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
  const id = product.id;

  // 1. Backpacks and Bags (e.g. Fjallraven No. 1)
  if (id === 1 || title.includes("backpack") || title.includes("foldsack") || title.includes("bag")) {
    return [
      {
        name: "Hacim / Boyut",
        options: ["16 Litre (Standart)", "20 Litre (Geniş)"],
        defaultValue: "16 Litre (Standart)",
      },
      {
        name: "Renk",
        options: ["Donanma Mavisi", "Gece Siyahı", "Haki Yeşili"],
        defaultValue: "Donanma Mavisi",
      },
    ];
  }

  // 2. Jackets, Coats, Outerwear
  if (title.includes("jacket") || title.includes("coat") || title.includes("windbreaker") || title.includes("biker")) {
    return [
      {
        name: "Beden",
        options: ["S", "M", "L", "XL", "XXL"],
        defaultValue: "L",
      },
      {
        name: "Renk",
        options: ["Kömür Siyahı", "Haki Asker Yeşili", "Koyu Lacivert"],
        defaultValue: "Kömür Siyahı",
      },
    ];
  }

  // 3. T-Shirts & Clothing
  if (cat.includes("clothing")) {
    return [
      {
        name: "Beden",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        defaultValue: "M",
      },
      {
        name: "Renk",
        options: ["Beyaz", "Siyah", "Gri Melanj", "Donanma Mavisi"],
        defaultValue: "Beyaz",
      },
    ];
  }

  // 4. Hard Drives & SSDs
  if (title.includes("drive") || title.includes("ssd") || title.includes("hard") || title.includes("elements")) {
    return [
      {
        name: "Depolama Kapasitesi",
        options: ["500 GB", "1 TB", "2 TB", "4 TB"],
        defaultValue: "1 TB",
      },
    ];
  }

  // 5. Monitors & Displays
  if (title.includes("monitor") || title.includes("screen") || title.includes("ultrawide") || title.includes("curved")) {
    return [
      {
        name: "Panel / Yenileme Hızı",
        options: ['24" FHD (144Hz)', '27" QHD (165Hz)', '49" Kavisli Ultra (144Hz)'],
        defaultValue: '27" QHD (165Hz)',
      },
    ];
  }

  // 6. Rings
  if (title.includes("ring")) {
    return [
      {
        name: "Yüzük Ölçüsü",
        options: ["12 Numara", "14 Numara", "16 Numara", "18 Numara"],
        defaultValue: "14 Numara",
      },
    ];
  }

  // 7. Bracelets & Chains
  if (title.includes("bracelet") || title.includes("chain")) {
    return [
      {
        name: "Bileklik Uzunluğu",
        options: ["18 cm (Zarif)", "20 cm (Standart)", "22 cm (Geniş)"],
        defaultValue: "20 cm (Standart)",
      },
    ];
  }

  // 8. Earrings
  if (title.includes("earring") || title.includes("tunnel") || title.includes("plug")) {
    return [
      {
        name: "Küpe Çapı",
        options: ["6 mm (Zarif)", "8 mm (Standart)", "10 mm (Belirgin)"],
        defaultValue: "8 mm (Standart)",
      },
    ];
  }

  // 9. Other Jewelery
  if (cat.includes("jewelery")) {
    return [
      {
        name: "Zincir / Boyut",
        options: ["45 cm (Kısa)", "50 cm (Standart)", "55 cm (Uzun)"],
        defaultValue: "50 cm (Standart)",
      },
    ];
  }

  return [
    {
      name: "Seçenek",
      options: ["Standart"],
      defaultValue: "Standart",
    },
  ];
}

export function getProductSpecifications(product: Product): ProductSpecification[] {
  const cat = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();
  const id = product.id;

  // Backpacks & Bags
  if (id === 1 || title.includes("backpack") || title.includes("foldsack") || title.includes("bag")) {
    return [
      { label: "Laptop Bölmesi", value: "15.6 inçe Kadar Darbe Korumalı Pedli Bölme" },
      { label: "Kumaş Materyali", value: "G-1000 HeavyDuty Eco (Dayanıklı Geri Dönüştürülmüş Kumaş)" },
      { label: "Su Dayanıklılığı", value: "Suya ve Neme Karşı Dayanıklı Wax Dış Kaplama" },
      { label: "Hacim / Kapasite", value: "16 Litre Geniş İç Alan" },
      { label: "Ürün Ağırlığı", value: "460 gram Ultra Hafif Ergonomik Tasarım" },
      { label: "Boyutlar", value: "38 cm (Y) x 27 cm (G) x 13 cm (D)" },
      { label: "Menşei & Tasarım", value: "İsveç Tasarımı (Orijinal Lisanslı)" },
      { label: "Garanti Süresi", value: "2 Yıl TrendSphere Resmi Garanti" },
    ];
  }

  // Jackets & Outerwear
  if (title.includes("jacket") || title.includes("coat") || title.includes("windbreaker") || title.includes("biker")) {
    return [
      { label: "Dış Yüzey", value: "%100 Su İtici ve Rüzgar Geçirmez Özel Dokuma" },
      { label: "İç Astar", value: "Isı Yalıtımlı Polar / Termal Dolgu Astar" },
      { label: "Kalıp (Fit)", value: "Modern Kışlık Regular Fit" },
      { label: "Cepler", value: "4 Adet Fermuarlı Güvenli Dış ve İç Cep" },
      { label: "Yıkama Talimatı", value: "30°C Hassas Yıkama / Kuru Temizleme Uyumlu" },
      { label: "Menşei", value: "Türkiye (TrendSphere Dış Giyim Koleksiyonu)" },
      { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100 Sertifikalı" },
    ];
  }

  // T-Shirts & Clothing
  if (cat.includes("clothing")) {
    return [
      { label: "Materyal", value: "%100 Organik Taranmış Penye Pamuk" },
      { label: "Kumaş Gramajı", value: "240 gr/m² Ağır Gramaj / Tok Duruş" },
      { label: "Kalıp (Fit)", value: "Modern Regular / Slim Fit Kesim" },
      { label: "Yaka & Kol", value: "Çift İğne Güçlendirilmiş Ribana Yaka" },
      { label: "Yıkama Talimatı", value: "30°C Makinede Tersten Yıkama" },
      { label: "Menşei", value: "Türkiye (Yerli Üretim)" },
      { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100 Ekolojik Güvenli" },
    ];
  }

  // Hard Drives & SSDs
  if (title.includes("drive") || title.includes("ssd") || title.includes("hard") || title.includes("elements")) {
    return [
      { label: "Okuma / Yazma Hızı", value: "1050 MB/sn Okuma, 1000 MB/sn Yazma Hızı" },
      { label: "Arayüz / Bağlantı", value: "USB-C 3.2 Gen 2 / Thunderbolt Uyumlu" },
      { label: "Darbe Dayanımı", value: "2 Metreye Kadar Düşmeye Karşı Dayanıklı Kasa" },
      { label: "Güvenlik", value: "256-Bit AES Donanımsal Veri Şifreleme" },
      { label: "Uyumluluk", value: "macOS, Windows, Linux, iOS & Android" },
      { label: "Kutu İçeriği", value: "Disk, Örgülü Type-C Kablo, Type-A Adaptör, Kılavuz" },
      { label: "Garanti Süresi", value: "3 Yıl Resmi Distribütör Birebir Değişim Garantili" },
    ];
  }

  // Monitors & Screens
  if (title.includes("monitor") || title.includes("screen") || title.includes("ultrawide") || title.includes("curved")) {
    return [
      { label: "Panel Teknolojisi", value: "IPS / Quantum Dot QLED 1ms (GtG) Tepki Süresi" },
      { label: "Yenileme Hızı", value: "144Hz - 165Hz AMD FreeSync & G-Sync Uyumlu" },
      { label: "Renk Doğruluğu", value: "%99 sRGB, HDR10 Gerçekçi Renk Desteği" },
      { label: "Giriş Portları", value: "2x HDMI 2.1, 1x DisplayPort 1.4, 1x USB-C Hub" },
      { label: "Ergonomi", value: "Yükseklik, Eğim ve Pivot Ayarlı Profesyonel Stand" },
      { label: "Ölü Piksel Garantisi", value: "3 Yıl Sıfır Ölü Piksel Birebir Değişim Garantisi" },
    ];
  }

  // Jewelery (Rings, Bracelets, Necklaces, Earrings)
  if (cat.includes("jewelery")) {
    return [
      { label: "Maden Türü & Ayar", value: "925 Ayar Hakiki Gümüş Üzeri Mikron Kaplama" },
      { label: "Taş Özelliği", value: "Özel Işıltılı Parlak Zirkon Kristali" },
      { label: "Alerjen Testi", value: "%100 Nikelsiz, Kurşunsuz ve Hipoalerjenik" },
      { label: "Net Ağırlık / Gramaj", value: "8.6 gr Hassas Kuyumcu İşçiliği" },
      { label: "Kutu & Paketleme", value: "TrendSphere Işıklı Lüks Kadife Mücevher Kutusu" },
      { label: "Garanti & Sertifika", value: "Orijinallik Sertifikası ve Bakım Bezi Dahil" },
    ];
  }

  return [
    { label: "Garanti Süresi", value: "2 Yıl Resmi Distribütör Garantili" },
    { label: "Menşei", value: "Orijinal Lisanslı Ürün" },
    { label: "Paketleme", value: "TrendSphere Özel Güvenli Kargo Kutusu" },
  ];
}

export function enrichProductWithSpecs(product: Product): Product {
  return {
    ...product,
    attributes: getProductAttributes(product),
    specifications: getProductSpecifications(product),
  };
}
