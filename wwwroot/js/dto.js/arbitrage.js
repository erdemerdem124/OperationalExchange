// Arbitrage veri işleme fonksiyonları
export function handleArbitrageData(arbitrages) {
    console.log("Arbitrage verisi alındı:", arbitrages);
    
    arbitrages.forEach(arb => {
        console.log("ID:", arb.id);
        console.log("Friendly ID:", arb.friendlyId);
        console.log("Is Finalized:", arb.isFinalized);
        console.log("Is Successful:", arb.isSuccessful);
        console.log("Realized Return:", arb.realizedReturn);
        console.log("Trading Path:", arb.tradingPath);
    });
    
    // DOM'u güncelle
    updateArbitrageDisplay(arbitrages);
    updateArbitrageStatistics(arbitrages);
}

// Arbitrage display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateArbitrageDisplay(arbitrages) {
    console.log("Arbitrage verisi alındı, modüler yapı için hazır:", arbitrages);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Arbitrage istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateArbitrageStatistics(arbitrages) {
    console.log("Arbitrage istatistikleri hesaplandı, modüler yapı için hazır:", arbitrages);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Arbitrage order detaylarını göster
export function showArbitrageOrders(arbitrageId) {
    console.log("Arbitrage order detayları gösteriliyor:", arbitrageId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyon olarak da ekle (HTML'den çağrılabilir)
window.showArbitrageOrders = showArbitrageOrders;

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterArbitrages(arbitrages, filters) { ... } - KALDIRILDI

// Örnek arbitrage verisi
export function getSampleArbitrageData() {
    return [
        {
            "id": 1,
            "friendlyId": "ARB-BTC-ETH-USDT-20240318-001",
            "dateAdded": "2024-03-18T10:30:45.123Z",
            "orders": [
                {
                    "id": 101,
                    "symbol": "BTC/USDT",
                    "side": "Buy",
                    "quantity": 0.5,
                    "price": 45000.00,
                    "status": "Filled",
                    "exchange": "Binance"
                },
                {
                    "id": 102,
                    "symbol": "ETH/BTC",
                    "side": "Buy",
                    "quantity": 8.5,
                    "price": 0.032,
                    "status": "Filled",
                    "exchange": "Coinbase"
                },
                {
                    "id": 103,
                    "symbol": "ETH/USDT",
                    "side": "Sell",
                    "quantity": 8.5,
                    "price": 1450.00,
                    "status": "Filled",
                    "exchange": "Kraken"
                }
            ],
            "tradingPath": "USDT → BTC → ETH → USDT",
            "realizedReturn": 125.50,
            "realizedReturnRatio": 0.0028,
            "totalDurationUs": 1500000,
            "marketRiskDurationUs": 750000,
            "isDemo": false,
            "isFinalized": true,
            "isSuccessful": true
        },
        {
            "id": 2,
            "friendlyId": "ARB-ETH-ADA-USDT-20240318-002",
            "dateAdded": "2024-03-18T11:15:22.456Z",
            "orders": [
                {
                    "id": 201,
                    "symbol": "ETH/USDT",
                    "side": "Buy",
                    "quantity": 2.0,
                    "price": 1445.00,
                    "status": "Filled",
                    "exchange": "Binance"
                },
                {
                    "id": 202,
                    "symbol": "ADA/ETH",
                    "side": "Buy",
                    "quantity": 5000,
                    "price": 0.00015,
                    "status": "Filled",
                    "exchange": "Coinbase"
                },
                {
                    "id": 203,
                    "symbol": "ADA/USDT",
                    "side": "Sell",
                    "quantity": 5000,
                    "price": 0.22,
                    "status": "Filled",
                    "exchange": "Kraken"
                }
            ],
            "tradingPath": "USDT → ETH → ADA → USDT",
            "realizedReturn": 89.75,
            "realizedReturnRatio": 0.0031,
            "totalDurationUs": 2200000,
            "marketRiskDurationUs": 1100000,
            "isDemo": true,
            "isFinalized": true,
            "isSuccessful": true
        },
        {
            "id": 3,
            "friendlyId": "ARB-BTC-LTC-USDT-20240318-003",
            "dateAdded": "2024-03-18T12:45:33.789Z",
            "orders": [
                {
                    "id": 301,
                    "symbol": "BTC/USDT",
                    "side": "Buy",
                    "quantity": 0.25,
                    "price": 45100.00,
                    "status": "Filled",
                    "exchange": "Binance"
                },
                {
                    "id": 302,
                    "symbol": "LTC/BTC",
                    "side": "Buy",
                    "quantity": 25,
                    "price": 0.0042,
                    "status": "Filled",
                    "exchange": "Coinbase"
                },
                {
                    "id": 303,
                    "symbol": "LTC/USDT",
                    "side": "Sell",
                    "quantity": 25,
                    "price": 190.50,
                    "status": "Filled",
                    "exchange": "Kraken"
                }
            ],
            "tradingPath": "USDT → BTC → LTC → USDT",
            "realizedReturn": -15.25,
            "realizedReturnRatio": -0.0013,
            "totalDurationUs": 1800000,
            "marketRiskDurationUs": 900000,
            "isDemo": false,
            "isFinalized": true,
            "isSuccessful": false
        },
        {
            "id": 4,
            "friendlyId": "ARB-ETH-DOT-USDT-20240318-004",
            "dateAdded": "2024-03-18T14:20:15.321Z",
            "orders": [
                {
                    "id": 401,
                    "symbol": "ETH/USDT",
                    "side": "Buy",
                    "quantity": 1.5,
                    "price": 1448.00,
                    "status": "Filled",
                    "exchange": "Binance"
                },
                {
                    "id": 402,
                    "symbol": "DOT/ETH",
                    "side": "Buy",
                    "quantity": 150,
                    "price": 0.0085,
                    "status": "Filled",
                    "exchange": "Coinbase"
                },
                {
                    "id": 403,
                    "symbol": "DOT/USDT",
                    "side": "Sell",
                    "quantity": 150,
                    "price": 12.25,
                    "status": "Filled",
                    "exchange": "Kraken"
                }
            ],
            "tradingPath": "USDT → ETH → DOT → USDT",
            "realizedReturn": 67.80,
            "realizedReturnRatio": 0.0031,
            "totalDurationUs": 1600000,
            "marketRiskDurationUs": 800000,
            "isDemo": false,
            "isFinalized": false,
            "isSuccessful": null
        },
        {
            "id": 5,
            "friendlyId": "ARB-BTC-XRP-USDT-20240318-005",
            "dateAdded": "2024-03-18T15:10:45.654Z",
            "orders": [
                {
                    "id": 501,
                    "symbol": "BTC/USDT",
                    "side": "Buy",
                    "quantity": 0.1,
                    "price": 45200.00,
                    "status": "Filled",
                    "exchange": "Binance"
                },
                {
                    "id": 502,
                    "symbol": "XRP/BTC",
                    "side": "Buy",
                    "quantity": 5000,
                    "price": 0.000022,
                    "status": "Filled",
                    "exchange": "Coinbase"
                },
                {
                    "id": 503,
                    "symbol": "XRP/USDT",
                    "side": "Sell",
                    "quantity": 5000,
                    "price": 0.98,
                    "status": "Filled",
                    "exchange": "Kraken"
                }
            ],
            "tradingPath": "USDT → BTC → XRP → USDT",
            "realizedReturn": 45.20,
            "realizedReturnRatio": 0.0010,
            "totalDurationUs": 1200000,
            "marketRiskDurationUs": 600000,
            "isDemo": true,
            "isFinalized": true,
            "isSuccessful": true
        }
    ];
} 

