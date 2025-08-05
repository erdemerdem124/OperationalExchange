// Trading Path Configuration veri işleme fonksiyonları
export function handleTradingPathConfigurationData(configurations) {
    console.log("Trading Path Configuration verisi alındı:", configurations);
    
    configurations.forEach(config => {
        console.log("Configuration ID:", config.id);
        console.log("Is Possible:", config.isPossible);
        console.log("Is Active:", config.isActive);
        console.log("Target Return:", config.targetReturn);
        console.log("Execution Limit:", config.executionLimit);
        console.log("Max Trade Volume:", config.maximumTradeVolumeAmount);
        console.log("Volume Asset:", config.volumeAsset?.name);
        console.log("Order Delay:", config.orderDelay);
        console.log("Slippage Protection:", config.slippageProtection);
        console.log("Trading Path:", config.tradingPath?.name);
        console.log("Is Locked:", config.isLocked);
        console.log("Invalidation Reason:", config.invalidationReason);
    });
    
    // DOM'u güncelle
    updateTradingPathConfigurationDisplay(configurations);
    updateTradingPathConfigurationStatistics(configurations);
}

// TradingPathConfigurationDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathConfigurationDisplay(data) {
    console.log("TradingPathConfigurationDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// TradingPathConfigurationStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathConfigurationStatistics(data) {
    console.log("TradingPathConfigurationStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Trading Path Configuration detaylarını göster
export function showTradingPathConfigurationDetails(configId) {
    console.log("Trading Path Configuration detayları gösteriliyor:", configId);
    // Modal implementasyonu burada olacak
}

// Trading Path Configuration düzenle
export function editTradingPathConfiguration(configId) {
    console.log("Trading Path Configuration düzenleniyor:", configId);
    // Düzenleme implementasyonu burada olacak
}

// Trading Path Configuration durumunu değiştir
export function toggleTradingPathConfigurationStatus(configId) {
    console.log("Trading Path Configuration durumu değiştiriliyor:", configId);
    // Durum değiştirme implementasyonu burada olacak
}

// Trading Path Configuration test et
export function testTradingPathConfiguration(configId) {
    console.log("Trading Path Configuration test ediliyor:", configId);
    // Test implementasyonu burada olacak
}

// Trading Path Configuration analiz et
export function analyzeTradingPathConfiguration(configId) {
    console.log("Trading Path Configuration analiz ediliyor:", configId);
    // Analiz implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showTradingPathConfigurationDetails = showTradingPathConfigurationDetails;
window.editTradingPathConfiguration = editTradingPathConfiguration;
window.toggleTradingPathConfigurationStatus = toggleTradingPathConfigurationStatus;
window.testTradingPathConfiguration = testTradingPathConfiguration;
window.analyzeTradingPathConfiguration = analyzeTradingPathConfiguration;

// Yardımcı fonksiyonlar
function getStatusBadge(config) {
    if (!config.isPossible) {
        return `<span class="badge bg-danger">Geçersiz</span>`;
    }
    if (config.isLocked) {
        return `<span class="badge bg-warning">Kilitli</span>`;
    }
    if (config.isActive) {
        return `<span class="badge bg-success">Aktif</span>`;
    }
    return `<span class="badge bg-secondary">Pasif</span>`;
}

function getTradingPathBadgeClass(type) {
    switch(type) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-info';
        case 'Margin': return 'bg-primary';
        case 'Arbitrage': return 'bg-purple';
        default: return 'bg-dark';
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

function getReturnBadgeClass(targetReturn) {
    if (targetReturn >= 0.05) return 'bg-success'; // >= 5%
    if (targetReturn >= 0.02) return 'bg-info';    // >= 2%
    if (targetReturn >= 0.01) return 'bg-warning'; // >= 1%
    return 'bg-danger';                             // < 1%
}

function getLimitBadgeClass(executionLimit) {
    if (executionLimit >= 1000000) return 'bg-success'; // >= 1M
    if (executionLimit >= 100000) return 'bg-info';     // >= 100K
    if (executionLimit >= 10000) return 'bg-warning';   // >= 10K
    return 'bg-danger';                                  // < 10K
}

function getVolumeBadgeClass(maxVolume) {
    if (maxVolume >= 1000000) return 'bg-success'; // >= 1M
    if (maxVolume >= 100000) return 'bg-info';     // >= 100K
    if (maxVolume >= 10000) return 'bg-warning';   // >= 10K
    return 'bg-danger';                             // < 10K
}

function getDelayBadgeClass(orderDelay) {
    if (orderDelay <= 10) return 'bg-success';     // <= 10ms
    if (orderDelay <= 50) return 'bg-info';        // <= 50ms
    if (orderDelay <= 100) return 'bg-warning';    // <= 100ms
    return 'bg-danger';                             // > 100ms
}

function getSlippageBadgeClass(slippageProtection) {
    if (slippageProtection <= 0.001) return 'bg-success'; // <= 0.1%
    if (slippageProtection <= 0.005) return 'bg-info';    // <= 0.5%
    if (slippageProtection <= 0.01) return 'bg-warning';  // <= 1%
    return 'bg-danger';                                   // > 1%
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

function getPerformanceBadgeClass(performanceScore) {
    if (performanceScore >= 90) return 'bg-success';
    if (performanceScore >= 70) return 'bg-info';
    if (performanceScore >= 50) return 'bg-warning';
    if (performanceScore >= 30) return 'bg-danger';
    return 'bg-dark';
}

function getConfigurationRowClass(config) {
    if (!config.isPossible) return 'table-danger';
    if (config.isLocked) return 'table-warning';
    if (!config.isActive) return 'table-secondary';
    return '';
}

function calculateRiskLevel(config) {
    let riskScore = 0;
    
    // Hedef getiri riski
    if (config.targetReturn > 0.1) riskScore += 3; // > 10%
    else if (config.targetReturn > 0.05) riskScore += 2; // > 5%
    else if (config.targetReturn > 0.02) riskScore += 1; // > 2%
    
    // Sipariş gecikmesi riski
    if (config.orderDelay > 100) riskScore += 2; // > 100ms
    else if (config.orderDelay > 50) riskScore += 1; // > 50ms
    
    // Kayma koruması riski
    if (config.slippageProtection > 0.02) riskScore += 2; // > 2%
    else if (config.slippageProtection > 0.01) riskScore += 1; // > 1%
    
    // Maksimum hacim riski
    if (config.maximumTradeVolumeAmount > 1000000) riskScore += 1; // > 1M
    
    // Geçersizlik nedeni varsa
    if (config.invalidationReason) riskScore += 3;
    
    if (riskScore >= 8) return 'Çok Yüksek';
    if (riskScore >= 6) return 'Yüksek';
    if (riskScore >= 4) return 'Orta';
    if (riskScore >= 2) return 'Düşük';
    return 'Çok Düşük';
}

function calculatePerformanceScore(config) {
    let score = 100;
    
    // Temel puanlar
    if (!config.isPossible) score -= 50;
    if (!config.isActive) score -= 20;
    if (config.isLocked) score -= 15;
    
    // Hedef getiri puanı (yüksek getiri = yüksek puan, ama çok yüksek = risk)
    if (config.targetReturn > 0.05 && config.targetReturn <= 0.1) score += 10;
    else if (config.targetReturn > 0.02 && config.targetReturn <= 0.05) score += 15;
    else if (config.targetReturn > 0.01 && config.targetReturn <= 0.02) score += 10;
    else if (config.targetReturn > 0.1) score -= 10; // Çok yüksek risk
    
    // Sipariş gecikmesi puanı (düşük gecikme = yüksek puan)
    if (config.orderDelay <= 10) score += 15;
    else if (config.orderDelay <= 50) score += 10;
    else if (config.orderDelay <= 100) score += 5;
    else score -= 10;
    
    // Kayma koruması puanı (düşük kayma = yüksek puan)
    if (config.slippageProtection <= 0.001) score += 15;
    else if (config.slippageProtection <= 0.005) score += 10;
    else if (config.slippageProtection <= 0.01) score += 5;
    else score -= 10;
    
    // Yürütme limiti puanı (yüksek limit = yüksek puan)
    if (config.executionLimit >= 1000000) score += 10;
    else if (config.executionLimit >= 100000) score += 5;
    else score -= 5;
    
    return Math.max(0, Math.min(100, score));
}

function formatVolume(volume) {
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toFixed(0);
}


// Örnek trading path configuration verisi
export function getSampleTradingPathConfigurationData() {
    return [
        {
            id: 1,
            isPossible: true,
            isActive: true,
            isLocked: false,
            targetReturn: 0.025, // 2.5%
            executionLimit: 500000,
            maximumTradeVolumeAmount: 100000,
            orderDelay: 15,
            slippageProtection: 0.002, // 0.2%
            invalidationReason: null,
            volumeAsset: {
                id: 1,
                name: "USDT",
                assetType: "Crypto"
            },
            tradingPath: {
                id: 1,
                name: "BTC-USDT Arbitraj",
                type: "Arbitrage"
            }
        },
        {
            id: 2,
            isPossible: true,
            isActive: false,
            isLocked: false,
            targetReturn: 0.035, // 3.5%
            executionLimit: 750000,
            maximumTradeVolumeAmount: 150000,
            orderDelay: 25,
            slippageProtection: 0.003, // 0.3%
            invalidationReason: null,
            volumeAsset: {
                id: 2,
                name: "BTC",
                assetType: "Crypto"
            },
            tradingPath: {
                id: 2,
                name: "ETH-BTC Cross",
                type: "Spot"
            }
        },
        {
            id: 3,
            isPossible: false,
            isActive: false,
            isLocked: true,
            targetReturn: 0.050, // 5%
            executionLimit: 1000000,
            maximumTradeVolumeAmount: 200000,
            orderDelay: 50,
            slippageProtection: 0.005, // 0.5%
            invalidationReason: "Yetersiz likidite",
            volumeAsset: {
                id: 3,
                name: "ETH",
                assetType: "Crypto"
            },
            tradingPath: {
                id: 3,
                name: "Futures Arbitraj",
                type: "Futures"
            }
        },
        {
            id: 4,
            isPossible: true,
            isActive: true,
            isLocked: false,
            targetReturn: 0.015, // 1.5%
            executionLimit: 300000,
            maximumTradeVolumeAmount: 75000,
            orderDelay: 8,
            slippageProtection: 0.001, // 0.1%
            invalidationReason: null,
            volumeAsset: {
                id: 4,
                name: "USD",
                assetType: "Fiat"
            },
            tradingPath: {
                id: 4,
                name: "Düşük Risk Arbitraj",
                type: "Arbitrage"
            }
        },
        {
            id: 5,
            isPossible: true,
            isActive: true,
            isLocked: false,
            targetReturn: 0.080, // 8%
            executionLimit: 2000000,
            maximumTradeVolumeAmount: 500000,
            orderDelay: 120,
            slippageProtection: 0.010, // 1%
            invalidationReason: null,
            volumeAsset: {
                id: 5,
                name: "BNB",
                assetType: "Crypto"
            },
            tradingPath: {
                id: 5,
                name: "Yüksek Risk Arbitraj",
                type: "Arbitrage"
            }
        }
    ];
} 

