// Order veri işleme fonksiyonları
export function handleOrderData(orders) {
    console.log("Order verisi alındı:", orders);
    
    orders.forEach(order => {
        console.log("Order ID:", order.id);
        console.log("Exchange Order ID:", order.exchangeOrderId);
        console.log("Pair:", order.pair);
        console.log("Exchange:", order.exchangeName);
        console.log("Direction:", order.direction);
        console.log("State:", order.state);
        console.log("Price:", order.price);
        console.log("Amount:", order.amount);
        console.log("Executed Amount:", order.executedAmount);
        console.log("Is Demo:", order.isDemo);
        console.log("Is Manual:", order.isManual);
    });
    
    // DOM'u güncelle
    updateOrderDisplay(orders);
    updateOrderStatistics(orders);
}

// OrderDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateOrderDisplay(data) {
    console.log("OrderDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// OrderStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateOrderStatistics(data) {
    console.log("OrderStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}


// Kar/Zarar hesaplama
function calculateProfitLoss(order) {
    if (order.direction === 'Buy') {
        // Alış işlemi: Verilen miktar - Alınan miktar
        return order.takenAmount - (order.givenAmount * order.avgExecutedPrice);
    } else {
        // Satış işlemi: Alınan miktar - Verilen miktar
        return (order.givenAmount * order.avgExecutedPrice) - order.takenAmount;
    }
}

// Order detaylarını göster
export function showOrderDetails(orderId) {
    console.log("Order detayları gösteriliyor:", orderId);
    // Modal implementasyonu burada olacak
}

// Order düzenle
export function editOrder(orderId) {
    console.log("Order düzenleniyor:", orderId);
    // Düzenleme implementasyonu burada olacak
}

// Order işlem yap
export function executeOrder(orderId) {
    console.log("Order işlem yapılıyor:", orderId);
    // İşlem implementasyonu burada olacak
}

// Order iptal et
export function cancelOrder(orderId) {
    console.log("Order iptal ediliyor:", orderId);
    // İptal implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showOrderDetails = showOrderDetails;
window.editOrder = editOrder;
window.executeOrder = executeOrder;
window.cancelOrder = cancelOrder;

// Yardımcı fonksiyonlar
function getOrderRowClass(state) {
    switch(state) {
        case 'Completed': return 'table-success';
        case 'Pending': return 'table-warning';
        case 'Cancelled': return 'table-danger';
        case 'Failed': return 'table-secondary';
        default: return '';
    }
}

function getDirectionBadgeClass(direction) {
    switch(direction) {
        case 'Buy': return 'bg-success';
        case 'Sell': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getDirectionText(direction) {
    switch(direction) {
        case 'Buy': return 'Alış';
        case 'Sell': return 'Satış';
        default: return direction || 'Bilinmeyen';
    }
}

function getOrderTypeBadgeClass(orderType) {
    switch(orderType) {
        case 'Limit': return 'bg-primary';
        case 'Market': return 'bg-warning';
        case 'StopLoss': return 'bg-danger';
        case 'TakeProfit': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function getOrderTypeText(orderType) {
    switch(orderType) {
        case 'Limit': return 'Limit';
        case 'Market': return 'Piyasa';
        case 'StopLoss': return 'Stop Loss';
        case 'TakeProfit': return 'Take Profit';
        default: return orderType || 'Bilinmeyen';
    }
}

function getOrderStateBadgeClass(state) {
    switch(state) {
        case 'Pending': return 'bg-warning';
        case 'Completed': return 'bg-success';
        case 'Cancelled': return 'bg-danger';
        case 'Failed': return 'bg-secondary';
        case 'PartiallyFilled': return 'bg-info';
        default: return 'bg-dark';
    }
}

function getOrderStateText(state) {
    switch(state) {
        case 'Pending': return 'Bekliyor';
        case 'Completed': return 'Tamamlandı';
        case 'Cancelled': return 'İptal Edildi';
        case 'Failed': return 'Başarısız';
        case 'PartiallyFilled': return 'Kısmi Dolu';
        default: return state || 'Bilinmeyen';
    }
}
// Örnek order verisi
export function getSampleOrderData() {
    return [
        {
            id: 1,
            exchangeOrderId: "binance_12345",
            exchangeClientId: "client_001",
            pair: "BTC/USDT",
            exchangeName: "Binance",
            arbitrageId: 1001,
            executionMethod: "Automatic",
            orderType: "Limit",
            direction: "Buy",
            state: "Completed",
            price: 45000.50,
            amount: 0.1,
            executedAmount: 0.1,
            avgExecutedPrice: 45000.50,
            timestamp: Date.now() / 1000 - 3600, // 1 saat önce
            finishedAt: Date.now() / 1000 - 3500,
            durationUs: 500000, // 0.5 saniye
            tradingFee: 0.001,
            startingBalanceAsset1Amount: 0.0,
            startingBalanceAsset2Amount: 5000.0,
            finishingBalanceAsset1Amount: 0.1,
            finishingBalanceAsset2Amount: 499.95,
            givenAmount: 4500.05,
            givenCurrency: "USDT",
            takenAmount: 0.1,
            takenCurrency: "BTC",
            errorMessage: null,
            description: "Arbitraj işlemi - BTC alış",
            isDemo: false,
            isManual: false,
            isSent: true,
            manualOperationCompleted: true
        },
        {
            id: 2,
            exchangeOrderId: "coinbase_67890",
            exchangeClientId: "client_002",
            pair: "ETH/USD",
            exchangeName: "Coinbase Pro",
            arbitrageId: 1001,
            executionMethod: "Automatic",
            orderType: "Market",
            direction: "Sell",
            state: "Completed",
            price: 3000.25,
            amount: 1.5,
            executedAmount: 1.5,
            avgExecutedPrice: 3000.25,
            timestamp: Date.now() / 1000 - 1800, // 30 dakika önce
            finishedAt: Date.now() / 1000 - 1790,
            durationUs: 100000, // 0.1 saniye
            tradingFee: 0.005,
            startingBalanceAsset1Amount: 1.5,
            startingBalanceAsset2Amount: 0.0,
            finishingBalanceAsset1Amount: 0.0,
            finishingBalanceAsset2Amount: 4499.625,
            givenAmount: 1.5,
            givenCurrency: "ETH",
            takenAmount: 4499.625,
            takenCurrency: "USD",
            errorMessage: null,
            description: "Arbitraj işlemi - ETH satış",
            isDemo: false,
            isManual: false,
            isSent: true,
            manualOperationCompleted: true
        },
        {
            id: 3,
            exchangeOrderId: "bybit_11111",
            exchangeClientId: "client_003",
            pair: "BTC/USDT",
            exchangeName: "Bybit",
            arbitrageId: null,
            executionMethod: "Manual",
            orderType: "Limit",
            direction: "Buy",
            state: "Pending",
            price: 44000.00,
            amount: 0.05,
            executedAmount: 0.0,
            avgExecutedPrice: 0.0,
            timestamp: Date.now() / 1000 - 300, // 5 dakika önce
            finishedAt: null,
            durationUs: null,
            tradingFee: 0.0,
            startingBalanceAsset1Amount: 0.0,
            startingBalanceAsset2Amount: 2500.0,
            finishingBalanceAsset1Amount: 0.0,
            finishingBalanceAsset2Amount: 2500.0,
            givenAmount: 0.0,
            givenCurrency: "USDT",
            takenAmount: 0.0,
            takenCurrency: "BTC",
            errorMessage: null,
            description: "Manuel BTC alış emri",
            isDemo: true,
            isManual: true,
            isSent: false,
            manualOperationCompleted: false
        },
        {
            id: 4,
            exchangeOrderId: "kraken_22222",
            exchangeClientId: "client_004",
            pair: "EUR/USD",
            exchangeName: "Kraken",
            arbitrageId: 1002,
            executionMethod: "Automatic",
            orderType: "StopLoss",
            direction: "Sell",
            state: "Cancelled",
            price: 1.0800,
            amount: 1000.0,
            executedAmount: 0.0,
            avgExecutedPrice: 0.0,
            timestamp: Date.now() / 1000 - 7200, // 2 saat önce
            finishedAt: Date.now() / 1000 - 7000,
            durationUs: 2000000, // 2 saniye
            tradingFee: 0.0,
            startingBalanceAsset1Amount: 1000.0,
            startingBalanceAsset2Amount: 0.0,
            finishingBalanceAsset1Amount: 1000.0,
            finishingBalanceAsset2Amount: 0.0,
            givenAmount: 0.0,
            givenCurrency: "EUR",
            takenAmount: 0.0,
            takenCurrency: "USD",
            errorMessage: "Fiyat hedefine ulaşılamadı",
            description: "Stop loss emri - iptal edildi",
            isDemo: false,
            isManual: false,
            isSent: true,
            manualOperationCompleted: true
        },
        {
            id: 5,
            exchangeOrderId: "deribit_33333",
            exchangeClientId: "client_005",
            pair: "ADA/USD",
            exchangeName: "Deribit",
            arbitrageId: null,
            executionMethod: "Manual",
            orderType: "TakeProfit",
            direction: "Sell",
            state: "Failed",
            price: 0.85,
            amount: 5000.0,
            executedAmount: 0.0,
            avgExecutedPrice: 0.0,
            timestamp: Date.now() / 1000 - 600, // 10 dakika önce
            finishedAt: Date.now() / 1000 - 580,
            durationUs: 20000000, // 20 saniye
            tradingFee: 0.0,
            startingBalanceAsset1Amount: 5000.0,
            startingBalanceAsset2Amount: 0.0,
            finishingBalanceAsset1Amount: 5000.0,
            finishingBalanceAsset2Amount: 0.0,
            givenAmount: 0.0,
            givenCurrency: "ADA",
            takenAmount: 0.0,
            takenCurrency: "USD",
            errorMessage: "Yetersiz bakiye",
            description: "Take profit emri - başarısız",
            isDemo: true,
            isManual: true,
            isSent: true,
            manualOperationCompleted: false
        }
    ];
} 

