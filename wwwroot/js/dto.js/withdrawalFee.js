// Withdrawal Fee veri işleme fonksiyonları
export function handleWithdrawalFeeData(withdrawalFees) {
    console.log("Withdrawal Fee verisi alındı:", withdrawalFees);
    
    withdrawalFees.forEach(fee => {
        console.log("Fee ID:", fee.id);
        console.log("Fee Amount:", fee.fee);
        console.log("Asset:", fee.asset?.name);
        console.log("Exchange:", fee.exchange?.name);
    });
    
    // DOM'u güncelle
    updateWithdrawalFeeDisplay(withdrawalFees);
    updateWithdrawalFeeStatistics(withdrawalFees);
}

// WithdrawalFeeDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateWithdrawalFeeDisplay(data) {
    console.log("WithdrawalFeeDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// WithdrawalFeeStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateWithdrawalFeeStatistics(data) {
    console.log("WithdrawalFeeStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Withdrawal Fee detaylarını göster
export function showWithdrawalFeeDetails(feeId) {
    console.log("Withdrawal Fee detayları gösteriliyor:", feeId);
    // Modal implementasyonu burada olacak
}

// Withdrawal Fee düzenle
export function editWithdrawalFee(feeId) {
    console.log("Withdrawal Fee düzenleniyor:", feeId);
    // Düzenleme implementasyonu burada olacak
}

// Withdrawal Fee'leri karşılaştır
export function compareWithdrawalFees(feeId) {
    console.log("Withdrawal Fee'ler karşılaştırılıyor:", feeId);
    // Karşılaştırma implementasyonu burada olacak
}

// Withdrawal maliyetlerini hesapla
export function calculateWithdrawalCosts(feeId) {
    console.log("Withdrawal maliyetleri hesaplanıyor:", feeId);
    // Maliyet hesaplama implementasyonu burada olacak
}

// Withdrawal Fee analiz et
export function analyzeWithdrawalFee(feeId) {
    console.log("Withdrawal Fee analiz ediliyor:", feeId);
    // Analiz implementasyonu burada olacak
}

// Withdrawal geçmişini göster
export function showWithdrawalHistory(feeId) {
    console.log("Withdrawal geçmişi gösteriliyor:", feeId);
    // Geçmiş gösterimi implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showWithdrawalFeeDetails = showWithdrawalFeeDetails;
window.editWithdrawalFee = editWithdrawalFee;
window.compareWithdrawalFees = compareWithdrawalFees;
window.calculateWithdrawalCosts = calculateWithdrawalCosts;
window.analyzeWithdrawalFee = analyzeWithdrawalFee;
window.showWithdrawalHistory = showWithdrawalHistory;

// Yardımcı fonksiyonlar
function getFeeCategory(fee) {
    if (fee <= 0.001) return 'Çok Düşük';
    if (fee <= 0.01) return 'Düşük';
    if (fee <= 0.1) return 'Orta';
    if (fee <= 1.0) return 'Yüksek';
    return 'Çok Yüksek';
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

function getFeeBadgeClass(feeCategory) {
    switch(feeCategory) {
        case 'Çok Düşük': return 'bg-success';
        case 'Düşük': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Yüksek': return 'bg-danger';
        case 'Çok Yüksek': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getCostBadgeClass(costLevel) {
    switch(costLevel) {
        case 'Çok Uygun': return 'bg-success';
        case 'Uygun': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Pahalı': return 'bg-danger';
        case 'Çok Pahalı': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getComparisonBadgeClass(comparisonResult) {
    switch(comparisonResult) {
        case 'En Uygun': return 'bg-success';
        case 'Uygun': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Pahalı': return 'bg-danger';
        case 'En Pahalı': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getWithdrawalFeeRowClass(fee, allFees) {
    const costAnalysis = calculateCostAnalysis(fee);
    if (costAnalysis.level === 'Çok Uygun') return 'table-success';
    if (costAnalysis.level === 'Uygun') return 'table-info';
    if (costAnalysis.level === 'Orta') return 'table-warning';
    if (costAnalysis.level === 'Pahalı') return 'table-danger';
    if (costAnalysis.level === 'Çok Pahalı') return 'table-dark';
    return '';
}

function calculateCostAnalysis(fee) {
    // Para birimi tipine göre maliyet analizi
    let baseScore = 0;
    
    if (fee.asset?.assetType === 'Fiat') {
        // Fiat para birimleri genelde daha pahalı
        if (fee.fee <= 5) baseScore = 1; // Çok Uygun
        else if (fee.fee <= 15) baseScore = 2; // Uygun
        else if (fee.fee <= 30) baseScore = 3; // Orta
        else if (fee.fee <= 50) baseScore = 4; // Pahalı
        else baseScore = 5; // Çok Pahalı
    } else if (fee.asset?.assetType === 'Crypto') {
        // Crypto para birimleri için farklı kriterler
        if (fee.fee <= 0.001) baseScore = 1; // Çok Uygun
        else if (fee.fee <= 0.01) baseScore = 2; // Uygun
        else if (fee.fee <= 0.1) baseScore = 3; // Orta
        else if (fee.fee <= 1.0) baseScore = 4; // Pahalı
        else baseScore = 5; // Çok Pahalı
    } else {
        // Diğer para birimleri için genel kriterler
        if (fee.fee <= 0.01) baseScore = 1;
        else if (fee.fee <= 0.1) baseScore = 2;
        else if (fee.fee <= 1.0) baseScore = 3;
        else if (fee.fee <= 10.0) baseScore = 4;
        else baseScore = 5;
    }
    
    // Exchange güvenilirliği bonusu
    if (fee.exchange?.context === 'Spot') baseScore = Math.max(1, baseScore - 1);
    
    const levels = ['Çok Uygun', 'Uygun', 'Orta', 'Pahalı', 'Çok Pahalı'];
    const descriptions = [
        'Çok uygun fiyat, önerilir',
        'Uygun fiyat, kullanılabilir',
        'Orta seviye fiyat',
        'Pahalı, alternatif düşünülmeli',
        'Çok pahalı, kaçınılmalı'
    ];
    
    return {
        level: levels[baseScore - 1],
        description: descriptions[baseScore - 1]
    };
}

function getComparisonResult(fee, allFees) {
    // Aynı para birimi için karşılaştırma
    const sameAssetFees = allFees.filter(f => f.asset?.name === fee.asset?.name);
    if (sameAssetFees.length <= 1) {
        return {
            result: 'Tek Seçenek',
            description: 'Bu para birimi için başka seçenek yok'
        };
    }
    
    const sortedFees = sameAssetFees.sort((a, b) => a.fee - b.fee);
    const rank = sortedFees.findIndex(f => f.id === fee.id) + 1;
    const total = sortedFees.length;
    
    if (rank === 1) {
        return {
            result: 'En Uygun',
            description: `${total} seçenek arasında en uygun`
        };
    } else if (rank <= Math.ceil(total / 3)) {
        return {
            result: 'Uygun',
            description: `${total} seçenek arasında üst %${Math.round((total - rank + 1) / total * 100)}`
        };
    } else if (rank <= Math.ceil(total * 2 / 3)) {
        return {
            result: 'Orta',
            description: `${total} seçenek arasında orta sıralama`
        };
    } else if (rank < total) {
        return {
            result: 'Pahalı',
            description: `${total} seçenek arasında alt sıralama`
        };
    } else {
        return {
            result: 'En Pahalı',
            description: `${total} seçenek arasında en pahalı`
        };
    }
}

function getRecommendations(fee, allFees) {
    const recommendations = [];
    const costAnalysis = calculateCostAnalysis(fee);
    
    if (costAnalysis.level === 'Çok Pahalı' || costAnalysis.level === 'Pahalı') {
        recommendations.push('Alternatif Ara');
        
        // Aynı para birimi için daha uygun seçenekler
        const sameAssetFees = allFees.filter(f => f.asset?.name === fee.asset?.name && f.id !== fee.id);
        const cheaperOptions = sameAssetFees.filter(f => f.fee < fee.fee);
        
        if (cheaperOptions.length > 0) {
            const cheapest = cheaperOptions.reduce((min, f) => f.fee < min.fee ? f : min);
            recommendations.push(`${cheapest.exchange?.name} Önerilir`);
        }
    }
    
    if (fee.asset?.assetType === 'Crypto' && fee.fee > 0.1) {
        recommendations.push('Yüksek Ücret');
    }
    
    if (fee.asset?.assetType === 'Fiat' && fee.fee > 30) {
        recommendations.push('Bankacılık Alternatifi');
    }
    
    if (costAnalysis.level === 'Çok Uygun' || costAnalysis.level === 'Uygun') {
        recommendations.push('Önerilen');
    }
    
    return recommendations.length > 0 ? recommendations : ['Standart'];
}

function calculateValueScore(fee, allFees) {
    const costAnalysis = calculateCostAnalysis(fee);
    const comparison = getComparisonResult(fee, allFees);
    
    let score = 0;
    
    // Maliyet analizi puanı
    switch(costAnalysis.level) {
        case 'Çok Uygun': score += 10; break;
        case 'Uygun': score += 8; break;
        case 'Orta': score += 5; break;
        case 'Pahalı': score += 2; break;
        case 'Çok Pahalı': score += 0; break;
    }
    
    // Karşılaştırma puanı
    switch(comparison.result) {
        case 'En Uygun': score += 10; break;
        case 'Uygun': score += 8; break;
        case 'Orta': score += 5; break;
        case 'Pahalı': score += 2; break;
        case 'En Pahalı': score += 0; break;
    }
    
    // Exchange güvenilirlik bonusu
    if (fee.exchange?.context === 'Spot') score += 2;
    
    return score;
}

function formatFee(fee) {
    if (fee < 0.001) return fee.toFixed(6);
    if (fee < 0.01) return fee.toFixed(4);
    if (fee < 1) return fee.toFixed(3);
    return fee.toFixed(2);
}

// Örnek withdrawal fee verisi
export function getSampleWithdrawalFeeData() {
    return [
        {
            id: 1,
            fee: 0.0005,
            asset: {
                id: 1,
                name: "BTC",
                assetType: "Crypto",
                abbreviationSymbol: "BTC"
            },
            exchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            }
        },
        {
            id: 2,
            fee: 0.002,
            asset: {
                id: 2,
                name: "ETH",
                assetType: "Crypto",
                abbreviationSymbol: "ETH"
            },
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            }
        },
        {
            id: 3,
            fee: 25.0,
            asset: {
                id: 3,
                name: "USD",
                assetType: "Fiat",
                abbreviationSymbol: "USD"
            },
            exchange: {
                id: 3,
                name: "Kraken",
                context: "Spot"
            }
        },
        {
            id: 4,
            fee: 0.01,
            asset: {
                id: 4,
                name: "USDT",
                assetType: "Crypto",
                abbreviationSymbol: "USDT"
            },
            exchange: {
                id: 4,
                name: "Bybit",
                context: "Futures"
            }
        },
        {
            id: 5,
            fee: 0.001,
            asset: {
                id: 5,
                name: "LTC",
                assetType: "Crypto",
                abbreviationSymbol: "LTC"
            },
            exchange: {
                id: 5,
                name: "Deribit",
                context: "Options"
            }
        },
        {
            id: 6,
            fee: 0.05,
            asset: {
                id: 6,
                name: "ADA",
                assetType: "Crypto",
                abbreviationSymbol: "ADA"
            },
            exchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            }
        },
        {
            id: 7,
            fee: 15.0,
            asset: {
                id: 7,
                name: "EUR",
                assetType: "Fiat",
                abbreviationSymbol: "EUR"
            },
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            }
        },
        {
            id: 8,
            fee: 0.0001,
            asset: {
                id: 8,
                name: "XRP",
                assetType: "Crypto",
                abbreviationSymbol: "XRP"
            },
            exchange: {
                id: 3,
                name: "Kraken",
                context: "Spot"
            }
        }
    ];
} 

