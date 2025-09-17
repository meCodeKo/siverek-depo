# Sıverk Depo - GitHub Yükleme Talimatları

Bu belge, Sıverk Depo uygulamasını GitHub'a yükleme talimatlarını içermektedir.

## Gerekli Hazırlıklar

1. [GitHub](https://github.com) hesabı oluşturun
2. Yeni bir repository oluşturun:
   - İsim: `siverek-depo`
   - Açıklama: "Sıverk Belediyesi Stok Takip Sistemi"
   - Public olarak ayarlayın
   - **README oluşturmayın**

## GitHub'a Yükleme Adımları

Aşağıdaki komutları PowerShell veya terminal penceresinde çalıştırın:

```bash
# Oluşturulan klasöre gidin
cd "c:\Users\Memet\Desktop\Masaüstü\siverek-depo-github"

# Git'i başlatın
git init

# Tüm dosyaları staging area'ya ekleyin
git add .

# İlk commit'i oluşturun
git commit -m "Initial commit with MongoDB integration"

# Main branch oluşturun
git branch -M main

# GitHub repository'nizi bağlayın (KULLANICIADINIZI değiştirin)
git remote add origin https://github.com/KULLANICIADINIZ/siverek-depo.git

# Dosyaları GitHub'a push edin
git push -u origin main
```

## MongoDB Atlas Kurulumu (Ücretsiz Seçenek)

Uygulamanın veritabanı olarak çalışması için MongoDB Atlas kurulumu gereklidir:

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) adresine gidin
2. Ücretsiz bir hesap oluşturun (kredi kartı gerekmez)
3. "Starter Cluster" (M0) seçin - bu tamamen ücretsizdir
4. "Connect" butonuna tıklayın
5. "Connect your application" seçeneğini seçin
6. Connection string'i kopyalayın

## Vercel Üzerinden Dağıtım

Uygulamayı web sitesi olarak yayınlamak için Vercel kullanabilirsiniz:

1. [Vercel](https://vercel.com) adresine gidin
2. GitHub ile giriş yapın
3. "New Project" butonuna tıklayın
4. GitHub repository'nizi seçin
5. Environment Variables bölümünde şu değişkeni ekleyin:
   - Key: `MONGODB_URI`
   - Value: MongoDB Atlas connection string
6. "Deploy" butonuna tıklayın

## Gerekli Dosyalar

Bu klasör aşağıdaki dosyaları içermektedir:

- `src/` - Uygulama kaynak kodları
- `public/` - Statik dosyalar
- `scripts/` - Deployment script'leri
- `package.json` - Bağımlılıklar ve script'ler
- `next.config.js` - Next.js yapılandırması
- `tsconfig.json` - TypeScript yapılandırması
- `.gitignore` - Git yoksayma dosyası
- `README.md` - Proje açıklaması

## Destek

Herhangi bir sorunla karşılaşırsanız aşağıdaki belgeleri inceleyin:
- [GITHUB-WEBSITE-WITH-SYNC.md](file:///c:/Users/Memet/Desktop/Masa%C3%BCst%C3%BC/s%C4%B1verk-depo/GITHUB-WEBSITE-WITH-SYNC.md) - Detaylı GitHub ve veri senkronizasyon kılavuzu
- [MAIN-DEPLOYMENT-GUIDE.md](file:///c:/Users/Memet/Desktop/Masa%C3%BCst%C3%BC/s%C4%B1verk-depo/MAIN-DEPLOYMENT-GUIDE.md) - Ana deployment kılavuzu