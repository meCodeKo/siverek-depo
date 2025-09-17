# Siverek Belediyesi Stok Takip Sistemi - Kullanım Kılavuzu

## 🔐 Güvenlik ve Erişim

### Giriş Yapma

1. Tarayıcınızda `http://localhost:3000` adresini açın
2. Karşınıza giriş ekranı gelecektir
3. Aşağıdaki test hesaplarından birini kullanarak giriş yapın:

#### Test Hesapları:
- **Sistem Yöneticisi**: `admin` / `admin123`
- **Müdür**: `manager` / `manager123`  
- **Kullanıcı**: `user1` / `user123`

### Yetki Seviyeleri

#### 🔴 Sistem Yöneticisi (Admin)
- Tüm işlemler için tam yetki
- Kullanıcı yönetimi
- Sistem ayarları
- Tüm raporlar ve dışa aktarma

#### 🟡 Müdür (Manager)
- Stok ekleme, düzenleme
- Stok hareketleri
- Raporları görüntüleme ve dışa aktarma
- Kullanıcıları görüntüleme

#### 🟢 Kullanıcı (User)
- Sadece görüntüleme yetkisi
- Stok listesini inceleme
- Temel raporları görüntüleme

## 📋 Ana İşlemler

### 1. Dashboard (Ana Sayfa)

Ana sayfada aşağıdaki bilgileri görebilirsiniz:
- **Toplam Ürün Sayısı**: Sistemde kayıtlı tüm ürünler
- **Toplam Miktar**: Depodaki toplam ürün miktarı
- **Toplam Değer**: Ürünlerin toplam parasal değeri
- **Düşük Stok Uyarıları**: Minimum seviyenin altındaki ürünler

### 2. Yeni Ürün Ekleme (Yönetici/Müdür)

1. Sol menüden **"Yeni Ürün Ekle"** seçin
2. Formu doldurun:
   - **Zorunlu Alanlar**: Ürün Adı, Kategori, Konum
   - **Ürün Bilgileri**: Marka, Model, Seri No, Barkod
   - **Stok Bilgileri**: Miktar, Minimum Seviye, Birim
   - **Mali Bilgiler**: Satın alma fiyatı, güncel değer
3. **"Ürünü Kaydet"** butonuna tıklayın

### 3. Stok Listesi Görüntüleme

1. Sol menüden **"Stok Listesi"** seçin
2. **Filtreleme Seçenekleri**:
   - Ürün adı ile arama
   - Kategori filtreleme
   - Durum filtreleme (Aktif, Pasif, Hasarlı, Bakımda)
   - Konum filtreleme

3. **Ürün İşlemleri**:
   - 👁️ **Görüntüle**: Ürün detayları
   - ✏️ **Düzenle**: Ürün bilgilerini güncelle (Yönetici/Müdür)
   - 🗑️ **Sil**: Ürünü sistemden kaldır (Sadece Yönetici)

### 4. Stok Hareketleri (Yönetici/Müdür)

1. Sol menüden **"Stok Hareketleri"** seçin
2. **"Stok Güncelle"** butonuna tıklayın
3. Form doldurma:
   - **Ürün**: Güncellenecek ürünü seçin
   - **İşlem Tipi**:
     - **Giriş (+)**: Stok ekleme (yeni alım, iade vb.)
     - **Çıkış (-)**: Stok çıkarma (kullanım, transfer vb.)
     - **Düzeltme (=)**: Doğru miktar belirtme (sayım sonrası)
   - **Miktar**: İşlem miktarı
   - **Sebep**: İşlem nedeni (zorunlu)
   - **Notlar**: Ek açıklamalar

### 5. Raporlama

#### Rapor Türleri:
1. **Stok Özeti**: Genel envanter durumu
2. **Düşük Stok Raporu**: Minimum seviyenin altındaki ürünler
3. **Stok Hareketleri**: Tarih bazlı işlem geçmişi
4. **Kategori Analizi**: Kategori bazında breakdown

#### Rapor Filtreleme:
- **Tarih Aralığı**: Başlangıç ve bitiş tarihi
- **Kategori**: Belirli kategoriler
- **Konum**: Belirli depolar
- **Durum**: Ürün durumları

#### Dışa Aktarma:
- **Excel**: Detaylı veri analizi için
- **PDF**: Baskı ve sunum için

## 🔄 Günlük İş Akışı Örnekleri

### Yeni Malzeme Geldiğinde:
1. **"Yeni Ürün Ekle"** sayfasına gidin
2. Malzeme bilgilerini tam olarak girin
3. Fatura bilgilerini ekleyin
4. Depo konumunu belirtin
5. Kaydedin

### Malzeme Çıkışı Yapılacağında:
1. **"Stok Hareketleri"** sayfasına gidin
2. **"Stok Güncelle"** butonuna tıklayın
3. İlgili ürünü seçin
4. **"Çıkış (-)"** işlem tipini seçin
5. Çıkış miktarını girin
6. Sebep olarak "Departman kullanımı" vb. yazın
7. Güncelleme yapın

### Aylık Rapor Hazırlarken:
1. **"Raporlar"** sayfasına gidin
2. **"Stok Özeti"** rapor türünü seçin
3. Tarih filtrelerini ayarlayın
4. **"Excel'e Aktar"** butonuna tıklayın
5. İndirilen dosyayı inceleyin

## ⚠️ Önemli Uyarılar

### Güvenlik:
- Şifrenizi kimseyle paylaşmayın
- Bilgisayar başından ayrılırken çıkış yapın
- Şüpheli aktivite durumunda sistem yöneticisine bildirin

### Veri Güvenliği:
- Düzenli olarak verilerinizi yedekleyin
- Yanlış veri girişinde hemen düzeltme yapın
- Büyük değişiklikler öncesi yöneticinizi bilgilendirin

### Performans:
- Sistemi güncel tarayıcılarda kullanın
- Çok fazla sekme açmayın
- Uzun süre aktif değilseniz oturum otomatik kapanır

## 🆘 Sorun Giderme

### Giriş Yapamıyorum:
- Kullanıcı adı ve şifrenizi kontrol edin
- Caps Lock açık olmadığından emin olun
- 5 yanlış denemeden sonra 15 dakika bekleyin
- Sorun devam ederse sistem yöneticisine başvurun

### Sayfa Yüklenmiyor:
- İnternet bağlantınızı kontrol edin
- Sayfayı yenileyin (F5)
- Tarayıcı geçmişini temizleyin
- Farklı tarayıcı deneyin

### İşlem Yapamıyorum:
- Yetkinizin olup olmadığını kontrol edin
- Zorunlu alanları doldurmuş olduğunuzdan emin olun
- Hata mesajlarını okuyun ve uygulayın

### Veriler Görünmüyor:
- Filtrelerinizi kontrol edin
- Tarih aralıklarını gözden geçirin
- Sayfa yenilemeyi deneyin

## 📞 Destek

**Teknik Destek**: Bilgi İşlem Müdürlüğü
**Sistem Yöneticisi**: IT Admin
**E-posta**: destek@siverek.gov.tr
**Dahili**: 1234

---

Bu kılavuz, sistemin etkin kullanımı için hazırlanmıştır. Güncellemeler sistem yöneticisi tarafından duyurulacaktır.