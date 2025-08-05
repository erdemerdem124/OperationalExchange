// Arbitrage Opportunity veri işleme fonksiyonları
export function handleArbitrageOpportunityData(opportunities) {
    console.log("Arbitrage Opportunity verisi alındı:", opportunities);
    
    opportunities.forEach(opp => {
        console.log("ID:", opp.id);
        console.log("Expected Return Ratio:", opp.expectedReturnRatio);
        console.log("Realised Return:", opp.realisedReturn);
        console.log("Life Span:", opp.lifeSpan);
    });
    
    // DOM'u güncelle
    updateArbitrageOpportunityDisplay(opportunities);
    updateArbitrageOpportunityStatistics(opportunities);
}

// Arbitrage Opportunity display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateArbitrageOpportunityDisplay(opportunities) {
    console.log("Arbitrage Opportunity verisi alındı, modüler yapı için hazır:", opportunities);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Arbitrage Opportunity istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateArbitrageOpportunityStatistics(opportunities) {
    console.log("Arbitrage Opportunity istatistikleri hesaplandı, modüler yapı için hazır:", opportunities);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Süreyi formatla (mikrosaniye cinsinden)
function formatDuration(microseconds) {
    const seconds = Math.floor(microseconds / 1000000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}s ${minutes % 60}d ${seconds % 60}sn`;
    } else if (minutes > 0) {
        return `${minutes}d ${seconds % 60}sn`;
    } else {
        return `${seconds}sn`;
    }
}

// Arbitrage Opportunity detaylarını göster
export function showArbitrageOpportunityDetails(opportunityId) {
    console.log("Arbitrage Opportunity detayları gösteriliyor:", opportunityId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyon olarak da ekle (HTML'den çağrılabilir)
window.showArbitrageOpportunityDetails = showArbitrageOpportunityDetails;

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterArbitrageOpportunities(opportunities, filters) { ... } - KALDIRILDI

// Örnek arbitrage opportunity verisi
export function getSampleArbitrageOpportunityData() {
    return [
        {
            "id": 1,
            "usdVolume": {
                "amount": 10000.00,
                "currency": "USD"
            },
            "coinVolume": {
                "amount": 0.25,
                "currency": "BTC"
            },
            "estimatedMarketDirection": 0.05,
            "laggingStep": {
                "id": 1,
                "action": "Buy",
                "exchange": "Binance"
            },
            "arbitrageCalculation": {
                "method": "Simple",
                "parameters": {}
            },
            "returnCalculation": "Percentage",
            "path": {
                "id": 1,
                "steps": [
                    {"exchange": "Binance", "pair": "BTC/USDT"},
                    {"exchange": "Coinbase", "pair": "ETH/BTC"},
                    {"exchange": "Kraken", "pair": "ETH/USDT"}
                ]
            },
            "startingVolume": {
                "amount": 10000.00,
                "currency": "USD"
            },
            "prices": [45000.00, 0.032, 1450.00],
            "limitProfitablePrices": [44900.00, 0.0315, 1445.00],
            "expectedReturnRatio": 0.0028,
            "realisedReturn": 28.00,
            "lifeSpan": 1500000
        },
        {
            "id": 2,
            "usdVolume": {
                "amount": 5000.00,
                "currency": "USD"
            },
            "coinVolume": {
                "amount": 2.0,
                "currency": "ETH"
            },
            "estimatedMarketDirection": -0.02,
            "laggingStep": {
                "id": 2,
                "action": "Sell",
                "exchange": "Coinbase"
            },
            "arbitrageCalculation": {
                "method": "Advanced",
                "parameters": {}
            },
            "returnCalculation": "Absolute",
            "path": {
                "id": 2,
                "steps": [
                    {"exchange": "Binance", "pair": "ETH/USDT"},
                    {"exchange": "Coinbase", "pair": "ADA/ETH"},
                    {"exchange": "Kraken", "pair": "ADA/USDT"}
                ]
            },
            "startingVolume": {
                "amount": 5000.00,
                "currency": "USD"
            },
            "prices": [1445.00, 0.00015, 0.22],
            "limitProfitablePrices": [1440.00, 0.00014, 0.21],
            "expectedReturnRatio": 0.0031,
            "realisedReturn": 15.50,
            "lifeSpan": 2200000
        },
        {
            "id": 3,
            "usdVolume": {
                "amount": 7500.00,
                "currency": "USD"
            },
            "coinVolume": {
                "amount": 25,
                "currency": "LTC"
            },
            "estimatedMarketDirection": 0.01,
            "laggingStep": {
                "id": 3,
                "action": "Buy",
                "exchange": "Binance"
            },
            "arbitrageCalculation": {
                "method": "Simple",
                "parameters": {}
            },
            "returnCalculation": "Percentage",
            "path": {
                "id": 3,
                "steps": [
                    {"exchange": "Binance", "pair": "BTC/USDT"},
                    {"exchange": "Coinbase", "pair": "LTC/BTC"},
                    {"exchange": "Kraken", "pair": "LTC/USDT"}
                ]
            },
            "startingVolume": {
                "amount": 7500.00,
                "currency": "USD"
            },
            "prices": [45100.00, 0.0042, 190.50],
            "limitProfitablePrices": [45000.00, 0.0041, 189.00],
            "expectedReturnRatio": -0.0013,
            "realisedReturn": -9.75,
            "lifeSpan": 1800000
        },
        {
            "id": 4,
            "usdVolume": {
                "amount": 12000.00,
                "currency": "USD"
            },
            "coinVolume": {
                "amount": 150,
                "currency": "DOT"
            },
            "estimatedMarketDirection": 0.03,
            "laggingStep": {
                "id": 4,
                "action": "Buy",
                "exchange": "Coinbase"
            },
            "arbitrageCalculation": {
                "method": "Advanced",
                "parameters": {}
            },
            "returnCalculation": "Absolute",
            "path": {
                "id": 4,
                "steps": [
                    {"exchange": "Binance", "pair": "ETH/USDT"},
                    {"exchange": "Coinbase", "pair": "DOT/ETH"},
                    {"exchange": "Kraken", "pair": "DOT/USDT"}
                ]
            },
            "startingVolume": {
                "amount": 12000.00,
                "currency": "USD"
            },
            "prices": [1448.00, 0.0085, 12.25],
            "limitProfitablePrices": [1440.00, 0.0083, 12.00],
            "expectedReturnRatio": 0.0031,
            "realisedReturn": 37.20,
            "lifeSpan": 1600000
        },
        {
            "id": 5,
            "usdVolume": {
                "amount": 3000.00,
                "currency": "USD"
            },
            "coinVolume": {
                "amount": 5000,
                "currency": "XRP"
            },
            "estimatedMarketDirection": -0.01,
            "laggingStep": {
                "id": 5,
                "action": "Sell",
                "exchange": "Kraken"
            },
            "arbitrageCalculation": {
                "method": "Simple",
                "parameters": {}
            },
            "returnCalculation": "Percentage",
            "path": {
                "id": 5,
                "steps": [
                    {"exchange": "Binance", "pair": "BTC/USDT"},
                    {"exchange": "Coinbase", "pair": "XRP/BTC"},
                    {"exchange": "Kraken", "pair": "XRP/USDT"}
                ]
            },
            "startingVolume": {
                "amount": 3000.00,
                "currency": "USD"
            },
            "prices": [45200.00, 0.000022, 0.98],
            "limitProfitablePrices": [45100.00, 0.000021, 0.97],
            "expectedReturnRatio": 0.0010,
            "realisedReturn": 3.00,
            "lifeSpan": 1200000
        }
    ];
} 

