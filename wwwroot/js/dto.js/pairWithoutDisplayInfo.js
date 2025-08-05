// Pair Without Display Info veri işleme fonksiyonları
export function handlePairWithoutDisplayInfoData(pairs) {
    console.log("Pair Without Display Info verisi alındı:", pairs);
    
    pairs.forEach(pair => {
        console.log("Pair ID:", pair.id);
        console.log("Friendly Name:", pair.friendlyName);
        console.log("Exchange:", pair.exchange?.name);
        console.log("Context:", pair.context);
        console.log("Asset1:", pair.asset1?.name);
        console.log("Asset2:", pair.asset2?.name);
        console.log("Trading Fee Level:", pair.tradingFeeLevel);
        console.log("Blockchain:", pair.blockchain);
        console.log("Asset1 Display Info:", pair.asset1?.displayFormatInfo ? 'Var' : 'Yok');
        console.log("Asset2 Display Info:", pair.asset2?.displayFormatInfo ? 'Var' : 'Yok');
    });
    
    // DOM'u güncelle
    updatePairWithoutDisplayInfoDisplay(pairs);
    updatePairWithoutDisplayInfoStatistics(pairs);
}

// PairWithoutDisplayInfoDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePairWithoutDisplayInfoDisplay(data) {
    console.log("PairWithoutDisplayInfoDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// PairWithoutDisplayInfoStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePairWithoutDisplayInfoStatistics(data) {
    console.log("PairWithoutDisplayInfoStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Pair Without Display Info detaylarını göster
export function showPairWithoutDisplayInfoDetails(pairId) {
    console.log("Pair Without Display Info detayları gösteriliyor:", pairId);
    // Modal implementasyonu burada olacak
}

// Pair Without Display Info düzenle
export function editPairWithoutDisplayInfo(pairId) {
    console.log("Pair Without Display Info düzenleniyor:", pairId);
    // Düzenleme implementasyonu burada olacak
}

// Pair Without Display Info konfigüre et
export function configurePairWithoutDisplayInfo(pairId) {
    console.log("Pair Without Display Info konfigüre ediliyor:", pairId);
    // Konfigürasyon implementasyonu burada olacak
}

// Display Info ekle
export function addDisplayInfo(pairId) {
    console.log("Display Info ekleniyor:", pairId);
    // Display Info ekleme implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showPairWithoutDisplayInfoDetails = showPairWithoutDisplayInfoDetails;
window.editPairWithoutDisplayInfo = editPairWithoutDisplayInfo;
window.configurePairWithoutDisplayInfo = configurePairWithoutDisplayInfo;
window.addDisplayInfo = addDisplayInfo;

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


// Örnek pair without display info verisi
export function getSamplePairWithoutDisplayInfoData() {
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
            friendlyName: "Bitcoin/Turkish Lira (Display Info Yok)",
            asset1: {
                id: 1,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
            },
            asset2: {
                id: 2,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
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
            friendlyName: "Ethereum/US Dollar (Kısmi Display Info)",
            asset1: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: {
                    currencySymbol: "$",
                    decimalPlaces: 2,
                    thousandsSeparator: ",",
                    decimalSeparator: "."
                } // Display Info var
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
            friendlyName: "Euro/US Dollar (Tam Display Info)",
            asset1: {
                id: 5,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: {
                    currencySymbol: "€",
                    decimalPlaces: 2,
                    thousandsSeparator: ".",
                    decimalSeparator: ","
                } // Display Info var
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: {
                    currencySymbol: "$",
                    decimalPlaces: 2,
                    thousandsSeparator: ",",
                    decimalSeparator: "."
                } // Display Info var
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
            friendlyName: "Turkish Lira/US Dollar (Display Info Yok)",
            asset1: {
                id: 2,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
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
            friendlyName: "Cardano/US Dollar (Display Info Yok)",
            asset1: {
                id: 6,
                name: "Cardano",
                abbreviationSymbol: "ADA",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
            },
            asset2: {
                id: 4,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00"),
                displayFormatInfo: null // Display Info yok
            },
            tradingFeeLevel: "VIP",
            blockchainAdress: "0x5555555555555555555555555555555555555555",
            blockchain: "Cardano"
        }
    ];
} 

