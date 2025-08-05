// Position veri işleme fonksiyonları
export function handlePositionData(positions) {
    console.log("Position verisi alındı:", positions);
    
    positions.forEach(position => {
        console.log("Position ID:", position.id);
        console.log("Ticket:", position.ticket);
        console.log("Direction:", position.direction);
        console.log("Volume:", position.volume);
        console.log("Opening Price:", position.openingPrice);
        console.log("Current Price:", position.currentPrice);
        console.log("Profit:", position.profit);
        console.log("Pair:", position.pair?.friendlyName);
        console.log("Is Finalized:", position.isFinalized);
    });
    
    // DOM'u güncelle
    updatePositionDisplay(positions);
    updatePositionStatistics(positions);
}

// PositionDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePositionDisplay(data) {
    console.log("PositionDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// PositionStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updatePositionStatistics(data) {
    console.log("PositionStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Position detaylarını göster
export function showPositionDetails(positionId) {
    console.log("Position detayları gösteriliyor:", positionId);
    // Modal implementasyonu burada olacak
}

// Position düzenle
export function editPosition(positionId) {
    console.log("Position düzenleniyor:", positionId);
    // Düzenleme implementasyonu burada olacak
}

// Position kapat
export function closePosition(positionId) {
    console.log("Position kapatılıyor:", positionId);
    // Kapatma implementasyonu burada olacak
}

// Position yeniden aç
export function reopenPosition(positionId) {
    console.log("Position yeniden açılıyor:", positionId);
    // Yeniden açma implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showPositionDetails = showPositionDetails;
window.editPosition = editPosition;
window.closePosition = closePosition;
window.reopenPosition = reopenPosition;

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

function formatTimestamp(milliseconds) {
    if (!milliseconds) return 'N/A';
    const date = new Date(milliseconds);
    return date.toLocaleString('tr-TR');
}

function formatDuration(milliseconds) {
    if (!milliseconds || milliseconds <= 0) return 'N/A';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days} gün ${hours % 24} saat`;
    } else if (hours > 0) {
        return `${hours} saat ${minutes % 60} dakika`;
    } else if (minutes > 0) {
        return `${minutes} dakika ${seconds % 60} saniye`;
    } else {
        return `${seconds} saniye`;
    }
}


// Örnek position verisi
export function getSamplePositionData() {
    return [
        {
            id: 1,
            ticket: "POS-001",
            timeMiliseconds: Date.now() - (24 * 60 * 60 * 1000), // 1 gün önce
            direction: "Buy",
            timeUpdateMiliseconds: Date.now(),
            volume: 0.5,
            openingPrice: 45000.0,
            currentPrice: 46500.0,
            profit: 750.0,
            pair: {
                id: 1,
                friendlyName: "Bitcoin/US Dollar",
                asset1: { abbreviationSymbol: "BTC" },
                asset2: { abbreviationSymbol: "USD" }
            },
            comment: "Trend takibi pozisyonu",
            isFinalized: false
        },
        {
            id: 2,
            ticket: "POS-002",
            timeMiliseconds: Date.now() - (2 * 60 * 60 * 1000), // 2 saat önce
            direction: "Sell",
            timeUpdateMiliseconds: Date.now(),
            volume: 1.0,
            openingPrice: 3200.0,
            currentPrice: 3150.0,
            profit: 50.0,
            pair: {
                id: 2,
                friendlyName: "Ethereum/US Dollar",
                asset1: { abbreviationSymbol: "ETH" },
                asset2: { abbreviationSymbol: "USD" }
            },
            comment: "Kısa vadeli arbitraj",
            isFinalized: false
        },
        {
            id: 3,
            ticket: "POS-003",
            timeMiliseconds: Date.now() - (7 * 24 * 60 * 60 * 1000), // 1 hafta önce
            direction: "Buy",
            timeUpdateMiliseconds: Date.now() - (24 * 60 * 60 * 1000), // 1 gün önce
            volume: 2.0,
            openingPrice: 2800.0,
            currentPrice: 3150.0,
            profit: 700.0,
            pair: {
                id: 2,
                friendlyName: "Ethereum/US Dollar",
                asset1: { abbreviationSymbol: "ETH" },
                asset2: { abbreviationSymbol: "USD" }
            },
            comment: "Uzun vadeli yatırım",
            isFinalized: true
        },
        {
            id: 4,
            ticket: "POS-004",
            timeMiliseconds: Date.now() - (12 * 60 * 60 * 1000), // 12 saat önce
            direction: "Sell",
            timeUpdateMiliseconds: Date.now(),
            volume: 0.1,
            openingPrice: 45000.0,
            currentPrice: 46500.0,
            profit: -150.0,
            pair: {
                id: 1,
                friendlyName: "Bitcoin/US Dollar",
                asset1: { abbreviationSymbol: "BTC" },
                asset2: { abbreviationSymbol: "USD" }
            },
            comment: "Test pozisyonu",
            isFinalized: false
        },
        {
            id: 5,
            ticket: "POS-005",
            timeMiliseconds: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 gün önce
            direction: "Buy",
            timeUpdateMiliseconds: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 gün önce
            volume: 5.0,
            openingPrice: 1.20,
            currentPrice: 1.15,
            profit: -250.0,
            pair: {
                id: 3,
                friendlyName: "Cardano/US Dollar",
                asset1: { abbreviationSymbol: "ADA" },
                asset2: { abbreviationSymbol: "USD" }
            },
            comment: "Düşük fiyat alımı",
            isFinalized: true
        }
    ];
} 

