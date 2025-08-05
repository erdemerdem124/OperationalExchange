// Crypto Transfer veri işleme fonksiyonları
export function handleCryptoTransferData(transfers) {
    console.log("Crypto Transfer verisi alındı:", transfers);
    
    transfers.forEach(transfer => {
        console.log("Transfer ID:", transfer.id);
        console.log("From Exchange:", transfer.from?.name);
        console.log("To Exchange:", transfer.to?.name);
        console.log("Status:", transfer.status);
        console.log("Type:", transfer.type);
        console.log("Capital Amount:", transfer.capital?.amount);
    });
    
    // DOM'u güncelle
    updateCryptoTransferDisplay(transfers);
    updateCryptoTransferStatistics(transfers);
}

// CryptoTransferDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateCryptoTransferDisplay(data) {
    console.log("CryptoTransferDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// CryptoTransferStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateCryptoTransferStatistics(data) {
    console.log("CryptoTransferStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Crypto Transfer detaylarını göster
export function showCryptoTransferDetails(transferId) {
    console.log("Crypto Transfer detayları gösteriliyor:", transferId);
    // Modal implementasyonu burada olacak
}

// Crypto Transfer düzenle
export function editCryptoTransfer(transferId) {
    console.log("Crypto Transfer düzenleniyor:", transferId);
    // Düzenleme implementasyonu burada olacak
}

// Crypto Transfer onayla
export function approveCryptoTransfer(transferId) {
    console.log("Crypto Transfer onaylanıyor:", transferId);
    // Onaylama implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showCryptoTransferDetails = showCryptoTransferDetails;
window.editCryptoTransfer = editCryptoTransfer;
window.approveCryptoTransfer = approveCryptoTransfer;

// Yardımcı fonksiyonlar
function getTransferRowClass(status) {
    switch(status) {
        case 'Completed': return 'table-success';
        case 'Pending': return 'table-warning';
        case 'Failed': return 'table-danger';
        case 'Cancelled': return 'table-secondary';
        default: return '';
    }
}

function getStatusBadgeClass(status) {
    switch(status) {
        case 'Completed': return 'bg-success';
        case 'Pending': return 'bg-warning';
        case 'Failed': return 'bg-danger';
        case 'Cancelled': return 'bg-secondary';
        case 'Processing': return 'bg-info';
        default: return 'bg-dark';
    }
}

function getStatusText(status) {
    switch(status) {
        case 'Completed': return 'Tamamlandı';
        case 'Pending': return 'Bekliyor';
        case 'Failed': return 'Başarısız';
        case 'Cancelled': return 'İptal Edildi';
        case 'Processing': return 'İşleniyor';
        default: return status || 'Bilinmeyen';
    }
}

function getTypeBadgeClass(type) {
    switch(type) {
        case 'Deposit': return 'bg-success';
        case 'Withdrawal': return 'bg-danger';
        case 'Transfer': return 'bg-info';
        case 'Swap': return 'bg-warning';
        default: return 'bg-secondary';
    }
}

function getTypeText(type) {
    switch(type) {
        case 'Deposit': return 'Yatırma';
        case 'Withdrawal': return 'Çekme';
        case 'Transfer': return 'Transfer';
        case 'Swap': return 'Takas';
        default: return type || 'Bilinmeyen';
    }
}

function getExchangeBadgeClass(exchangeType) {
    switch(exchangeType) {
        case 'Spot': return 'bg-success';
        case 'Futures': return 'bg-warning';
        case 'Options': return 'bg-info';
        default: return 'bg-secondary';
    }
}

function getCurrencyBadgeClass(assetType) {
    switch(assetType) {
        case 'Crypto': return 'bg-warning';
        case 'Forex': return 'bg-info';
        case 'Stock': return 'bg-success';
        case 'Commodity': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

function calculateUsdValue(capital) {
    if (!capital) return 0;
    
    // Basit USD dönüşüm oranları
    const usdRates = {
        'TRY': 0.031,
        'EUR': 1.08,
        'BTC': 45000,
        'ETH': 3000,
        'USD': 1
    };
    
    const currency = capital.currency?.abbreviationSymbol || 'USD';
    const rate = usdRates[currency] || 1;
    return capital.amount * rate;
}

function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('tr-TR');
}

// Örnek crypto transfer verisi
export function getSampleCryptoTransferData() {
    return [
        {
            id: 1,
            operationalId: "OP-001-2024",
            from: {
                id: 1,
                name: "Binance",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "binance_api_key_1"
            },
            to: {
                id: 2,
                name: "Coinbase Pro",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "coinbase_api_key_1"
            },
            date: new Date("2024-01-15T10:30:00"),
            dateUpdated: new Date("2024-01-15T11:45:00"),
            friendlyId: "TRANSFER-001",
            status: "Completed",
            capital: {
                id: 1,
                currency: {
                    id: 2,
                    name: "Bitcoin",
                    abbreviationSymbol: "BTC",
                    assetType: "Crypto",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 0.5,
                balanceSnapshot: {
                    id: 1,
                    ownerExchange: {
                        id: 1,
                        name: "Binance",
                        exchangeType: "Spot",
                        isActive: true,
                        apiKey: "binance_api_key_1"
                    },
                    dateFetched: new Date("2024-01-15T10:30:00")
                }
            },
            isDemo: false,
            type: "Transfer",
            fee: 0.001,
            message: "Başarılı transfer"
        },
        {
            id: 2,
            operationalId: "OP-002-2024",
            from: {
                id: 3,
                name: "Bybit",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "bybit_api_key_1"
            },
            to: {
                id: 4,
                name: "Kraken",
                exchangeType: "Spot",
                isActive: false,
                apiKey: "kraken_api_key_1"
            },
            date: new Date("2024-01-16T14:20:00"),
            dateUpdated: new Date("2024-01-16T14:20:00"),
            friendlyId: "TRANSFER-002",
            status: "Pending",
            capital: {
                id: 2,
                currency: {
                    id: 3,
                    name: "Ethereum",
                    abbreviationSymbol: "ETH",
                    assetType: "Crypto",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 5.0,
                balanceSnapshot: {
                    id: 3,
                    ownerExchange: {
                        id: 3,
                        name: "Bybit",
                        exchangeType: "Futures",
                        isActive: true,
                        apiKey: "bybit_api_key_1"
                    },
                    dateFetched: new Date("2024-01-16T14:20:00")
                }
            },
            isDemo: true,
            type: "Withdrawal",
            fee: 0.005,
            message: "Bekleyen çekme işlemi"
        },
        {
            id: 3,
            operationalId: "OP-003-2024",
            from: {
                id: 5,
                name: "Deribit",
                exchangeType: "Options",
                isActive: true,
                apiKey: "deribit_api_key_1"
            },
            to: {
                id: 6,
                name: "OKX",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "okx_api_key_1"
            },
            date: new Date("2024-01-17T09:15:00"),
            dateUpdated: new Date("2024-01-17T10:30:00"),
            friendlyId: "TRANSFER-003",
            status: "Failed",
            capital: {
                id: 3,
                currency: {
                    id: 4,
                    name: "Euro",
                    abbreviationSymbol: "EUR",
                    assetType: "Forex",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 1000.00,
                balanceSnapshot: {
                    id: 5,
                    ownerExchange: {
                        id: 5,
                        name: "Deribit",
                        exchangeType: "Options",
                        isActive: true,
                        apiKey: "deribit_api_key_1"
                    },
                    dateFetched: new Date("2024-01-17T09:15:00")
                }
            },
            isDemo: false,
            type: "Deposit",
            fee: 0.00,
            message: "Yetersiz bakiye"
        },
        {
            id: 4,
            operationalId: "OP-004-2024",
            from: {
                id: 7,
                name: "Huobi",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "huobi_api_key_1"
            },
            to: {
                id: 8,
                name: "BitMEX",
                exchangeType: "Futures",
                isActive: false,
                apiKey: "bitmex_api_key_1"
            },
            date: new Date("2024-01-18T16:45:00"),
            dateUpdated: new Date("2024-01-18T16:45:00"),
            friendlyId: "TRANSFER-004",
            status: "Cancelled",
            capital: {
                id: 4,
                currency: {
                    id: 6,
                    name: "Binance Coin",
                    abbreviationSymbol: "BNB",
                    assetType: "Crypto",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 50.0,
                balanceSnapshot: {
                    id: 7,
                    ownerExchange: {
                        id: 7,
                        name: "Huobi",
                        exchangeType: "Spot",
                        isActive: true,
                        apiKey: "huobi_api_key_1"
                    },
                    dateFetched: new Date("2024-01-18T16:45:00")
                }
            },
            isDemo: true,
            type: "Swap",
            fee: 0.1,
            message: "Kullanıcı tarafından iptal edildi"
        },
        {
            id: 5,
            operationalId: "OP-005-2024",
            from: {
                id: 1,
                name: "Binance",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "binance_api_key_1"
            },
            to: {
                id: 3,
                name: "Bybit",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "bybit_api_key_1"
            },
            date: new Date("2024-01-19T11:20:00"),
            dateUpdated: new Date("2024-01-19T12:15:00"),
            friendlyId: "TRANSFER-005",
            status: "Completed",
            capital: {
                id: 5,
                currency: {
                    id: 2,
                    name: "Bitcoin",
                    abbreviationSymbol: "BTC",
                    assetType: "Crypto",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 1.0,
                balanceSnapshot: {
                    id: 1,
                    ownerExchange: {
                        id: 1,
                        name: "Binance",
                        exchangeType: "Spot",
                        isActive: true,
                        apiKey: "binance_api_key_1"
                    },
                    dateFetched: new Date("2024-01-19T11:20:00")
                }
            },
            isDemo: false,
            type: "Transfer",
            fee: 0.002,
            message: "Başarılı arbitraj transferi"
        },
        {
            id: 6,
            operationalId: "OP-006-2024",
            from: {
                id: 2,
                name: "Coinbase Pro",
                exchangeType: "Spot",
                isActive: true,
                apiKey: "coinbase_api_key_1"
            },
            to: {
                id: 6,
                name: "OKX",
                exchangeType: "Futures",
                isActive: true,
                apiKey: "okx_api_key_1"
            },
            date: new Date("2024-01-20T13:10:00"),
            dateUpdated: new Date("2024-01-20T13:10:00"),
            friendlyId: "TRANSFER-006",
            status: "Pending",
            capital: {
                id: 6,
                currency: {
                    id: 3,
                    name: "Ethereum",
                    abbreviationSymbol: "ETH",
                    assetType: "Crypto",
                    isPerpetual: false,
                    dateAdded: new Date("2024-01-01T00:00:00")
                },
                amount: 10.0,
                balanceSnapshot: {
                    id: 2,
                    ownerExchange: {
                        id: 2,
                        name: "Coinbase Pro",
                        exchangeType: "Spot",
                        isActive: true,
                        apiKey: "coinbase_api_key_1"
                    },
                    dateFetched: new Date("2024-01-20T13:10:00")
                }
            },
            isDemo: false,
            type: "Deposit",
            fee: 0.00,
            message: "Bekleyen yatırma işlemi"
        }
    ];
} 

