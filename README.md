# OperationalExchangeNew

Gerçek zamanlı borsa ve kripto para arbitraj işlemleri için geliştirilmiş modern web uygulaması. SignalR teknolojisi ile anlık veri akışı sağlar.

## 🚀 Özellikler

### 📊 Gerçek Zamanlı Veri Akışı
- **SignalR** ile anlık veri güncellemeleri
- **Borsa (BIST)** ve **Kripto Para** verileri
- **Arbitraj fırsatları** tespiti
- **Fiyat animasyonları** ve görsel geri bildirimler

### 💹 Arbitraj İşlemleri
- Çoklu exchange arbitrajı
- Otomatik fırsat tespiti
- Demo ve gerçek işlem modları
- Detaylı işlem geçmişi

### 🎨 Modern UI/UX
- **Bootstrap 5** ile responsive tasarım
- **Umbraco CMS** entegrasyonu
- Dinamik panel sistemi
- Toast bildirimleri

### 🔧 Teknik Özellikler
- **.NET 8** ve **ASP.NET Core**
- **Umbraco CMS** v13
- **SignalR** gerçek zamanlı iletişim
- **SQLite** veritabanı
- **JavaScript ES6+** modülleri

## 📋 Gereksinimler

- .NET 8.0 SDK
- Node.js 18+ (opsiyonel)
- Visual Studio 2022 veya VS Code

## 🛠️ Kurulum

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/[kullanici-adi]/OperationalExchangeNew.git
cd OperationalExchangeNew
```

### 2. Bağımlılıkları Yükleyin
```bash
dotnet restore
```

### 3. Veritabanını Başlatın
```bash
dotnet ef database update
```

### 4. Uygulamayı Çalıştırın
```bash
dotnet run
```

### 5. Tarayıcıda Açın
```
https://localhost:5001
```

## 🏗️ Proje Yapısı

```
OperationalExchangeNew/
├── Controllers/                 # API ve MVC Controller'ları
│   ├── SignalRHubController.cs  # SignalR Hub
│   ├── TestDataController.cs    # Test verileri
│   └── ...
├── Models/                      # Veri modelleri
├── Views/                       # Razor view'ları
│   ├── TestSignalR.cshtml      # Test sayfası
│   └── ...
├── wwwroot/                     # Statik dosyalar
│   ├── js/
│   │   ├── signalr-common.js   # SignalR yöneticisi
│   │   ├── arbitrage-data.js   # Arbitraj veri yöneticisi
│   │   ├── borsa-data.js       # Borsa veri yöneticisi
│   │   └── crypto-data.js      # Kripto veri yöneticisi
│   └── css/
│       └── site.css            # Özel stiller
└── Program.cs                   # Uygulama başlangıç noktası
```

## 🔌 API Endpoints

### Test Endpoints
- `POST /api/testdata/send-arbitrage` - Test arbitraj verisi
- `POST /api/testdata/send-borsa` - Test borsa verisi
- `POST /api/testdata/send-crypto` - Test kripto verisi
- `POST /api/testdata/send-price-update` - Test fiyat güncellemesi
- `POST /api/testdata/send-opportunity` - Test arbitraj fırsatı
- `POST /api/testdata/send-initial-data` - Başlangıç verileri

### SignalR Hub
- Hub URL: `/signalrhub`
- Metodlar: `UpdateArbitrageData`, `UpdateBorsaData`, `UpdateCryptoData`, vb.

## 🧪 Test Etme

### 1. Test Sayfasına Gidin
```
https://localhost:5001/test-signalr
```

### 2. Test Butonlarını Kullanın
- **Arbitraj Verisi**: Yeni arbitraj işlemi ekler
- **Borsa Verisi**: BIST verilerini günceller
- **Kripto Verisi**: Kripto para verilerini günceller
- **Fiyat Güncelleme**: Gerçek zamanlı fiyat değişiklikleri
- **Arbitraj Fırsatı**: Yeni arbitraj fırsatları
- **Başlangıç Verileri**: İlk yükleme verileri

## 📱 Kullanım

### Arbitraj İşlemleri
1. Ana sayfada "İşlemler" sekmesine gidin
2. Arbitraj fırsatlarını takip edin
3. Demo modunda test edin
4. Gerçek işlemler için hesap ayarlarını yapın

### Borsa Takibi
1. Borsa verilerini gerçek zamanlı izleyin
2. Fiyat değişimlerini animasyonlarla görün
3. İstatistikleri takip edin

### Kripto Para Takibi
1. Çoklu exchange verilerini görün
2. Market cap ve hacim bilgilerini takip edin
3. 24 saatlik değişimleri izleyin

## 🔧 Konfigürasyon

### appsettings.json
```json
{
  "ConnectionStrings": {
    "umbracoDbDSN": "Data Source=|DataDirectory|/Umbraco.sqlite.db"
  },
  "SignalR": {
    "HubUrl": "/signalrhub"
  }
}
```

### SignalR Ayarları
- Otomatik yeniden bağlanma
- Bağlantı durumu izleme
- Hata yönetimi

## 🚀 Deployment

### Docker ile
```bash
docker build -t operationalexchange .
docker run -p 5000:5000 operationalexchange
```

### Azure ile
```bash
az webapp up --name operationalexchange --resource-group myResourceGroup
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: [Adınız]
- **Email**: [email@example.com]
- **GitHub**: [https://github.com/[kullanici-adi]]

## 🙏 Teşekkürler

- **Umbraco** - CMS platformu
- **SignalR** - Gerçek zamanlı iletişim
- **Bootstrap** - UI framework
- **.NET** - Geliştirme platformu

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! 