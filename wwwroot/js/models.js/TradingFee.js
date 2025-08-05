/**
 * TradingFee DTO - Belirli bir exchange'deki trading operasyonları için fee yapısını temsil eder
 * Yüksek frekanslı ticaret için optimize edilmiş minimum bellek kullanımı
 * Fee rate'leri yüzde olarak temsil eden decimal'lar olarak saklanır (örn: 0.001 = 0.1%)
 */

import { Exchange } from './Exchange.js';

export class TradingFee {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.exchangeId = data.exchangeId || 0;
        this.primaryMakerFeeRate = data.primaryMakerFeeRate || 0;
        this.secondaryMakerFeeRate = data.secondaryMakerFeeRate || 0;
        this.tertiaryMakerFeeRate = data.tertiaryMakerFeeRate || 0;
        this.primaryTakerFeeRate = data.primaryTakerFeeRate || 0;
        this.secondaryTakerFeeRate = data.secondaryTakerFeeRate || 0;
        this.tertiaryTakerFeeRate = data.tertiaryTakerFeeRate || 0;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.exchange = data.exchange ? new Exchange(data.exchange) : null;
        this.notionPageId = data.notionPageId || null;
        this._hash = data._hash || null;
    }

    /**
     * Fee yapısı için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            this._hash = this.exchange?.id || 0;
        }
        return this._hash;
    }

    /**
     * İki trading fee'nin eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.id === other.id && this.exchangeId === other.exchangeId;
    }

    /**
     * Trading fee'yi doğrular
     */
    validate() {
        const errors = [];
        
        if (this.exchangeId <= 0) {
            errors.push("Exchange ID gerekli");
        }
        
        if (this.primaryMakerFeeRate < 0) {
            errors.push("Primary maker fee rate negatif olamaz");
        }
        
        if (this.secondaryMakerFeeRate < 0) {
            errors.push("Secondary maker fee rate negatif olamaz");
        }
        
        if (this.tertiaryMakerFeeRate < 0) {
            errors.push("Tertiary maker fee rate negatif olamaz");
        }
        
        if (this.primaryTakerFeeRate < 0) {
            errors.push("Primary taker fee rate negatif olamaz");
        }
        
        if (this.secondaryTakerFeeRate < 0) {
            errors.push("Secondary taker fee rate negatif olamaz");
        }
        
        if (this.tertiaryTakerFeeRate < 0) {
            errors.push("Tertiary taker fee rate negatif olamaz");
        }
        
        // Maker fee'lerin taker fee'lerden düşük olması gerekir
        if (this.primaryMakerFeeRate > this.primaryTakerFeeRate) {
            errors.push("Primary maker fee taker fee'den yüksek olamaz");
        }
        
        if (this.secondaryMakerFeeRate > this.secondaryTakerFeeRate) {
            errors.push("Secondary maker fee taker fee'den yüksek olamaz");
        }
        
        if (this.tertiaryMakerFeeRate > this.tertiaryTakerFeeRate) {
            errors.push("Tertiary maker fee taker fee'den yüksek olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Trading fee'yi kopyalar
     */
    clone() {
        return new TradingFee({
            ...this,
            exchange: this.exchange ? this.exchange.clone() : null,
            dateAdded: new Date(this.dateAdded),
            _hash: null
        });
    }

    /**
     * Trading fee'yi JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new TradingFee(data);
        } catch (error) {
            console.error("TradingFee JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Trading fee'yi JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                exchangeId: this.exchangeId,
                primaryMakerFeeRate: this.primaryMakerFeeRate,
                secondaryMakerFeeRate: this.secondaryMakerFeeRate,
                tertiaryMakerFeeRate: this.tertiaryMakerFeeRate,
                primaryTakerFeeRate: this.primaryTakerFeeRate,
                secondaryTakerFeeRate: this.secondaryTakerFeeRate,
                tertiaryTakerFeeRate: this.tertiaryTakerFeeRate,
                dateAdded: this.dateAdded.toISOString(),
                exchange: this.exchange,
                notionPageId: this.notionPageId
            });
        } catch (error) {
            console.error("TradingFee JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir trading fee objesi oluşturur (static method)
     */
    static create(exchangeId, exchange = null) {
        return new TradingFee({
            exchangeId: exchangeId,
            exchange: exchange
        });
    }

    /**
     * Primary maker fee'yi yüzde olarak getirir
     */
    getPrimaryMakerFeePercentage() {
        return this.primaryMakerFeeRate * 100;
    }

    /**
     * Secondary maker fee'yi yüzde olarak getirir
     */
    getSecondaryMakerFeePercentage() {
        return this.secondaryMakerFeeRate * 100;
    }

    /**
     * Tertiary maker fee'yi yüzde olarak getirir
     */
    getTertiaryMakerFeePercentage() {
        return this.tertiaryMakerFeeRate * 100;
    }

    /**
     * Primary taker fee'yi yüzde olarak getirir
     */
    getPrimaryTakerFeePercentage() {
        return this.primaryTakerFeeRate * 100;
    }

    /**
     * Secondary taker fee'yi yüzde olarak getirir
     */
    getSecondaryTakerFeePercentage() {
        return this.secondaryTakerFeeRate * 100;
    }

    /**
     * Tertiary taker fee'yi yüzde olarak getirir
     */
    getTertiaryTakerFeePercentage() {
        return this.tertiaryTakerFeeRate * 100;
    }

    /**
     * Ortalama maker fee'yi hesaplar
     */
    getAverageMakerFee() {
        return (this.primaryMakerFeeRate + this.secondaryMakerFeeRate + this.tertiaryMakerFeeRate) / 3;
    }

    /**
     * Ortalama taker fee'yi hesaplar
     */
    getAverageTakerFee() {
        return (this.primaryTakerFeeRate + this.secondaryTakerFeeRate + this.tertiaryTakerFeeRate) / 3;
    }

    /**
     * Maker fee spread'ini hesaplar (en yüksek - en düşük)
     */
    getMakerFeeSpread() {
        const fees = [this.primaryMakerFeeRate, this.secondaryMakerFeeRate, this.tertiaryMakerFeeRate];
        return Math.max(...fees) - Math.min(...fees);
    }

    /**
     * Taker fee spread'ini hesaplar (en yüksek - en düşük)
     */
    getTakerFeeSpread() {
        const fees = [this.primaryTakerFeeRate, this.secondaryTakerFeeRate, this.tertiaryTakerFeeRate];
        return Math.max(...fees) - Math.min(...fees);
    }

    /**
     * Tarihi formatlar
     */
    getDateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Exchange adını getirir
     */
    getExchangeName() {
        return this.exchange?.name || 'Unknown';
    }

    /**
     * Fee yapısının aktif olup olmadığını kontrol eder
     */
    isActive() {
        return this.exchange && this.exchange.isActive;
    }

    /**
     * Fee yapısının geçerli olup olmadığını kontrol eder
     */
    isValid() {
        return this.primaryMakerFeeRate >= 0 && this.primaryTakerFeeRate >= 0;
    }

    /**
     * Fee yapısının VIP olup olmadığını kontrol eder (düşük fee'ler)
     */
    isVip() {
        return this.primaryMakerFeeRate < 0.001 && this.primaryTakerFeeRate < 0.002;
    }

    /**
     * Fee yapısının premium olup olmadığını kontrol eder
     */
    isPremium() {
        return this.primaryMakerFeeRate < 0.002 && this.primaryTakerFeeRate < 0.005;
    }

    /**
     * Örnek trading fee verisi
     */
    static getSampleData() {
        return [
            new TradingFee({
                id: 1,
                exchangeId: 1,
                exchange: { id: 1, name: "Binance" },
                primaryMakerFeeRate: 0.001,
                secondaryMakerFeeRate: 0.0008,
                tertiaryMakerFeeRate: 0.0005,
                primaryTakerFeeRate: 0.001,
                secondaryTakerFeeRate: 0.0008,
                tertiaryTakerFeeRate: 0.0005,
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new TradingFee({
                id: 2,
                exchangeId: 2,
                exchange: { id: 2, name: "Coinbase" },
                primaryMakerFeeRate: 0.004,
                secondaryMakerFeeRate: 0.003,
                tertiaryMakerFeeRate: 0.002,
                primaryTakerFeeRate: 0.006,
                secondaryTakerFeeRate: 0.004,
                tertiaryTakerFeeRate: 0.003,
                dateAdded: new Date("2024-01-15T10:30:00")
            }),
            new TradingFee({
                id: 3,
                exchangeId: 3,
                exchange: { id: 3, name: "Kraken" },
                primaryMakerFeeRate: 0.0016,
                secondaryMakerFeeRate: 0.0014,
                tertiaryMakerFeeRate: 0.0012,
                primaryTakerFeeRate: 0.0026,
                secondaryTakerFeeRate: 0.0024,
                tertiaryTakerFeeRate: 0.0022,
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new TradingFee({
                id: 4,
                exchangeId: 4,
                exchange: { id: 4, name: "Bybit" },
                primaryMakerFeeRate: 0.001,
                secondaryMakerFeeRate: 0.0008,
                tertiaryMakerFeeRate: 0.0006,
                primaryTakerFeeRate: 0.001,
                secondaryTakerFeeRate: 0.0008,
                tertiaryTakerFeeRate: 0.0006,
                dateAdded: new Date("2024-01-15T11:30:00")
            }),
            new TradingFee({
                id: 5,
                exchangeId: 5,
                exchange: { id: 5, name: "KuCoin" },
                primaryMakerFeeRate: 0.001,
                secondaryMakerFeeRate: 0.0008,
                tertiaryMakerFeeRate: 0.0005,
                primaryTakerFeeRate: 0.001,
                secondaryTakerFeeRate: 0.0008,
                tertiaryTakerFeeRate: 0.0005,
                dateAdded: new Date("2024-01-15T12:00:00")
            }),
            new TradingFee({
                id: 6,
                exchangeId: 6,
                exchange: { id: 6, name: "OKX" },
                primaryMakerFeeRate: 0.0008,
                secondaryMakerFeeRate: 0.0006,
                tertiaryMakerFeeRate: 0.0004,
                primaryTakerFeeRate: 0.001,
                secondaryTakerFeeRate: 0.0008,
                tertiaryTakerFeeRate: 0.0006,
                dateAdded: new Date("2024-01-15T12:30:00")
            }),
            new TradingFee({
                id: 7,
                exchangeId: 7,
                exchange: { id: 7, name: "Gate.io" },
                primaryMakerFeeRate: 0.002,
                secondaryMakerFeeRate: 0.0015,
                tertiaryMakerFeeRate: 0.001,
                primaryTakerFeeRate: 0.002,
                secondaryTakerFeeRate: 0.0015,
                tertiaryTakerFeeRate: 0.001,
                dateAdded: new Date("2024-01-15T13:00:00")
            }),
            new TradingFee({
                id: 8,
                exchangeId: 8,
                exchange: { id: 8, name: "Huobi" },
                primaryMakerFeeRate: 0.002,
                secondaryMakerFeeRate: 0.0015,
                tertiaryMakerFeeRate: 0.001,
                primaryTakerFeeRate: 0.002,
                secondaryTakerFeeRate: 0.0015,
                tertiaryTakerFeeRate: 0.001,
                dateAdded: new Date("2024-01-15T13:30:00")
            }),
            new TradingFee({
                id: 9,
                exchangeId: 9,
                exchange: { id: 9, name: "Bitfinex" },
                primaryMakerFeeRate: 0.001,
                secondaryMakerFeeRate: 0.0008,
                tertiaryMakerFeeRate: 0.0006,
                primaryTakerFeeRate: 0.002,
                secondaryTakerFeeRate: 0.0016,
                tertiaryTakerFeeRate: 0.0012,
                dateAdded: new Date("2024-01-15T14:00:00")
            }),
            new TradingFee({
                id: 10,
                exchangeId: 10,
                exchange: { id: 10, name: "Deribit" },
                primaryMakerFeeRate: 0.0001,
                secondaryMakerFeeRate: 0.00008,
                tertiaryMakerFeeRate: 0.00005,
                primaryTakerFeeRate: 0.0005,
                secondaryTakerFeeRate: 0.0004,
                tertiaryTakerFeeRate: 0.0003,
                dateAdded: new Date("2024-01-15T14:30:00")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingFee = TradingFee;
} 