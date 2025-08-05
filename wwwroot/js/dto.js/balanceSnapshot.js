// Balance Snapshot veri işleme fonksiyonları
export function handleBalanceSnapshotData(balanceSnapshots) {
    console.log("Balance Snapshot verisi alındı:", balanceSnapshots);
    
    balanceSnapshots.forEach(snapshot => {
        console.log("ID:", snapshot.id);
        console.log("Exchange:", snapshot.ownerExchange);
        console.log("Date Fetched:", snapshot.dateFetched);
    });
    
    // DOM'u güncelle
    updateBalanceSnapshotDisplay(balanceSnapshots);
    updateBalanceSnapshotStatistics(balanceSnapshots);
}

// BalanceSnapshotDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateBalanceSnapshotDisplay(data) {
    console.log("BalanceSnapshotDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// BalanceSnapshotStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateBalanceSnapshotStatistics(data) {
    console.log("BalanceSnapshotStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Exchange tipi badge rengini belirle
function getExchangeTypeBadgeClass(exchangeType) {
    switch(exchangeType) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-danger';
        case 'OTC': return 'bg-secondary';
        default: return 'bg-info';
    }
}

// Exchange tipi adını getir
function getExchangeTypeName(exchangeType) {
    switch(exchangeType) {
        case 'Spot': return 'Spot';
        case 'Futures': return 'Vadeli';
        case 'Options': return 'Opsiyon';
        case 'OTC': return 'OTC';
        default: return exchangeType || 'Bilinmeyen';
    }
}

// Zaman önce hesapla
function getTimeAgo(dateFetched) {
    const now = new Date();
    const fetched = new Date(dateFetched);
    const diffMs = now - fetched;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return fetched.toLocaleDateString('tr-TR');
}

// Balance Snapshot detaylarını göster
export function showBalanceSnapshotDetails(snapshotId) {
    console.log("Balance Snapshot detayları gösteriliyor:", snapshotId);
    // Modal implementasyonu burada olacak
}

// Global fonksiyon olarak da ekle (HTML'den çağrılabilir)
window.showBalanceSnapshotDetails = showBalanceSnapshotDetails;

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterBalanceSnapshots(snapshots, filters) { ... } - KALDIRILDI

// Örnek balance snapshot verisi
export function getSampleBalanceSnapshotData() {
    return [
        {
            id: 1,
            ownerExchange: {
                id: 1,
                name: "Binance",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "binance_api_key_1"
            },
            dateFetched: new Date("2024-01-15T10:30:00")
        },
        {
            id: 2,
            ownerExchange: {
                id: 2,
                name: "Coinbase Pro",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "coinbase_api_key_1"
            },
            dateFetched: new Date("2024-01-15T11:15:00")
        },
        {
            id: 3,
            ownerExchange: {
                id: 3,
                name: "Bybit",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "bybit_api_key_1"
            },
            dateFetched: new Date("2024-01-15T12:00:00")
        },
        {
            id: 4,
            ownerExchange: {
                id: 4,
                name: "Kraken",
                exchangeType: "Spot",
                isActive: false,
                apiKey: "kraken_api_key_1"
            },
            dateFetched: new Date("2024-01-14T15:45:00")
        },
        {
            id: 5,
            ownerExchange: {
                id: 5,
                name: "Deribit",
                exchangeType: "Options",
                isActive: true,
                apiKey: "deribit_api_key_1"
            },
            dateFetched: new Date("2024-01-15T09:20:00")
        },
        {
            id: 6,
            ownerExchange: {
                id: 6,
                name: "OKX",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "okx_api_key_1"
            },
            dateFetched: new Date("2024-01-15T13:30:00")
        },
        {
            id: 7,
            ownerExchange: {
                id: 7,
                name: "Huobi",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "huobi_api_key_1"
            },
            dateFetched: new Date("2024-01-15T14:15:00")
        },
        {
            id: 8,
            ownerExchange: {
                id: 8,
                name: "BitMEX",
                exchangeType: "Futures",
                isActive: false,
                apiKey: "bitmex_api_key_1"
            },
            dateFetched: new Date("2024-01-13T16:20:00")
        }
    ];
} 

