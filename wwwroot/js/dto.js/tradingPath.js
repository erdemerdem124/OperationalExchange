// Trading Path veri işleme fonksiyonları
export function handleTradingPathData(tradingPaths) {
    console.log("Trading Path verisi alındı:", tradingPaths);
    
    tradingPaths.forEach(path => {
        console.log("Trading Path ID:", path.id);
        console.log("Friendly Name:", path.friendlyName);
        console.log("Date Added:", path.dateAdded);
        console.log("Step Count:", path.stepCount);
        console.log("Is Visible:", path.isVisible);
        console.log("Configuration:", path.tradingPathConfiguration?.id);
        console.log("Group:", path.tradingPathGroup?.name);
    });
    
    // DOM'u güncelle
    updateTradingPathDisplay(tradingPaths);
    updateTradingPathStatistics(tradingPaths);
}

// TradingPathDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathDisplay(data) {
    console.log("TradingPathDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// TradingPathStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingPathStatistics(data) {
    console.log("TradingPathStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Trading Path detaylarını göster
export function showTradingPathDetails(pathId) {
    console.log("Trading Path detayları gösteriliyor:", pathId);
    // Modal implementasyonu burada olacak
}

// Trading Path düzenle
export function editTradingPath(pathId) {
    console.log("Trading Path düzenleniyor:", pathId);
    // Düzenleme implementasyonu burada olacak
}

// Trading Path görünürlüğünü değiştir
export function toggleTradingPathVisibility(pathId) {
    console.log("Trading Path görünürlüğü değiştiriliyor:", pathId);
    // Görünürlük değiştirme implementasyonu burada olacak
}

// Trading Path test et
export function testTradingPath(pathId) {
    console.log("Trading Path test ediliyor:", pathId);
    // Test implementasyonu burada olacak
}

// Trading Path analiz et
export function analyzeTradingPath(pathId) {
    console.log("Trading Path analiz ediliyor:", pathId);
    // Analiz implementasyonu burada olacak
}

// Trading Path adımlarını göster
export function showTradingPathSteps(pathId) {
    console.log("Trading Path adımları gösteriliyor:", pathId);
    // Adım gösterimi implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showTradingPathDetails = showTradingPathDetails;
window.editTradingPath = editTradingPath;
window.toggleTradingPathVisibility = toggleTradingPathVisibility;
window.testTradingPath = testTradingPath;
window.analyzeTradingPath = analyzeTradingPath;
window.showTradingPathSteps = showTradingPathSteps;

// Yardımcı fonksiyonlar
function getStatusBadge(path) {
    if (!path.isVisible) {
        return `<span class="badge bg-secondary">Gizli</span>`;
    }
    if (!path.tradingPathConfiguration?.isPossible) {
        return `<span class="badge bg-danger">Geçersiz</span>`;
    }
    if (!path.tradingPathConfiguration?.isActive) {
        return `<span class="badge bg-warning">Pasif</span>`;
    }
    return `<span class="badge bg-success">Aktif</span>`;
}

function getTradingPathTypeBadgeClass(type) {
    switch(type) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-info';
        case 'Margin': return 'bg-primary';
        case 'Arbitrage': return 'bg-purple';
        case 'Cross': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getGroupBadgeClass(category) {
    switch(category) {
        case 'Low Risk': return 'bg-success';
        case 'Medium Risk': return 'bg-warning';
        case 'High Risk': return 'bg-danger';
        case 'Ultra High Risk': return 'bg-dark';
        case 'Experimental': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function getConfigurationStatusBadgeClass(config) {
    if (!config) return 'bg-secondary';
    if (!config.isPossible) return 'bg-danger';
    if (config.isLocked) return 'bg-warning';
    if (!config.isActive) return 'bg-secondary';
    return 'bg-success';
}

function getConfigurationStatusText(config) {
    if (!config) return 'N/A';
    if (!config.isPossible) return 'Geçersiz';
    if (config.isLocked) return 'Kilitli';
    if (!config.isActive) return 'Pasif';
    return 'Aktif';
}

function getStepCountBadgeClass(stepCount) {
    if (stepCount <= 2) return 'bg-success';
    if (stepCount <= 4) return 'bg-info';
    if (stepCount <= 6) return 'bg-warning';
    return 'bg-danger';
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

function getTradingPathRowClass(path) {
    if (!path.isVisible) return 'table-secondary';
    if (!path.tradingPathConfiguration?.isPossible) return 'table-danger';
    if (!path.tradingPathConfiguration?.isActive) return 'table-warning';
    return '';
}

function calculateComplexity(path) {
    if (path.stepCount <= 2) return 'Basit';
    if (path.stepCount <= 4) return 'Orta';
    if (path.stepCount <= 6) return 'Karmaşık';
    return 'Çok Karmaşık';
}

function calculateRiskLevel(path) {
    let riskScore = 0;
    
    // Adım sayısı riski
    if (path.stepCount > 6) riskScore += 3;
    else if (path.stepCount > 4) riskScore += 2;
    else if (path.stepCount > 2) riskScore += 1;
    
    // Konfigürasyon riski
    if (path.tradingPathConfiguration) {
        if (!path.tradingPathConfiguration.isPossible) riskScore += 5;
        if (path.tradingPathConfiguration.isLocked) riskScore += 2;
        if (path.tradingPathConfiguration.targetReturn > 0.05) riskScore += 2;
        if (path.tradingPathConfiguration.orderDelay > 100) riskScore += 1;
    }
    
    // Grup riski
    if (path.tradingPathGroup?.category === 'High Risk') riskScore += 2;
    else if (path.tradingPathGroup?.category === 'Ultra High Risk') riskScore += 3;
    else if (path.tradingPathGroup?.category === 'Experimental') riskScore += 2;
    
    if (riskScore >= 8) return 'Çok Yüksek';
    if (riskScore >= 6) return 'Yüksek';
    if (riskScore >= 4) return 'Orta';
    if (riskScore >= 2) return 'Düşük';
    return 'Çok Düşük';
}

function calculatePerformanceScore(path) {
    let score = 100;
    
    // Temel puanlar
    if (!path.isVisible) score -= 20;
    if (!path.tradingPathConfiguration?.isPossible) score -= 50;
    if (!path.tradingPathConfiguration?.isActive) score -= 30;
    if (path.tradingPathConfiguration?.isLocked) score -= 15;
    
    // Adım sayısı puanı (optimal adım sayısı = 3-4)
    if (path.stepCount <= 2) score += 10;
    else if (path.stepCount <= 4) score += 15;
    else if (path.stepCount <= 6) score += 5;
    else score -= 10;
    
    // Konfigürasyon puanı
    if (path.tradingPathConfiguration) {
        if (path.tradingPathConfiguration.targetReturn > 0.02 && path.tradingPathConfiguration.targetReturn <= 0.05) score += 10;
        else if (path.tradingPathConfiguration.targetReturn > 0.05) score -= 10;
        
        if (path.tradingPathConfiguration.orderDelay <= 50) score += 10;
        else if (path.tradingPathConfiguration.orderDelay > 100) score -= 10;
    }
    
    // Grup puanı
    if (path.tradingPathGroup?.category === 'Low Risk') score += 10;
    else if (path.tradingPathGroup?.category === 'High Risk') score -= 10;
    else if (path.tradingPathGroup?.category === 'Ultra High Risk') score -= 20;
    
    return Math.max(0, Math.min(100, score));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}


// Örnek trading path verisi
export function getSampleTradingPathData() {
    return [
        {
            id: 1,
            friendlyName: "BTC-USDT Arbitraj Yolu",
            dateAdded: "2024-01-15T10:30:00Z",
            stepCount: 3,
            isVisible: true,
            tradingPathConfiguration: {
                id: 1,
                isPossible: true,
                isActive: true,
                isLocked: false,
                targetReturn: 0.025
            },
            tradingPathGroup: {
                id: 1,
                name: "Düşük Risk Arbitraj",
                type: "Arbitrage",
                category: "Low Risk"
            }
        },
        {
            id: 2,
            friendlyName: "ETH-BTC Cross Trading",
            dateAdded: "2024-01-20T14:15:00Z",
            stepCount: 4,
            isVisible: true,
            tradingPathConfiguration: {
                id: 2,
                isPossible: true,
                isActive: false,
                isLocked: false,
                targetReturn: 0.035
            },
            tradingPathGroup: {
                id: 2,
                name: "Cross Trading",
                type: "Cross",
                category: "Medium Risk"
            }
        },
        {
            id: 3,
            friendlyName: "Futures Arbitraj Kompleks",
            dateAdded: "2024-02-01T09:45:00Z",
            stepCount: 7,
            isVisible: false,
            tradingPathConfiguration: {
                id: 3,
                isPossible: false,
                isActive: false,
                isLocked: true,
                targetReturn: 0.050
            },
            tradingPathGroup: {
                id: 3,
                name: "Yüksek Risk Arbitraj",
                type: "Futures",
                category: "High Risk"
            }
        },
        {
            id: 4,
            friendlyName: "Basit Spot Arbitraj",
            dateAdded: "2024-01-10T16:20:00Z",
            stepCount: 2,
            isVisible: true,
            tradingPathConfiguration: {
                id: 4,
                isPossible: true,
                isActive: true,
                isLocked: false,
                targetReturn: 0.015
            },
            tradingPathGroup: {
                id: 4,
                name: "Ultra Düşük Risk",
                type: "Spot",
                category: "Low Risk"
            }
        },
        {
            id: 5,
            friendlyName: "Deneysel Options Arbitraj",
            dateAdded: "2024-02-10T11:30:00Z",
            stepCount: 8,
            isVisible: true,
            tradingPathConfiguration: {
                id: 5,
                isPossible: true,
                isActive: true,
                isLocked: false,
                targetReturn: 0.080
            },
            tradingPathGroup: {
                id: 5,
                name: "Deneysel Arbitraj",
                type: "Options",
                category: "Experimental"
            }
        }
    ];
} 

