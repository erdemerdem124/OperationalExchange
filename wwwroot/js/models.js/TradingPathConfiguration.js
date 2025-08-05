/**
 * TradingPathConfiguration DTO - Yüksek frekanslı arbitraj ticaretinde trading path konfigürasyonunu temsil eder
 * Bu sınıf minimum bellek kullanımı ve hızlı erişim desenleri için optimize edilmiştir
 * Sadece temel konfigürasyon verileri saklanır, hesaplanan değerler runtime'da işlenir
 */

import { Asset } from './Asset.js';

export class TradingPathConfiguration {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.isPossible = data.isPossible !== undefined ? data.isPossible : false;
        this.invalidationReason = data.invalidationReason || PathInvalidationReason.InitiallyDisabled;
        this.isActive = data.isActive !== undefined ? data.isActive : false;
        this.targetReturn = data.targetReturn || 0.01;
        this.executionLimit = data.executionLimit || 100000;
        this.maximumTradeVolumeAmount = data.maximumTradeVolumeAmount || 0;
        this.volumeAsset = data.volumeAsset ? new Asset(data.volumeAsset) : null;
        this.orderDelayMs = data.orderDelayMs || 0;
        this.slippageProtection = data.slippageProtection || 0.5;
        this.tradingPathId = data.tradingPathId || 0;
        this.isLocked = data.isLocked !== undefined ? data.isLocked : false;
    }

    /**
     * İki trading path configuration'ın eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.id === other.id && this.tradingPathId === other.tradingPathId;
    }

    /**
     * Trading path configuration'ı doğrular
     */
    validate() {
        const errors = [];
        
        if (this.tradingPathId <= 0) {
            errors.push("Trading path ID gerekli");
        }
        
        if (this.targetReturn < 0) {
            errors.push("Target return negatif olamaz");
        }
        
        if (this.executionLimit < 0) {
            errors.push("Execution limit negatif olamaz");
        }
        
        if (this.maximumTradeVolumeAmount < 0) {
            errors.push("Maximum trade volume amount negatif olamaz");
        }
        
        if (this.orderDelayMs < 0) {
            errors.push("Order delay negatif olamaz");
        }
        
        if (this.slippageProtection < 0) {
            errors.push("Slippage protection negatif olamaz");
        }
        
        if (this.maximumTradeVolumeAmount > this.executionLimit) {
            errors.push("Maximum trade volume execution limit'ten büyük olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Trading path configuration'ı kopyalar
     */
    clone() {
        return new TradingPathConfiguration({
            ...this,
            volumeAsset: this.volumeAsset ? this.volumeAsset.clone() : null
        });
    }

    /**
     * Trading path configuration'ı JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new TradingPathConfiguration(data);
        } catch (error) {
            console.error("TradingPathConfiguration JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Trading path configuration'ı JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                isPossible: this.isPossible,
                invalidationReason: this.invalidationReason,
                isActive: this.isActive,
                targetReturn: this.targetReturn,
                executionLimit: this.executionLimit,
                maximumTradeVolumeAmount: this.maximumTradeVolumeAmount,
                volumeAsset: this.volumeAsset,
                orderDelayMs: this.orderDelayMs,
                slippageProtection: this.slippageProtection,
                tradingPathId: this.tradingPathId,
                isLocked: this.isLocked
            });
        } catch (error) {
            console.error("TradingPathConfiguration JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir trading path configuration objesi oluşturur (static method)
     */
    static create(tradingPathId, volumeAsset = null) {
        return new TradingPathConfiguration({
            tradingPathId: tradingPathId,
            volumeAsset: volumeAsset
        });
    }

    /**
     * Target return'u yüzde olarak getirir
     */
    getTargetReturnPercentage() {
        return this.targetReturn * 100;
    }

    /**
     * Slippage protection'ı yüzde olarak getirir
     */
    getSlippageProtectionPercentage() {
        return this.slippageProtection;
    }

    /**
     * Volume asset adını getirir
     */
    getVolumeAssetName() {
        return this.volumeAsset?.name || 'Unknown';
    }

    /**
     * Configuration'ın aktif olup olmadığını kontrol eder
     */
    isActiveConfiguration() {
        return this.isActive && this.isPossible && !this.isLocked;
    }

    /**
     * Configuration'ın kilitli olup olmadığını kontrol eder
     */
    isLockedConfiguration() {
        return this.isLocked;
    }

    /**
     * Configuration'ın geçerli olup olmadığını kontrol eder
     */
    isValidConfiguration() {
        return this.invalidationReason === PathInvalidationReason.None;
    }

    /**
     * Configuration'ın disabled olup olmadığını kontrol eder
     */
    isDisabled() {
        return !this.isActive || this.isLocked || !this.isPossible;
    }

    /**
     * Configuration'ın disabled olma sebebini getirir
     */
    getDisabledReason() {
        if (this.isLocked) return "Kilitli";
        if (!this.isActive) return "Aktif değil";
        if (!this.isPossible) return "Mümkün değil";
        if (this.invalidationReason !== PathInvalidationReason.None) return this.invalidationReason;
        return "Aktif";
    }

    /**
     * Configuration'ın risk seviyesini getirir
     */
    getRiskLevel() {
        if (this.executionLimit > 100000) return "Çok Yüksek";
        if (this.executionLimit > 50000) return "Yüksek";
        if (this.executionLimit > 10000) return "Orta";
        return "Düşük";
    }

    /**
     * Configuration'ın agresiflik seviyesini getirir
     */
    getAggressivenessLevel() {
        if (this.targetReturn > 0.02) return "Çok Agresif";
        if (this.targetReturn > 0.01) return "Agresif";
        if (this.targetReturn > 0.005) return "Orta";
        return "Konservatif";
    }

    /**
     * Configuration'ın hız seviyesini getirir
     */
    getSpeedLevel() {
        if (this.orderDelayMs === 0) return "Anında";
        if (this.orderDelayMs <= 100) return "Hızlı";
        if (this.orderDelayMs <= 1000) return "Orta";
        return "Yavaş";
    }

    /**
     * Configuration'ın güvenlik seviyesini getirir
     */
    getSecurityLevel() {
        if (this.slippageProtection > 1.0) return "Çok Güvenli";
        if (this.slippageProtection > 0.5) return "Güvenli";
        if (this.slippageProtection > 0.2) return "Orta";
        return "Riskli";
    }

    /**
     * Configuration'ın performans skorunu hesaplar
     */
    getPerformanceScore() {
        let score = 0;
        
        // Target return'a göre puan
        if (this.targetReturn >= 0.02) score += 30;
        else if (this.targetReturn >= 0.01) score += 20;
        else if (this.targetReturn >= 0.005) score += 10;
        
        // Execution limit'e göre puan
        if (this.executionLimit >= 50000) score += 25;
        else if (this.executionLimit >= 10000) score += 15;
        else if (this.executionLimit >= 1000) score += 10;
        
        // Slippage protection'a göre puan
        if (this.slippageProtection >= 0.5) score += 20;
        else if (this.slippageProtection >= 0.2) score += 15;
        else if (this.slippageProtection >= 0.1) score += 10;
        
        // Order delay'a göre puan
        if (this.orderDelayMs <= 100) score += 15;
        else if (this.orderDelayMs <= 1000) score += 10;
        else if (this.orderDelayMs <= 5000) score += 5;
        
        // Aktiflik durumuna göre puan
        if (this.isActive && this.isPossible) score += 10;
        
        return Math.min(score, 100);
    }

    /**
     * Configuration'ın performans seviyesini getirir
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
     * Configuration'ın performans badge rengini getirir
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
     * Agresiflik badge rengini getirir
     */
    getAggressivenessBadgeClass() {
        switch(this.getAggressivenessLevel()) {
            case 'Konservatif': return 'bg-success';
            case 'Orta': return 'bg-info';
            case 'Agresif': return 'bg-warning';
            case 'Çok Agresif': return 'bg-danger';
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
     * Örnek trading path configuration verisi
     */
    static getSampleData() {
        return [
            new TradingPathConfiguration({
                id: 1,
                tradingPathId: 1,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.005,
                executionLimit: 10000,
                maximumTradeVolumeAmount: 1000,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 100,
                slippageProtection: 0.3,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 2,
                tradingPathId: 2,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.008,
                executionLimit: 5000,
                maximumTradeVolumeAmount: 500,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 150,
                slippageProtection: 0.5,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 3,
                tradingPathId: 3,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.012,
                executionLimit: 2500,
                maximumTradeVolumeAmount: 250,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 200,
                slippageProtection: 0.8,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 4,
                tradingPathId: 4,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.015,
                executionLimit: 2000,
                maximumTradeVolumeAmount: 200,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 250,
                slippageProtection: 1.0,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 5,
                tradingPathId: 5,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.02,
                executionLimit: 50000,
                maximumTradeVolumeAmount: 5000,
                volumeAsset: { id: 4, name: "USD" },
                orderDelayMs: 300,
                slippageProtection: 1.5,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 6,
                tradingPathId: 6,
                isPossible: false,
                invalidationReason: PathInvalidationReason.InsufficientFunds,
                isActive: false,
                targetReturn: 0.01,
                executionLimit: 100000,
                maximumTradeVolumeAmount: 10000,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 0,
                slippageProtection: 0.5,
                isLocked: true
            }),
            new TradingPathConfiguration({
                id: 7,
                tradingPathId: 7,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.025,
                executionLimit: 75000,
                maximumTradeVolumeAmount: 7500,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 50,
                slippageProtection: 0.2,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 8,
                tradingPathId: 8,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.03,
                executionLimit: 150000,
                maximumTradeVolumeAmount: 15000,
                volumeAsset: { id: 4, name: "USD" },
                orderDelayMs: 0,
                slippageProtection: 0.1,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 9,
                tradingPathId: 9,
                isPossible: false,
                invalidationReason: PathInvalidationReason.DisabledByUser,
                isActive: false,
                targetReturn: 0.01,
                executionLimit: 10000,
                maximumTradeVolumeAmount: 1000,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 1000,
                slippageProtection: 0.5,
                isLocked: false
            }),
            new TradingPathConfiguration({
                id: 10,
                tradingPathId: 10,
                isPossible: true,
                invalidationReason: PathInvalidationReason.None,
                isActive: true,
                targetReturn: 0.008,
                executionLimit: 3000,
                maximumTradeVolumeAmount: 300,
                volumeAsset: { id: 2, name: "USDT" },
                orderDelayMs: 500,
                slippageProtection: 0.6,
                isLocked: false
            })
        ];
    }
}

/**
 * Path invalidation reason sabitleri
 * Bellek tahsisi azaltmak için static string'ler olarak saklanır
 */
export const PathInvalidationReason = {
    InsufficientFunds: "Borsada yeterli coin yok",
    DisabledByUser: "Kullanıcı tarafından deaktive edildi",
    DisabledBySystem: "Admin tarafından deaktive edildi",
    InitiallyDisabled: "Default deaktif olarak başlatılmıştır.",
    NonWithdrawableExchange: "Borsadan para çekimi yapılamaz",
    None: ""
};

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingPathConfiguration = TradingPathConfiguration;
    window.PathInvalidationReason = PathInvalidationReason;
} 