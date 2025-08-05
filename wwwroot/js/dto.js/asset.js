// Asset veri işleme fonksiyonları
export function handleAssetData(assets) {
    console.log("Asset verisi alındı:", assets);
    
    assets.forEach(asset => {
        console.log("ID:", asset.id);
        console.log("Name:", asset.name);
        console.log("Asset Type:", asset.assetType);
        console.log("Is Perpetual:", asset.isPerpetual);
        console.log("Symbol:", asset.abbreviationSymbol);
    });
    
    // DOM'u güncelle
    updateAssetDisplay(assets);
    updateAssetStatistics(assets);
}

// AssetDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateAssetDisplay(data) {
    console.log("AssetDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// AssetStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateAssetStatistics(data) {
    console.log("AssetStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Asset tipi badge rengini belirle
function getAssetTypeBadgeClass(assetType) {
    switch(assetType) {
        case 'Crypto': return 'bg-warning';
        case 'Stock': return 'bg-info';
        case 'Forex': return 'bg-success';
        case 'Commodity': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

// Asset tipi adını getir
function getAssetTypeName(assetType) {
    switch(assetType) {
        case 'Crypto': return 'Kripto';
        case 'Stock': return 'Hisse';
        case 'Forex': return 'Döviz';
        case 'Commodity': return 'Emtia';
        default: return assetType;
    }
}

// Asset detaylarını göster
export function showAssetDetails(assetId) {
    console.log("Asset detayları gösteriliyor:", assetId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyon olarak da ekle (HTML'den çağrılabilir)
window.showAssetDetails = showAssetDetails;

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterAssets(assets, filters) { ... } - KALDIRILDI

// Örnek asset verisi (GetAssetDto)
export function getSampleAssetData() {
    return [
        {
            id: 1,
            name: "Bitcoin",
            dateAdded: new Date("2024-01-15T10:30:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "BTC"
        },
        {
            id: 2,
            name: "Ethereum",
            dateAdded: new Date("2024-01-16T14:20:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "ETH"
        },
        {
            id: 3,
            name: "Apple Inc.",
            dateAdded: new Date("2024-01-17T09:15:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "AAPL"
        },
        {
            id: 4,
            name: "Tesla Inc.",
            dateAdded: new Date("2024-01-18T11:45:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "TSLA"
        },
        {
            id: 5,
            name: "EUR/USD Perpetual",
            dateAdded: new Date("2024-01-19T16:30:00"),
            assetType: "Forex",
            isPerpetual: true,
            abbreviationSymbol: "EURUSD"
        },
        {
            id: 6,
            name: "Gold Futures",
            dateAdded: new Date("2024-01-20T13:10:00"),
            assetType: "Commodity",
            isPerpetual: false,
            abbreviationSymbol: "XAUUSD"
        },
        {
            id: 7,
            name: "Binance Coin",
            dateAdded: new Date("2024-01-21T08:25:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "BNB"
        },
        {
            id: 8,
            name: "Microsoft Corp.",
            dateAdded: new Date("2024-01-22T12:40:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "MSFT"
        }
    ];
}

