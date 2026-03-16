# CN Top - Online E-Ticaret Sipariş Sitesi

Apple seviyesinde premium, modern ve minimal tasarıma sahip e-ticaret sipariş web sitesi.

## Teknoloji Yığını

- **Next.js 14+** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ShadCN UI**
- **Framer Motion**
- **Firebase** (Firestore + Storage)

## Özellikler

- 🏠 **Ana Sayfa**: Hero bölümü, kategoriler, ürün kartları
- 📦 **Kategoriler**: Firebase'den dinamik kategori listesi
- 🛍️ **Ürünler**: Kategoriye göre filtreleme, ürün detay modalı
- 🛒 **Sepet**: Slide-in çekmece, miktar kontrolü, toplam fiyat
- 💳 **Ödeme**: Müşteri bilgileri formu, havale/EFT, dekont yükleme (Base64)
- 📤 **Sipariş**: Firestore'a sipariş kaydı

## Firebase Yapılandırması

Firebase yapılandırması `src/lib/firebase.ts` dosyasında tanımlıdır.

### Firestore Koleksiyonları

**categories**
- `id`, `name`, `image`, `order`

**products**
- `id`, `name`, `description`, `price`, `image`, `categoryId`, `stock`

**orders**
- `customerName`, `phone`, `email`, `address`, `items[]`, `totalPrice`, `receiptBase64`, `createdAt`

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## Önemli Notlar

1. **Firestore Kuralları**: Firebase Console → Firestore → Kurallar bölümüne gidin. `firestore.rules` dosyasındaki kuralları yapıştırın ve yayınlayın. Varsayılan kurallar tüm okumaları engeller.

2. **Örnek Veri**: Firestore'da `categories` ve `products` koleksiyonlarına veri ekleyin:
   - **categories**: `name`, `image`, `order` (sayı)
   - **products**: `name`, `description`, `price`, `image`, `categoryId`, `stock`

3. **IBAN**: Checkout sayfasındaki IBAN numarasını `src/app/checkout/page.tsx` içinde güncelleyin.

4. **Sipariş Onay E-postası** (ücretsiz): [Resend](https://resend.com) ile sipariş sonrası otomatik e-posta gönderilir. Kurulum:
   - resend.com üzerinden ücretsiz hesap oluşturun
   - API Key alın
   - `.env.local` dosyasına `RESEND_API_KEY=re_xxx` ekleyin
   - Ücretsiz: 3000 e-posta/ay

5. **Görseller**: Ürün ve kategori görselleri Firebase Storage veya harici URL'lerden yüklenebilir.

## Proje Yapısı

```
src/
├── app/           # Sayfalar ve layout
├── components/    # UI bileşenleri
├── hooks/         # Firebase veri hook'ları
├── lib/           # Firebase, utils
├── store/         # Sepet state (CartProvider)
└── types/         # TypeScript tipleri
```
