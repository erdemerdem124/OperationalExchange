// Trading Path Group veri işleme fonksiyonları
export function handleTradingPathGroupData(tradingPathGroups) {
    console.log("Trading Path Group verisi alındı:", tradingPathGroups);
    
    tradingPathGroups.forEach(group => {
        console.log("Group ID:", group.id);
        console.log("Arbitrage Operation Type:", group.arbitrageOperationType);
        console.log("Order Number:", group.orderNumber);
        console.log("User Friendly String:", group.userFriendlyString);
        console.log("Profit Currency:", group.profitCurrency?.name);
        console.log("Unique Input String:", group.uniqueInputString);
        console.log("Starting Asset:", group.startingAsset?.name);
        console.log("Finishing Asset:", group.finishingAsset?.name);
    });
    
    // DOM'u güncelle
    updateTradingPathGroupDisplay(tradingPathGroups);
    updateTradingPathGroupStatistics(tradingPathGroups);
}

// TradingPathGroupDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathGroupDisplay(data) {
    console.log("TradingPathGroupDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// TradingPathGroupStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathGroupStatistics(data) {
    console.log("TradingPathGroupStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}
// Trading Path Group detaylarını göster
export function showTradingPathGroupDetails(groupId) {
    console.log("Trading Path Group detayları gösteriliyor:", groupId);
    // Modal implementasyonu burada olacak
}

// Trading Path Group düzenle
export function editTradingPathGroup(groupId) {
    console.log("Trading Path Group düzenleniyor:", groupId);
    // Düzenleme implementasyonu burada olacak
}

// Trading Path Group sırala
export function reorderTradingPathGroup(groupId) {
    console.log("Trading Path Group sıralanıyor:", groupId);
    // Sıralama implementasyonu burada olacak
}

// Trading Path Group test et
export function testTradingPathGroup(groupId) {
    console.log("Trading Path Group test ediliyor:", groupId);
    // Test implementasyonu burada olacak
}

// Trading Path Group analiz et
export function analyzeTradingPathGroup(groupId) {
    console.log("Trading Path Group analiz ediliyor:", groupId);
    // Analiz implementasyonu burada olacak
}

// Trading Path Group yollarını göster
export function showTradingPathGroupPaths(groupId) {
    console.log("Trading Path Group yolları gösteriliyor:", groupId);
    // Yol gösterimi implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showTradingPathGroupDetails = showTradingPathGroupDetails;
window.editTradingPathGroup = editTradingPathGroup;
window.reorderTradingPathGroup = reorderTradingPathGroup;
window.testTradingPathGroup = testTradingPathGroup;
window.analyzeTradingPathGroup = analyzeTradingPathGroup;
window.showTradingPathGroupPaths = showTradingPathGroupPaths;

// Yardımcı fonksiyonlar
function getOperationTypeBadgeClass(operationType) {
    switch(operationType) {
        case 'SpotArbitrage': return 'bg-success';
        case 'FuturesArbitrage': return 'bg-warning';
        case 'CrossExchangeArbitrage': return 'bg-info';
        case 'StatisticalArbitrage': return 'bg-primary';
        case 'TriangularArbitrage': return 'bg-purple';
        case 'PairsTrading': return 'bg-dark';
        case 'MergerArbitrage': return 'bg-secondary';
        default: return 'bg-light text-dark';
    }
}

function getOperationTypeText(operationType) {
    switch(operationType) {
        case 'SpotArbitrage': return 'Spot Arbitraj';
        case 'FuturesArbitrage': return 'Futures Arbitraj';
        case 'CrossExchangeArbitrage': return 'Cross Exchange';
        case 'StatisticalArbitrage': return 'İstatistiksel Arbitraj';
        case 'TriangularArbitrage': return 'Üçgen Arbitraj';
        case 'PairsTrading': return 'Çift Trading';
        case 'MergerArbitrage': return 'Birleşme Arbitrajı';
        default: return 'Bilinmeyen';
    }
}

function getAssetBadgeClass(assetType) {
    switch(assetType) {
        case 'Crypto': return 'bg-success';
        case 'Fiat': return 'bg-primary';
        case 'Stock': return 'bg-info';
        case 'Commodity': return 'bg-warning';
        case 'Forex': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getOrderNumberBadgeClass(orderNumber) {
    if (orderNumber <= 5) return 'bg-success';
    if (orderNumber <= 10) return 'bg-info';
    if (orderNumber <= 20) return 'bg-warning';
    return 'bg-danger';
}

function getRiskBadgeClass(riskLevel) {
    switch(riskLevel) {
        case 'Çok Düşük': return 'bg-success';
        case 'Düşük': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Yüksek': return 'bg-danger';
        case 'Çok Yüksek': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getComplexityBadgeClass(complexity) {
    switch(complexity) {
        case 'Basit': return 'bg-success';
        case 'Orta': return 'bg-info';
        case 'Karmaşık': return 'bg-warning';
        case 'Çok Karmaşık': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getPopularityBadgeClass(popularity) {
    switch(popularity) {
        case 'Çok Popüler': return 'bg-success';
        case 'Popüler': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Az Popüler': return 'bg-danger';
        case 'Nadir': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getTradingPathGroupRowClass(group) {
    const riskLevel = calculateRiskLevel(group);
    if (riskLevel === 'Çok Yüksek') return 'table-danger';
    if (riskLevel === 'Yüksek') return 'table-warning';
    return '';
}

function calculateRiskLevel(group) {
    let riskScore = 0;
    
    // Operasyon tipi riski
    switch(group.arbitrageOperationType) {
        case 'FuturesArbitrage': riskScore += 3;
        case 'StatisticalArbitrage': riskScore += 2;
        case 'TriangularArbitrage': riskScore += 2;
        case 'MergerArbitrage': riskScore += 3;
        case 'CrossExchangeArbitrage': riskScore += 1;
        case 'SpotArbitrage': riskScore += 0;
        case 'PairsTrading': riskScore += 1;
    }
    
    // Asset tipi riski
    const assets = [group.startingAsset, group.finishingAsset, group.profitCurrency];
    assets.forEach(asset => {
        if (asset?.assetType === 'Crypto') riskScore += 1;
        else if (asset?.assetType === 'Forex') riskScore += 2;
        else if (asset?.assetType === 'Commodity') riskScore += 1;
    });
    
    // Sıra numarası riski (yüksek sıra = daha az test edilmiş)
    if (group.orderNumber > 20) riskScore += 2;
    else if (group.orderNumber > 10) riskScore += 1;
    
    if (riskScore >= 8) return 'Çok Yüksek';
    if (riskScore >= 6) return 'Yüksek';
    if (riskScore >= 4) return 'Orta';
    if (riskScore >= 2) return 'Düşük';
    return 'Çok Düşük';
}

function calculateComplexity(group) {
    let complexityScore = 0;
    
    // Operasyon tipi karmaşıklığı
    switch(group.arbitrageOperationType) {
        case 'TriangularArbitrage': complexityScore += 3;
        case 'StatisticalArbitrage': complexityScore += 3;
        case 'MergerArbitrage': complexityScore += 2;
        case 'FuturesArbitrage': complexityScore += 2;
        case 'CrossExchangeArbitrage': complexityScore += 1;
        case 'PairsTrading': complexityScore += 1;
        case 'SpotArbitrage': complexityScore += 0;
    }
    
    // Asset çeşitliliği
    const uniqueAssets = new Set([
        group.startingAsset?.name,
        group.finishingAsset?.name,
        group.profitCurrency?.name
    ].filter(Boolean));
    
    if (uniqueAssets.size >= 3) complexityScore += 2;
    else if (uniqueAssets.size === 2) complexityScore += 1;
    
    if (complexityScore >= 5) return 'Çok Karmaşık';
    if (complexityScore >= 3) return 'Karmaşık';
    if (complexityScore >= 1) return 'Orta';
    return 'Basit';
}

function calculatePopularity(group) {
    let popularityScore = 0;
    
    // Operasyon tipi popülerliği
    switch(group.arbitrageOperationType) {
        case 'SpotArbitrage': popularityScore += 4;
        case 'CrossExchangeArbitrage': popularityScore += 3;
        case 'FuturesArbitrage': popularityScore += 2;
        case 'PairsTrading': popularityScore += 2;
        case 'TriangularArbitrage': popularityScore += 1;
        case 'StatisticalArbitrage': popularityScore += 1;
        case 'MergerArbitrage': popularityScore += 0;
    }
    
    // Asset popülerliği
    const popularAssets = ['BTC', 'ETH', 'USDT', 'USD', 'EUR'];
    const assets = [group.startingAsset?.name, group.finishingAsset?.name, group.profitCurrency?.name];
    assets.forEach(asset => {
        if (popularAssets.includes(asset)) popularityScore += 1;
    });
    
    // Sıra numarası popülerliği (düşük sıra = daha popüler)
    if (group.orderNumber <= 5) popularityScore += 2;
    else if (group.orderNumber <= 10) popularityScore += 1;
    
    if (popularityScore >= 8) return 'Çok Popüler';
    if (popularityScore >= 6) return 'Popüler';
    if (popularityScore >= 4) return 'Orta';
    if (popularityScore >= 2) return 'Az Popüler';
    return 'Nadir';
}


// Örnek trading path group verisi
export function getSampleTradingPathGroupData() {
    return [
        {
            id: 1,
            arbitrageOperationType: 'SpotArbitrage',
            orderNumber: 1,
            userFriendlyString: 'BTC-USDT Spot Arbitraj',
            uniqueInputString: 'BTC_USDT_SPOT',
            profitCurrency: {
                id: 1,
                name: 'USDT',
                assetType: 'Crypto'
            },
            startingAsset: {
                id: 2,
                name: 'BTC',
                assetType: 'Crypto'
            },
            finishingAsset: {
                id: 1,
                name: 'USDT',
                assetType: 'Crypto'
            }
        },
        {
            id: 2,
            arbitrageOperationType: 'CrossExchangeArbitrage',
            orderNumber: 2,
            userFriendlyString: 'ETH Cross Exchange',
            uniqueInputString: 'ETH_CROSS_EXCHANGE',
            profitCurrency: {
                id: 3,
                name: 'USD',
                assetType: 'Fiat'
            },
            startingAsset: {
                id: 4,
                name: 'ETH',
                assetType: 'Crypto'
            },
            finishingAsset: {
                id: 3,
                name: 'USD',
                assetType: 'Fiat'
            }
        },
        {
            id: 3,
            arbitrageOperationType: 'FuturesArbitrage',
            orderNumber: 15,
            userFriendlyString: 'Yüksek Risk Futures',
            uniqueInputString: 'HIGH_RISK_FUTURES',
            profitCurrency: {
                id: 1,
                name: 'USDT',
                assetType: 'Crypto'
            },
            startingAsset: {
                id: 2,
                name: 'BTC',
                assetType: 'Crypto'
            },
            finishingAsset: {
                id: 5,
                name: 'BNB',
                assetType: 'Crypto'
            }
        },
        {
            id: 4,
            arbitrageOperationType: 'TriangularArbitrage',
            orderNumber: 5,
            userFriendlyString: 'Üçgen Arbitraj',
            uniqueInputString: 'TRIANGULAR_ARBITRAGE',
            profitCurrency: {
                id: 1,
                name: 'USDT',
                assetType: 'Crypto'
            },
            startingAsset: {
                id: 2,
                name: 'BTC',
                assetType: 'Crypto'
            },
            finishingAsset: {
                id: 4,
                name: 'ETH',
                assetType: 'Crypto'
            }
        },
        {
            id: 5,
            arbitrageOperationType: 'StatisticalArbitrage',
            orderNumber: 25,
            userFriendlyString: 'İstatistiksel Arbitraj',
            uniqueInputString: 'STATISTICAL_ARBITRAGE',
            profitCurrency: {
                id: 3,
                name: 'USD',
                assetType: 'Fiat'
            },
            startingAsset: {
                id: 6,
                name: 'AAPL',
                assetType: 'Stock'
            },
            finishingAsset: {
                id: 7,
                name: 'GOOGL',
                assetType: 'Stock'
            }
        }
    ];
} 

