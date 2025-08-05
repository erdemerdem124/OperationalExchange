// Capital veri işleme fonksiyonları
export function handleCapitalData(capitals) {
    console.log("Capital verisi alındı:", capitals);
    
    capitals.forEach(capital => {
        console.log("Capital ID:", capital.id);
        console.log("Currency:", capital.currency?.name);
        console.log("Amount:", capital.amount);
        console.log("Balance Snapshot:", capital.balanceSnapshot?.id);
    });
    
    // DOM'u güncelle
    updateCapitalDisplay(capitals);
    updateCapitalStatistics(capitals);
}

// CapitalDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateCapitalDisplay(data) {
    console.log("CapitalDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// CapitalStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateCapitalStatistics(data) {
    console.log("CapitalStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Capital detaylarını göster
export function showCapitalDetails(capitalId) {
    console.log("Capital detayları gösteriliyor:", capitalId);
    // Modal implementasyonu burada olacak
}

// Capital düzenle
export function editCapital(capitalId) {
    console.log("Capital düzenleniyor:", capitalId);
    // Düzenleme implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showCapitalDetails = showCapitalDetails;
window.editCapital = editCapital;

// Yardımcı fonksiyonlar
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
    // Basit USD dönüşüm oranları (gerçek uygulamada API'den alınacak)
    const usdRates = {
        'TRY': 0.031, // 1 TRY = 0.031 USD
        'EUR': 1.08,  // 1 EUR = 1.08 USD
        'BTC': 45000, // 1 BTC = 45000 USD
        'ETH': 3000,  // 1 ETH = 3000 USD
        'USD': 1      // 1 USD = 1 USD
    };
    
    const currency = capital.currency?.abbreviationSymbol || 'USD';
    const rate = usdRates[currency] || 1;
    return capital.amount * rate;
}

function formatDate(date) {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('tr-TR');
}

// Filtreleme fonksiyonları - Kaldırıldı, yeni models.js sistemi kullanılacak
// export function filterCapitals(capitals, filters) { ... } - KALDIRILDI

// Örnek capital verisi
export function getSampleCapitalData() {
    return [
        {
            id: 1,
            currency: {
                id: 1,
                name: "Turkish Lira",
                abbreviationSymbol: "TRY",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 150000.50,
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
        {
            id: 2,
            currency: {
                id: 2,
                name: "Bitcoin",
                abbreviationSymbol: "BTC",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 2.5,
            balanceSnapshot: {
                id: 2,
                ownerExchange: {
                    id: 2,
                    name: "Coinbase Pro",
                    exchangeType: "Spot",
                    isActive: true,
                    apiKey: "coinbase_api_key_1"
                },
                dateFetched: new Date("2024-01-15T11:15:00")
            }
        },
        {
            id: 3,
            currency: {
                id: 3,
                name: "Ethereum",
                abbreviationSymbol: "ETH",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 15.75,
            balanceSnapshot: {
                id: 3,
                ownerExchange: {
                    id: 3,
                    name: "Bybit",
                    exchangeType: "Futures",
                    isActive: true,
                    apiKey: "bybit_api_key_1"
                },
                dateFetched: new Date("2024-01-15T12:00:00")
            }
        },
        {
            id: 4,
            currency: {
                id: 4,
                name: "Euro",
                abbreviationSymbol: "EUR",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 5000.00,
            balanceSnapshot: {
                id: 4,
                ownerExchange: {
                    id: 4,
                    name: "Kraken",
                    exchangeType: "Spot",
                    isActive: false,
                    apiKey: "kraken_api_key_1"
                },
                dateFetched: new Date("2024-01-14T15:45:00")
            }
        },
        {
            id: 5,
            currency: {
                id: 5,
                name: "US Dollar",
                abbreviationSymbol: "USD",
                assetType: "Forex",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 25000.00,
            balanceSnapshot: {
                id: 5,
                ownerExchange: {
                    id: 5,
                    name: "Deribit",
                    exchangeType: "Options",
                    isActive: true,
                    apiKey: "deribit_api_key_1"
                },
                dateFetched: new Date("2024-01-15T09:20:00")
            }
        },
        {
            id: 6,
            currency: {
                id: 6,
                name: "Binance Coin",
                abbreviationSymbol: "BNB",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 100.25,
            balanceSnapshot: {
                id: 6,
                ownerExchange: {
                    id: 6,
                    name: "OKX",
                    exchangeType: "Futures",
                    isActive: true,
                    apiKey: "okx_api_key_1"
                },
                dateFetched: new Date("2024-01-15T13:30:00")
            }
        },
        {
            id: 7,
            currency: {
                id: 7,
                name: "Gold",
                abbreviationSymbol: "XAU",
                assetType: "Commodity",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 5.5,
            balanceSnapshot: {
                id: 7,
                ownerExchange: {
                    id: 7,
                    name: "Huobi",
                    exchangeType: "Spot",
                    isActive: true,
                    apiKey: "huobi_api_key_1"
                },
                dateFetched: new Date("2024-01-15T14:15:00")
            }
        },
        {
            id: 8,
            currency: {
                id: 8,
                name: "Cardano",
                abbreviationSymbol: "ADA",
                assetType: "Crypto",
                isPerpetual: false,
                dateAdded: new Date("2024-01-01T00:00:00")
            },
            amount: 50000.00,
            balanceSnapshot: {
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
        }
    ];
} 

