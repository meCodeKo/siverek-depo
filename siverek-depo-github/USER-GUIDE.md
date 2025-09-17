# Sıverk Depo Kullanıcı Kılavuzu

## 📋 İçindekiler

1. [Sisteme Giriş](#sisteme-giriş)
2. [Ana Sayfa](#ana-sayfa)
3. [Stok Yönetimi](#stok-yönetimi)
   - [Ürün Ekleme](#ürün-ekleme)
   - [Ürün Düzenleme](#ürün-düzenleme)
   - [Ürün Silme](#ürün-silme)
   - [Stok Hareketleri](#stok-hareketleri)
4. [Raporlama](#raporlama)
5. [Ayarlar](#ayarlar)
6. [Kullanıcı Yönetimi](#kullanıcı-yönetimi)
7. [Sorun Giderme](#sorun-giderme)

## Sisteme Giriş

### Giriş Bilgileri
- **Yönetici Hesabı**: 
  - Kullanıcı Adı: `admin`
  - Şifre: `admin123`
- **Müdür Hesabı**: 
  - Kullanıcı Adı: `manager`
  - Şifre: `manager123`

### Giriş Adımları
1. Web tarayıcınızda sistem URL'sini açın
2. Kullanıcı adı ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

## Ana Sayfa

Ana sayfa, sistemin genel durumu hakkında bilgiler içerir:

- Toplam ürün sayısı
- Düşük stok seviyesindeki ürünler
- Son stok hareketleri
- Hızlı erişim butonları

## Stok Yönetimi

### Ürün Ekleme

1. Sol menüden "Stok Listesi"ne tıklayın
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Aşağıdaki bilgileri girin:
   - **Ürün Adı** (*): Zorunlu alan
   - **Kategori** (*): Zorunlu alan
   - **Marka**: Opsiyonel
   - **Model**: Opsiyonel
   - **Seri Numarası**: Opsiyonel
   - **Barkod**: Opsiyonel
   - **Açıklama**: Opsiyonel
   - **Mevcut Miktar**: Varsayılan 0
   - **Minimum Stok Seviyesi**: Uyarı için
   - **Birim**: Adet, kg, lt, vb.
   - **Konum** (*): Zorunlu alan
   - **Durum**: Aktif, Pasif, Hasarlı, Bakımda
   - **Notlar**: Opsiyonel
4. "Ürünü Kaydet" butonuna tıklayın

### Ürün Düzenleme

1. Stok listesinden düzenlemek istediğiniz ürüne tıklayın
2. Ürün detay sayfasında "Düzenle" butonuna tıklayın
3. Gerekli alanları güncelleyin
4. "Güncelle" butonuna tıklayın

### Ürün Silme

1. Stok listesinden silmek istediğiniz ürünün yanındaki çöp kutusu ikonuna tıklayın
2. Onay penceresinde "Tamam" butonuna tıklayın

### Stok Hareketleri

Stok hareketleri otomatik olarak kaydedilir:

- **Stok Girişi**: Yeni ürün eklendiğinde
- **Stok Çıkışı**: Manuel olarak güncellendiğinde
- **Stok Düzeltmesi**: Miktar değiştirildiğinde

## Raporlama

### Rapor Türleri

1. **Stok Raporu**: Tüm ürünlerin listesi
2. **Düşük Stok Raporu**: Minimum seviyenin altındaki ürünler
3. **Stok Hareket Raporu**: Tüm stok hareketlerinin detaylı listesi
4. **Kategori Raporu**: Kategorilere göre stok dağılımı

### Rapor Dışa Aktarma

Raporlar iki formatta dışa aktarılabilir:
- **Excel**: .xlsx formatında
- **PDF**: .pdf formatında

## Ayarlar

### Kullanıcı Profili

1. Sağ üst köşedeki kullanıcı menüsünden "Profil" seçeneğine tıklayın
2. Profil bilgilerinizi görüntüleyin ve güncelleyin

### Sistem Ayarları

Yönetici kullanıcılar için:
1. "Ayarlar" menüsüne tıklayın
2. Sistem ayarlarını görüntüleyin ve güncelleyin

## Kullanıcı Yönetimi

### Kullanıcı Ekleme (Yalnızca Yönetici)

1. Sol menüden "Kullanıcılar" seçeneğine tıklayın
2. "Yeni Kullanıcı Ekle" butonuna tıklayın
3. Kullanıcı bilgilerini girin:
   - Kullanıcı Adı
   - Tam Ad
   - Rol (Admin, Müdür, Kullanıcı)
   - Şifre
4. "Kullanıcı Ekle" butonuna tıklayın

### Kullanıcı Düzenleme (Yalnızca Yönetici)

1. Kullanıcı listesinden düzenlemek istediğiniz kullanıcıya tıklayın
2. Kullanıcı bilgilerini güncelleyin
3. "Güncelle" butonuna tıklayın

### Kullanıcı Silme (Yalnızca Yönetici)

1. Kullanıcı listesinden silmek istediğiniz kullanıcının yanındaki çöp kutusu ikonuna tıklayın
2. Onay penceresinde "Tamam" butonuna tıklayın

## Sorun Giderme

### Yaygın Sorunlar

#### 1. Giriş Yapılamıyor
- Kullanıcı adı ve şifreyi doğru girdiğinizden emin olun
- Büyük/küçük harf duyarlılığını kontrol edin
- Caps Lock tuşunun açık olup olmadığını kontrol edin

#### 2. Ürün Eklenemiyor
- Zorunlu alanların doldurulduğundan emin olun (* ile işaretli alanlar)
- İnternet bağlantınızı kontrol edin
- Sayfayı yenileyin ve tekrar deneyin

#### 3. Rapor Oluşturulamıyor
- Seçilen tarih aralığının doğru olduğundan emin olun
- Filtreleme seçeneklerini kontrol edin
- Tarayıcıyı yenileyin

#### 4. Yavaş Performans
- Tarayıcınızın önbelleğini temizleyin
- Farklı bir tarayıcı deneyin
- İnternet bağlantınızı kontrol edin

### Teknik Destek

Herhangi bir teknik sorunla karşılaşırsanız:
1. Sistem yöneticinizle iletişime geçin
2. Karşılaştığınız hatayı ve adımları detaylı olarak bildirin
3. Tarayıcı konsolundaki hata mesajlarını paylaşın (varsa)

## 📱 Mobil Uyumluluk

Sistem mobil cihazlarda da kullanılabilir:
- Tüm modern tarayıcılar desteklenir
- Responsive tasarım ile uyumlu arayüz
- Dokunmatik ekran desteği

## 🔒 Güvenlik

### Oturum Güvenliği
- Oturumlar otomatik olarak zaman aşımına uğrar
- Aynı anda yalnızca bir oturum açılabilir
- Şifreler güvenli bir şekilde saklanır

### Veri Güvenliği
- Tüm veriler şifreli olarak iletilir
- Veritabanı yedeklemeleri düzenli olarak alınır
- Erişim logları tutulur

## 🔄 Sürüm Güncellemeleri

Sistem otomatik olarak güncellenir. Yeni özellikler ve iyileştirmeler düzenli olarak eklenir.

### Son Güncellemeler
- MongoDB veritabanı desteği eklendi
- Geliştirilmiş raporlama özellikleri
- Mobil uyumluluk iyileştirmeleri
- Performans optimizasyonları

## 📞 İletişim

Herhangi bir soru veya destek için lütfen sistem yöneticinizle iletişime geçin.