// Wallet Identifier veri işleme fonksiyonları
export function handleWalletIdentifierData(walletIdentifiers) {
    console.log("Wallet Identifier verisi alındı:", walletIdentifiers);
    
    walletIdentifiers.forEach(wallet => {
        console.log("Wallet ID:", wallet.id);
        console.log("Currency:", wallet.currency?.name);
        console.log("Owner Exchange:", wallet.owner?.name);
        console.log("Wallet ID:", wallet.walletId);
        console.log("Destination Tag:", wallet.destinationTag);
        console.log("Is New:", wallet.isNew);
        console.log("Expire Time:", wallet.expireTime);
    });
    
    // DOM'u güncelle
    updateWalletIdentifierDisplay(walletIdentifiers);
    updateWalletIdentifierStatistics(walletIdentifiers);
}

// WalletIdentifierDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateWalletIdentifierDisplay(data) {
    console.log("WalletIdentifierDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// WalletIdentifierStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateWalletIdentifierStatistics(data) {
    console.log("WalletIdentifierStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Wallet Identifier detaylarını göster
export function showWalletIdentifierDetails(walletId) {
    console.log("Wallet Identifier detayları gösteriliyor:", walletId);
    // Modal implementasyonu burada olacak
}

// Wallet Identifier düzenle
export function editWalletIdentifier(walletId) {
    console.log("Wallet Identifier düzenleniyor:", walletId);
    // Düzenleme implementasyonu burada olacak
}

// Wallet Identifier yenile
export function renewWalletIdentifier(walletId) {
    console.log("Wallet Identifier yenileniyor:", walletId);
    // Yenileme implementasyonu burada olacak
}

// Wallet Identifier test et
export function testWalletIdentifier(walletId) {
    console.log("Wallet Identifier test ediliyor:", walletId);
    // Test implementasyonu burada olacak
}

// Wallet Identifier analiz et
export function analyzeWalletIdentifier(walletId) {
    console.log("Wallet Identifier analiz ediliyor:", walletId);
    // Analiz implementasyonu burada olacak
}

// Wallet işlemlerini göster
export function showWalletTransactions(walletId) {
    console.log("Wallet işlemleri gösteriliyor:", walletId);
    // İşlem gösterimi implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showWalletIdentifierDetails = showWalletIdentifierDetails;
window.editWalletIdentifier = editWalletIdentifier;
window.renewWalletIdentifier = renewWalletIdentifier;
window.testWalletIdentifier = testWalletIdentifier;
window.analyzeWalletIdentifier = analyzeWalletIdentifier;
window.showWalletTransactions = showWalletTransactions;

// Yardımcı fonksiyonlar
function getStatusBadge(wallet) {
    if (isExpired(wallet.expireTime)) {
        return `<span class="badge bg-danger">Süresi Dolmuş</span>`;
    }
    if (wallet.isNew) {
        return `<span class="badge bg-success">Yeni</span>`;
    }
    return `<span class="badge bg-info">Aktif</span>`;
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

function getSecurityBadgeClass(securityLevel) {
    switch(securityLevel) {
        case 'Çok Yüksek': return 'bg-success';
        case 'Yüksek': return 'bg-info';
        case 'Orta': return 'bg-warning';
        case 'Düşük': return 'bg-danger';
        case 'Çok Düşük': return 'bg-dark';
        default: return 'bg-secondary';
    }
}

function getTimeRemainingBadgeClass(timeRemaining) {
    if (timeRemaining <= 0) return 'bg-danger';
    if (timeRemaining <= 3600000) return 'bg-danger'; // 1 saat
    if (timeRemaining <= 86400000) return 'bg-warning'; // 1 gün
    if (timeRemaining <= 604800000) return 'bg-info'; // 1 hafta
    return 'bg-success';
}

function getWalletIdentifierRowClass(wallet) {
    if (isExpired(wallet.expireTime)) return 'table-danger';
    if (wallet.isNew) return 'table-success';
    return '';
}

function calculateTimeRemaining(expireTime) {
    const now = Date.now();
    return expireTime - now;
}

function isExpired(expireTime) {
    return calculateTimeRemaining(expireTime) <= 0;
}

function calculateSecurityLevel(wallet) {
    let securityScore = 0;
    
    // Para birimi güvenliği
    if (wallet.currency?.assetType === 'Fiat') securityScore += 2;
    else if (wallet.currency?.assetType === 'Crypto') securityScore += 1;
    
    // Exchange güvenliği
    if (wallet.owner?.context === 'Spot') securityScore += 2;
    else if (wallet.owner?.context === 'Futures') securityScore += 1;
    
    // Cüzdan ID varlığı
    if (wallet.walletId) securityScore += 2;
    
    // Hedef etiketi varlığı
    if (wallet.destinationTag) securityScore += 1;
    
    // Yeni cüzdan bonusu
    if (wallet.isNew) securityScore += 1;
    
    // Süre kontrolü
    const timeRemaining = calculateTimeRemaining(wallet.expireTime);
    if (timeRemaining > 2592000000) securityScore += 2; // 1 aydan fazla
    else if (timeRemaining > 604800000) securityScore += 1; // 1 haftadan fazla
    else if (timeRemaining <= 0) securityScore -= 3; // Süresi dolmuş
    
    if (securityScore >= 8) return 'Çok Yüksek';
    if (securityScore >= 6) return 'Yüksek';
    if (securityScore >= 4) return 'Orta';
    if (securityScore >= 2) return 'Düşük';
    return 'Çok Düşük';
}

function formatExpireTime(expireTime) {
    const date = new Date(expireTime);
    return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTimeRemaining(timeRemaining) {
    if (timeRemaining <= 0) return 'Süresi Dolmuş';
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}g ${hours}s`;
    if (hours > 0) return `${hours}s ${minutes}d`;
    return `${minutes}d`;
}


// Örnek wallet identifier verisi
export function getSampleWalletIdentifierData() {
    return [
        {
            id: 1,
            currency: {
                id: 1,
                name: "USDT",
                assetType: "Crypto"
            },
            owner: {
                id: 1,
                name: "Binance",
                context: "Spot"
            },
            walletId: "TQn9Y2khDD95J42FQtQTdwVVRqjqjqjqjq",
            destinationTag: null,
            isNew: false,
            expireTime: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 gün sonra
        },
        {
            id: 2,
            currency: {
                id: 2,
                name: "BTC",
                assetType: "Crypto"
            },
            owner: {
                id: 2,
                name: "Coinbase Pro",
                context: "Spot"
            },
            walletId: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            destinationTag: null,
            isNew: true,
            expireTime: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 gün sonra
        },
        {
            id: 3,
            currency: {
                id: 3,
                name: "USD",
                assetType: "Fiat"
            },
            owner: {
                id: 3,
                name: "Kraken",
                context: "Spot"
            },
            walletId: "US123456789",
            destinationTag: "REF123",
            isNew: false,
            expireTime: Date.now() - (1 * 24 * 60 * 60 * 1000) // 1 gün önce (süresi dolmuş)
        },
        {
            id: 4,
            currency: {
                id: 4,
                name: "ETH",
                assetType: "Crypto"
            },
            owner: {
                id: 4,
                name: "Bybit",
                context: "Futures"
            },
            walletId: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b7",
            destinationTag: null,
            isNew: false,
            expireTime: Date.now() + (2 * 60 * 60 * 1000) // 2 saat sonra
        },
        {
            id: 5,
            currency: {
                id: 5,
                name: "EUR",
                assetType: "Fiat"
            },
            owner: {
                id: 5,
                name: "Deribit",
                context: "Options"
            },
            walletId: "DE987654321",
            destinationTag: "OPT456",
            isNew: true,
            expireTime: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 gün sonra
        }
    ];
} 

