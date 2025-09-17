# Sıverk Depo - Stok Takip Sistemi

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

Sıverk Belediyesi Bilgi İşlem Müdürlüğü için geliştirilen modern bir malzeme stok takip ve yönetim sistemi.

## 📋 Proje Özeti

Sıverk Depo, Siverek Belediyesi Bilgi İşlem Müdürlüğü için geliştirilmiş modern bir malzeme stok takip ve yönetim sistemidir. Lokal yönetimde stok kontrolünü dijitalleştirmeyi ve süreçleri optimize etmeyi amaçlamaktadır.

### Çözülen Temel Kullanıcı Problemleri:
- Fiziksel stok kayıtlarının zaman alması ve hata riski
- Yetkilendirme olmadan erişim ve işlem kontrolü
- Stok seviyesinin anlık olarak takip edilememesi
- Raporlama ve analiz eksikliği

## 🌟 Sistem Özellikleri

- **Rol tabanlı erişim kontrolü** (Admin, Müdür, Kullanıcı)
- **Stok ekleme, güncelleme ve izleme**
- **Stok hareketlerinin detaylı kaydı**
- **Excel ve PDF formatında raporlama**
- **Anlık stok durumu ve uyarı sistemi**
- **Kullanıcı dostu arayüz ve mobil uyumlu tasarım**

## 🏗️ Teknik Mimarisi

### Genel Mimari
Next.js App Router mimarisi üzerine kurulmuş, istemci tarafında MongoDB ile veri yönetimi yapan bir full-stack sistemdir.

### Teknik Kararlar
- **Next.js 15.5.3** - Sunucu ve istemci bileşenleri için
- **TypeScript** - Tip güvenliği için
- **MongoDB** - Veri saklama için
- **Tailwind CSS** - Hızlı ve tutarlı stil oluşturma için
- **Recharts** - Görsel veri sunumu için

### Mimari ve Tasarım Desenleri
- **Component-Based Architecture** - React ile modüler yapı
- **Protected Route Pattern** - Yetki kontrolü için
- **Service Layer Pattern** - İş mantığı ve veri erişimi ayrımı
- **Layout Pattern** - Tekrar kullanılabilir düzen bileşenleri

## 🛠️ Teknoloji Yığını

### Frontend
- Next.js 15.5.3
- React 19.1.0
- TypeScript
- Tailwind CSS
- Heroicons, Headless UI
- Recharts (grafikler için)
- xlsx, jsPDF (rapor dışa aktarma)
- date-fns (tarih işlemleri)

### Backend
- Next.js API Routes
- MongoDB (Atlas veya kendi sunucunuz)
- Mongoose (ODM)

### Veri Yönetimi
- MongoDB (Production ortamı)
- JSON dosyaları (Development ortamı - eski sürüm)

## ⚙️ Geliştirme Ortamı ve Dağıtım

### Gerekli Araçlar
- Node.js (v18 veya üzeri önerilir)
- npm
- MongoDB (Yerel veya bulut)

### Ortam Kurulumu

```bash
# Proje klasörüne git
cd siverek-inventory-system

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

### Build & Dağıtım

```bash
# Projeyi derle
npm run build

# Üretim ortamında başlat
npm run start
```

### Dağıtım Gereksinimleri
- Next.js destekleyen bir ortam (Vercel, Node.js sunucu, vs.)
- MongoDB veritabanı

## 📁 Proje Dizin Yapısı

```
src/
├── app/                      # Next.js sayfaları
│   ├── inventory/           # Stok yönetimi
│   ├── transactions/        # Stok hareketleri
│   ├── reports/             # Raporlama
│   ├── login/               # Giriş sayfası
│   ├── unauthorized/        # Erişim reddi sayfası
│   └── layout.tsx           # Ana layout
├── components/              # Yeniden kullanılabilir bileşenler
│   ├── Auth/                # Yetkilendirme bileşenleri
│   └── Layout/              # Düzen bileşenleri
├── lib/                     # Veri erişim katmanı
│   └── dataStorage.ts       # Eski dosya tabanlı veri erişimi
├── services/                # İş mantığı
│   ├── authService.ts       # Yetkilendirme işlemleri
│   ├── inventoryService.ts  # Stok işlemleri
│   └── dbService.ts         # Yeni MongoDB tabanlı veri erişimi
└── types/                   # TypeScript tipleri
    ├── auth.ts              # Yetkilendirme tipleri
    └── inventory.ts         # Stok tipleri
```

## 🚀 GitHub Üzerinden Dağıtım

Bu projeyi GitHub üzerinden dağıtmak ve farklı bilgisayarlarda çalışmasını sağlamak için:

1. Bu repository'yi forklayın
2. MongoDB veritabanı oluşturun (MongoDB Atlas önerilir)
3. `.env` dosyasını oluşturun ve MongoDB bağlantı dizesini ekleyin:
   ```
   MONGODB_URI=mongodb+srv://kullanici:sifre@cluster0.mongodb.net/siverekdepo
   ```
4. Projeyi Vercel, Netlify veya başka bir platforma deploy edin

## 🔒 Güvenlik

- XSS koruma
- Form doğrulama
- Oturum zaman aşımı
- Rol tabanlı erişim kontrolü

## 📈 Performans

- Mobil uyumlu ve hafif arayüz
- Sunucu tarafı render etme
- Statik dosya optimizasyonu

## 🧪 Test

Unit test desteği ilerleyen aşamalarda eklenecektir.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunanlar

- Siverek Belediyesi Bilgi İşlem Müdürlüğü

## 📞 İletişim

Herhangi bir soru veya destek için lütfen sistem yöneticinizle iletişime geçin.