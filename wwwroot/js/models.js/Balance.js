/**
 * Balance DTO - Gerçek zamanlı bellek içi bakiye takipçisi
 * Yüksek frekanslı ticaret operasyonları için optimize edilmiş
 * Eşzamanlı erişim ve minimum bellek kullanımı için tasarlanmış
 * Gerçek zamanlı arbitraj hesaplamaları için kritik performans bileşeni
 */

import { Asset } from './Asset.js';

export class BalanceEntry {
    constructor(data = {}) {
        this.currency = data.currency ? new Asset(data.currency) : null;
        this.available = data.available || 0;
        this.total = data.total || 0;
    }

    /**
     * String temsilini döndürür
     */
    toString() {
        return this.total.toString();
    }

    /**
     * Bakiye girişini doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.currency) {
            errors.push("Para birimi boş olamaz");
        }
        
        if (this.available < 0) {
            errors.push("Kullanılabilir bakiye negatif olamaz");
        }
        
        if (this.total < 0) {
            errors.push("Toplam bakiye negatif olamaz");
        }
        
        if (this.available > this.total) {
            errors.push("Kullanılabilir bakiye toplam bakiyeden büyük olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Bakiye girişini kopyalar
     */
    clone() {
        return new BalanceEntry({
            currency: this.currency ? this.currency.clone() : null,
            available: this.available,
            total: this.total
        });
    }

    /**
     * JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new BalanceEntry(data);
        } catch (error) {
            console.error("BalanceEntry JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("BalanceEntry JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir bakiye girişi oluşturur
     */
    static create(currency, available = 0, total = 0) {
        return new BalanceEntry({
            currency: currency,
            available: available,
            total: total
        });
    }
}

export class Balance {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.exchange = data.exchange || null;
        this.blockchain = data.blockchain || null;
        this._hash = data._hash || null;
        
        // ConcurrentDictionary yerine Map kullanıyoruz
        this.entries = new Map();
        
        // Mevcut girişleri yükle
        if (data.entries) {
            Object.entries(data.entries).forEach(([key, value]) => {
                const asset = new Asset(JSON.parse(key));
                const entry = new BalanceEntry(value);
                this.entries.set(asset, entry);
            });
        }
    }

    /**
     * Bakiye girişi ekler veya günceller
     */
    set(asset, entry) {
        if (!(asset instanceof Asset)) {
            asset = new Asset(asset);
        }
        if (!(entry instanceof BalanceEntry)) {
            entry = new BalanceEntry(entry);
        }
        this.entries.set(asset, entry);
    }

    /**
     * Bakiye girişi alır
     */
    get(asset) {
        if (!(asset instanceof Asset)) {
            asset = new Asset(asset);
        }
        return this.entries.get(asset);
    }

    /**
     * Bakiye girişi kaldırır
     */
    remove(asset) {
        if (!(asset instanceof Asset)) {
            asset = new Asset(asset);
        }
        return this.entries.delete(asset);
    }

    /**
     * Tüm girişleri alır
     */
    getAllEntries() {
        return Array.from(this.entries.entries()).map(([asset, entry]) => ({
            asset: asset,
            entry: entry
        }));
    }

    /**
     * Belirli bir para birimi için bakiye alır
     */
    getBalanceForCurrency(currencyName) {
        const asset = new Asset({ name: currencyName });
        return this.get(asset);
    }

    /**
     * Toplam kullanılabilir bakiye hesaplar
     */
    getTotalAvailable() {
        let total = 0;
        this.entries.forEach(entry => {
            total += entry.available;
        });
        return total;
    }

    /**
     * Toplam bakiye hesaplar
     */
    getTotalBalance() {
        let total = 0;
        this.entries.forEach(entry => {
            total += entry.total;
        });
        return total;
    }

    /**
     * Kilitli bakiye hesaplar
     */
    getLockedBalance() {
        return this.getTotalBalance() - this.getTotalAvailable();
    }

    /**
     * Hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = this.toString();
            this._hash = this.computeHash(str);
        }
        return this._hash;
    }

    /**
     * Basit hash hesaplama
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
     * String temsilini döndürür
     */
    toString() {
        const entries = Array.from(this.entries.entries())
            .map(([asset, entry]) => `${asset.name}:${entry.total}`)
            .join(',');
        return `Balance[${entries}]`;
    }

    /**
     * Bakiye girişlerini doğrular
     */
    validate() {
        const errors = [];
        
        this.entries.forEach((entry, asset) => {
            const validation = entry.validate();
            if (!validation.isValid) {
                errors.push(`${asset.name}: ${validation.errors.join(', ')}`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Bakiyeyi kopyalar
     */
    clone() {
        const cloned = new Balance({
            id: this.id,
            dateAdded: this.dateAdded,
            exchange: this.exchange,
            blockchain: this.blockchain,
            _hash: null
        });
        
        this.entries.forEach((entry, asset) => {
            cloned.set(asset.clone(), entry.clone());
        });
        
        return cloned;
    }

    /**
     * JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Balance(data);
        } catch (error) {
            console.error("Balance JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * JSON'a dönüştürür
     */
    toJson() {
        try {
            const entries = {};
            this.entries.forEach((entry, asset) => {
                entries[JSON.stringify(asset)] = entry;
            });
            
            return JSON.stringify({
                id: this.id,
                dateAdded: this.dateAdded,
                exchange: this.exchange,
                blockchain: this.blockchain,
                entries: entries
            });
        } catch (error) {
            console.error("Balance JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir bakiye oluşturur
     */
    static create(exchange = null, blockchain = null) {
        return new Balance({
            exchange: exchange,
            blockchain: blockchain
        });
    }

    /**
     * Örnek bakiye verisi
     */
    static getSampleData() {
        const balance = new Balance({
            id: 1,
            exchange: "Binance",
            dateAdded: new Date("2024-01-15")
        });

        // Örnek bakiye girişleri
        balance.set(new Asset({ name: "USDT" }), new BalanceEntry({
            currency: new Asset({ name: "USDT" }),
            available: 10000.50,
            total: 10000.50
        }));

        balance.set(new Asset({ name: "BTC" }), new BalanceEntry({
            currency: new Asset({ name: "BTC" }),
            available: 0.5,
            total: 0.5
        }));

        balance.set(new Asset({ name: "ETH" }), new BalanceEntry({
            currency: new Asset({ name: "ETH" }),
            available: 2.0,
            total: 2.5
        }));

        balance.set(new Asset({ name: "USD" }), new BalanceEntry({
            currency: new Asset({ name: "USD" }),
            available: 5000.00,
            total: 5000.00
        }));

        balance.set(new Asset({ name: "EUR" }), new BalanceEntry({
            currency: new Asset({ name: "EUR" }),
            available: 3000.00,
            total: 3000.00
        }));

        return balance;
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Balance = Balance;
    window.BalanceEntry = BalanceEntry;
} 