// Trade Action veri işleme fonksiyonları
export function handleTradeActionData(tradeActions) {
    console.log("Trade Action verisi alındı:", tradeActions);
    
    tradeActions.forEach(action => {
        console.log("Trade Action ID:", action.id);
        console.log("Pair:", action.pair?.friendlyName);
        console.log("Direction:", action.direction);
        console.log("Trade Order:", action.tradeOrder);
        console.log("Is Starter:", action.isStarter);
        console.log("Starting Asset:", action.startingAsset?.name);
        console.log("Finishing Asset:", action.finishingAsset?.name);
        console.log("Starting Exchange:", action.startingExchange?.name);
        console.log("Finishing Exchange:", action.finishingExchange?.name);
    });
    
    // DOM'u güncelle
    updateTradeActionDisplay(tradeActions);
    updateTradeActionStatistics(tradeActions);
}

// TradeActionDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradeActionDisplay(data) {
    console.log("TradeActionDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// TradeActionStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradeActionStatistics(data) {
    console.log("TradeActionStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Trade Action detaylarını göster
export function showTradeActionDetails(actionId) {
    console.log("Trade Action detayları gösteriliyor:", actionId);
    // Modal implementasyonu burada olacak
}

// Trade Action düzenle
export function editTradeAction(actionId) {
    console.log("Trade Action düzenleniyor:", actionId);
    // Düzenleme implementasyonu burada olacak
}

// Trade Action işlem yap
export function executeTradeAction(actionId) {
    console.log("Trade Action işlem yapılıyor:", actionId);
    // İşlem implementasyonu burada olacak
}

// Trade sırasını başlat
export function startTradeSequence(actionId) {
    console.log("Trade sırası başlatılıyor:", actionId);
    // Sıra başlatma implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showTradeActionDetails = showTradeActionDetails;
window.editTradeAction = editTradeAction;
window.executeTradeAction = executeTradeAction;
window.startTradeSequence = startTradeSequence;

// Yardımcı fonksiyonlar
function getDirectionBadgeClass(direction) {
    switch(direction) {
        case 'Buy': return 'bg-success';
        case 'Sell': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getDirectionText(direction) {
    switch(direction) {
        case 'Buy': return 'Alış (Long)';
        case 'Sell': return 'Satış (Short)';
        default: return direction || 'Bilinmeyen';
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


// Örnek trade action verisi
export function getSampleTradeActionData() {
    return [
        {
            id: 1,
            pair: {
                id: 1,
                friendlyName: "Bitcoin/US Dollar",
                asset1: { abbreviationSymbol: "BTC", assetType: "Crypto" },
                asset2: { abbreviationSymbol: "USD", assetType: "Forex" }
            },
            direction: "Buy",
            tradeOrder: 1,
            isStarter: true,
            startingAsset: {
                id: 1,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex"
            },
            finishingAsset: {
                id: 2,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto"
            },
            startingExchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            },
            finishingExchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            }
        },
        {
            id: 2,
            pair: {
                id: 2,
                friendlyName: "Ethereum/US Dollar",
                asset1: { abbreviationSymbol: "ETH", assetType: "Crypto" },
                asset2: { abbreviationSymbol: "USD", assetType: "Forex" }
            },
            direction: "Sell",
            tradeOrder: 2,
            isStarter: false,
            startingAsset: {
                id: 2,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto"
            },
            finishingAsset: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto"
            },
            startingExchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            },
            finishingExchange: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            }
        },
        {
            id: 3,
            pair: {
                id: 3,
                friendlyName: "Ethereum/US Dollar",
                asset1: { abbreviationSymbol: "ETH", assetType: "Crypto" },
                asset2: { abbreviationSymbol: "USD", assetType: "Forex" }
            },
            direction: "Sell",
            tradeOrder: 3,
            isStarter: false,
            startingAsset: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto"
            },
            finishingAsset: {
                id: 1,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex"
            },
            startingExchange: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            },
            finishingExchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            }
        },
        {
            id: 4,
            pair: {
                id: 4,
                friendlyName: "Euro/US Dollar",
                asset1: { abbreviationSymbol: "EUR", assetType: "Forex" },
                asset2: { abbreviationSymbol: "USD", assetType: "Forex" }
            },
            direction: "Buy",
            tradeOrder: 1,
            isStarter: true,
            startingAsset: {
                id: 1,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex"
            },
            finishingAsset: {
                id: 4,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex"
            },
            startingExchange: {
                id: 3,
                name: "Bybit",
                context: "Futures"
            },
            finishingExchange: {
                id: 3,
                name: "Bybit",
                context: "Futures"
            }
        },
        {
            id: 5,
            pair: {
                id: 5,
                friendlyName: "Cardano/US Dollar",
                asset1: { abbreviationSymbol: "ADA", assetType: "Crypto" },
                asset2: { abbreviationSymbol: "USD", assetType: "Forex" }
            },
            direction: "Sell",
            tradeOrder: 2,
            isStarter: false,
            startingAsset: {
                id: 4,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex"
            },
            finishingAsset: {
                id: 5,
                name: "Cardano",
                abbreviationSymbol: "ADA",
                assetType: "Crypto"
            },
            startingExchange: {
                id: 3,
                name: "Bybit",
                context: "Futures"
            },
            finishingExchange: {
                id: 4,
                name: "Kraken",
                context: "Spot"
            }
        }
    ];
} 

