// Exchange veri işleme fonksiyonları
export function handleExchangeData(exchanges) {
    console.log("Exchange verisi alındı:", exchanges);
    
    exchanges.forEach(exchange => {
        console.log("Exchange ID:", exchange.id);
        console.log("Exchange Name:", exchange.name);
        console.log("Is Currency Convertor:", exchange.isCurrencyConvertor);
        console.log("Trade Context:", exchange.context);
        console.log("Config Active:", exchange.config?.isActive);
    });
    
    // DOM'u güncelle
    updateExchangeDisplay(exchanges);
    updateExchangeStatistics(exchanges);
}

// ExchangeDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateExchangeDisplay(data) {
    console.log("ExchangeDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// ExchangeStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateExchangeStatistics(data) {
    console.log("ExchangeStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Exchange detaylarını göster
export function showExchangeDetails(exchangeId) {
    console.log("Exchange detayları gösteriliyor:", exchangeId);
    // Modal implementasyonu burada olacak
}

// Exchange düzenle
export function editExchange(exchangeId) {
    console.log("Exchange düzenleniyor:", exchangeId);
    // Düzenleme implementasyonu burada olacak
}

// Exchange konfigüre et
export function configureExchange(exchangeId) {
    console.log("Exchange konfigüre ediliyor:", exchangeId);
    // Konfigürasyon implementasyonu burada olacak
}

// Exchange aktif yap
export function activateExchange(exchangeId) {
    console.log("Exchange aktif yapılıyor:", exchangeId);
    // Aktivasyon implementasyonu burada olacak
}

// Exchange pasif yap
export function deactivateExchange(exchangeId) {
    console.log("Exchange pasif yapılıyor:", exchangeId);
    // Deaktivasyon implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showExchangeDetails = showExchangeDetails;
window.editExchange = editExchange;
window.configureExchange = configureExchange;
window.activateExchange = activateExchange;
window.deactivateExchange = deactivateExchange;

// Yardımcı fonksiyonlar
function getTradeContextBadgeClass(context) {
    switch(context) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-info';
        case 'Margin': return 'bg-primary';
        case 'OTC': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

function getTradeContextText(context) {
    switch(context) {
        case 'Spot': return 'Spot';
        case 'Futures': return 'Vadeli';
        case 'Options': return 'Opsiyon';
        case 'Margin': return 'Marjin';
        case 'OTC': return 'OTC';
        default: return context || 'Bilinmeyen';
    }
}

function getCurrencyBadgeClass(assetType) {
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

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterExchanges(exchanges, filters) { ... } - KALDIRILDI

// Örnek exchange verisi
export function getSampleExchangeData() {
    return [
        {
            id: 1,
            name: "Binance",
            isCurrencyConvertor: true,
            context: "Spot",
            config: {
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
            }
        },
        {
            id: 2,
            name: "Coinbase Pro",
            isCurrencyConvertor: false,
            context: "Spot",
            config: {
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
            }
        },
        {
            id: 3,
            name: "Bybit",
            isCurrencyConvertor: true,
            context: "Futures",
            config: {
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
            }
        },
        {
            id: 4,
            name: "Kraken",
            isCurrencyConvertor: false,
            context: "Spot",
            config: {
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
            }
        },
        {
            id: 5,
            name: "Deribit",
            isCurrencyConvertor: true,
            context: "Options",
            config: {
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
            }
        },
        {
            id: 6,
            name: "OKX",
            isCurrencyConvertor: false,
            context: "Futures",
            config: {
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
            }
        },
        {
            id: 7,
            name: "Huobi",
            isCurrencyConvertor: true,
            context: "Margin",
            config: {
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
            }
        },
        {
            id: 8,
            name: "BitMEX",
            isCurrencyConvertor: false,
            context: "Futures",
            config: {
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
        }
    ];
} 

