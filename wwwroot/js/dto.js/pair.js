// Pair veri işleme fonksiyonları
export function handlePairData(pairs) {
    console.log("Pair verisi alındı:", pairs);
    
    pairs.forEach(pair => {
        console.log("Pair ID:", pair.id);
        console.log("Friendly Name:", pair.friendlyName);
        console.log("Exchange:", pair.exchange?.name);
        console.log("Context:", pair.context);
        console.log("Asset1:", pair.asset1?.name);
        console.log("Asset2:", pair.asset2?.name);
        console.log("Trading Fee Level:", pair.tradingFeeLevel);
        console.log("Blockchain:", pair.blockchain);
    });
    
    // DOM'u güncelle
    updatePairDisplay(pairs);
    updatePairStatistics(pairs);
}

// PairDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePairDisplay(data) {
    console.log("PairDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// PairStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePairStatistics(data) {
    console.log("PairStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Pair detaylarını göster
export function showPairDetails(pairId) {
    console.log("Pair detayları gösteriliyor:", pairId);
    // Modal implementasyonu burada olacak
}

// Pair düzenle
export function editPair(pairId) {
    console.log("Pair düzenleniyor:", pairId);
    // Düzenleme implementasyonu burada olacak
}

// Pair konfigüre et
export function configurePair(pairId) {
    console.log("Pair konfigüre ediliyor:", pairId);
    // Konfigürasyon implementasyonu burada olacak
}

// Pair aktif yap
export function activatePair(pairId) {
    console.log("Pair aktif yapılıyor:", pairId);
    // Aktivasyon implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showPairDetails = showPairDetails;
window.editPair = editPair;
window.configurePair = configurePair;
window.activatePair = activatePair;

// Yardımcı fonksiyonlar
function getExchangeBadgeClass(context) {
    switch(context) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-info';
        case 'Margin': return 'bg-primary';
        case 'OTC': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

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

function getTradingFeeLevelBadgeClass(feeLevel) {
    switch(feeLevel) {
        case 'Low': return 'bg-success';
        case 'Medium': return 'bg-warning';
        case 'High': return 'bg-danger';
        case 'VIP': return 'bg-primary';
        default: return 'bg-secondary';
    }
}

function getTradingFeeLevelText(feeLevel) {
    switch(feeLevel) {
        case 'Low': return 'Düşük';
        case 'Medium': return 'Orta';
        case 'High': return 'Yüksek';
        case 'VIP': return 'VIP';
        default: return feeLevel || 'Bilinmeyen';
    }
}

// Örnek pair verisi
export function getSamplePairData() {
    return [
        {
            id: 1,
            exchange: {
                id: 1,
                name: "Binance",
                isCurrencyConvertor: true,
                context: "Spot"
            },
            context: "Spot",
            friendlyName: "Bitcoin/Turkish Lira",
            asset1: {
                id: 1,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 2,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "Medium",
            blockchainAdress: "0x1234567890abcdef1234567890abcdef12345678",
            blockchain: "Bitcoin"
        },
        {
            id: 2,
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                isCurrencyConvertor: false,
                context: "Spot"
            },
            context: "Spot",
            friendlyName: "Ethereum/US Dollar",
            asset1: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "Low",
            blockchainAdress: "0xabcdef1234567890abcdef1234567890abcdef12",
            blockchain: "Ethereum"
        },
        {
            id: 3,
            exchange: {
                id: 3,
                name: "Bybit",
                isCurrencyConvertor: true,
                context: "Futures"
            },
            context: "Futures",
            friendlyName: "Euro/US Dollar",
            asset1: {
                id: 5,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "High",
            blockchainAdress: "0x9876543210fedcba9876543210fedcba98765432",
            blockchain: "Traditional"
        },
        {
            id: 4,
            exchange: {
                id: 4,
                name: "Kraken",
                isCurrencyConvertor: false,
                context: "Spot"
            },
            context: "Spot",
            friendlyName: "Turkish Lira/US Dollar",
            asset1: {
                id: 2,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "Medium",
            blockchainAdress: "0xfedcba0987654321fedcba0987654321fedcba09",
            blockchain: "Traditional"
        },
        {
            id: 5,
            exchange: {
                id: 5,
                name: "Deribit",
                isCurrencyConvertor: true,
                context: "Options"
            },
            context: "Options",
            friendlyName: "Cardano/US Dollar",
            asset1: {
                id: 6,
                name: "Cardano",
                abbreviationSymbol: "ADA",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "VIP",
            blockchainAdress: "0x5555555555555555555555555555555555555555",
            blockchain: "Cardano"
        },
        {
            id: 6,
            exchange: {
                id: 1,
                name: "Binance",
                isCurrencyConvertor: true,
                context: "Spot"
            },
            context: "Spot",
            friendlyName: "Binance Coin/USDT",
            asset1: {
                id: 7,
                name: "Binance Coin",
                abbreviationSymbol: "BNB",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 8,
                name: "Tether",
                abbreviationSymbol: "USDT",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "Low",
            blockchainAdress: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            blockchain: "Binance Smart Chain"
        },
        {
            id: 7,
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                isCurrencyConvertor: false,
                context: "Spot"
            },
            context: "Spot",
            friendlyName: "Gold/US Dollar",
            asset1: {
                id: 9,
                name: "Gold",
                abbreviationSymbol: "XAU",
                assetType: "Commodity",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "High",
            blockchainAdress: "0xcccccccccccccccccccccccccccccccccccccccc",
            blockchain: "Traditional"
        },
        {
            id: 8,
            exchange: {
                id: 3,
                name: "Bybit",
                isCurrencyConvertor: true,
                context: "Futures"
            },
            context: "Futures",
            friendlyName: "Tesla Stock/US Dollar",
            asset1: {
                id: 10,
                name: "Tesla Stock",
                abbreviationSymbol: "TSLA",
                assetType: "Stock",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            tradingFeeLevel: "Medium",
            blockchainAdress: "0xdddddddddddddddddddddddddddddddddddddddd",
            blockchain: "Traditional"
        }
    ];
} 

