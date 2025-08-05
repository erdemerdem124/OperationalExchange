// Trading Fee veri işleme fonksiyonları
export function handleTradingFeeData(tradingFees) {
    console.log("Trading Fee verisi alındı:", tradingFees);
    
    tradingFees.forEach(fee => {
        console.log("Trading Fee ID:", fee.id);
        console.log("Exchange:", fee.exchange?.name);
        console.log("Primary Maker Fee:", fee.primaryMakerFeeRate);
        console.log("Primary Taker Fee:", fee.primaryTakerFeeRate);
        console.log("Secondary Maker Fee:", fee.secondaryMakerFeeRate);
        console.log("Secondary Taker Fee:", fee.secondaryTakerFeeRate);
        console.log("Tertiary Maker Fee:", fee.tertiaryMakerFeeRate);
        console.log("Tertiary Taker Fee:", fee.tertiaryTakerFeeRate);
    });
    
    // DOM'u güncelle
    updateTradingFeeDisplay(tradingFees);
    updateTradingFeeStatistics(tradingFees);
}

// TradingFeeDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingFeeDisplay(data) {
    console.log("TradingFeeDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// TradingFeeStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateTradingFeeStatistics(data) {
    console.log("TradingFeeStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Trading Fee detaylarını göster
export function showTradingFeeDetails(feeId) {
    console.log("Trading Fee detayları gösteriliyor:", feeId);
    // Modal implementasyonu burada olacak
}

// Trading Fee düzenle
export function editTradingFee(feeId) {
    console.log("Trading Fee düzenleniyor:", feeId);
    // Düzenleme implementasyonu burada olacak
}

// Trading Fee karşılaştır
export function compareTradingFees(feeId) {
    console.log("Trading Fee karşılaştırılıyor:", feeId);
    // Karşılaştırma implementasyonu burada olacak
}

// Trading maliyetlerini hesapla
export function calculateTradingCosts(feeId) {
    console.log("Trading maliyetleri hesaplanıyor:", feeId);
    // Maliyet hesaplama implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showTradingFeeDetails = showTradingFeeDetails;
window.editTradingFee = editTradingFee;
window.compareTradingFees = compareTradingFees;
window.calculateTradingCosts = calculateTradingCosts;

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

function getFeeRateBadgeClass(feeRate) {
    if (feeRate < 0.001) return 'bg-success'; // < 0.1%
    if (feeRate < 0.002) return 'bg-info';    // < 0.2%
    if (feeRate < 0.005) return 'bg-warning'; // < 0.5%
    return 'bg-danger';                        // >= 0.5%
}

function getFeeCompetitivenessClass(avgTakerFee) {
    if (avgTakerFee < 0.001) return 'table-success'; // Çok düşük
    if (avgTakerFee < 0.002) return 'table-info';    // Düşük
    if (avgTakerFee < 0.005) return 'table-warning'; // Orta
    if (avgTakerFee < 0.01) return 'table-danger';   // Yüksek
    return 'table-dark';                              // Çok yüksek
}

function getFeeCompetitiveness(avgTakerFee) {
    if (avgTakerFee < 0.001) return 'Çok Düşük';
    if (avgTakerFee < 0.002) return 'Düşük';
    if (avgTakerFee < 0.005) return 'Orta';
    if (avgTakerFee < 0.01) return 'Yüksek';
    return 'Çok Yüksek';
}

// Örnek trading fee verisi
export function getSampleTradingFeeData() {
    return [
        {
            id: 1,
            primaryMakerFeeRate: 0.0010, // 0.10%
            primaryTakerFeeRate: 0.0010, // 0.10%
            secondaryMakerFeeRate: 0.0008, // 0.08%
            secondaryTakerFeeRate: 0.0008, // 0.08%
            tertiaryMakerFeeRate: 0.0006, // 0.06%
            tertiaryTakerFeeRate: 0.0006, // 0.06%
            exchange: {
                id: 1,
                name: "Binance",
                context: "Spot"
            }
        },
        {
            id: 2,
            primaryMakerFeeRate: 0.0025, // 0.25%
            primaryTakerFeeRate: 0.0025, // 0.25%
            secondaryMakerFeeRate: 0.0020, // 0.20%
            secondaryTakerFeeRate: 0.0020, // 0.20%
            tertiaryMakerFeeRate: 0.0015, // 0.15%
            tertiaryTakerFeeRate: 0.0015, // 0.15%
            exchange: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            }
        },
        {
            id: 3,
            primaryMakerFeeRate: 0.0015, // 0.15%
            primaryTakerFeeRate: 0.0015, // 0.15%
            secondaryMakerFeeRate: 0.0012, // 0.12%
            secondaryTakerFeeRate: 0.0012, // 0.12%
            tertiaryMakerFeeRate: 0.0010, // 0.10%
            tertiaryTakerFeeRate: 0.0010, // 0.10%
            exchange: {
                id: 3,
                name: "Bybit",
                context: "Futures"
            }
        },
        {
            id: 4,
            primaryMakerFeeRate: 0.0030, // 0.30%
            primaryTakerFeeRate: 0.0030, // 0.30%
            secondaryMakerFeeRate: 0.0025, // 0.25%
            secondaryTakerFeeRate: 0.0025, // 0.25%
            tertiaryMakerFeeRate: 0.0020, // 0.20%
            tertiaryTakerFeeRate: 0.0020, // 0.20%
            exchange: {
                id: 4,
                name: "Kraken",
                context: "Spot"
            }
        },
        {
            id: 5,
            primaryMakerFeeRate: 0.0005, // 0.05%
            primaryTakerFeeRate: 0.0005, // 0.05%
            secondaryMakerFeeRate: 0.0004, // 0.04%
            secondaryTakerFeeRate: 0.0004, // 0.04%
            tertiaryMakerFeeRate: 0.0003, // 0.03%
            tertiaryTakerFeeRate: 0.0003, // 0.03%
            exchange: {
                id: 5,
                name: "Deribit",
                context: "Options"
            }
        }
    ];
} 

