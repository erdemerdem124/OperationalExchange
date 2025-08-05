// Exchange Configuration veri işleme fonksiyonları
export function handleExchangeConfigurationData(configurations) {
    console.log("Exchange Configuration verisi alındı:", configurations);
    
    configurations.forEach(config => {
        console.log("Config ID:", config.id);
        console.log("Exchange ID:", config.exchangeId);
        console.log("Is Active:", config.isActive);
        console.log("Accumulate Profit In:", config.accumulateProfitIn?.name);
    });
    
    // DOM'u güncelle
    updateExchangeConfigurationDisplay(configurations);
    updateExchangeConfigurationStatistics(configurations);
}

// ExchangeConfigurationDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateExchangeConfigurationDisplay(data) {
    console.log("ExchangeConfigurationDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// ExchangeConfigurationStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateExchangeConfigurationStatistics(data) {
    console.log("ExchangeConfigurationStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Exchange Configuration detaylarını göster
export function showExchangeConfigurationDetails(configId) {
    console.log("Exchange Configuration detayları gösteriliyor:", configId);
    // Modal implementasyonu burada olacak
}

// Exchange Configuration düzenle
export function editExchangeConfiguration(configId) {
    console.log("Exchange Configuration düzenleniyor:", configId);
    // Düzenleme implementasyonu burada olacak
}

// Exchange Configuration durumunu değiştir
export function toggleExchangeConfigurationStatus(configId) {
    console.log("Exchange Configuration durumu değiştiriliyor:", configId);
    // Durum değiştirme implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showExchangeConfigurationDetails = showExchangeConfigurationDetails;
window.editExchangeConfiguration = editExchangeConfiguration;
window.toggleExchangeConfigurationStatus = toggleExchangeConfigurationStatus;

// Yardımcı fonksiyonlar
function getCurrencyBadgeClass(assetType) {
    switch(assetType) {
        case 'Crypto': return 'bg-warning';
        case 'Forex': return 'bg-info';
        case 'Stock': return 'bg-success';
        case 'Commodity': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

function getAssetTypeBadgeClass(assetType) {
    switch(assetType) {
        case 'Crypto': return 'bg-warning';
        case 'Forex': return 'bg-info';
        case 'Stock': return 'bg-success';
        case 'Commodity': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

function getAssetTypeText(assetType) {
    switch(assetType) {
        case 'Crypto': return 'Kripto';
        case 'Forex': return 'Döviz';
        case 'Stock': return 'Hisse';
        case 'Commodity': return 'Emtia';
        default: return assetType || 'Bilinmeyen';
    }
}

// Örnek exchange configuration verisi
export function getSampleExchangeConfigurationData() {
    return [
        {
            id: 1,
            exchangeId: 1001,
            isActive: true,
            accumulateProfitIn: {
                id: 1,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 2,
            exchangeId: 1002,
            isActive: true,
            accumulateProfitIn: {
                id: 2,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 3,
            exchangeId: 1003,
            isActive: false,
            accumulateProfitIn: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 4,
            exchangeId: 1004,
            isActive: true,
            accumulateProfitIn: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 5,
            exchangeId: 1005,
            isActive: true,
            accumulateProfitIn: {
                id: 5,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 6,
            exchangeId: 1006,
            isActive: false,
            accumulateProfitIn: {
                id: 6,
                name: "Binance Coin",
                abbreviationSymbol: "BNB",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 7,
            exchangeId: 1007,
            isActive: true,
            accumulateProfitIn: {
                id: 7,
                name: "Gold",
                abbreviationSymbol: "XAU",
                assetType: "Commodity",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        },
        {
            id: 8,
            exchangeId: 1008,
            isActive: true,
            accumulateProfitIn: {
                id: 8,
                name: "Cardano",
                abbreviationSymbol: "ADA",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            }
        }
    ];
} 

