/**
 * Capital DTO - HFT operasyonları için belirli bir para biriminde değişmez sermaye miktarını temsil eder
 * Yüksek frekanslı ticaret için optimize edilmiş, minimum bellek kullanımı ve tahsisi
 */

import { Asset } from './Asset.js';

export class Capital {
    constructor(data = {}) {
        this.currency = data.currency ? new Asset(data.currency) : null;
        this.amount = data.amount || 0;
    }

    /**
     * Para biriminin görüntüleme formatını kullanarak formatlanmış string temsilini döndürür
     * Loglama ve hata ayıklama için kullanılır
     */
    toString() {
        if (!this.currency) {
            return `${this.amount.toFixed(2)} UNKNOWN`;
        }
        
        const formatInfo = this.currency.displayFormatInfo;
        const formattedAmount = this.amount.toLocaleString('tr-TR', {
            minimumFractionDigits: formatInfo.numberDecimalDigits,
            maximumFractionDigits: formatInfo.numberDecimalDigits
        });
        
        return `${formattedAmount} ${this.currency.name}`;
    }

    /**
     * İki capital'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.currency.equals(other.currency) && this.amount === other.amount;
    }

    /**
     * Capital'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.currency) {
            errors.push("Para birimi boş olamaz");
        }
        
        if (this.amount < 0) {
            errors.push("Sermaye miktarı negatif olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Capital'i kopyalar
     */
    clone() {
        return new Capital({
            currency: this.currency ? this.currency.clone() : null,
            amount: this.amount
        });
    }

    /**
     * Capital'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Capital(data);
        } catch (error) {
            console.error("Capital JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Capital'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Capital JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir capital objesi oluşturur (static method)
     */
    static create(currency, amount) {
        return new Capital({
            currency: currency,
            amount: amount
        });
    }

    /**
     * İki capital'i toplar (aynı para birimi olmalı)
     */
    add(other) {
        if (!other || !this.currency || !other.currency) {
            throw new Error("Geçersiz capital objesi");
        }
        
        if (!this.currency.equals(other.currency)) {
            throw new Error("Farklı para birimleri toplanamaz");
        }
        
        return new Capital({
            currency: this.currency,
            amount: this.amount + other.amount
        });
    }

    /**
     * İki capital'i çıkarır (aynı para birimi olmalı)
     */
    subtract(other) {
        if (!other || !this.currency || !other.currency) {
            throw new Error("Geçersiz capital objesi");
        }
        
        if (!this.currency.equals(other.currency)) {
            throw new Error("Farklı para birimleri çıkarılamaz");
        }
        
        const result = this.amount - other.amount;
        if (result < 0) {
            throw new Error("Negatif sonuç oluştu");
        }
        
        return new Capital({
            currency: this.currency,
            amount: result
        });
    }

    /**
     * Capital'i bir sayı ile çarpar
     */
    multiply(factor) {
        if (factor < 0) {
            throw new Error("Negatif çarpan kullanılamaz");
        }
        
        return new Capital({
            currency: this.currency,
            amount: this.amount * factor
        });
    }

    /**
     * Capital'i bir sayıya böler
     */
    divide(divisor) {
        if (divisor <= 0) {
            throw new Error("Sıfır veya negatif bölen kullanılamaz");
        }
        
        return new Capital({
            currency: this.currency,
            amount: this.amount / divisor
        });
    }

    /**
     * Capital'in sıfır olup olmadığını kontrol eder
     */
    isZero() {
        return this.amount === 0;
    }

    /**
     * Capital'in pozitif olup olmadığını kontrol eder
     */
    isPositive() {
        return this.amount > 0;
    }

    /**
     * Capital'in negatif olup olmadığını kontrol eder
     */
    isNegative() {
        return this.amount < 0;
    }

    /**
     * Capital'in formatlanmış miktarını döndürür
     */
    getFormattedAmount() {
        if (!this.currency) {
            return this.amount.toFixed(2);
        }
        
        const formatInfo = this.currency.displayFormatInfo;
        return this.amount.toLocaleString('tr-TR', {
            minimumFractionDigits: formatInfo.numberDecimalDigits,
            maximumFractionDigits: formatInfo.numberDecimalDigits
        });
    }

    /**
     * Capital'in kısa string temsilini döndürür
     */
    getShortString() {
        if (!this.currency) {
            return `${this.amount.toFixed(2)}`;
        }
        return `${this.amount.toFixed(2)} ${this.currency.name}`;
    }

    /**
     * Capital'in USD karşılığını hesaplar (yaklaşık)
     */
    getUsdEquivalent() {
        if (!this.currency) return 0;
        
        // Basit dönüşüm oranları (gerçek uygulamada API'den alınır)
        const rates = {
            'USD': 1,
            'EUR': 1.1,
            'TRY': 0.03,
            'USDT': 1,
            'USDC': 1,
            'BTC': 45000,
            'ETH': 3000,
            'BNB': 300
        };
        
        const rate = rates[this.currency.name] || 1;
        return this.amount * rate;
    }

    /**
     * Örnek capital verisi
     */
    static getSampleData() {
        return [
            new Capital({
                currency: new Asset({ name: "USD", assetType: "Forex" }),
                amount: 10000.00
            }),
            new Capital({
                currency: new Asset({ name: "EUR", assetType: "Forex" }),
                amount: 8500.00
            }),
            new Capital({
                currency: new Asset({ name: "USDT", assetType: "Crypto" }),
                amount: 50000.00
            }),
            new Capital({
                currency: new Asset({ name: "BTC", assetType: "Crypto" }),
                amount: 2.5
            }),
            new Capital({
                currency: new Asset({ name: "ETH", assetType: "Crypto" }),
                amount: 15.0
            }),
            new Capital({
                currency: new Asset({ name: "TRY", assetType: "Forex" }),
                amount: 300000.00
            }),
            new Capital({
                currency: new Asset({ name: "USDC", assetType: "Crypto" }),
                amount: 25000.00
            }),
            new Capital({
                currency: new Asset({ name: "BNB", assetType: "Crypto" }),
                amount: 100.0
            }),
            new Capital({
                currency: new Asset({ name: "JPY", assetType: "Forex" }),
                amount: 1500000.00
            }),
            new Capital({
                currency: new Asset({ name: "GBP", assetType: "Forex" }),
                amount: 7500.00
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Capital = Capital;
} 