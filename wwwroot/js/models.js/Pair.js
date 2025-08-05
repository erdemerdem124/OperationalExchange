/**
 * Pair DTO - Yüksek frekanslı ticaret sisteminde bir trading pair'i temsil eder
 * Minimum bellek kullanımı ve yüksek performans operasyonları için optimize edilmiştir
 * Sadece temel veriler veritabanında saklanırken tüm gerekli trading mantığı korunur
 */

import { Asset } from './Asset.js';
import { Exchange } from './Exchange.js';

export class Pair {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.context = data.context || "Spot";
        this.tradingFeeLevel = data.tradingFeeLevel || "Medium";
        
        // Trading constraints ve parametreler
        this.lotDigit = data.lotDigit || 8;
        this.priceDigit = data.priceDigit || 8;
        this.lotIncrement = data.lotIncrement || 0.00000001;
        this.priceIncrement = data.priceIncrement || 0.00000001;
        this.minimumOrderAmount = data.minimumOrderAmount || 0;
        this.maximumOrderAmount = data.maximumOrderAmount || 0;
        
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        
        // Trading fee rates (basis points - 1bp = 0.01%)
        this.takerFeeRate = data.takerFeeRate || null;
        this.makerFeeRate = data.makerFeeRate || null;
        
        // Navigation properties
        this.exchangeId = data.exchangeId || 0;
        this.exchange = data.exchange ? new Exchange(data.exchange) : null;
        
        this.asset1Id = data.asset1Id || 0;
        this.asset1 = data.asset1 ? new Asset(data.asset1) : null;
        
        this.asset2Id = data.asset2Id || 0;
        this.asset2 = data.asset2 ? new Asset(data.asset2) : null;
        
        // Status flags
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.isExpired = data.isExpired || false;
        this.isDeleted = data.isDeleted || false;
        this.tradingFeeTakenFromBoughtAmount = data.tradingFeeTakenFromBoughtAmount !== undefined ? data.tradingFeeTakenFromBoughtAmount : true;
        this.tradingFeeTakenFromSoldAmount = data.tradingFeeTakenFromSoldAmount !== undefined ? data.tradingFeeTakenFromSoldAmount : true;
        
        // Cached values
        this._toString = null;
        this._rawName = null;
        this._hash = data._hash || null;
    }

    /**
     * Pair'in string temsilini döndürür (cached)
     */
    toString() {
        if (this._toString === null) {
            this._toString = `${this.asset1?.name || 'Unknown'}_${this.asset2?.name || 'Unknown'}-${this.exchange?.name || 'Unknown'}`;
        }
        return this._toString;
    }

    /**
     * Raw pair adını döndürür (cached)
     */
    rawName() {
        if (this._rawName === null) {
            this._rawName = `${this.asset1?.name || 'Unknown'}_${this.asset2?.name || 'Unknown'}`;
        }
        return this._rawName;
    }

    /**
     * Pair için hash değeri hesaplar
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
     * İki pair'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.toString() === other.toString();
    }

    /**
     * Pair'in adını getirir (geriye uyumluluk için)
     */
    get name() {
        return this.toString();
    }

    /**
     * Exchange adını getirir (geriye uyumluluk için)
     */
    get exchangeName() {
        return this.exchange?.name || '';
    }

    /**
     * Pair'in asset'lerini döndürür
     */
    getAssets() {
        return [this.asset1, this.asset2].filter(asset => asset !== null);
    }

    /**
     * Pair'in belirtilen currency'nin symbol'ü olup olmadığını kontrol eder
     */
    isSymbolOfCurrency(currency) {
        return this.asset1?.name === currency || this.asset2?.name === currency;
    }

    /**
     * Pair'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.asset1) {
            errors.push("Base asset gerekli");
        }
        
        if (!this.asset2) {
            errors.push("Quote asset gerekli");
        }
        
        if (!this.exchange) {
            errors.push("Exchange gerekli");
        }
        
        if (this.asset1 && this.asset2 && this.asset1.name === this.asset2.name) {
            errors.push("Base ve quote asset'ler farklı olmalı");
        }
        
        if (this.minimumOrderAmount < 0) {
            errors.push("Minimum order amount negatif olamaz");
        }
        
        if (this.maximumOrderAmount > 0 && this.minimumOrderAmount > this.maximumOrderAmount) {
            errors.push("Minimum order amount maximum'dan büyük olamaz");
        }
        
        if (this.lotIncrement <= 0) {
            errors.push("Lot increment pozitif olmalı");
        }
        
        if (this.priceIncrement <= 0) {
            errors.push("Price increment pozitif olmalı");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Pair'i kopyalar
     */
    clone() {
        return new Pair({
            ...this,
            asset1: this.asset1 ? this.asset1.clone() : null,
            asset2: this.asset2 ? this.asset2.clone() : null,
            exchange: this.exchange ? this.exchange.clone() : null,
            _toString: null,
            _rawName: null,
            _hash: null
        });
    }

    /**
     * Pair'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Pair(data);
        } catch (error) {
            console.error("Pair JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Pair'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Pair JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir pair objesi oluşturur (static method)
     */
    static create(baseAsset, quoteAsset, exchange) {
        return new Pair({
            asset1: baseAsset,
            asset1Id: baseAsset?.id || 0,
            asset2: quoteAsset,
            asset2Id: quoteAsset?.id || 0,
            exchange: exchange,
            exchangeId: exchange?.id || 0
        });
    }

    /**
     * Context badge rengini getirir
     */
    getContextBadgeClass() {
        switch(this.context) {
            case 'Spot': return 'bg-success';
            case 'Futures': return 'bg-warning';
            case 'Options': return 'bg-info';
            case 'Margin': return 'bg-primary';
            case 'OTC': return 'bg-secondary';
            default: return 'bg-dark';
        }
    }

    /**
     * Context adını getirir
     */
    getContextName() {
        switch(this.context) {
            case 'Spot': return 'Spot';
            case 'Futures': return 'Vadeli';
            case 'Options': return 'Opsiyon';
            case 'Margin': return 'Marjin';
            case 'OTC': return 'OTC';
            default: return this.context || 'Bilinmeyen';
        }
    }

    /**
     * Trading fee level badge rengini getirir
     */
    getTradingFeeLevelBadgeClass() {
        switch(this.tradingFeeLevel) {
            case 'Low': return 'bg-success';
            case 'Medium': return 'bg-warning';
            case 'High': return 'bg-danger';
            case 'VIP': return 'bg-primary';
            default: return 'bg-secondary';
        }
    }

    /**
     * Trading fee level adını getirir
     */
    getTradingFeeLevelName() {
        switch(this.tradingFeeLevel) {
            case 'Low': return 'Düşük';
            case 'Medium': return 'Orta';
            case 'High': return 'Yüksek';
            case 'VIP': return 'VIP';
            default: return this.tradingFeeLevel || 'Bilinmeyen';
        }
    }

    /**
     * Taker fee rate'ini yüzde olarak getirir
     */
    getTakerFeePercentage() {
        if (!this.takerFeeRate) return 0;
        return (this.takerFeeRate / 10000) * 100; // basis points to percentage
    }

    /**
     * Maker fee rate'ini yüzde olarak getirir
     */
    getMakerFeePercentage() {
        if (!this.makerFeeRate) return 0;
        return (this.makerFeeRate / 10000) * 100; // basis points to percentage
    }

    /**
     * Minimum order amount'u formatlar
     */
    getMinimumOrderAmountFormatted() {
        return this.minimumOrderAmount.toFixed(this.lotDigit);
    }

    /**
     * Maximum order amount'u formatlar
     */
    getMaximumOrderAmountFormatted() {
        if (this.maximumOrderAmount <= 0) return 'Sınırsız';
        return this.maximumOrderAmount.toFixed(this.lotDigit);
    }

    /**
     * Lot increment'i formatlar
     */
    getLotIncrementFormatted() {
        return this.lotIncrement.toFixed(this.lotDigit);
    }

    /**
     * Price increment'i formatlar
     */
    getPriceIncrementFormatted() {
        return this.priceIncrement.toFixed(this.priceDigit);
    }

    /**
     * Pair'in durumunu getirir
     */
    getStatusText() {
        if (this.isDeleted) return 'Silinmiş';
        if (this.isExpired) return 'Süresi Dolmuş';
        if (!this.isActive) return 'Pasif';
        return 'Aktif';
    }

    /**
     * Pair'in durum badge rengini getirir
     */
    getStatusBadgeClass() {
        if (this.isDeleted) return 'bg-danger';
        if (this.isExpired) return 'bg-warning';
        if (!this.isActive) return 'bg-secondary';
        return 'bg-success';
    }

    /**
     * Örnek pair verisi
     */
    static getSampleData() {
        return [
            new Pair({
                id: 1,
                context: "Spot",
                tradingFeeLevel: "Medium",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 0.001,
                maximumOrderAmount: 1000,
                takerFeeRate: 10, // 0.1%
                makerFeeRate: 5,  // 0.05%
                asset1: { id: 1, name: "BTC" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 1, name: "Binance" },
                isActive: true,
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new Pair({
                id: 2,
                context: "Spot",
                tradingFeeLevel: "Low",
                lotDigit: 8,
                priceDigit: 2,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 0.01,
                maximumOrderAmount: 500,
                takerFeeRate: 5,  // 0.05%
                makerFeeRate: 2,  // 0.02%
                asset1: { id: 3, name: "ETH" },
                asset2: { id: 4, name: "USD" },
                exchange: { id: 2, name: "Coinbase" },
                isActive: true,
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new Pair({
                id: 3,
                context: "Futures",
                tradingFeeLevel: "High",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.0001,
                minimumOrderAmount: 0.1,
                maximumOrderAmount: 10000,
                takerFeeRate: 15, // 0.15%
                makerFeeRate: 8,  // 0.08%
                asset1: { id: 5, name: "ADA" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 3, name: "Kraken" },
                isActive: true,
                dateAdded: new Date("2024-01-15T12:00:00")
            }),
            new Pair({
                id: 4,
                context: "Spot",
                tradingFeeLevel: "Medium",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 1,
                maximumOrderAmount: 50000,
                takerFeeRate: 12, // 0.12%
                makerFeeRate: 6,  // 0.06%
                asset1: { id: 6, name: "SOL" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 4, name: "Bybit" },
                isActive: true,
                dateAdded: new Date("2024-01-15T13:00:00")
            }),
            new Pair({
                id: 5,
                context: "Spot",
                tradingFeeLevel: "VIP",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.001,
                minimumOrderAmount: 0.1,
                maximumOrderAmount: 2000,
                takerFeeRate: 3,  // 0.03%
                makerFeeRate: 1,  // 0.01%
                asset1: { id: 7, name: "DOT" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 5, name: "KuCoin" },
                isActive: true,
                dateAdded: new Date("2024-01-15T14:00:00")
            }),
            new Pair({
                id: 6,
                context: "Margin",
                tradingFeeLevel: "High",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 0.001,
                maximumOrderAmount: 100,
                takerFeeRate: 20, // 0.2%
                makerFeeRate: 10, // 0.1%
                asset1: { id: 1, name: "BTC" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 1, name: "Binance" },
                isActive: false,
                dateAdded: new Date("2024-01-15T15:00:00")
            }),
            new Pair({
                id: 7,
                context: "Options",
                tradingFeeLevel: "VIP",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.0001,
                minimumOrderAmount: 0.01,
                maximumOrderAmount: 5000,
                takerFeeRate: 25, // 0.25%
                makerFeeRate: 15, // 0.15%
                asset1: { id: 3, name: "ETH" },
                asset2: { id: 4, name: "USD" },
                exchange: { id: 6, name: "Deribit" },
                isActive: true,
                dateAdded: new Date("2024-01-15T16:00:00")
            }),
            new Pair({
                id: 8,
                context: "Spot",
                tradingFeeLevel: "Low",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 10,
                maximumOrderAmount: 100000,
                takerFeeRate: 8,  // 0.08%
                makerFeeRate: 4,  // 0.04%
                asset1: { id: 8, name: "LINK" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 3, name: "Kraken" },
                isActive: true,
                dateAdded: new Date("2024-01-15T17:00:00")
            }),
            new Pair({
                id: 9,
                context: "Futures",
                tradingFeeLevel: "Medium",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.001,
                minimumOrderAmount: 0.1,
                maximumOrderAmount: 10000,
                takerFeeRate: 12, // 0.12%
                makerFeeRate: 6,  // 0.06%
                asset1: { id: 9, name: "MATIC" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 4, name: "Bybit" },
                isActive: true,
                dateAdded: new Date("2024-01-15T18:00:00")
            }),
            new Pair({
                id: 10,
                context: "Spot",
                tradingFeeLevel: "High",
                lotDigit: 8,
                priceDigit: 8,
                lotIncrement: 0.00000001,
                priceIncrement: 0.01,
                minimumOrderAmount: 0.1,
                maximumOrderAmount: 5000,
                takerFeeRate: 18, // 0.18%
                makerFeeRate: 9,  // 0.09%
                asset1: { id: 10, name: "AVAX" },
                asset2: { id: 2, name: "USDT" },
                exchange: { id: 5, name: "KuCoin" },
                isActive: true,
                dateAdded: new Date("2024-01-15T19:00:00")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Pair = Pair;
} 