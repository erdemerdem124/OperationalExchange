// Asset Without Display Info veri işleme fonksiyonları
export function handleAssetWithoutDisplayInfoData(assets) {
    console.log("Asset Without Display Info verisi alındı:", assets);
    
    assets.forEach(asset => {
        console.log("ID:", asset.id);
        console.log("Name:", asset.name);
        console.log("Asset Type:", asset.assetType);
        console.log("Is Perpetual:", asset.isPerpetual);
        console.log("Symbol:", asset.abbreviationSymbol);
    });
    
    // DOM'u güncelle
    updateAssetWithoutDisplayInfoDisplay(assets);
    updateAssetWithoutDisplayInfoStatistics(assets);
}

// AssetWithoutDisplayInfoDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateAssetWithoutDisplayInfoDisplay(data) {
    console.log("AssetWithoutDisplayInfoDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// AssetWithoutDisplayInfoStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateAssetWithoutDisplayInfoStatistics(data) {
    console.log("AssetWithoutDisplayInfoStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
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

// Asset Without Display Info detaylarını göster
export function showAssetWithoutDisplayInfoDetails(assetId) {
    console.log("Asset Without Display Info detayları gösteriliyor:", assetId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyon olarak da ekle (HTML'den çağrılabilir)
window.showAssetWithoutDisplayInfoDetails = showAssetWithoutDisplayInfoDetails;

// Örnek asset verisi (GetAssetWithoutDisplayInfoDto) - ID long tipinde
export function getSampleAssetWithoutDisplayInfoData() {
    return [
        {
            id: 1001,
            name: "Cardano",
            dateAdded: new Date("2024-02-01T10:30:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "ADA"
        },
        {
            id: 1002,
            name: "Solana",
            dateAdded: new Date("2024-02-02T14:20:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "SOL"
        },
        {
            id: 1003,
            name: "Google Inc.",
            dateAdded: new Date("2024-02-03T09:15:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "GOOGL"
        },
        {
            id: 1004,
            name: "Amazon.com Inc.",
            dateAdded: new Date("2024-02-04T11:45:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "AMZN"
        },
        {
            id: 1005,
            name: "GBP/USD Perpetual",
            dateAdded: new Date("2024-02-05T16:30:00"),
            assetType: "Forex",
            isPerpetual: true,
            abbreviationSymbol: "GBPUSD"
        },
        {
            id: 1006,
            name: "Polkadot",
            dateAdded: new Date("2024-02-06T12:15:00"),
            assetType: "Crypto",
            isPerpetual: false,
            abbreviationSymbol: "DOT"
        },
        {
            id: 1007,
            name: "Netflix Inc.",
            dateAdded: new Date("2024-02-07T15:45:00"),
            assetType: "Stock",
            isPerpetual: false,
            abbreviationSymbol: "NFLX"
        }
    ];
}

