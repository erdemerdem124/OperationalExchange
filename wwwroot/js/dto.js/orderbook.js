// Orderbook veri işleme fonksiyonları
export function handleOrderbookData(orderbooks) {
    console.log("Orderbook verisi alındı:", orderbooks);
    
    orderbooks.forEach(orderbook => {
        console.log("Timestamp:", orderbook.timeStamp);
        console.log("Pair:", orderbook.pair?.name);
        console.log("Exchange:", orderbook.exchange?.name);
        console.log("Asks count:", Object.keys(orderbook.asks || {}).length);
        console.log("Bids count:", Object.keys(orderbook.bids || {}).length);
        console.log("Ask Change:", orderbook.askChange);
        console.log("Bid Change:", orderbook.bidChange);
        console.log("Mid Change:", orderbook.midChange);
    });
    
    // DOM'u güncelle
    updateOrderbookDisplay(orderbooks);
    updateOrderbookStatistics(orderbooks);
}

// OrderbookDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateOrderbookDisplay(data) {
    console.log("OrderbookDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// OrderbookStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateOrderbookStatistics(data) {
    console.log("OrderbookStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Orderbook detaylarını göster
export function showOrderbookDetails(orderbookIndex) {
    console.log("Orderbook detayları gösteriliyor:", orderbookIndex);
    // Modal implementasyonu burada olacak
}

// Orderbook derinliğini göster
export function showOrderbookDepth(orderbookIndex) {
    console.log("Orderbook derinliği gösteriliyor:", orderbookIndex);
    // Derinlik grafiği implementasyonu burada olacak
}

// Orderbook analiz et
export function analyzeOrderbook(orderbookIndex) {
    console.log("Orderbook analiz ediliyor:", orderbookIndex);
    // Analiz implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showOrderbookDetails = showOrderbookDetails;
window.showOrderbookDepth = showOrderbookDepth;
window.analyzeOrderbook = analyzeOrderbook;

// Yardımcı fonksiyonlar
function formatTimestamp(timestamp) {
    const date = new Date(timestamp * 1000); // Unix timestamp'i milisaniyeye çevir
    return date.toLocaleString('tr-TR');
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

// Örnek orderbook verisi
export function getSampleOrderbookData() {
    return [
        {
            timeStamp: Math.floor(Date.now() / 1000) - 300, // 5 dakika önce
            asks: {
                45000.50: 0.5,
                45001.00: 1.2,
                45001.50: 0.8,
                45002.00: 2.1,
                45002.50: 1.5
            },
            bids: {
                44999.50: 0.7,
                44999.00: 1.3,
                44998.50: 0.9,
                44998.00: 1.8,
                44997.50: 1.1
            },
            pair: {
                id: 1,
                name: "Bitcoin/Turkish Lira",
                abbreviationSymbol: "BTC/TRY",
                baseAsset: "BTC",
                quoteAsset: "TRY"
            },
            exchange: {
                id: 1,
                name: "Binance",
                isCurrencyConvertor: true,
                context: "Spot"
            },
            isUpdateData: false,
            askChange: 0.0025,
            bidChange: -0.0018,
            midChange: 0.0003
        },
        {
            timeStamp: Math.floor(Date.now() / 1000) - 180, // 3 dakika önce
            asks: {
                3000.25: 2.5,
                3000.50: 1.8,
                3000.75: 3.2,
                3001.00: 1.5,
                3001.25: 2.8
            },
            bids: {
                2999.75: 2.1,
                2999.50: 1.9,
                2999.25: 3.5,
                2998.75: 2.2,
                2998.50: 1.7
            },
            pair: {
                id: 2,
                name: "Ethereum/US Dollar",
                abbreviationSymbol: "ETH/USD",
                baseAsset: "ETH",
                quoteAsset: "USD"
            },
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                isCurrencyConvertor: false,
                context: "Spot"
            },
            isUpdateData: true,
            askChange: -0.0012,
            bidChange: 0.0021,
            midChange: 0.0004
        },
        {
            timeStamp: Math.floor(Date.now() / 1000) - 120, // 2 dakika önce
            asks: {
                1.0850: 50000,
                1.0851: 75000,
                1.0852: 60000,
                1.0853: 80000,
                1.0854: 65000
            },
            bids: {
                1.0849: 55000,
                1.0848: 70000,
                1.0847: 65000,
                1.0846: 85000,
                1.0845: 60000
            },
            pair: {
                id: 3,
                name: "Euro/US Dollar",
                abbreviationSymbol: "EUR/USD",
                baseAsset: "EUR",
                quoteAsset: "USD"
            },
            exchange: {
                id: 3,
                name: "Bybit",
                isCurrencyConvertor: true,
                context: "Futures"
            },
            isUpdateData: false,
            askChange: 0.0001,
            bidChange: 0.0002,
            midChange: 0.0001
        },
        {
            timeStamp: Math.floor(Date.now() / 1000) - 60, // 1 dakika önce
            asks: {
                32.50: 1000,
                32.51: 1500,
                32.52: 1200,
                32.53: 1800,
                32.54: 1300
            },
            bids: {
                32.49: 1100,
                32.48: 1400,
                32.47: 1300,
                32.46: 1700,
                32.45: 1200
            },
            pair: {
                id: 4,
                name: "Turkish Lira/US Dollar",
                abbreviationSymbol: "TRY/USD",
                baseAsset: "TRY",
                quoteAsset: "USD"
            },
            exchange: {
                id: 4,
                name: "Kraken",
                isCurrencyConvertor: false,
                context: "Spot"
            },
            isUpdateData: true,
            askChange: -0.0050,
            bidChange: -0.0048,
            midChange: -0.0049
        },
        {
            timeStamp: Math.floor(Date.now() / 1000) - 30, // 30 saniye önce
            asks: {
                0.85: 100000,
                0.851: 150000,
                0.852: 120000,
                0.853: 180000,
                0.854: 130000
            },
            bids: {
                0.849: 110000,
                0.848: 140000,
                0.847: 130000,
                0.846: 170000,
                0.845: 120000
            },
            pair: {
                id: 5,
                name: "Cardano/US Dollar",
                abbreviationSymbol: "ADA/USD",
                baseAsset: "ADA",
                quoteAsset: "USD"
            },
            exchange: {
                id: 5,
                name: "Deribit",
                isCurrencyConvertor: true,
                context: "Options"
            },
            isUpdateData: false,
            askChange: 0.0015,
            bidChange: 0.0012,
            midChange: 0.0013
        }
    ];
} 

