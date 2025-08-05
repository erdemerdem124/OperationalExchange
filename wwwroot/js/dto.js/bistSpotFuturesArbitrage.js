// BIST Spot Futures Arbitrage veri işleme fonksiyonları
export function handleBistSpotFuturesArbitrageData(arbitrages) {
    console.log("BIST Spot Futures Arbitrage verisi alındı:", arbitrages);
    
    arbitrages.forEach(arb => {
        console.log("BORSA:", arb.exchange);
        console.log("YÖN:", arb.direction);
        console.log("HACİM:", arb.volume);
        console.log("BRÜT KAR:", arb.grossProfit);
        console.log("NET KAR:", arb.netProfit);
        console.log("BRÜT KAR MARJI:", arb.grossProfitMargin);
        console.log("NET KAR MARJI:", arb.netProfitMargin);
    });
    
    // DOM'u güncelle
    updateBistSpotFuturesArbitrageDisplay(arbitrages);
    updateBistSpotFuturesArbitrageStatistics(arbitrages);
}

// BistSpotFuturesArbitrageDisplay display'ini güncelle - BIST vadeli işlemler tablosu
function updateBistSpotFuturesArbitrageDisplay(data) {
    console.log("BistSpotFuturesArbitrageDisplay verisi alındı:", data);
    
    const container = document.getElementById('kripto-0-ozet-bist-vadeli-islemler-table');
    if (!container) {
        console.error('BIST vadeli işlemler tablosu container bulunamadı');
        return;
    }
    
    // Tablo HTML'ini oluştur
    const tableHTML = generateBistSpotFuturesArbitrageTable(data);
    container.innerHTML = tableHTML;
}

// BIST vadeli işlemler tablosu HTML'ini oluştur
function generateBistSpotFuturesArbitrageTable(data) {
    if (!data || data.length === 0) {
        return `
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>Veri bulunamadı</p>
                </div>
            </div>
        `;
    }
    
    const tableRows = data.map(item => generateBistSpotFuturesArbitrageRow(item)).join('');
    
    return `
        <table class="kripto-responsive-table" id="kripto-0-ozet-bist-vadeli-islemler-table" style="min-width: 175px">
            <colgroup>
                <col style="min-width: 25px">
                <col style="min-width: 25px">
                <col style="min-width: 25px">
                <col style="min-width: 25px">
                <col style="min-width: 25px">
                <col style="min-width: 25px">
                <col style="min-width: 25px">
            </colgroup>
            <tbody>
                <tr>
                    <th colspan="1" rowspan="1">
                        <p>BORSA</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>YÖN</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>HACİM</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>BRÜT KAR</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>NET KAR</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>BRÜT KAR MARJI</p>
                    </th>
                    <th colspan="1" rowspan="1">
                        <p>NET KAR MARJI</p>
                    </th>
                </tr>
                ${tableRows}
            </tbody>
        </table>
    `;
}

// BIST vadeli işlemler tablo satırı oluştur
function generateBistSpotFuturesArbitrageRow(item) {
    const exchangeColorClass = getExchangeColorClass(item.exchange);
    const directionColorClass = getDirectionColorClass(item.direction);
    const grossProfitClass = item.grossProfit > 0 ? 'text-success' : 'text-danger';
    const netProfitClass = item.netProfit > 0 ? 'text-success' : 'text-danger';
    const grossMarginClass = item.grossProfitMargin > 0 ? 'text-success' : 'text-danger';
    const netMarginClass = item.netProfitMargin > 0 ? 'text-success' : 'text-danger';
    
    return `
        <tr>
            <td colspan="1" rowspan="1">
                <p class="${exchangeColorClass}">${item.exchange}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p class="${directionColorClass}">${item.direction}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>${item.volume.toLocaleString('tr-TR')}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p class="${grossProfitClass}">${item.grossProfit.toFixed(2).replace('.', ',')}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p class="${netProfitClass}">${item.netProfit.toFixed(2).replace('.', ',')}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p class="${grossMarginClass}">%${item.grossProfitMargin.toFixed(2).replace('.', ',')}</p>
            </td>
            <td colspan="1" rowspan="1">
                <p class="${netMarginClass}">%${item.netProfitMargin.toFixed(2).replace('.', ',')}</p>
            </td>
        </tr>
    `;
}

// Borsa renk sınıfını getir
function getExchangeColorClass(exchange) {
    const exchangeColors = {
        'Bitci': 'y-brown',
        'Paribu': 'y-black',
        'Bitexen': 'y-yellow',
        'BtcTürk': 'y-red',
        'Icrypex': 'y-purple'
    };
    return exchangeColors[exchange] || 'text-white';
}

// Yön renk sınıfını getir
function getDirectionColorClass(direction) {
    const directionColors = {
        'TRY Trio': 'y-orange',
        'USDT Trio': 'y-blue'
    };
    return directionColors[direction] || 'text-white';
}

// BistSpotFuturesArbitrageStatistics istatistiklerini güncelle - BIST vadeli işlemler
function updateBistSpotFuturesArbitrageStatistics(data) {
    console.log("BistSpotFuturesArbitrageStatistics istatistikleri hesaplandı:", data);
    
    if (!data || data.length === 0) {
        console.log("İstatistik hesaplanacak veri bulunamadı");
        return;
    }
    
    // İstatistikleri hesapla
    const stats = calculateBistSpotFuturesArbitrageStatistics(data);
    console.log("BIST vadeli işlemler istatistikleri:", stats);
    
    // İstatistikleri göster (isteğe bağlı)
    displayBistSpotFuturesArbitrageStatistics(stats);
}

// BIST vadeli işlemler istatistiklerini hesapla
function calculateBistSpotFuturesArbitrageStatistics(data) {
    const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
    const totalGrossProfit = data.reduce((sum, item) => sum + item.grossProfit, 0);
    const totalNetProfit = data.reduce((sum, item) => sum + item.netProfit, 0);
    const averageGrossMargin = data.reduce((sum, item) => sum + item.grossProfitMargin, 0) / data.length;
    const averageNetMargin = data.reduce((sum, item) => sum + item.netProfitMargin, 0) / data.length;
    const profitableCount = data.filter(item => item.grossProfit > 0).length;
    
    return {
        totalVolume,
        totalGrossProfit,
        totalNetProfit,
        averageGrossMargin,
        averageNetMargin,
        profitableCount,
        totalCount: data.length,
        successRate: (profitableCount / data.length) * 100
    };
}

// BIST vadeli işlemler istatistiklerini göster
function displayBistSpotFuturesArbitrageStatistics(stats) {
    const statsContainer = document.getElementById('bist-vadeli-islemler-stats');
    if (!statsContainer) {
        console.log("İstatistik container bulunamadı, istatistikler gösterilmeyecek");
        return;
    }
    
    statsContainer.innerHTML = `
        <div class="row text-center">
            <div class="col-md-2">
                <small class="text-muted">Toplam Hacim</small>
                <div class="fw-bold">${stats.totalVolume.toLocaleString('tr-TR')}</div>
            </div>
            <div class="col-md-2">
                <small class="text-muted">Toplam Brüt Kar</small>
                <div class="fw-bold text-success">${stats.totalGrossProfit.toFixed(2).replace('.', ',')} TRY</div>
            </div>
            <div class="col-md-2">
                <small class="text-muted">Toplam Net Kar</small>
                <div class="fw-bold text-success">${stats.totalNetProfit.toFixed(2).replace('.', ',')} TRY</div>
            </div>
            <div class="col-md-2">
                <small class="text-muted">Ort. Brüt Marj</small>
                <div class="fw-bold">%${stats.averageGrossMargin.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="col-md-2">
                <small class="text-muted">Ort. Net Marj</small>
                <div class="fw-bold">%${stats.averageNetMargin.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="col-md-2">
                <small class="text-muted">Başarı Oranı</small>
                <div class="fw-bold">%${stats.successRate.toFixed(1).replace('.', ',')}</div>
            </div>
        </div>
    `;
}

// Arbitraj satır rengini belirle
function getArbitrageRowClass(arb) {
    if (!arb.isFinalized) return 'table-warning';
    if (arb.realizedReturn >= 0) return 'table-success';
    return 'table-danger';
}

// Durum badge rengini belirle
function getStatusBadgeClass(arb) {
    if (!arb.isFinalized) return 'bg-warning';
    if (arb.realizedReturn >= 0) return 'bg-success';
    return 'bg-danger';
}

// Durum metnini getir
function getStatusText(arb) {
    if (!arb.isFinalized) return 'Beklemede';
    if (arb.realizedReturn >= 0) return 'Karlı';
    return 'Zararlı';
}

// BIST Spot Futures Arbitrage detaylarını göster
export function showBistSpotFuturesArbitrageDetails(arbitrageId) {
    console.log("BIST Spot Futures Arbitrage detayları gösteriliyor:", arbitrageId);
    // Modal implementasyonu burada olacak
}

// BIST Spot Futures Arbitrage emirlerini göster
export function showBistSpotFuturesArbitrageOrders(arbitrageId) {
    console.log("BIST Spot Futures Arbitrage emirleri gösteriliyor:", arbitrageId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showBistSpotFuturesArbitrageDetails = showBistSpotFuturesArbitrageDetails;
window.showBistSpotFuturesArbitrageOrders = showBistSpotFuturesArbitrageOrders;

// Örnek BIST Spot Futures Arbitrage verisi - HTML tablosu ile uyumlu
export function getSampleBistSpotFuturesArbitrageData() {
    return [
        {
            id: 1,
            exchange: "Bitci",
            direction: "TRY Trio",
            volume: 6000,
            grossProfit: 300.00,
            netProfit: 240.00,
            grossProfitMargin: 1.56,
            netProfitMargin: 1.25,
            dateAdded: new Date("2024-01-15T10:30:00")
        },
        {
            id: 2,
            exchange: "Paribu",
            direction: "USDT Trio",
            volume: 4000,
            grossProfit: 300.00,
            netProfit: 180.00,
            grossProfitMargin: 1.50,
            netProfitMargin: 1.20,
            dateAdded: new Date("2024-01-15T11:15:00")
        },
        {
            id: 3,
            exchange: "Bitexen",
            direction: "TRY Trio",
            volume: 3000,
            grossProfit: 90.00,
            netProfit: 60.00,
            grossProfitMargin: 1.35,
            netProfitMargin: 1.28,
            dateAdded: new Date("2024-01-15T12:00:00")
        },
        {
            id: 4,
            exchange: "BtcTürk",
            direction: "USDT Trio",
            volume: 2000,
            grossProfit: 69.00,
            netProfit: 46.00,
            grossProfitMargin: 1.45,
            netProfitMargin: 1.26,
            dateAdded: new Date("2024-01-15T13:30:00")
        },
        {
            id: 5,
            exchange: "Icrypex",
            direction: "TRY Trio",
            volume: 5000,
            grossProfit: 50.00,
            netProfit: 35.00,
            grossProfitMargin: 0.90,
            netProfitMargin: 0.70,
            dateAdded: new Date("2024-01-15T14:15:00")
        }
    ];
} 

