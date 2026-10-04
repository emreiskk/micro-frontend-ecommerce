export interface Rating {
  rate: number;
  count: number;
}

export interface VariantOptionDetail {
  label: string;
  priceDelta?: number;
  specsOverrides?: Record<string, string>;
  inStock?: boolean;
  stockCount?: number;
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

export interface LeanCartItem {
  cartItemId?: string;
  productId: number;
  quantity: number;
  selected?: boolean;
  selectedAttributes?: SelectedAttributes;
  unitPrice?: number;
  needsAttributeConfirmation?: boolean;
}

export interface CartItem {
  cartItemId?: string;
  product: Product;
  quantity: number;
  selected?: boolean;
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
  selectedCount: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

export type CartActionType =
  | 'SYNC'
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'UPDATE_ATTRIBUTES'
  | 'TOGGLE_ITEM_SELECTED'
  | 'TOGGLE_ALL_SELECTION'
  | 'CLEAR_CART';

export interface CartSyncMessage {
  type: CartActionType;
  items: CartItem[];
  timestamp: number;
  source: 'home' | 'cart';
}

export function getProductAttributes(product: Product): ProductAttribute[] {
  const id = product.id;
  const cat = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  // Deterministic ID-First Matching for all 20 catalog products
  switch (id) {
    // 1. Fjallraven Sırt Çantası
    case 1:
      return [
        {
          name: "Hacim / Kapasite",
          options: ["16 Litre (Standart)", "20 Litre (Genişletilmiş)"],
          optionDetails: [
            {
              label: "16 Litre (Standart)",
              priceDelta: 0,
              specsOverrides: {
                "Hacim / Kapasite": "16 Litre Standart İç Alan",
                "Laptop Bölmesi": "15.6 inçe Kadar Pedli Bölme",
                "Ürün Ağırlığı": "460 gram Ultra Hafif",
              },
            },
            {
              label: "20 Litre (Genişletilmiş)",
              priceDelta: 25,
              specsOverrides: {
                "Hacim / Kapasite": "20 Litre Genişletilmiş Kapasite",
                "Laptop Bölmesi": "17 inçe Kadar Büyük Pedli Bölme",
                "Ürün Ağırlığı": "580 gram Takviyeli",
              },
            },
          ],
          defaultValue: "16 Litre (Standart)",
        },
        {
          name: "Renk",
          options: ["Donanma Mavisi", "Gece Siyahı", "Haki Yeşili", "Hardal Sarısı"],
          defaultValue: "Donanma Mavisi",
        },
      ];

    // 2. Erkek Tişört
    case 2:
      return [
        {
          name: "Beden",
          options: ["S", "M", "L", "XL", "XXL"],
          optionDetails: [
            { label: "S", priceDelta: 0, inStock: true, stockCount: 8 },
            { label: "M", priceDelta: 0, inStock: true, stockCount: 15 },
            { label: "L", priceDelta: 0, inStock: false, stockCount: 0 },
            { label: "XL", priceDelta: 0, inStock: false, stockCount: 0 },
            { label: "XXL", priceDelta: 2, inStock: true, stockCount: 3 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Koyu Gri Raglan", "Beyaz / Lacivert", "Bordo Melanj", "Antrasit Siyah"],
          defaultValue: "Koyu Gri Raglan",
        },
      ];

    // 3. Erkek Pamuklu Mevsimlik Ceket
    case 3:
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
          options: ["Askeri Haki", "Koyu Lacivert", "Toprak Kahvesi", "Mat Siyah"],
          defaultValue: "Askeri Haki",
        },
      ];

    // 4. Erkek Gömlek
    case 4:
      return [
        {
          name: "Beden",
          options: ["S", "M", "L", "XL"],
          optionDetails: [
            { label: "S", priceDelta: 0 },
            { label: "M", priceDelta: 0 },
            { label: "L", priceDelta: 0 },
            { label: "XL", priceDelta: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Oxford Açık Mavi", "Klasik Beyaz", "Koyu Lacivert", "Açık Gri"],
          defaultValue: "Oxford Açık Mavi",
        },
      ];

    // 5. John Hardy Ejderha Zincir Bileklik
    case 5:
      return [
        {
          name: "Bileklik Uzunluğu",
          options: ["18 cm (Zarif Bilek)", "20 cm (Standart Bilek)", "22 cm (Geniş Bilek)"],
          optionDetails: [
            {
              label: "18 cm (Zarif Bilek)",
              priceDelta: 0,
              inStock: true,
              stockCount: 3,
              specsOverrides: {
                "Uzunluk / Boyut": "18 cm (Zarif Bilek Ölçüsü)",
                "Net Ağırlık / Gramaj": "42 gram Masif İşçilik",
              },
            },
            {
              label: "20 cm (Standart Bilek)",
              priceDelta: 0,
              inStock: true,
              stockCount: 7,
              specsOverrides: {
                "Uzunluk / Boyut": "20 cm (Standart Bilek Ölçüsü)",
                "Net Ağırlık / Gramaj": "46 gram Masif İşçilik",
              },
            },
            {
              label: "22 cm (Geniş Bilek)",
              priceDelta: 35,
              inStock: false,
              stockCount: 0,
              specsOverrides: {
                "Uzunluk / Boyut": "22 cm (Geniş Bilek Ölçüsü)",
                "Net Ağırlık / Gramaj": "52 gram Masif İşçilik",
              },
            },
          ],
          defaultValue: "20 cm (Standart Bilek)",
        },
        {
          name: "Maden & Taş Detayı",
          options: ["925 Masif Gümüş & Mavi Safir", "18K Altın & Gümüş Kombin & Safir"],
          optionDetails: [
            {
              label: "925 Masif Gümüş & Mavi Safir",
              priceDelta: 0,
              specsOverrides: {
                "Maden Türü & Ayar": "925 Ayar Masif Gümüş (Bali El Sanatları)",
                "Taş & Detay": "Ejderha Başında Doğal Yuvarlak Mavi Safir Gözler",
              },
            },
            {
              label: "18K Altın & Gümüş Kombin & Safir",
              priceDelta: 180,
              specsOverrides: {
                "Maden Türü & Ayar": "18K Masif Sarı Altın ve 925 Gümüş El İşçiliği Kombinasyon",
                "Taş & Detay": "Ejderha Başında El Mıhlaması Parlak Doğal Mavi Safir Gözler",
              },
            },
          ],
          defaultValue: "925 Masif Gümüş & Mavi Safir",
        },
      ];

    // 6. Petite Micropave Zarafet Yüzüğü
    case 6:
      return [
        {
          name: "Yüzük Ölçüsü",
          options: ["12 Numara", "14 Numara", "16 Numara", "18 Numara"],
          defaultValue: "14 Numara",
        },
        {
          name: "Maden & Taş Türü",
          options: ["14K Sarı Altın & Doğal Pırlanta", "18K Beyaz Altın & Ekstra Parlak Pırlanta"],
          optionDetails: [
            {
              label: "14K Sarı Altın & Doğal Pırlanta",
              priceDelta: 0,
              specsOverrides: {
                "Maden Türü & Ayar": "14K Masif Sarı Altın (585 Milyem)",
                "Pırlanta Özellikleri": "0.12 Karat F-G Renk / VS Berraklık Doğal Pırlanta",
              },
            },
            {
              label: "18K Beyaz Altın & Ekstra Parlak Pırlanta",
              priceDelta: 75,
              specsOverrides: {
                "Maden Türü & Ayar": "18K Masif Beyaz Altın (750 Milyem)",
                "Pırlanta Özellikleri": "0.18 Karat D-E Renk / VVS1 Berraklık Doğal Pırlanta",
              },
            },
          ],
          defaultValue: "14K Sarı Altın & Doğal Pırlanta",
        },
      ];

    // 7. Prenses Kesim Solitaire Yüzük
    case 7:
      return [
        {
          name: "Yüzük Ölçüsü",
          options: ["12 Numara", "14 Numara", "16 Numara", "18 Numara"],
          defaultValue: "14 Numara",
        },
        {
          name: "Kaplama & Seri",
          options: ["14K Beyaz Altın Kaplama (925 Gümüş)", "18K Rose Gold Kaplama (925 Gümüş)"],
          optionDetails: [
            {
              label: "14K Beyaz Altın Kaplama (925 Gümüş)",
              priceDelta: 0,
              specsOverrides: {
                "Maden & Kaplama": "925 Ayar Gümüş Üzeri 14K Rodyum & Beyaz Altın Kaplama",
              },
            },
            {
              label: "18K Rose Gold Kaplama (925 Gümüş)",
              priceDelta: 5,
              specsOverrides: {
                "Maden & Kaplama": "925 Ayar Gümüş Üzeri 18K Rose Gold Mikron Kaplama",
              },
            },
          ],
          defaultValue: "14K Beyaz Altın Kaplama (925 Gümüş)",
        },
      ];

    // 8. Pierced Owl Çift Taraflı Tünel Küpe
    case 8:
      return [
        {
          name: "Küpe Çapı",
          options: ["6 mm (Küçük)", "8 mm (Standart)", "10 mm (Geniş)", "12 mm (Büyük)"],
          optionDetails: [
            {
              label: "6 mm (Küçük)",
              priceDelta: -2,
              specsOverrides: {
                "Çap / Kalınlık": "6 mm Çap / 2 GA Ölçüsü",
                "Net Ağırlık / Çift": "2.2 gram Hafif Kullanım",
              },
            },
            {
              label: "8 mm (Standart)",
              priceDelta: 0,
              specsOverrides: {
                "Çap / Kalınlık": "8 mm Çap / 0 GA Ölçüsü",
                "Net Ağırlık / Çift": "3.4 gram Standart Kullanım",
              },
            },
            {
              label: "10 mm (Geniş)",
              priceDelta: 4,
              specsOverrides: {
                "Çap / Kalınlık": "10 mm Çap / 00 GA Ölçüsü",
                "Net Ağırlık / Çift": "4.8 gram Genişletilmiş Kullanım",
              },
            },
            {
              label: "12 mm (Büyük)",
              priceDelta: 8,
              specsOverrides: {
                "Çap / Kalınlık": "12 mm Çap / 1/2 inç Ölçüsü",
                "Net Ağırlık / Çift": "6.2 gram Büyük Boyut",
              },
            },
          ],
          defaultValue: "8 mm (Standart)",
        },
        {
          name: "Renk / Kaplama",
          options: ["Rose Gold", "Metalik Çelik Gümüşü", "Mat Gece Siyahı"],
          defaultValue: "Rose Gold",
        },
      ];

    // 9. WD Elements Taşınabilir Harici Disk
    case 9:
      return [
        {
          name: "Depolama Kapasitesi",
          options: ["1 TB", "2 TB", "4 TB", "5 TB"],
          optionDetails: [
            {
              label: "1 TB",
              priceDelta: -15,
              specsOverrides: {
                "Depolama Kapasitesi": "1 TB (1.000 GB Veri Alanı)",
              },
            },
            {
              label: "2 TB",
              priceDelta: 0,
              specsOverrides: {
                "Depolama Kapasitesi": "2 TB (2.000 GB Standart Veri Alanı)",
              },
            },
            {
              label: "4 TB",
              priceDelta: 45,
              specsOverrides: {
                "Depolama Kapasitesi": "4 TB (4.000 GB Geniş Arşiv Alanı)",
              },
            },
            {
              label: "5 TB",
              priceDelta: 75,
              specsOverrides: {
                "Depolama Kapasitesi": "5 TB (5.000 GB Maksimum Arşiv Alanı)",
              },
            },
          ],
          defaultValue: "2 TB",
        },
      ];

    // 10. SanDisk SSD PLUS Dahili SSD
    case 10:
      return [
        {
          name: "Depolama Kapasitesi",
          options: ["500 GB", "1 TB", "2 TB"],
          optionDetails: [
            {
              label: "500 GB",
              priceDelta: -35,
              specsOverrides: {
                "Depolama Kapasitesi": "500 GB Hızlı Katı Hal Sürücü",
                "Sıralı Okuma / Yazma": "535 MB/sn Okuma, 445 MB/sn Yazma",
              },
            },
            {
              label: "1 TB",
              priceDelta: 0,
              specsOverrides: {
                "Depolama Kapasitesi": "1 TB (1000 GB) Hızlı Katı Hal Sürücü",
                "Sıralı Okuma / Yazma": "535 MB/sn Okuma, 450 MB/sn Yazma",
              },
            },
            {
              label: "2 TB",
              priceDelta: 70,
              specsOverrides: {
                "Depolama Kapasitesi": "2 TB (2000 GB) Hızlı Katı Hal Sürücü",
                "Sıralı Okuma / Yazma": "545 MB/sn Okuma, 450 MB/sn Yazma",
              },
            },
          ],
          defaultValue: "1 TB",
        },
      ];

    // 11. Silicon Power A55 3D NAND Dahili SSD
    case 11:
      return [
        {
          name: "Depolama Kapasitesi",
          options: ["256 GB", "512 GB", "1 TB", "2 TB"],
          optionDetails: [
            {
              label: "256 GB",
              priceDelta: -40,
              specsOverrides: {
                "Depolama Kapasitesi": "256 GB Katı Hal Depolama",
              },
            },
            {
              label: "512 GB",
              priceDelta: -20,
              specsOverrides: {
                "Depolama Kapasitesi": "512 GB Katı Hal Depolama",
              },
            },
            {
              label: "1 TB",
              priceDelta: 0,
              specsOverrides: {
                "Depolama Kapasitesi": "1 TB (1000 GB) Katı Hal Depolama",
              },
            },
            {
              label: "2 TB",
              priceDelta: 75,
              specsOverrides: {
                "Depolama Kapasitesi": "2 TB (2000 GB) Katı Hal Depolama",
              },
            },
          ],
          defaultValue: "1 TB",
        },
      ];

    // 12. WD Gaming Drive PS4 Uyumlu Disk
    case 12:
      return [
        {
          name: "Depolama Kapasitesi",
          options: ["2 TB", "4 TB", "5 TB"],
          optionDetails: [
            {
              label: "2 TB",
              priceDelta: -25,
              specsOverrides: {
                "Oyun Kapasitesi": "Yaklaşık 50+ PS4/PS5 Oyunu Depolama",
              },
            },
            {
              label: "4 TB",
              priceDelta: 0,
              specsOverrides: {
                "Oyun Kapasitesi": "Yaklaşık 100+ PS4/PS5 Oyunu Depolama",
              },
            },
            {
              label: "5 TB",
              priceDelta: 40,
              specsOverrides: {
                "Oyun Kapasitesi": "Yaklaşık 125+ PS4/PS5 Oyunu Depolama",
              },
            },
          ],
          defaultValue: "4 TB",
        },
      ];

    // 13. Acer SB220Q Düz IPS Monitör
    case 13:
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

    // 14. Samsung CHG90 Kavisli QLED Monitör
    case 14:
      return [
        {
          name: "Ekran Boyutu (Kavisli Panel)",
          options: ['34" Kavisli UltraWide (144Hz)', '49" Kavisli Süper Ultra (144Hz)', '57" Kavisli Dual 4K (240Hz)'],
          optionDetails: [
            {
              label: '34" Kavisli UltraWide (144Hz)',
              priceDelta: -200,
              inStock: true,
              stockCount: 4,
              specsOverrides: {
                "Ekran Boyutu": "34 inç 21:9 UltraWide Kavisli Panel",
                "Çözünürlük": "3440 x 1440 UltraWide QHD (144Hz)",
                "Kavis Oranı": "1800R Derin Panoramik Kavis",
              },
            },
            {
              label: '49" Kavisli Süper Ultra (144Hz)',
              priceDelta: 0,
              inStock: true,
              stockCount: 6,
              specsOverrides: {
                "Ekran Boyutu": "49 inç 32:9 Süper UltraWide Kavisli Panel",
                "Çözünürlük": "5120 x 1440 Dual QHD (144Hz)",
                "Kavis Oranı": "1800R Derin Panoramik Kavis",
              },
            },
            {
              label: '57" Kavisli Dual 4K (240Hz)',
              priceDelta: 400,
              inStock: false,
              stockCount: 0,
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

    // 15. BIYLACLESEN Kadın Kayak Montu
    case 15:
      return [
        {
          name: "Beden",
          options: ["S", "M", "L", "XL"],
          optionDetails: [
            { label: "S", priceDelta: 0 },
            { label: "M", priceDelta: 0 },
            { label: "L", priceDelta: 0 },
            { label: "XL", priceDelta: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Mor / Siyah", "Gül Kurusu", "Gece Mavisi", "Zümrüt Yeşili"],
          defaultValue: "Mor / Siyah",
        },
      ];

    // 16. Lock and Love Kadın Deri Motorcu Ceketi
    case 16:
      return [
        {
          name: "Beden",
          options: ["XS", "S", "M", "L", "XL"],
          optionDetails: [
            { label: "XS", priceDelta: 0, inStock: false, stockCount: 0 },
            { label: "S", priceDelta: 0, inStock: true, stockCount: 5 },
            { label: "M", priceDelta: 0, inStock: true, stockCount: 11 },
            { label: "L", priceDelta: 0, inStock: true, stockCount: 4 },
            { label: "XL", priceDelta: 0, inStock: false, stockCount: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Siyah (Gümüş Fermuar)", "Kahve Taba", "Bordo Deri", "Koyu Zeytin"],
          defaultValue: "Siyah (Gümüş Fermuar)",
        },
      ];

    // 17. Kadın Çizgili Yağmurluk
    case 17:
      return [
        {
          name: "Beden",
          options: ["S", "M", "L", "XL"],
          optionDetails: [
            { label: "S", priceDelta: 0 },
            { label: "M", priceDelta: 0 },
            { label: "L", priceDelta: 0 },
            { label: "XL", priceDelta: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Klasik Sarı", "Lacivert Denizci", "Toz Pembe", "Haki Doğa"],
          defaultValue: "Klasik Sarı",
        },
      ];

    // 18. MBJ Kadın V Yaka Tişört
    case 18:
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
          options: ["Bordo Melanj", "Siyah", "Kırık Beyaz", "Mürdüm", "Lacivert"],
          defaultValue: "Bordo Melanj",
        },
      ];

    // 19. Opna Kadın Spor Tişört
    case 19:
      return [
        {
          name: "Beden",
          options: ["XS", "S", "M", "L", "XL"],
          optionDetails: [
            { label: "XS", priceDelta: 0 },
            { label: "S", priceDelta: 0 },
            { label: "M", priceDelta: 0 },
            { label: "L", priceDelta: 0 },
            { label: "XL", priceDelta: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Elektrik Pembesi", "Turkuaz Canlı", "Siyah", "Koyu Mor", "Gümüş Gri"],
          defaultValue: "Elektrik Pembesi",
        },
      ];

    // 20. DANVOUY Kadın Günlük Tişört
    case 20:
      return [
        {
          name: "Beden",
          options: ["S", "M", "L", "XL"],
          optionDetails: [
            { label: "S", priceDelta: 0 },
            { label: "M", priceDelta: 0 },
            { label: "L", priceDelta: 0 },
            { label: "XL", priceDelta: 0 },
          ],
          defaultValue: "M",
        },
        {
          name: "Renk",
          options: ["Zeytin Yeşili (Outdoor)", "Bebek Sarısı", "Pudra Pembesi", "Antrasit Gri"],
          defaultValue: "Zeytin Yeşili (Outdoor)",
        },
      ];

    default:
      break;
  }

  // Robust Category-Based Fallbacks for dynamic products
  if (cat.includes("jewelery")) {
    if (title.includes("ring")) {
      return [
        {
          name: "Yüzük Ölçüsü",
          options: ["12 Numara", "14 Numara", "16 Numara", "18 Numara"],
          defaultValue: "14 Numara",
        },
        {
          name: "Maden Türü",
          options: ["14K Sarı Altın", "18K Beyaz Altın"],
          optionDetails: [
            { label: "14K Sarı Altın", priceDelta: 0 },
            { label: "18K Beyaz Altın", priceDelta: 50 },
          ],
          defaultValue: "14K Sarı Altın",
        },
      ];
    }
    if (title.includes("bracelet") || title.includes("chain")) {
      return [
        {
          name: "Bileklik Uzunluğu",
          options: ["18 cm (Zarif)", "20 cm (Standart)", "22 cm (Geniş)"],
          optionDetails: [
            { label: "18 cm (Zarif)", priceDelta: 0 },
            { label: "20 cm (Standart)", priceDelta: 0 },
            { label: "22 cm (Geniş)", priceDelta: 20 },
          ],
          defaultValue: "20 cm (Standart)",
        },
      ];
    }
    if (title.includes("earring") || title.includes("tunnel") || title.includes("plug")) {
      return [
        {
          name: "Küpe Çapı",
          options: ["6 mm", "8 mm", "10 mm"],
          defaultValue: "8 mm",
        },
      ];
    }
    return [
      {
        name: "Zincir / Boyut",
        options: ["45 cm (Kısa)", "50 cm (Standart)", "55 cm (Uzun)"],
        defaultValue: "50 cm (Standart)",
      },
    ];
  }

  if (cat.includes("electronics")) {
    if (title.includes("curved") || title.includes("chg90") || title.includes("samsung")) {
      return [
        {
          name: "Ekran Boyutu (Kavisli Panel)",
          options: ['34" Kavisli UltraWide (144Hz)', '49" Kavisli Süper Ultra (144Hz)'],
          defaultValue: '49" Kavisli Süper Ultra (144Hz)',
        },
      ];
    }
    if (title.includes("monitor") || title.includes("screen") || title.includes("display")) {
      return [
        {
          name: "Ekran Boyutu (Düz Panel)",
          options: ['21.5" FHD (75Hz Düz)', '24" FHD (100Hz Düz)', '27" QHD (165Hz Düz)'],
          defaultValue: '21.5" FHD (75Hz Düz)',
        },
      ];
    }
    // Hard drives & SSDs
    return [
      {
        name: "Depolama Kapasitesi",
        options: ["500 GB", "1 TB", "2 TB", "4 TB"],
        optionDetails: [
          { label: "500 GB", priceDelta: -25 },
          { label: "1 TB", priceDelta: 0 },
          { label: "2 TB", priceDelta: 45 },
          { label: "4 TB", priceDelta: 95 },
        ],
        defaultValue: "1 TB",
      },
    ];
  }

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
        options: ["Siyah", "Beyaz", "Gri Melanj", "Donanma Mavisi"],
        defaultValue: "Siyah",
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
  const id = product.id;
  const cat = (product.category || "").toLowerCase();
  const title = (product.title || "").toLowerCase();

  // Deterministic ID-First Specifications for all 20 catalog products
  switch (id) {
    // 1. Fjallraven Sırt Çantası
    case 1:
      return [
        { label: "Hacim / Kapasite", value: "16 Litre Standart İç Alan" },
        { label: "Laptop Bölmesi", value: "15.6 inçe Kadar Pedli Bölme" },
        { label: "Kumaş Materyali", value: "G-1000 HeavyDuty Eco (%65 Geri Dönüştürülmüş Polyester, %35 Organik Pamuk)" },
        { label: "Su Dayanıklılığı", value: "Grönland Vaksı ile Suya & Rüzgara Dayanıklı Kaplama" },
        { label: "Ürün Ağırlığı", value: "460 gram Ultra Hafif" },
        { label: "Boyutlar", value: "38 cm (Y) x 27 cm (G) x 13 cm (D)" },
        { label: "Cepler", value: "Fermuarlı Ön Güvenlik Cebi, Yan Matara Bölmeleri, İç Evrak Cebi" },
        { label: "Garanti Süresi", value: "2 Yıl TrendSphere Resmi Distribütör Garantisi" },
      ];

    // 2. Erkek Tişört
    case 2:
      return [
        { label: "Kumaş Materyali", value: "%100 Organik Taranmış Ringel Pamuk (220 gr/m²)" },
        { label: "Yaka & Kol Modeli", value: "3 Düğmeli Henley Patlı Ribana Yaka & Kontrast Raglan Kol" },
        { label: "Kalıp (Fit)", value: "Modern Slim Fit (Vücuda Oturan Kesim)" },
        { label: "Nefes Alabilirlik", value: "Terletmeyen Doğal Pamuklu Doku" },
        { label: "Yıkama & Bakım", value: "30°C Makinede Tersten Yıkama, Çekmezlik Sanforlu" },
        { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100 Ekolojik Tekstil Sertifikalı" },
        { label: "Menşei", value: "Türkiye (Yerli Üretim)" },
      ];

    // 3. Erkek Pamuklu Mevsimlik Ceket
    case 3:
      return [
        { label: "Dış Kumaş", value: "%100 Ağır Hizmet Tipi Ağartılmış Pamuklu Kanvas Kumaş" },
        { label: "İç Astar", value: "Nefes Alabilir Ekose Pamuk Astar" },
        { label: "Kapama", value: "Tam Boy Ağır Hizmet Pirinç Fermuar ve Çıtçıtlı Rüzgar Patı" },
        { label: "Cepler", value: "2 Göğüs Fleto Cebi, 2 Geniş Yan Cep, 1 İç Güvenlik Cebi" },
        { label: "Kalıp (Fit)", value: "Rahat Hareket Sağlayan Mevsimlik Regular Fit" },
        { label: "Mevsim", value: "İlkbahar / Sonbahar / Ilık Kış" },
        { label: "Yıkama & Bakım", value: "Kuru Temizleme veya 30°C Hassas Program" },
      ];

    // 4. Erkek Gömlek
    case 4:
      return [
        { label: "Kumaş Dokusu", value: "%100 Saf Pamuk Premium Oxford Dokuma (Kolay Ütülenebilir)" },
        { label: "Kalıp (Fit)", value: "Şık ve Modern Slim Fit Kesim" },
        { label: "Yaka Tipi", value: "Düğmeli Gizli Yaka (Button-Down Collar)" },
        { label: "Manşet Detayı", value: "Çift Düğmeli Ayarlanabilir İtalyan Manşet" },
        { label: "Dikiş Kalitesi", value: "Çift İğne Takviyeli Dayanıklı Yan Dikişler" },
        { label: "Menşei", value: "Türkiye (TrendSphere Özel Terzilik Koleksiyonu)" },
      ];

    // 5. John Hardy Ejderha Zincir Bileklik
    case 5:
      return [
        { label: "Koleksiyon", value: "John Hardy Legends Naga Özel Bali Zanaatkar Koleksiyonu" },
        { label: "Maden Türü & Ayar", value: "925 Ayar Masif Gümüş (Bali El Sanatları)" },
        { label: "Taş & Detay", value: "Ejderha Başında Doğal Yuvarlak Mavi Safir Gözler" },
        { label: "Uzunluk / Boyut", value: "20 cm (Standart Bilek Ölçüsü)" },
        { label: "Net Ağırlık / Gramaj", value: "46 gram Masif İşçilik" },
        { label: "Kilit Mekanizması", value: "Ejderha Ağzından Açılan Entegre Emniyetli Gizli Yaylı Kilit" },
        { label: "Sembolik Anlam", value: "Naga Su Ejderhası; Aşkı, Korumayı ve Refahı Temsil Eder" },
        { label: "Kutu & Sertifika", value: "TrendSphere Ahşap Mücevher Kutusu & Orijinallik Sertifikası Dahil" },
        { label: "Garanti Süresi", value: "Ömür Boyu Uluslararası İşçilik Garantisi" },
      ];

    // 6. Petite Micropave Zarafet Yüzüğü
    case 6:
      return [
        { label: "Model Tipi", value: "Mikro Pavé Taş Dizimli Zarif Tamtur & Tektaş Yanı Yüzük" },
        { label: "Maden Türü & Ayar", value: "14K Masif Sarı Altın (585 Milyem)" },
        { label: "Pırlanta Özellikleri", value: "0.12 Karat F-G Renk / VS Berraklık Doğal Pırlanta" },
        { label: "Montür / Dizim", value: "Düşmeye Karşı Korumalı 4 Tırnaklı Mikro Pavé Zanaat Montürü" },
        { label: "Net Ağırlık / Gramaj", value: "2.1 gram Zarif Duruş" },
        { label: "Kutu & Sertifika", value: "TrendSphere Lüks Işıklı Kadife Kutu & Gemoloji Sertifikası" },
        { label: "Bakım Garantisi", value: "Ömür Boyu Ücretsiz Taş Kontrolü ve Parlatma Bakımı" },
      ];

    // 7. Prenses Kesim Solitaire Yüzük
    case 7:
      return [
        { label: "Merkez Taş", value: "1.5 Karat Eşdeğer 8mm Prenses Kare Kesim Işıltılı Kübik Zirkon" },
        { label: "Yan Taşlar", value: "Çift Sıra Omuz Mikro Pave Zirkon Kristal Dizimi" },
        { label: "Maden & Kaplama", value: "925 Ayar Gümüş Üzeri 14K Rodyum & Beyaz Altın Kaplama" },
        { label: "Kararma Direnci", value: "Kararmaya Karşı Özel Şeffaf E-Coating Koruyucu Kaplama" },
        { label: "Alerjen Testi", value: "%100 Nikelsiz, Kurşunsuz ve Hipoalerjenik Cilt Dostu" },
        { label: "Kutu & Paketleme", value: "TrendSphere Özel Işıklı Tektaş Yüzük Kutusu" },
      ];

    // 8. Pierced Owl Çift Taraflı Tünel Küpe
    case 8:
      return [
        { label: "Materyal", value: "316L Medikal Sınıf Cerrahi Paslanmaz Çelik" },
        { label: "Çap / Kalınlık", value: "8 mm Çap / 0 GA Ölçüsü" },
        { label: "Net Ağırlık / Çift", value: "3.4 gram Standart Kullanım" },
        { label: "Kaplama", value: "Aşınmaya Dayanıklı Vakum PVD Titanyum İyon Kaplama" },
        { label: "Tasarım", value: "Çift Taraflı Genişleyen Flared Vidalı Tünel Plug" },
        { label: "Biyouyumluluk", value: "İmplant Sınıfı Hipoalerjenik, Paslanmaz ve Kararmaz" },
        { label: "Paket İçeriği", value: "1 Takım = 2 Adet Çift Taraflı Vidalı Küpe" },
        { label: "Hijyen Durumu", value: "UV Sterilize Edilmiş Vakumlu Hijyenik Ambalaj" },
      ];

    // 9. WD Elements Taşınabilir Harici Disk
    case 9:
      return [
        { label: "Depolama Kapasitesi", value: "2 TB (2.000 GB Standart Veri Alanı)" },
        { label: "Bağlantı Arayüzü", value: "Yüksek Hızlı USB 3.0 (USB 2.0 ile Geriye Dönük Tam Uyumlu)" },
        { label: "Veri Aktarım Hızı", value: "130 MB/sn'ye Varan Kararlı Veri Transfer Hızı" },
        { label: "Disk Formatı", value: "Windows NTFS Hazır Formatlı (macOS için Kolay Reformat)" },
        { label: "Güç Gereksinimi", value: "Harici Adaptörsüz, Doğrudan USB Portundan Güç Alan Kasa" },
        { label: "Kasa Yapısı", value: "Darbeye Dayanıklı Kompakt Hafif Polikarbonat Gövde (134 gr)" },
        { label: "Boyutlar", value: "111 mm x 82 mm x 15 mm Cep Boyu" },
        { label: "Garanti Süresi", value: "2 Yıl Western Digital Resmi Distribütör Garantisi" },
      ];

    // 10. SanDisk SSD PLUS Dahili SSD
    case 10:
      return [
        { label: "Depolama Kapasitesi", value: "1 TB (1000 GB) Hızlı Katı Hal Sürücü" },
        { label: "Sıralı Okuma / Yazma", value: "535 MB/sn Okuma, 450 MB/sn Yazma" },
        { label: "Form Faktörü", value: "2.5 inç / 7 mm Ultra-İnce Standart Laptop & Masaüstü Kasası" },
        { label: "Arayüz", value: "SATA III 6 Gb/sn (SATA II ve I ile Geriye Dönük Uyumlu)" },
        { label: "Darbe Dayanımı", value: "1500G'ye Kadar Şok ve Titreşime Karşı Dayanıklı Kasa" },
        { label: "Isınma & Güç", value: "Düşük Güç Tüketimi ile Sessiz Çalışma & Uzayan Pil Ömrü" },
        { label: "Garanti Süresi", value: "3 Yıl SanDisk Resmi Birebir Değişim Garantisi" },
      ];

    // 11. Silicon Power A55 3D NAND Dahili SSD
    case 11:
      return [
        { label: "Depolama Kapasitesi", value: "1 TB (1000 GB) Katı Hal Depolama" },
        { label: "Flash Bellek Tipi", value: "Gelişmiş 3D NAND Flash Teknolojisi" },
        { label: "Sıralı Okuma / Yazma", value: "500 MB/sn Okuma, 450 MB/sn Yazma Hızı" },
        { label: "Önbellek Desteği", value: "SLC Cache Teknolojisi ile Hız Aşırtma Desteği" },
        { label: "Arayüz & Form", value: "2.5 inç SATA III 6 Gb/sn (7 mm Kalınlık)" },
        { label: "Güvenlik", value: "ECC Otomatik Hata Düzeltme & S.M.A.R.T. Sağlık Takibi" },
        { label: "Garanti Süresi", value: "3 Yıl Silicon Power Resmi Garantisi" },
      ];

    // 12. WD Gaming Drive PS4 Uyumlu Disk
    case 12:
      return [
        { label: "Konsol Uyumluluğu", value: "Sony PlayStation 4, PS4 Pro, PlayStation 5 (PS4 oyunları) & PC" },
        { label: "Oyun Kapasitesi", value: "Yaklaşık 100+ PS4/PS5 Oyunu Depolama" },
        { label: "Bağlantı Tipi", value: "Yüksek Hızlı Mavi LED Göstergeli USB 3.0" },
        { label: "Kurulum Kolaylığı", value: "Doğrudan Konsola Bağla ve Oyna (3 Dakikada Formatlama)" },
        { label: "Tasarım", value: "Konsol ile Uyumlu Şık Mat Siyah ve Mavi Vurgulu Kasa" },
        { label: "Garanti Süresi", value: "3 Yıl Western Digital Sınırlı Garantisi" },
      ];

    // 13. Acer SB220Q Düz IPS Monitör
    case 13:
      return [
        { label: "Panel Teknolojisi", value: "Ultra-İnce Çerçevesiz Düz IPS Panel" },
        { label: "Ekran Boyutu", value: "21.5 inç Çerçevesiz Düz Panel" },
        { label: "Çözünürlük", value: "1920 x 1080 Full HD (75Hz)" },
        { label: "Tepki Süresi", value: "1ms VRB Hızlı Tepki Süresi" },
        { label: "Senkronizasyon", value: "AMD Radeon FreeSync Ekran Yırtılmasını Önleyen Teknoloji" },
        { label: "Giriş Portları", value: "1x HDMI, 1x VGA" },
        { label: "Tasarım Kalınlığı", value: "Yalnızca 6.6 mm Ultra İnce Kenar Tasarımı" },
        { label: "Ölü Piksel Garantisi", value: "3 Yıl Sıfır Ölü Piksel Birebir Değişim Garantisi" },
      ];

    // 14. Samsung CHG90 Kavisli QLED Monitör
    case 14:
      return [
        { label: "Panel Teknolojisi", value: "1800R Kavisli Quantum Dot QLED Panel (HDR600 Desteği)" },
        { label: "Ekran Boyutu", value: "49 inç 32:9 Süper UltraWide Kavisli Panel" },
        { label: "Çözünürlük", value: "5120 x 1440 Dual QHD (144Hz)" },
        { label: "Kavis Oranı", value: "1800R Derin Panoramik Kavis" },
        { label: "Tepki Süresi", value: "1ms (GtG) Ekstrem Hızlı Tepki" },
        { label: "Giriş Portları", value: "2x HDMI 2.1, 1x DisplayPort 1.4, USB 3.0 Çoklu Port Hub" },
        { label: "Ergonomi", value: "Yüksekliği Ayarlanabilir, Sağa/Sola Eğimli Ağır Hizmet Standı" },
        { label: "Ölü Piksel Garantisi", value: "3 Yıl Sıfır Ölü Piksel Birebir Değişim Garantisi" },
      ];

    // 15. BIYLACLESEN Kadın Kayak Montu
    case 15:
      return [
        { label: "Su Geçirmezlik", value: "10.000 mm/H2O Profesyonel Su ve Kar Geçirmez Membran" },
        { label: "3-in-1 Modüler Yapı", value: "Çıkarılabilir Fermuarlı İç Polar Astar + Rüzgar Geçirmez Dış Kabuk" },
        { label: "Rüzgar Koruması", value: "Ayarlanabilir Cırt Cırtlı Manşetler ve İpli Çıkarılabilir Fırtına Kapüşonu" },
        { label: "Cepler", value: "Su Geçirmez Fermuarlı 2 Göğüs Cebi, 2 Yan Isıtmalı Cep, Kayak Kartı Cebi" },
        { label: "Astar & Isı Yalıtımı", value: "Ağır Hizmet Tipi Termal Polar İç Yalıtım" },
        { label: "Kullanım Alanları", value: "Snowboard, Kayak, Kış Dağcılığı, Soğuk Hava Doğa Yürüyüşü" },
        { label: "Garanti", value: "2 Yıl TrendSphere Dış Giyim Garantisi" },
      ];

    // 16. Lock and Love Kadın Deri Motorcu Ceketi
    case 16:
      return [
        { label: "Dış Yüzey", value: "%100 Yüksek Kalite Yumuşak Dokulu Vegan Poliüretan (PU) Deri" },
        { label: "Kapüşon Tasarımı", value: "Fermuarlı Çıkarılabilir Gri Melanj Sweatshirt Kapüşon & Ön Pat" },
        { label: "Kalıp (Fit)", value: "Kadın Vücut Hatlarına Oturan Modern Biker / Moto Kesim" },
        { label: "Cepler", value: "2 Fermuarlı Yan Cep ve Detay Amaçlı Göğüs Fermuarları" },
        { label: "Astar", value: "%100 İpeksi Polyester Astar" },
        { label: "Bakım & Temizlik", value: "Nemli Bezle Kolay Silinebilir, Kuru Temizleme Tavsiye Edilir" },
      ];

    // 17. Kadın Çizgili Yağmurluk
    case 17:
      return [
        { label: "Dış Kumaş", value: "Su İtici ve Hafif Rüzgarlık Teknolojili Özel Dokuma Kumaş" },
        { label: "İç Astar", value: "Gövde ve Kapüşon İçinde Şık Çizgili Marin Pamuk Astar" },
        { label: "Bel Tasarımı", value: "Ayarlanabilir Büzgülü İp ile Vücuda Göre Şekillendirilebilir Bel Detayı" },
        { label: "Kapama & Güvenlik", value: "Çift Yönlü Tam Fermuar ve Üzerine Kapanan Rüzgar Düğmeleri" },
        { label: "Taşınabilirlik", value: "Çantada Kolay Taşınabilen Ultra Hafif Katlanabilir Yapı" },
        { label: "Yıkama & Bakım", value: "30°C Hassas Yıkama veya Elde Ilık Suyla Temizleme" },
      ];

    // 18. MBJ Kadın V Yaka Tişört
    case 18:
      return [
        { label: "Kumaş Karışımı", value: "%95 Doğal Viskon (Rayon), %5 Esnek Likra (Spandex)" },
        { label: "Kumaş Dokusu", value: "İpeksi Yumuşaklıkta, Dökümlü ve Nefes Alan Lüks Viskon Kumaş" },
        { label: "Yaka Stili", value: "Derin Olmayan Zarif ve Şık V Yaka Kesim" },
        { label: "Esneklik", value: "4 Yöne Esneyen Gün Boyu Konforlu Formunu Koruyan Kumaş" },
        { label: "Kalıp (Fit)", value: "Vücudu Sıkmayan Dökümlü Regular Fit" },
        { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100 Ekolojik Tekstil Sertifikalı" },
      ];

    // 19. Opna Kadın Spor Tişört
    case 19:
      return [
        { label: "Kumaş Teknolojisi", value: "%100 Nem Emici Cationic Interlock Polyester (Dry-Fit)" },
        { label: "Ter Tutmazlık", value: "Hızlı Kuruyan ve Nemi Dışarı Atan Mikro Gözenekli Yapı" },
        { label: "Dikiş Tipi", value: "Sürtünmeyi ve Tahrişi Önleyen 4 İğneli Düz Reçme Dikişler" },
        { label: "Koku Önleme", value: "Bakteri ve Koku Oluşumunu Engelleyen Antimikrobiyal Dokuma" },
        { label: "Kullanım Alanı", value: "Fitness, Koşu, Yoga, Pilates ve Günlük Aktif Spor Giyim" },
        { label: "Bakım Kolaylığı", value: "Makinede Hızlı Yıkama & Çabuk Kuruma (Ütü Gerektirmez)" },
      ];

    // 20. DANVOUY Kadın Günlük Tişört
    case 20:
      return [
        { label: "Kumaş Materyali", value: "%95 Organik Penye Pamuk, %5 Elastan" },
        { label: "Yaka & Kol", value: "Klasik Bisiklet Yaka (Crew Neck) ve Duble Katlamalı Kısa Kol" },
        { label: "Ön Baskı", value: "Çatlama ve Solma Yapmayan Su Bazlı Ekolojik Doğa Temalı Tipografik Baskı" },
        { label: "Kalıp (Fit)", value: "Rahat ve Dökümlü Günlük Casual Kesim" },
        { label: "Yıkama Dayanımı", value: "50+ Yıkamada Rengini ve Formunu Koruyan Sanforize Edilmiş Kumaş" },
        { label: "Menşei", value: "Türkiye (TrendSphere Günlük Koleksiyonu)" },
      ];

    default:
      break;
  }

  // Robust Category-Based Fallbacks for dynamic products
  if (cat.includes("jewelery")) {
    return [
      { label: "Maden Türü & Ayar", value: "925 Ayar Hakiki Masif Gümüş Üzeri Kaplama" },
      { label: "Taş Özelliği", value: "Özel Işıltılı Parlak Zirkon Kristali" },
      { label: "Alerjen Testi", value: "%100 Nikelsiz, Kurşunsuz ve Hipoalerjenik" },
      { label: "Kutu & Paketleme", value: "TrendSphere Işıklı Lüks Kadife Mücevher Kutusu" },
      { label: "Garanti & Sertifika", value: "Orijinallik Sertifikası ve Bakım Bezi Dahil" },
    ];
  }

  if (cat.includes("electronics")) {
    return [
      { label: "Bağlantı & Arayüz", value: "Yüksek Hızlı Standart Bağlantı Arabirimi" },
      { label: "Uyumluluk", value: "Tüm Modern Sistemler ile Tak-Çalıştır Uyumlu" },
      { label: "Güvenlik & Sertifika", value: "CE, RoHS, FCC Uluslararası Standartlarına Sahip" },
      { label: "Garanti Süresi", value: "2 Yıl Resmi Distribütör Garantili" },
    ];
  }

  if (cat.includes("clothing")) {
    return [
      { label: "Materyal", value: "%100 Doğal ve Nefes Alabilir Kumaş" },
      { label: "Kalıp (Fit)", value: "Modern ve Rahat Kesim" },
      { label: "Yıkama Talimatı", value: "30°C Makinede Tersten Yıkama" },
      { label: "Sertifikasyon", value: "OEKO-TEX® Standard 100 Ekolojik Güvenli" },
      { label: "Menşei", value: "Türkiye (Yerli Üretim)" },
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

  const updatedSpecs = baseSpecs.map((spec) => {
    if (overrides[spec.label]) {
      return { ...spec, value: overrides[spec.label] };
    }
    return spec;
  });

  // Ensure any override that wasn't already in baseSpecs is seamlessly appended
  const existingLabels = new Set(baseSpecs.map((s) => s.label));
  Object.entries(overrides).forEach(([label, value]) => {
    if (!existingLabels.has(label)) {
      updatedSpecs.push({ label, value });
    }
  });

  return updatedSpecs;
}

export const CATEGORY_DISPLAY_MAP: Record<string, string> = {
  "all": "Tüm Ürünler",
  "men's clothing": "Erkek Giyim",
  "women's clothing": "Kadın Giyim",
  "jewelery": "Mücevher & Takı",
  "electronics": "Elektronik",
};

export function getCategoryDisplayName(category?: string): string {
  if (!category) return "Genel";
  const normalized = category.toLowerCase().trim();
  return CATEGORY_DISPLAY_MAP[normalized] || category;
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

export const CANONICAL_PRODUCT_DESCRIPTIONS: Record<number, string> = {
  1: "Günlük şehir kullanımı ve doğa yürüyüşleri için mükemmel bir sırt çantası. Dayanıklı G-1000 kumaşı ve 15 inç destekli laptop bölmesi ile fonksiyonel taşıma sağlar.",
  2: "Modern slim fit kalıp, kontrast raglan uzun kollar ve 3 düğmeli henley pat detayı. Nefes alabilir, terletmeyen yumuşak pamuklu kumaşı ile gün boyu konfor sunar.",
  3: "İlkbahar, sonbahar ve ılık kış günleri için ideal pamuklu kanvas ceket. Doğa yürüyüşü, kamp ve günlük şehir stili için fonksiyonel cepler ve rüzgar koruması.",
  4: "Rahat kesim, dayanıklı dokuma ve nefes alabilir pamuk kumaş. Hem iş hayatında hem de günlük kullanımda şıklığı ve hareket özgürlüğünü bir arada sunar.",
  5: "Bali'nin efsanevi su ejderhasından ilham alan el yapımı tasarım. 925 ayar masif gümüş, mavi safir taşlı gözler ve güvenli entegre kilit mekanizması.",
  6: "İnce ve zarif mikro pavé taş dizimi. 14K altın kaplama ve parlak taş detayları ile tek başına veya tektaş yüzüklerle kombinlemek için ideal zarafet.",
  7: "Özel anlar, söz ve nişan için tasarlanmış prenses kesim klasik tektaş yüzük. 925 ayar gümüş üzerine parlak platin kaplama işçiliği.",
  8: "316L cerrahi çelik üzeri rose gold kaplama çift taraflı tünel küpe. Alerji yapmayan medikal yapısı ve pürüzsüz polisajlı yüzeyiyle konforlu kullanım.",
  9: "USB 3.0 ve USB 2.0 uyumlu hızlı veri aktarımı. Belgeleriniz, fotoğraflarınız ve medya arşiviniz için yüksek kapasiteli, tak-çalıştır taşınabilir depolama çözümü.",
  10: "Bilgisayarınız için hızlı açılış, seri kapanış ve yüksek tepki süresi sağlayan güvenilir dahili katı hal sürücüsü. 535 MB/s sıralı okuma hızı.",
  11: "Gelişmiş 3D NAND flaş teknolojisiyle donatılmış ultra hızlı katı hal sürücü. Sistem performansını katlar, veri güvenliği ve enerji tasarrufu sağlar.",
  12: "PlayStation 4 ve PS5 oyun arşivinizi genişletin. 100'den fazla oyunu yanınızda taşıyabileceğiniz kompakt, şık ve lisanslı taşınabilir oyun diski.",
  13: "Çerçevesiz ultra ince IPS panel, Full HD çözünürlük ve 75Hz yenileme hızı. Geniş görüş açısı ve canlı renk doğruluğu ile ofis ve günlük kullanım için ideal.",
  14: "32:9 oranında devasa 49 inç kavisli ultra panoramik ekran. Quantum Dot teknolojisi, 144Hz yenileme hızı ve HDR desteği ile benzersiz simülasyon ve oyun deneyimi.",
  15: "Su ve rüzgar geçirmez dış kabuk, çıkarılabilir polar iç astar. Zorlu kış şartlarında, kayak pistlerinde ve outdoor maceralarında maksimum sıcaklık ve koruma.",
  16: "Çıkarılabilir kapüşonlu, yumuşak dokulu suni deri motorcu ceketi. Cepli tasarımı ve vücuda oturan modern kesimi ile dört mevsim şık sokak stili.",
  17: "Hafif ve suya dayanıklı nefes alabilir kumaş. İpli ayarlanabilir bel detayı, çizgili iç astar ve fermuarlı cepleriyle yağmurlu günlerde mükemmel koruma.",
  18: "Yüksek esneklik ve yumuşaklık sunan dökümlü kumaş. Ribana yaka detayı ve rahat kesimi ile her kombine uyum sağlayan zamansız bir temel parça.",
  19: "Nem tutmayan ve hızlı kuruyan interlok kumaş teknolojisi. Fitness, koşu ve yoga antrenmanlarında hafif ve ferah hareket özgürlüğü sağlar.",
  20: "Nefes alabilen pamuklu dokuma, rahat V yaka ve esnek kalıp. Günlük kullanımda kot pantolon veya eteklerle kolayca kombinlenebilir.",
};

export function enrichProductWithSpecs(product: Product): Product {
  const canonicalTitle = CANONICAL_PRODUCT_TITLES[product.id] || product.title;
  const canonicalDescription = CANONICAL_PRODUCT_DESCRIPTIONS[product.id] || product.description;
  return {
    ...product,
    title: canonicalTitle,
    description: canonicalDescription,
    attributes: getProductAttributes(product),
    specifications: getProductSpecifications(product),
  };
}

export const PRODUCT_IMAGE_MAP: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&h=800&q=80",
  2: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=800&q=80",
  3: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&h=800&q=80",
  4: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&h=800&q=80",
  5: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&h=800&q=80",
  6: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&h=800&q=80",
  7: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&h=800&q=80",
  8: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&h=800&q=80",
  9: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&h=800&q=80",
  10: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&h=800&q=80",
  11: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&h=800&q=80",
  12: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&h=800&q=80",
  13: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&h=800&q=80",
  14: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&h=800&q=80",
  15: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&h=800&q=80",
  16: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&h=800&q=80",
  17: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&h=800&q=80",
  18: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&h=800&q=80",
  19: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?auto=format&fit=crop&w=800&h=800&q=80",
  20: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&h=800&q=80",
};

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: CANONICAL_PRODUCT_TITLES[1],
    price: 109.95,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[1],
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[1],
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: CANONICAL_PRODUCT_TITLES[2],
    price: 22.3,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[2],
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[2],
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: CANONICAL_PRODUCT_TITLES[3],
    price: 55.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[3],
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[3],
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: CANONICAL_PRODUCT_TITLES[4],
    price: 15.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[4],
    category: "men's clothing",
    image: PRODUCT_IMAGE_MAP[4],
    rating: { rate: 2.1, count: 430 },
  },
  {
    id: 5,
    title: CANONICAL_PRODUCT_TITLES[5],
    price: 695,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[5],
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[5],
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: CANONICAL_PRODUCT_TITLES[6],
    price: 168,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[6],
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[6],
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 7,
    title: CANONICAL_PRODUCT_TITLES[7],
    price: 9.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[7],
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[7],
    rating: { rate: 3, count: 400 },
  },
  {
    id: 8,
    title: CANONICAL_PRODUCT_TITLES[8],
    price: 10.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[8],
    category: "jewelery",
    image: PRODUCT_IMAGE_MAP[8],
    rating: { rate: 1.9, count: 100 },
  },
  {
    id: 9,
    title: CANONICAL_PRODUCT_TITLES[9],
    price: 64,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[9],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[9],
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 10,
    title: CANONICAL_PRODUCT_TITLES[10],
    price: 109,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[10],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[10],
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 11,
    title: CANONICAL_PRODUCT_TITLES[11],
    price: 109,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[11],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[11],
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 12,
    title: CANONICAL_PRODUCT_TITLES[12],
    price: 114,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[12],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[12],
    rating: { rate: 4.8, count: 400 },
  },
  {
    id: 13,
    title: CANONICAL_PRODUCT_TITLES[13],
    price: 599,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[13],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[13],
    rating: { rate: 2.9, count: 250 },
  },
  {
    id: 14,
    title: CANONICAL_PRODUCT_TITLES[14],
    price: 999.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[14],
    category: "electronics",
    image: PRODUCT_IMAGE_MAP[14],
    rating: { rate: 2.2, count: 140 },
  },
  {
    id: 15,
    title: CANONICAL_PRODUCT_TITLES[15],
    price: 56.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[15],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[15],
    rating: { rate: 2.6, count: 235 },
  },
  {
    id: 16,
    title: CANONICAL_PRODUCT_TITLES[16],
    price: 29.95,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[16],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[16],
    rating: { rate: 2.9, count: 340 },
  },
  {
    id: 17,
    title: CANONICAL_PRODUCT_TITLES[17],
    price: 39.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[17],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[17],
    rating: { rate: 3.8, count: 679 },
  },
  {
    id: 18,
    title: CANONICAL_PRODUCT_TITLES[18],
    price: 9.85,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[18],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[18],
    rating: { rate: 4.7, count: 130 },
  },
  {
    id: 19,
    title: CANONICAL_PRODUCT_TITLES[19],
    price: 7.95,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[19],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[19],
    rating: { rate: 4.5, count: 146 },
  },
  {
    id: 20,
    title: CANONICAL_PRODUCT_TITLES[20],
    price: 12.99,
    description: CANONICAL_PRODUCT_DESCRIPTIONS[20],
    category: "women's clothing",
    image: PRODUCT_IMAGE_MAP[20],
    rating: { rate: 3.6, count: 145 },
  },
];

export function getCatalogProduct(id: number): Product {
  const found = FALLBACK_PRODUCTS.find((p) => p.id === id);
  if (found) {
    return enrichProductWithSpecs(found);
  }
  return enrichProductWithSpecs({
    id,
    title: CANONICAL_PRODUCT_TITLES[id] || `Ürün #${id}`,
    price: 19.99,
    description: "",
    category: "general",
    image: PRODUCT_IMAGE_MAP[id] || "/images/fallback/placeholder.svg",
    rating: { rate: 4.5, count: 100 },
  });
}

export function toLeanCartItem(item: CartItem | any): LeanCartItem {
  const productId = Number(item.productId || item.product?.id || 1);
  const selectedAttributes = item.selectedAttributes || item.attributes;
  const cartItemId = item.cartItemId || getCartItemId(productId, selectedAttributes);
  return {
    cartItemId,
    productId,
    quantity: item.quantity ?? 1,
    selected: item.selected !== false,
    selectedAttributes,
    unitPrice: item.unitPrice,
    needsAttributeConfirmation: item.needsAttributeConfirmation,
  };
}

export function hydrateCartItem(item: any): CartItem {
  if (!item) {
    return {
      cartItemId: "1",
      product: getCatalogProduct(1),
      quantity: 1,
      selected: true,
    };
  }

  const productId = Number(item.productId || item.product?.id || 1);
  const catalogProduct = getCatalogProduct(productId);
  const selectedAttributes = item.selectedAttributes || item.attributes || {};
  const cartItemId = item.cartItemId || getCartItemId(productId, selectedAttributes);

  const product: Product = {
    ...catalogProduct,
    id: productId,
    title: CANONICAL_PRODUCT_TITLES[productId] || item.product?.title || catalogProduct.title,
    price: catalogProduct.price,
    description: catalogProduct.description,
    category: catalogProduct.category,
    image: PRODUCT_IMAGE_MAP[productId] || item.product?.image || catalogProduct.image,
    rating: catalogProduct.rating,
    attributes: catalogProduct.attributes || getProductAttributes(catalogProduct),
    specifications: catalogProduct.specifications || getProductSpecifications(catalogProduct),
  };

  const unitPrice =
    typeof item.unitPrice === "number"
      ? item.unitPrice
      : calculateProductPrice(product, selectedAttributes);

  return {
    cartItemId,
    product,
    quantity: Math.max(1, Number(item.quantity) || 1),
    selected: item.selected !== false,
    selectedAttributes,
    unitPrice,
    needsAttributeConfirmation: Boolean(item.needsAttributeConfirmation),
  };
}

export function isVariantInStock(product: Product, selectedAttributes?: SelectedAttributes): boolean {
  if (!selectedAttributes) return true;
  const attrs = product.attributes || getProductAttributes(product);
  for (const attr of attrs) {
    const selectedVal = selectedAttributes[attr.name];
    if (selectedVal && attr.optionDetails) {
      const detail = attr.optionDetails.find((d) => d.label === selectedVal);
      if (detail && detail.inStock === false) {
        return false;
      }
    }
  }
  return true;
}

export function getOptionStockDetail(
  attr: ProductAttribute,
  optionLabel: string
): { inStock: boolean; stockCount?: number } {
  if (!attr.optionDetails) {
    return { inStock: true };
  }
  const detail = attr.optionDetails.find((d) => d.label === optionLabel);
  if (!detail) {
    return { inStock: true };
  }
  return {
    inStock: detail.inStock !== false,
    stockCount: detail.stockCount,
  };
}



