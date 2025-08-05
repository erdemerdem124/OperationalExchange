/**
 * Asset DTO - Hafif ticaret varlığı için yüksek frekanslı ticaret operasyonları
 * Arbitraj senaryolarında minimum bellek kullanımı ve maksimum performans için optimize edilmiş
 * Bu geçici bir sınıftır, veritabanında saklanmaz, sadece çalışma zamanı operasyonları için kullanılır
 */
export class Asset {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.name = data.name ? data.name.toUpperCase() : "";
        this.blockchain = data.blockchain || "CEX";
        this.blockchainAddress = data.blockchainAddress || "";
        this.assetType = data.assetType || null;
        this.leverage = data.leverage || null;
        this.displayDecimals = data.displayDecimals || 0;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.expiration = data.expiration ? new Date(data.expiration) : null;
        this._hash = data._hash || null;
        
        // Borsa bazlı fiyatlar
        this.btcTurkPrice = data.btcTurkPrice || 0;
        this.paribuPrice = data.paribuPrice || 0;
        this.icrypexPrice = data.icrypexPrice || 0;
        this.bitciPrice = data.bitciPrice || 0;
        this.bitexenPrice = data.bitexenPrice || 0;
    }

    /**
     * Fiat para birimi olup olmadığını kontrol eder
     * Arbitraj çifti seçimi ve risk hesaplamaları için kritik
     */
    get isFiatCurrency() {
        const fiatCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNH", "TRY"];
        return fiatCurrencies.includes(this.name);
    }

    /**
     * Stablecoin olup olmadığını kontrol eder
     * Arbitraj fırsatı tanımlaması için önemli
     */
    get isStableCoin() {
        const stableCoins = ["USDT", "USDC", "BUSD", "DAI", "TUSD", "UST", "EURT"];
        return stableCoins.includes(this.name);
    }

    /**
     * Tutarlı görüntüleme için sayı formatlama bilgisi sağlar
     */
    get displayFormatInfo() {
        return {
            numberDecimalSeparator: ",",
            numberDecimalDigits: this.displayDecimals || 0,
            numberGroupSeparator: ".",
            numberGroupSizes: [3]
        };
    }

    /**
     * Asset'in string temsilini döndürür
     */
    toString() {
        return `${this.name} ${this.blockchain} ${this.blockchainAddress || ""}`.trim();
    }

    /**
     * İki asset'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return (this.name + this.blockchain) === (other.name + other.blockchain);
    }

    /**
     * Asset için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = this.toString();
            this._hash = this.computeHash(str);
        }
        return this._hash;
    }

    /**
     * String için basit hash hesaplama
     */
    computeHash(str) {
        if (!str) return 0;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32-bit integer'a dönüştür
        }
        return Math.abs(hash);
    }

    /**
     * Asset'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === "") {
            errors.push("Asset adı boş olamaz");
        }
        
        if (this.displayDecimals < 0) {
            errors.push("Görüntüleme ondalık sayısı negatif olamaz");
        }
        
        if (this.leverage !== null && this.leverage !== undefined && this.leverage <= 0) {
            errors.push("Kaldıraç pozitif olmalıdır");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Asset'i kopyalar
     */
    clone() {
        return new Asset({
            ...this,
            _hash: null // Hash'i yeniden hesaplanacak
        });
    }

    /**
     * Asset'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Asset(data);
        } catch (error) {
            console.error("Asset JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Asset'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Asset JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir asset objesi oluşturur (static method)
     */
    static create(name, options = {}) {
        return new Asset({
            name: name,
            ...options
        });
    }

    /**
     * Fiat para birimi kontrolü (static method)
     */
    static isFiatCurrency(asset) {
        const fiatCurrencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNH", "TRY"];
        return fiatCurrencies.includes(asset.name);
    }

    /**
     * Stablecoin kontrolü (static method)
     */
    static isStableCoin(asset) {
        const stableCoins = ["USDT", "USDC", "BUSD", "DAI", "TUSD", "UST", "EURT"];
        return stableCoins.includes(asset.name);
    }

    /**
     * Örnek asset verisi
     */
    static getSampleData() {
        return [
            new Asset({ id: 1, name: "TRY", assetType: "Forex", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 100000, paribuPrice: 95000, icrypexPrice: 102000, bitciPrice: 98000, bitexenPrice: 97500 }),
            new Asset({ id: 2, name: "USD", assetType: "Forex", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 3000, paribuPrice: 2950, icrypexPrice: 3100, bitciPrice: 3050, bitexenPrice: 3020 }),
            new Asset({ id: 3, name: "USDT", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 2500, paribuPrice: 2450, icrypexPrice: 2600, bitciPrice: 2550, bitexenPrice: 2520 }),
            new Asset({ id: 4, name: "BTC", assetType: "Crypto", blockchain: "CEX", displayDecimals: 8, btcTurkPrice: 65000, paribuPrice: 64800, icrypexPrice: 65200, bitciPrice: 64900, bitexenPrice: 65100 }),
            new Asset({ id: 5, name: "ETH", assetType: "Crypto", blockchain: "ETH", displayDecimals: 6, btcTurkPrice: 3200, paribuPrice: 3180, icrypexPrice: 3210, bitciPrice: 3190, bitexenPrice: 3205 }),
            new Asset({ id: 6, name: "XRP", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 0.65, paribuPrice: 0.64, icrypexPrice: 0.66, bitciPrice: 0.65, bitexenPrice: 0.65 }),
            new Asset({ id: 7, name: "BNB", assetType: "Crypto", blockchain: "BSC", displayDecimals: 2, btcTurkPrice: 400, paribuPrice: 398, icrypexPrice: 402, bitciPrice: 399, bitexenPrice: 401 }),
            new Asset({ id: 8, name: "ADA", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 1.25, paribuPrice: 1.24, icrypexPrice: 1.26, bitciPrice: 1.25, bitexenPrice: 1.25 }),
            new Asset({ id: 9, name: "SOL", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 150, paribuPrice: 149, icrypexPrice: 151, bitciPrice: 150, bitexenPrice: 150 }),
            new Asset({ id: 10, name: "AVAX", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 30, paribuPrice: 29.8, icrypexPrice: 30.2, bitciPrice: 30, bitexenPrice: 30.1 }),
            new Asset({ id: 11, name: "DOT", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 6.5, paribuPrice: 6.4, icrypexPrice: 6.6, bitciPrice: 6.5, bitexenPrice: 6.5 }),
            new Asset({ id: 12, name: "MATIC", assetType: "Crypto", blockchain: "POLYGON", displayDecimals: 2, btcTurkPrice: 0.95, paribuPrice: 0.94, icrypexPrice: 0.96, bitciPrice: 0.95, bitexenPrice: 0.95 }),
            new Asset({ id: 13, name: "TRX", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 0.13, paribuPrice: 0.13, icrypexPrice: 0.14, bitciPrice: 0.13, bitexenPrice: 0.13 }),
            new Asset({ id: 14, name: "LINK", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 14, paribuPrice: 13.9, icrypexPrice: 14.1, bitciPrice: 14, bitexenPrice: 14 }),
            new Asset({ id: 15, name: "ATOM", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 8.5, paribuPrice: 8.4, icrypexPrice: 8.6, bitciPrice: 8.5, bitexenPrice: 8.5 }),
            new Asset({ id: 16, name: "LTC", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 75, paribuPrice: 74.8, icrypexPrice: 75.2, bitciPrice: 75, bitexenPrice: 75.1 }),
            new Asset({ id: 17, name: "SHIB", assetType: "Crypto", blockchain: "CEX", displayDecimals: 8, btcTurkPrice: 0.00002, paribuPrice: 0.000019, icrypexPrice: 0.000021, bitciPrice: 0.00002, bitexenPrice: 0.00002 }),
            new Asset({ id: 18, name: "UNI", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 6.2, paribuPrice: 6.1, icrypexPrice: 6.3, bitciPrice: 6.2, bitexenPrice: 6.2 }),
            new Asset({ id: 19, name: "ETC", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 24, paribuPrice: 23.8, icrypexPrice: 24.2, bitciPrice: 24, bitexenPrice: 24.1 }),
            new Asset({ id: 20, name: "ALGO", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 0.18, paribuPrice: 0.17, icrypexPrice: 0.19, bitciPrice: 0.18, bitexenPrice: 0.18 }),
            new Asset({ id: 21, name: "FTM", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 0.45, paribuPrice: 0.44, icrypexPrice: 0.46, bitciPrice: 0.45, bitexenPrice: 0.45 }),
            new Asset({ id: 22, name: "VET", assetType: "Crypto", blockchain: "CEX", displayDecimals: 3, btcTurkPrice: 0.025, paribuPrice: 0.024, icrypexPrice: 0.026, bitciPrice: 0.025, bitexenPrice: 0.025 }),
            new Asset({ id: 23, name: "ICP", assetType: "Crypto", blockchain: "CEX", displayDecimals: 2, btcTurkPrice: 8, paribuPrice: 7.9, icrypexPrice: 8.1, bitciPrice: 8, bitexenPrice: 8 })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Asset = Asset;
} 