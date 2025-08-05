/**
 * TradingPathGroup DTO - Yüksek frekanslı arbitraj ticaretinde trading path gruplarını temsil eder
 * Minimum depolama alanı ve maksimum performans için optimize edilmiştir
 * Sadece temel veriler saklanırken tüm gerekli trading mantığı korunur
 */

import { Asset } from './Asset.js';
import { Exchange } from './Exchange.js';

export class TradingPathGroup {
    constructor(data = {}) {
        this._hash = data._hash || null;
        this.id = data.id || 0;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.uniqueInputString = data.uniqueInputString || "";
        this.flags = data.flags || 0;
        this.configParams = data.configParams || 0;
        this.orderThreshold = data.orderThreshold || 0;
        this.maxOrderAmountUSD = data.maxOrderAmountUSD || 0;
        this.minOrderAmountUSD = data.minOrderAmountUSD || 0;
        this.moneyLimitUSD = data.moneyLimitUSD || 0;
        this.maxOrderbookTimeDifferenceMs = data.maxOrderbookTimeDifferenceMs || 0;
        this.interArbitrageDelayMs = data.interArbitrageDelayMs || 0;
        this.orderDelayMs = data.orderDelayMs || 0;
        this.opportunityLifeSpanThresholdMs = data.opportunityLifeSpanThresholdMs || 0;
        this.slippageProtectionPercentage = data.slippageProtectionPercentage || 0;
        this.opportunityDumpThresholdPercentage = data.opportunityDumpThresholdPercentage || 0;
        this.profitCurrencyId = data.profitCurrencyId || null;
        this.startingAssetId = data.startingAssetId || null;
        this.finishingAssetId = data.finishingAssetId || null;
        this.exchange1Id = data.exchange1Id || null;
        this.exchange2Id = data.exchange2Id || null;
        this.exchange3Id = data.exchange3Id || null;
        this.exchange4Id = data.exchange4Id || null;
        this.exchange5Id = data.exchange5Id || null;
        this.exchange6Id = data.exchange6Id || null;
        
        // Navigation properties
        this.canBeClearedVia = data.canBeClearedVia ? data.canBeClearedVia.map(group => new TradingPathGroup(group)) : [];
        this.canClear = data.canClear ? data.canClear.map(group => new TradingPathGroup(group)) : [];
        this.userFriendlyString = data.userFriendlyString || "";
        this.startingAsset = data.startingAsset ? new Asset(data.startingAsset) : null;
        this.finishingAsset = data.finishingAsset ? new Asset(data.finishingAsset) : null;
        this.intermediaryAssetsCommaSeparated = data.intermediaryAssetsCommaSeparated || "";
        this.cssClass = data.cssClass || "";
        this.exchange1 = data.exchange1 ? new Exchange(data.exchange1) : null;
        this.exchange2 = data.exchange2 ? new Exchange(data.exchange2) : null;
        this.exchange3 = data.exchange3 ? new Exchange(data.exchange3) : null;
        this.exchange4 = data.exchange4 ? new Exchange(data.exchange4) : null;
        this.exchange5 = data.exchange5 ? new Exchange(data.exchange5) : null;
        this.exchange6 = data.exchange6 ? new Exchange(data.exchange6) : null;
        this.orderNumber = data.orderNumber || 0;
        this.profitCurrency = data.profitCurrency ? new Asset(data.profitCurrency) : null;
        this.returnCalculationMethod = data.returnCalculationMethod || "Standard";
        this.arbitrageOperationType = data.arbitrageOperationType || "Spot";
        this.maxConcurrentArbitrage = data.maxConcurrentArbitrage || 5;
    }

    // Bit flag operations for efficient state management
    get isActive() {
        return (this.flags & 0x01) !== 0;
    }

    set isActive(value) {
        this.flags = value ? (this.flags | 0x01) : (this.flags & ~0x01);
    }

    get toBeSeen() {
        return (this.flags & 0x02) !== 0;
    }

    set toBeSeen(value) {
        this.flags = value ? (this.flags | 0x02) : (this.flags & ~0x02);
    }

    get isSerial() {
        return (this.flags & 0x04) !== 0;
    }

    set isSerial(value) {
        this.flags = value ? (this.flags | 0x04) : (this.flags & ~0x04);
    }

    get needsManualClearing() {
        return (this.flags & 0x08) !== 0;
    }

    set needsManualClearing(value) {
        this.flags = value ? (this.flags | 0x08) : (this.flags & ~0x08);
    }

    get needsUnwindClearing() {
        return (this.flags & 0x10) !== 0;
    }

    set needsUnwindClearing(value) {
        this.flags = value ? (this.flags | 0x10) : (this.flags & ~0x10);
    }

    get parallelityCount() {
        return (this.configParams & 0xFF);
    }

    set parallelityCount(value) {
        this.configParams = (this.configParams & ~0xFF) | (value & 0xFF);
    }

    get robotNumber() {
        return (this.configParams >> 8) & 0xFF;
    }

    set robotNumber(value) {
        this.configParams = (this.configParams & ~(0xFF << 8)) | ((value & 0xFF) << 8);
    }

    get maxConcurrentArbitrageFromConfig() {
        return (this.configParams >> 16) & 0xFFFF;
    }

    set maxConcurrentArbitrageFromConfig(value) {
        this.configParams = (this.configParams & ~(0xFFFF << 16)) | ((value & 0xFFFF) << 16);
    }

    /**
     * İki trading path group'un eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.uniqueInputString === other.uniqueInputString;
    }

    /**
     * Trading path group için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            this._hash = this.uniqueInputString ? this.computeHash(this.uniqueInputString) : 0;
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
     * Trading path group'u doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.uniqueInputString || this.uniqueInputString.trim() === "") {
            errors.push("Unique input string gerekli");
        }
        
        if (this.orderThreshold < 0) {
            errors.push("Order threshold negatif olamaz");
        }
        
        if (this.maxOrderAmountUSD < 0) {
            errors.push("Max order amount USD negatif olamaz");
        }
        
        if (this.minOrderAmountUSD < 0) {
            errors.push("Min order amount USD negatif olamaz");
        }
        
        if (this.moneyLimitUSD < 0) {
            errors.push("Money limit USD negatif olamaz");
        }
        
        if (this.maxOrderAmountUSD < this.minOrderAmountUSD) {
            errors.push("Max order amount min order amount'tan küçük olamaz");
        }
        
        if (this.maxOrderbookTimeDifferenceMs < 0) {
            errors.push("Max orderbook time difference negatif olamaz");
        }
        
        if (this.interArbitrageDelayMs < 0) {
            errors.push("Inter arbitrage delay negatif olamaz");
        }
        
        if (this.orderDelayMs < 0) {
            errors.push("Order delay negatif olamaz");
        }
        
        if (this.opportunityLifeSpanThresholdMs < 0) {
            errors.push("Opportunity life span threshold negatif olamaz");
        }
        
        if (this.slippageProtectionPercentage < 0) {
            errors.push("Slippage protection percentage negatif olamaz");
        }
        
        if (this.opportunityDumpThresholdPercentage < 0) {
            errors.push("Opportunity dump threshold percentage negatif olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Trading path group'u kopyalar
     */
    clone() {
        return new TradingPathGroup({
            ...this,
            canBeClearedVia: this.canBeClearedVia.map(group => group.clone()),
            canClear: this.canClear.map(group => group.clone()),
            startingAsset: this.startingAsset ? this.startingAsset.clone() : null,
            finishingAsset: this.finishingAsset ? this.finishingAsset.clone() : null,
            exchange1: this.exchange1 ? this.exchange1.clone() : null,
            exchange2: this.exchange2 ? this.exchange2.clone() : null,
            exchange3: this.exchange3 ? this.exchange3.clone() : null,
            exchange4: this.exchange4 ? this.exchange4.clone() : null,
            exchange5: this.exchange5 ? this.exchange5.clone() : null,
            exchange6: this.exchange6 ? this.exchange6.clone() : null,
            profitCurrency: this.profitCurrency ? this.profitCurrency.clone() : null,
            dateAdded: new Date(this.dateAdded),
            _hash: null
        });
    }

    /**
     * Trading path group'u JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new TradingPathGroup(data);
        } catch (error) {
            console.error("TradingPathGroup JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Trading path group'u JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                dateAdded: this.dateAdded.toISOString(),
                uniqueInputString: this.uniqueInputString,
                flags: this.flags,
                configParams: this.configParams,
                orderThreshold: this.orderThreshold,
                maxOrderAmountUSD: this.maxOrderAmountUSD,
                minOrderAmountUSD: this.minOrderAmountUSD,
                moneyLimitUSD: this.moneyLimitUSD,
                maxOrderbookTimeDifferenceMs: this.maxOrderbookTimeDifferenceMs,
                interArbitrageDelayMs: this.interArbitrageDelayMs,
                orderDelayMs: this.orderDelayMs,
                opportunityLifeSpanThresholdMs: this.opportunityLifeSpanThresholdMs,
                slippageProtectionPercentage: this.slippageProtectionPercentage,
                opportunityDumpThresholdPercentage: this.opportunityDumpThresholdPercentage,
                profitCurrencyId: this.profitCurrencyId,
                startingAssetId: this.startingAssetId,
                finishingAssetId: this.finishingAssetId,
                exchange1Id: this.exchange1Id,
                exchange2Id: this.exchange2Id,
                exchange3Id: this.exchange3Id,
                exchange4Id: this.exchange4Id,
                exchange5Id: this.exchange5Id,
                exchange6Id: this.exchange6Id,
                userFriendlyString: this.userFriendlyString,
                startingAsset: this.startingAsset,
                finishingAsset: this.finishingAsset,
                intermediaryAssetsCommaSeparated: this.intermediaryAssetsCommaSeparated,
                cssClass: this.cssClass,
                exchange1: this.exchange1,
                exchange2: this.exchange2,
                exchange3: this.exchange3,
                exchange4: this.exchange4,
                exchange5: this.exchange5,
                exchange6: this.exchange6,
                orderNumber: this.orderNumber,
                profitCurrency: this.profitCurrency,
                returnCalculationMethod: this.returnCalculationMethod,
                arbitrageOperationType: this.arbitrageOperationType,
                maxConcurrentArbitrage: this.maxConcurrentArbitrage
            });
        } catch (error) {
            console.error("TradingPathGroup JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir trading path group objesi oluşturur (static method)
     */
    static create(uniqueInputString, userFriendlyString = "") {
        return new TradingPathGroup({
            uniqueInputString: uniqueInputString,
            userFriendlyString: userFriendlyString
        });
    }

    /**
     * Tarihi formatlar
     */
    getDateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Trading path group'un aktif olup olmadığını kontrol eder
     */
    isActiveGroup() {
        return this.isActive;
    }

    /**
     * Trading path group'un görünür olup olmadığını kontrol eder
     */
    isVisibleGroup() {
        return this.toBeSeen;
    }

    /**
     * Trading path group'un seri olup olmadığını kontrol eder
     */
    isSerialGroup() {
        return this.isSerial;
    }

    /**
     * Trading path group'un manuel temizlik gerektirip gerektirmediğini kontrol eder
     */
    needsManualClearingGroup() {
        return this.needsManualClearing;
    }

    /**
     * Trading path group'un unwind temizlik gerektirip gerektirmediğini kontrol eder
     */
    needsUnwindClearingGroup() {
        return this.needsUnwindClearing;
    }

    /**
     * Kullanılan exchange'leri getirir
     */
    getExchanges() {
        const exchanges = [];
        if (this.exchange1) exchanges.push(this.exchange1);
        if (this.exchange2) exchanges.push(this.exchange2);
        if (this.exchange3) exchanges.push(this.exchange3);
        if (this.exchange4) exchanges.push(this.exchange4);
        if (this.exchange5) exchanges.push(this.exchange5);
        if (this.exchange6) exchanges.push(this.exchange6);
        return exchanges;
    }

    /**
     * Exchange sayısını getirir
     */
    getExchangeCount() {
        return this.getExchanges().length;
    }

    /**
     * Kullanılan asset'leri getirir
     */
    getAssets() {
        const assets = [];
        if (this.startingAsset) assets.push(this.startingAsset);
        if (this.finishingAsset) assets.push(this.finishingAsset);
        if (this.profitCurrency) assets.push(this.profitCurrency);
        return assets;
    }

    /**
     * Asset sayısını getirir
     */
    getAssetCount() {
        return this.getAssets().length;
    }

    /**
     * Trading path group'un karmaşıklık seviyesini getirir
     */
    getComplexityLevel() {
        const exchangeCount = this.getExchangeCount();
        const assetCount = this.getAssetCount();
        
        if (exchangeCount <= 2 && assetCount <= 2) return "Basit";
        if (exchangeCount <= 3 && assetCount <= 3) return "Orta";
        if (exchangeCount <= 4 && assetCount <= 4) return "Karmaşık";
        return "Çok Karmaşık";
    }

    /**
     * Trading path group'un risk seviyesini getirir
     */
    getRiskLevel() {
        if (this.maxOrderAmountUSD > 100000) return "Çok Yüksek";
        if (this.maxOrderAmountUSD > 50000) return "Yüksek";
        if (this.maxOrderAmountUSD > 10000) return "Orta";
        return "Düşük";
    }

    /**
     * Trading path group'un hız seviyesini getirir
     */
    getSpeedLevel() {
        if (this.orderDelayMs === 0) return "Anında";
        if (this.orderDelayMs <= 100) return "Hızlı";
        if (this.orderDelayMs <= 1000) return "Orta";
        return "Yavaş";
    }

    /**
     * Trading path group'un güvenlik seviyesini getirir
     */
    getSecurityLevel() {
        if (this.slippageProtectionPercentage > 1.0) return "Çok Güvenli";
        if (this.slippageProtectionPercentage > 0.5) return "Güvenli";
        if (this.slippageProtectionPercentage > 0.2) return "Orta";
        return "Riskli";
    }

    /**
     * Trading path group'un performans skorunu hesaplar
     */
    getPerformanceScore() {
        let score = 0;
        
        // Exchange sayısına göre puan
        const exchangeCount = this.getExchangeCount();
        if (exchangeCount >= 4) score += 25;
        else if (exchangeCount >= 3) score += 20;
        else if (exchangeCount >= 2) score += 15;
        else score += 10;
        
        // Asset sayısına göre puan
        const assetCount = this.getAssetCount();
        if (assetCount >= 3) score += 20;
        else if (assetCount >= 2) score += 15;
        else score += 10;
        
        // Max order amount'a göre puan
        if (this.maxOrderAmountUSD >= 50000) score += 20;
        else if (this.maxOrderAmountUSD >= 10000) score += 15;
        else if (this.maxOrderAmountUSD >= 1000) score += 10;
        else score += 5;
        
        // Order delay'a göre puan
        if (this.orderDelayMs <= 100) score += 15;
        else if (this.orderDelayMs <= 1000) score += 10;
        else if (this.orderDelayMs <= 5000) score += 5;
        
        // Slippage protection'a göre puan
        if (this.slippageProtectionPercentage >= 0.5) score += 20;
        else if (this.slippageProtectionPercentage >= 0.2) score += 15;
        else if (this.slippageProtectionPercentage >= 0.1) score += 10;
        else score += 5;
        
        return Math.min(score, 100);
    }

    /**
     * Trading path group'un performans seviyesini getirir
     */
    getPerformanceLevel() {
        const score = this.getPerformanceScore();
        if (score >= 80) return "Mükemmel";
        if (score >= 60) return "İyi";
        if (score >= 40) return "Orta";
        if (score >= 20) return "Zayıf";
        return "Çok Zayıf";
    }

    /**
     * Trading path group'un performans badge rengini getirir
     */
    getPerformanceBadgeClass() {
        const score = this.getPerformanceScore();
        if (score >= 80) return 'bg-success';
        if (score >= 60) return 'bg-info';
        if (score >= 40) return 'bg-warning';
        if (score >= 20) return 'bg-danger';
        return 'bg-secondary';
    }

    /**
     * Risk badge rengini getirir
     */
    getRiskBadgeClass() {
        switch(this.getRiskLevel()) {
            case 'Düşük': return 'bg-success';
            case 'Orta': return 'bg-info';
            case 'Yüksek': return 'bg-warning';
            case 'Çok Yüksek': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Hız badge rengini getirir
     */
    getSpeedBadgeClass() {
        switch(this.getSpeedLevel()) {
            case 'Anında': return 'bg-success';
            case 'Hızlı': return 'bg-info';
            case 'Orta': return 'bg-warning';
            case 'Yavaş': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Güvenlik badge rengini getirir
     */
    getSecurityBadgeClass() {
        switch(this.getSecurityLevel()) {
            case 'Çok Güvenli': return 'bg-success';
            case 'Güvenli': return 'bg-info';
            case 'Orta': return 'bg-warning';
            case 'Riskli': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Örnek trading path group verisi
     */
    static getSampleData() {
        return [
            new TradingPathGroup({
                id: 1,
                uniqueInputString: "BTC-USDT-Binance-Coinbase",
                userFriendlyString: "BTC/USDT Cross Exchange",
                flags: 0x01, // IsActive
                configParams: 0x050001, // ParallelityCount: 5, RobotNumber: 0, MaxConcurrentArbitrage: 1
                orderThreshold: 100,
                maxOrderAmountUSD: 10000,
                minOrderAmountUSD: 100,
                moneyLimitUSD: 50000,
                maxOrderbookTimeDifferenceMs: 1000,
                interArbitrageDelayMs: 500,
                orderDelayMs: 100,
                opportunityLifeSpanThresholdMs: 5000,
                slippageProtectionPercentage: 0.3,
                opportunityDumpThresholdPercentage: 0.1,
                startingAsset: { id: 1, name: "BTC" },
                finishingAsset: { id: 2, name: "USDT" },
                profitCurrency: { id: 2, name: "USDT" },
                exchange1: { id: 1, name: "Binance" },
                exchange2: { id: 2, name: "Coinbase" },
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new TradingPathGroup({
                id: 2,
                uniqueInputString: "ETH-USDT-Kraken-Bybit",
                userFriendlyString: "ETH/USDT Cross Exchange",
                flags: 0x01, // IsActive
                configParams: 0x030002, // ParallelityCount: 3, RobotNumber: 0, MaxConcurrentArbitrage: 2
                orderThreshold: 50,
                maxOrderAmountUSD: 5000,
                minOrderAmountUSD: 50,
                moneyLimitUSD: 25000,
                maxOrderbookTimeDifferenceMs: 800,
                interArbitrageDelayMs: 400,
                orderDelayMs: 80,
                opportunityLifeSpanThresholdMs: 4000,
                slippageProtectionPercentage: 0.5,
                opportunityDumpThresholdPercentage: 0.15,
                startingAsset: { id: 3, name: "ETH" },
                finishingAsset: { id: 2, name: "USDT" },
                profitCurrency: { id: 2, name: "USDT" },
                exchange1: { id: 3, name: "Kraken" },
                exchange2: { id: 4, name: "Bybit" },
                dateAdded: new Date("2024-01-15T10:30:00")
            }),
            new TradingPathGroup({
                id: 3,
                uniqueInputString: "ADA-SOL-USDT-KuCoin-OKX-Gate",
                userFriendlyString: "ADA/SOL/USDT Triangle",
                flags: 0x01, // IsActive
                configParams: 0x020003, // ParallelityCount: 2, RobotNumber: 0, MaxConcurrentArbitrage: 3
                orderThreshold: 25,
                maxOrderAmountUSD: 2500,
                minOrderAmountUSD: 25,
                moneyLimitUSD: 12500,
                maxOrderbookTimeDifferenceMs: 1200,
                interArbitrageDelayMs: 600,
                orderDelayMs: 200,
                opportunityLifeSpanThresholdMs: 6000,
                slippageProtectionPercentage: 0.8,
                opportunityDumpThresholdPercentage: 0.2,
                startingAsset: { id: 5, name: "ADA" },
                finishingAsset: { id: 6, name: "SOL" },
                profitCurrency: { id: 2, name: "USDT" },
                exchange1: { id: 5, name: "KuCoin" },
                exchange2: { id: 6, name: "OKX" },
                exchange3: { id: 7, name: "Gate.io" },
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new TradingPathGroup({
                id: 4,
                uniqueInputString: "DOT-LINK-MATIC-Huobi-Bitfinex-Deribit-Binance",
                userFriendlyString: "DOT/LINK/MATIC Cycle",
                flags: 0x01, // IsActive
                configParams: 0x010004, // ParallelityCount: 1, RobotNumber: 0, MaxConcurrentArbitrage: 4
                orderThreshold: 20,
                maxOrderAmountUSD: 2000,
                minOrderAmountUSD: 20,
                moneyLimitUSD: 10000,
                maxOrderbookTimeDifferenceMs: 1500,
                interArbitrageDelayMs: 750,
                orderDelayMs: 250,
                opportunityLifeSpanThresholdMs: 7500,
                slippageProtectionPercentage: 1.0,
                opportunityDumpThresholdPercentage: 0.25,
                startingAsset: { id: 7, name: "DOT" },
                finishingAsset: { id: 8, name: "LINK" },
                profitCurrency: { id: 2, name: "USDT" },
                exchange1: { id: 8, name: "Huobi" },
                exchange2: { id: 9, name: "Bitfinex" },
                exchange3: { id: 10, name: "Deribit" },
                exchange4: { id: 1, name: "Binance" },
                dateAdded: new Date("2024-01-15T11:30:00")
            }),
            new TradingPathGroup({
                id: 5,
                uniqueInputString: "BTC-ETH-USD-Coinbase-Kraken-Bybit-KuCoin",
                userFriendlyString: "BTC/ETH/USD Complex",
                flags: 0x01, // IsActive
                configParams: 0x010005, // ParallelityCount: 1, RobotNumber: 0, MaxConcurrentArbitrage: 5
                orderThreshold: 1000,
                maxOrderAmountUSD: 50000,
                minOrderAmountUSD: 1000,
                moneyLimitUSD: 250000,
                maxOrderbookTimeDifferenceMs: 2000,
                interArbitrageDelayMs: 1000,
                orderDelayMs: 300,
                opportunityLifeSpanThresholdMs: 10000,
                slippageProtectionPercentage: 1.5,
                opportunityDumpThresholdPercentage: 0.3,
                startingAsset: { id: 1, name: "BTC" },
                finishingAsset: { id: 3, name: "ETH" },
                profitCurrency: { id: 4, name: "USD" },
                exchange1: { id: 2, name: "Coinbase" },
                exchange2: { id: 3, name: "Kraken" },
                exchange3: { id: 4, name: "Bybit" },
                exchange4: { id: 5, name: "KuCoin" },
                dateAdded: new Date("2024-01-15T12:00:00")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingPathGroup = TradingPathGroup;
} 