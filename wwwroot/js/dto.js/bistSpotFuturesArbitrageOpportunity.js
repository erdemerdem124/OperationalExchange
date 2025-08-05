// BIST Spot Futures Arbitrage Opportunity veri işleme fonksiyonları
export function handleBistSpotFuturesArbitrageOpportunityData(opportunities) {
    console.log("BIST Spot Futures Arbitrage Opportunity verisi alındı:", opportunities);
    
    opportunities.forEach(opp => {
        console.log("TRY Volume:", opp.tryVolume);
        console.log("Close Maturity:", opp.closeMaturityInDays);
        console.log("Far Maturity:", opp.farMaturityInDays);
        console.log("Expected Netto Profit:", opp.expectedNettoProfit);
        console.log("Expected Annualized Return:", opp.expectedAnnualizedReturnRatioCompounded);
    });
    
    // DOM'u güncelle
    updateBistSpotFuturesArbitrageOpportunityDisplay(opportunities);
    updateBistSpotFuturesArbitrageOpportunityStatistics(opportunities);
}

// BistSpotFuturesArbitrageOpportunityDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateBistSpotFuturesArbitrageOpportunityDisplay(data) {
    console.log("BistSpotFuturesArbitrageOpportunityDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// BistSpotFuturesArbitrageOpportunityStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateBistSpotFuturesArbitrageOpportunityStatistics(data) {
    console.log("BistSpotFuturesArbitrageOpportunityStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// BIST Spot Futures Arbitrage Opportunity detaylarını göster
export function showBistSpotFuturesArbitrageOpportunityDetails(opportunityIndex) {
    console.log("BIST Spot Futures Arbitrage Opportunity detayları gösteriliyor:", opportunityIndex);
    // Modal implementasyonu burada olacak
}

// BIST Spot Futures Arbitrage Opportunity'yi uygula
export function executeBistSpotFuturesArbitrageOpportunity(opportunityIndex) {
    console.log("BIST Spot Futures Arbitrage Opportunity uygulanıyor:", opportunityIndex);
    // Uygulama implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showBistSpotFuturesArbitrageOpportunityDetails = showBistSpotFuturesArbitrageOpportunityDetails;
window.executeBistSpotFuturesArbitrageOpportunity = executeBistSpotFuturesArbitrageOpportunity;


// Örnek BIST Spot Futures Arbitrage Opportunity verisi
export function getSampleBistSpotFuturesArbitrageOpportunityData() {
    return [
        {
            tryVolume: {
                amount: 50000,
                currency: "TRY"
            },
            closeMaturityInDays: 15,
            farMaturityInDays: 45,
            maturityDifferenceInDays: 30,
            daysUntilFirstMaturity: 5,
            lot: 1000,
            expectedBruttoProfit: 2500.00,
            expectedNettoProfit: 2200.00,
            expectedAnnualizedReturnRatioSimple: 0.175,
            expectedAnnualizedReturnRatioCompounded: 0.189,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.165,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        },
        {
            tryVolume: {
                amount: 75000,
                currency: "TRY"
            },
            closeMaturityInDays: 30,
            farMaturityInDays: 90,
            maturityDifferenceInDays: 60,
            daysUntilFirstMaturity: 12,
            lot: 1500,
            expectedBruttoProfit: 4200.00,
            expectedNettoProfit: 3800.00,
            expectedAnnualizedReturnRatioSimple: 0.203,
            expectedAnnualizedReturnRatioCompounded: 0.225,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.198,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        },
        {
            tryVolume: {
                amount: 30000,
                currency: "TRY"
            },
            closeMaturityInDays: 7,
            farMaturityInDays: 21,
            maturityDifferenceInDays: 14,
            daysUntilFirstMaturity: 3,
            lot: 600,
            expectedBruttoProfit: 800.00,
            expectedNettoProfit: 650.00,
            expectedAnnualizedReturnRatioSimple: 0.156,
            expectedAnnualizedReturnRatioCompounded: 0.168,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.142,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        },
        {
            tryVolume: {
                amount: 100000,
                currency: "TRY"
            },
            closeMaturityInDays: 60,
            farMaturityInDays: 180,
            maturityDifferenceInDays: 120,
            daysUntilFirstMaturity: 45,
            lot: 2000,
            expectedBruttoProfit: 6000.00,
            expectedNettoProfit: 5400.00,
            expectedAnnualizedReturnRatioSimple: 0.164,
            expectedAnnualizedReturnRatioCompounded: 0.178,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.152,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        },
        {
            tryVolume: {
                amount: 25000,
                currency: "TRY"
            },
            closeMaturityInDays: 10,
            farMaturityInDays: 25,
            maturityDifferenceInDays: 15,
            daysUntilFirstMaturity: 2,
            lot: 500,
            expectedBruttoProfit: 1200.00,
            expectedNettoProfit: 950.00,
            expectedAnnualizedReturnRatioSimple: 0.228,
            expectedAnnualizedReturnRatioCompounded: 0.256,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.218,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        },
        {
            tryVolume: {
                amount: 80000,
                currency: "TRY"
            },
            closeMaturityInDays: 45,
            farMaturityInDays: 135,
            maturityDifferenceInDays: 90,
            daysUntilFirstMaturity: 20,
            lot: 1600,
            expectedBruttoProfit: 3800.00,
            expectedNettoProfit: 3200.00,
            expectedAnnualizedReturnRatioSimple: 0.162,
            expectedAnnualizedReturnRatioCompounded: 0.175,
            expectedAnnualizedPortfolioReturnRatioCompounded: 0.148,
            calculation: {
                method: "Compounded",
                details: "Yıllık bileşik getiri hesaplaması"
            }
        }
    ];
} 

