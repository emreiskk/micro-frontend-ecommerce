export interface Rating {
  rate: number;
  count: number;
}

export interface VariantOptionDetail {
  label: string;
  priceDelta?: number;
  specsOverrides?: Record<string, string>;
}

export interface ProductAttribute {
  name: string;
  options: string[];
  optionDetails?: VariantOptionDetail[];
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
  cartItemId?: string;
  product: Product;
  quantity: number;
  selectedAttributes?: SelectedAttributes;
  unitPrice?: number;
  needsAttributeConfirmation?: boolean;
}

export function getCartItemId(
  productId: number,
  selectedAttributes?: SelectedAttributes
): string {
  if (!selectedAttributes || Object.keys(selectedAttributes).length === 0) {
    return String(productId);
  }
  const serialized = Object.entries(selectedAttributes)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
  return `${productId}__${serialized}`;
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
        options: ["16 Litre (Standart)", "20 Litre (Genişletilmiş)"],
        optionDetails: [
          {
            label: "16 Litre (Standart)",
            priceDelta: 0,
            specsOverrides: {
              "Hacim / Kapasite": "16 Litre Standart İç Alan",
              "Laptop Bölmesi": "15.6 inçe Kadar Pedli Bölme",
              "Ürün Ağırlığı": "460 gram Ultra Hafif Ergonomik Tasarım",
            },
          },
          {
            label: "20 Litre (Genişletilmiş)",
            priceDelta: 25,
            specsOverrides: {
              "Hacim / Kapasite": "20 Litre Genişletilmiş Kapasite",
              "Laptop Bölmesi": "17 inçe Kadar Büyük Pedli Bölme",
              "Ürün Ağırlığı": "580 gram Takviyeli Tasarım",
            },
          },
        ],
        defaultValue: "16 Litre (Standart)",
      },
      {
        name: "Renk",
        options: ["Donanma Mavisi", "Gece Siyahı", "Haki Yeşili"],
        defaultValue: "Donanma Mavisi",
      },
    ];
  }

  // 2. Monitors & Displays (FLAT vs. CURVED CLEAR SEPARATION)
  // 2A: Acer Monitor (FLAT IPS PANEL ONLY)
  if (id === 13 || title.includes("acer") || (title.includes("monitor") && !title.includes("curved") && !title.includes("chg90"))) {
    return [
      {
        name: "Ekran Boyutu (Düz Panel)",
        options: ['21.5" FHD (75Hz Düz)', '24" FHD (100Hz Düz)', '27" QHD (165Hz Düz)'],
        optionDetails: [
          {
            label: '21.5" FHD (75Hz Düz)',
            priceDelta: 0,
            specsOverrides: {
              "Ekran Boyutu": "21.5 inç Çerçevesiz Düz Panel",
              "Çözünürlük": "1920 x 1080 Full HD (75Hz)",
              "Panel Teknolojisi": "Ultra-İnce Çerçevesiz Düz IPS Panel",
              "Giriş Portları": "1x HDMI, 1x VGA",
            },
          },
          {
            label: '24" FHD (100Hz Düz)',
            priceDelta: 60,
            specsOverrides: {
              "Ekran Boyutu": "24 inç Çerçevesiz Düz Panel",
              "Çözünürlük": "1920 x 1080 Full HD (100Hz)",
              "Panel Teknolojisi": "Ultra-İnce Çerçevesiz Düz IPS Panel",
              "Giriş Portları": "2x HDMI, 1x DisplayPort",
            },
          },
          {
            label: '27" QHD (165Hz Düz)',
            priceDelta: 140,
            specsOverrides: {
              "Ekran Boyutu": "27 inç Çerçevesiz Düz Panel",
              "Çözünürlük": "2560 x 1440 2K QHD (165Hz)",
              "Panel Teknolojisi": "Ultra-İnce Çerçevesiz Düz IPS Panel",
              "Giriş Portları": "2x HDMI 2.1, 1x DisplayPort 1.4",
            },
          },
        ],
        defaultValue: '21.5" FHD (75Hz Düz)',
      },
    ];
  }

  // 2B: Samsung Monitor (CURVED ULTRAWIDE PANEL ONLY)
  if (id === 14 || title.includes("samsung") || title.includes("curved") || title.includes("chg90")) {
    return [
      {
        name: "Ekran Boyutu (Kavisli Panel)",
        options: ['34" Kavisli UltraWide (144Hz)', '49" Kavisli Süper Ultra (144Hz)', '57" Kavisli Dual 4K (240Hz)'],
        optionDetails: [
          {
            label: '34" Kavisli UltraWide (144Hz)',
            priceDelta: -200,
            specsOverrides: {
              "Ekran Boyutu": "34 inç 21:9 UltraWide Kavisli Panel",
              "Çözünürlük": "3440 x 1440 UltraWide QHD (144Hz)",
              "Kavis Oranı": "1800R Derin Panoramik Kavis",
            },
          },
          {
            label: '49" Kavisli Süper Ultra (144Hz)',
            priceDelta: 0,
            specsOverrides: {
              "Ekran Boyutu": "49 inç 32:9 Süper UltraWide Kavisli Panel",
              "Çözünürlük": "5120 x 1440 Dual QHD (144Hz)",
              "Kavis Oranı": "1800R Derin Panoramik Kavis",
            },
          },
          {
            label: '57" Kavisli Dual 4K (240Hz)',
            priceDelta: 400,
            specsOverrides: {
              "Ekran Boyutu": "57 inç 32:9 Dünyanın İlk Dual 4K Kavisli Ekranı",
              "Çözünürlük": "7680 x 2160 Dual UHD 4K (240Hz)",
              "Kavis Oranı": "1000R Agresif Panoramik Kavis",
            },
          },
        ],
        defaultValue: '49" Kavisli Süper Ultra (144Hz)',
      },
    ];
  }

  // 3. Hard Drives & SSDs
  if (title.includes("drive") || title.includes("ssd") || title.includes("hard") || title.includes("elements")) {
    const isWdElements = title.includes("elements");
    return [
      {
        name: "Depolama Kapasitesi",
        options: ["500 GB", "1 TB", "2 TB", "4 TB"],
        optionDetails: [
          {
            label: "500 GB",
            priceDelta: isWdElements ? -20 : -30,
            specsOverrides: {
              "Okuma / Yazma Hızı": "550 MB/sn Okuma, 500 MB/sn Yazma",
            },
          },
          {
            label: "1 TB",
            priceDelta: 0,
            specsOverrides: {
              "Okuma / Yazma Hızı": "1050 MB/sn Okuma, 1000 MB/sn Yazma",
            },
          },
          {
            label: "2 TB",
            priceDelta: isWdElements ? 35 : 55,
            specsOverrides: {
              "Okuma / Yazma Hızı": "1050 MB/sn Okuma, 1000 MB/sn Yazma",
            },
          },
          {
            label: "4 TB",
            priceDelta: isWdElements ? 75 : 135,
            specsOverrides: {
              "Okuma / Yazma Hızı": "1050 MB/sn Okuma, 1000 MB/sn Yazma",
            },
          },
        ],
        defaultValue: title.includes("2tb") ? "2 TB" : title.includes("4tb") ? "4 TB" : "1 TB",
      },
    ];
  }

  // 4. Jackets, Coats, Outerwear
  if (title.includes("jacket") || title.includes("coat") || title.includes("windbreaker") || title.includes("biker")) {
    return [
      {
        name: "Beden",
        options: ["S", "M", "L", "XL", "XXL"],
        optionDetails: [
          { label: "S", priceDelta: 0 },
          { label: "M", priceDelta: 0 },
          { label: "L", priceDelta: 0 },
          { label: "XL", priceDelta: 0 },
          { label: "XXL", priceDelta: 5 },
        ],
        defaultValue: "L",
      },
      {
        name: "Renk",
        options: ["Kömür Siyahı", "Haki Asker Yeşili", "Koyu Lacivert"],
        defaultValue: "Kömür Siyahı",
      },
    ];
  }

  // 5. T-Shirts & General Clothing
  if (cat.includes("clothing")) {
    return [
      {
        name: "Beden",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        optionDetails: [
          { label: "XS", priceDelta: 0 },
          { label: "S", priceDelta: 0 },
          { label: "M", priceDelta: 0 },
          { label: "L", priceDelta: 0 },
          { label: "XL", priceDelta: 0 },
          { label: "XXL", priceDelta: 2 },
        ],
        defaultValue: "M",
      },
      {
        name: "Renk",
        options: ["Beyaz", "Siyah", "Gri Melanj", "Donanma Mavisi"],
        defaultValue: "Beyaz",
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
      {
        name: "Ayar & Seri",
        options: ["14K Beyaz Altın Kaplama", "18K Pırlantalı Özel Seri"],
        optionDetails: [
          { label: "14K Beyaz Altın Kaplama", priceDelta: 0 },
          {
            label: "18K Pırlantalı Özel Seri",
            priceDelta: 60,
            specsOverrides: {
              "Maden Türü & Ayar": "18K Hakiki Masif Altın ve 0.15ct Parlak Pırlanta",
              "Garanti & Sertifika": "Uluslararası Gemoloji Pırlanta Sertifikalı",
            },
          },
        ],
        defaultValue: "14K Beyaz Altın Kaplama",
      },
    ];
  }

  // 7. Bracelets & Chains
  if (title.includes("bracelet") || title.includes("chain")) {
    return [
      {
        name: "Bileklik Uzunluğu",
        options: ["18 cm (Zarif)", "20 cm (Standart)", "22 cm (Geniş)"],
        optionDetails: [
          { label: "18 cm (Zarif)", priceDelta: 0 },
          { label: "20 cm (Standart)", priceDelta: 0 },
          { label: "22 cm (Geniş)", priceDelta: 15 },
        ],
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

  // Acer Monitor (Flat IPS)
  if (id === 13 || title.includes("acer") || (title.includes("monitor") && !title.includes("curved") && !title.includes("chg90"))) {
    return [
      { label: "Panel Teknolojisi", value: "Ultra-İnce Çerçevesiz Düz IPS Panel" },
      { label: "Ekran Boyutu", value: "21.5 inç Çerçevesiz Düz Panel" },
      { label: "Çözünürlük", value: "1920 x 1080 Full HD (75Hz)" },
      { label: "Tepki Süresi", value: "1ms VRB Hızlı Tepki" },
      { label: "Renk Doğruluğu", value: "%99 sRGB Canlı Renk Skalası" },
      { label: "Giriş Portları", value: "1x HDMI, 1x VGA" },
      { label: "Ölü Piksel Garantisi", value: "3 Yıl Sıfır Ölü Piksel Birebir Değişim Garantisi" },
    ];
  }

  // Samsung Gaming Monitor (Curved UltraWide)
  if (id === 14 || title.includes("samsung") || title.includes("curved") || title.includes("chg90")) {
    return [
      { label: "Panel Teknolojisi", value: "1800R Kavisli Quantum Dot QLED Panel" },
      { label: "Ekran Boyutu", value: "49 inç 32:9 Süper UltraWide Kavisli Panel" },
      { label: "Çözünürlük", value: "5120 x 1440 Dual QHD (144Hz)" },
      { label: "Kavis Oranı", value: "1800R Derin Panoramik Kavis" },
      { label: "Tepki Süresi", value: "1ms (GtG) Ekstrem Hızlı" },
      { label: "Giriş Portları", value: "2x HDMI 2.1, 1x DisplayPort 1.4, USB 3.0 Hub" },
      { label: "Ölü Piksel Garantisi", value: "3 Yıl Sıfır Ölü Piksel Birebir Değişim Garantisi" },
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

export function calculateProductPrice(product: Product, selectedAttributes?: SelectedAttributes): number {
  let price = product.price;
  if (!selectedAttributes) return Number(price.toFixed(2));

  const attrs = product.attributes || getProductAttributes(product);
  attrs.forEach((attr) => {
    const selectedVal = selectedAttributes[attr.name];
    if (selectedVal && attr.optionDetails) {
      const detail = attr.optionDetails.find((d) => d.label === selectedVal);
      if (detail && typeof detail.priceDelta === "number") {
        price += detail.priceDelta;
      }
    }
  });

  return Number(Math.max(1, price).toFixed(2));
}

export function calculateDynamicSpecifications(product: Product, selectedAttributes?: SelectedAttributes): ProductSpecification[] {
  const baseSpecs = product.specifications || getProductSpecifications(product);
  if (!selectedAttributes) return baseSpecs;

  const attrs = product.attributes || getProductAttributes(product);
  const overrides: Record<string, string> = {};

  attrs.forEach((attr) => {
    const selectedVal = selectedAttributes[attr.name];
    if (selectedVal && attr.optionDetails) {
      const detail = attr.optionDetails.find((d) => d.label === selectedVal);
      if (detail && detail.specsOverrides) {
        Object.assign(overrides, detail.specsOverrides);
      }
    }
  });

  return baseSpecs.map((spec) => {
    if (overrides[spec.label]) {
      return { ...spec, value: overrides[spec.label] };
    }
    return spec;
  });
}

export const CANONICAL_PRODUCT_TITLES: Record<number, string> = {
  1: "Fjallraven - Foldsack No. 1 Sırt Çantası",
  2: "Erkek Casual Premium Slim Fit Tişört",
  3: "Erkek Pamuklu Mevsimlik Ceket",
  4: "Erkek Casual Slim Fit Uzun Kollu Gömlek",
  5: "John Hardy Legends Naga Ejderha Zincir Bileklik",
  6: "Petite Micropave Zarafet Yüzüğü",
  7: "Prenses Kesim Tektaş Solitaire Yüzük",
  8: "Pierced Owl Çift Taraflı Tünel Küpe",
  9: "WD Elements Taşınabilir Harici Disk (USB 3.0)",
  10: "SanDisk SSD PLUS Dahili SSD (SATA III)",
  11: "Silicon Power A55 3D NAND Dahili SSD",
  12: "WD Gaming Drive PS4 Uyumlu Taşınabilir Disk",
  13: "Acer SB220Q Ultra-İnce Düz IPS Monitör",
  14: "Samsung CHG90 Kavisli QLED Oyuncu Monitörü",
  15: "BIYLACLESEN Kadın 3-in-1 Snowboard Kayak Montu",
  16: "Lock and Love Kadın Kapüşonlu Deri Motorcu Ceketi",
  17: "Kadın Çizgili Rüzgarlık & Su Geçirmez Yağmurluk",
  18: "MBJ Kadın Kısa Kollu V Yaka Tişört",
  19: "Opna Kadın Spor Nefes Alabilir Tişört",
  20: "DANVOUY Kadın Pamuklu Günlük Tişört",
};

export function enrichProductWithSpecs(product: Product): Product {
  const canonicalTitle = CANONICAL_PRODUCT_TITLES[product.id] || product.title;
  return {
    ...product,
    title: canonicalTitle,
    attributes: getProductAttributes(product),
    specifications: getProductSpecifications(product),
  };
}

