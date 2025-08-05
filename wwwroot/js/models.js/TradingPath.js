/**
 * TradingPath DTO - Kripto para arbitraj fırsatları için trading path'ini temsil eder
 * Yüksek frekanslı ticaret için optimize edilmiş minimum bellek kullanımı
 * Sadece temel veriler saklanırken tüm gerekli trading mantığı korunur
 */

import { TradeAction } from './TradeAction.js';

export class TradingPath {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.tradingPathGroupId = data.tradingPathGroupId || 0;
        this.tradingPathGroup = data.tradingPathGroup || null;
        this.steps = data.steps ? data.steps.map(step => new TradeAction(step)) : [];
        this.stepCount = data.stepCount || 0;
        this.friendlyName = data.friendlyName || "";
        this.minimumOrderInUsd = data.minimumOrderInUsd || 0;
        this.executionLimit = data.executionLimit || 100000;
        this.targetReturn = data.targetReturn || 0.01;
        this.slippageProtection = data.slippageProtection || 0.5;
        this.orderDelayMs = data.orderDelayMs || 0;
        this.invalidationReason = data.invalidationReason || PathInvalidationReason.InitiallyDisabled;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
        this.isPossible = data.isPossible !== undefined ? data.isPossible : true;
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.isLocked = data.isLocked !== undefined ? data.isLocked : false;
        this.transitionPattern = data.transitionPattern || null;
        this._hash = data._hash || null;
    }

    /**
     * Actions property'si (Steps için alias)
     */
    get actions() {
        return this.steps;
    }

    /**
     * Trading path'in string temsilini döndürür
     */
    toString() {
        return this.steps
            .sort((a, b) => a.id - b.id)
            .map(step => {
                const direction = step.direction === "Buy" ? "Buy" : "Sell";
                const pair = step.pair?.toString() || "Unknown";
                const exchange = step.pair?.exchange?.name || "Unknown";
                const isStarter = step.isStarter;
                return `${direction}-${pair}-${exchange}-${isStarter}`;
            })
            .join("|");
    }

    /**
     * Trading path için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            this._hash = this.friendlyName ? this.computeHash(this.friendlyName) : 0;
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
     * İki trading path'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.id === other.id && this.friendlyName === other.friendlyName;
    }

    /**
     * Trading path'i doğrular
     */
    validate() {
        const errors = [];
        
        if (this.tradingPathGroupId <= 0) {
            errors.push("Trading path group ID gerekli");
        }
        
        if (!this.friendlyName || this.friendlyName.trim() === "") {
            errors.push("Friendly name gerekli");
        }
        
        if (this.minimumOrderInUsd < 0) {
            errors.push("Minimum order USD negatif olamaz");
        }
        
        if (this.executionLimit < 0) {
            errors.push("Execution limit negatif olamaz");
        }
        
        if (this.targetReturn < 0) {
            errors.push("Target return negatif olamaz");
        }
        
        if (this.slippageProtection < 0) {
            errors.push("Slippage protection negatif olamaz");
        }
        
        if (this.orderDelayMs < 0) {
            errors.push("Order delay negatif olamaz");
        }
        
        if (this.steps.length === 0) {
            errors.push("En az bir step gerekli");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Trading path'i kopyalar
     */
    clone() {
        return new TradingPath({
            ...this,
            steps: this.steps.map(step => step.clone()),
            tradingPathGroup: this.tradingPathGroup ? { ...this.tradingPathGroup } : null,
            dateAdded: new Date(this.dateAdded),
            _hash: null
        });
    }

    /**
     * Trading path'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new TradingPath(data);
        } catch (error) {
            console.error("TradingPath JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Trading path'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                tradingPathGroupId: this.tradingPathGroupId,
                tradingPathGroup: this.tradingPathGroup,
                steps: this.steps,
                stepCount: this.stepCount,
                friendlyName: this.friendlyName,
                minimumOrderInUsd: this.minimumOrderInUsd,
                executionLimit: this.executionLimit,
                targetReturn: this.targetReturn,
                slippageProtection: this.slippageProtection,
                orderDelayMs: this.orderDelayMs,
                invalidationReason: this.invalidationReason,
                dateAdded: this.dateAdded.toISOString(),
                isVisible: this.isVisible,
                isPossible: this.isPossible,
                isActive: this.isActive,
                isLocked: this.isLocked,
                transitionPattern: this.transitionPattern
            });
        } catch (error) {
            console.error("TradingPath JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir trading path objesi oluşturur (static method)
     */
    static create(tradingPathGroupId, friendlyName, steps = []) {
        return new TradingPath({
            tradingPathGroupId: tradingPathGroupId,
            friendlyName: friendlyName,
            steps: steps,
            stepCount: steps.length
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
     * Tarihi formatlar
     */
    getDateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Trading path'in aktif olup olmadığını kontrol eder
     */
    isActivePath() {
        return this.isActive && this.isPossible && !this.isLocked;
    }

    /**
     * Trading path'in görünür olup olmadığını kontrol eder
     */
    isVisiblePath() {
        return this.isVisible && this.isActive;
    }

    /**
     * Trading path'in kilitli olup olmadığını kontrol eder
     */
    isLockedPath() {
        return this.isLocked;
    }

    /**
     * Trading path'in geçerli olup olmadığını kontrol eder
     */
    isValidPath() {
        return this.invalidationReason === PathInvalidationReason.None;
    }

    /**
     * Trading path'in disabled olup olmadığını kontrol eder
     */
    isDisabled() {
        return !this.isActive || this.isLocked || !this.isPossible;
    }

    /**
     * Trading path'in disabled olma sebebini getirir
     */
    getDisabledReason() {
        if (this.isLocked) return "Kilitli";
        if (!this.isActive) return "Aktif değil";
        if (!this.isPossible) return "Mümkün değil";
        if (this.invalidationReason !== PathInvalidationReason.None) return this.invalidationReason;
        return "Aktif";
    }

    /**
     * Trading path'in toplam adım sayısını getirir
     */
    getTotalSteps() {
        return this.steps.length;
    }

    /**
     * Trading path'in başlangıç adımlarını getirir
     */
    getStarterSteps() {
        return this.steps.filter(step => step.isStarter);
    }

    /**
     * Trading path'in ara adımlarını getirir
     */
    getIntermediateSteps() {
        return this.steps.filter(step => !step.isStarter);
    }

    /**
     * Trading path'in buy adımlarını getirir
     */
    getBuySteps() {
        return this.steps.filter(step => step.direction === "Buy");
    }

    /**
     * Trading path'in sell adımlarını getirir
     */
    getSellSteps() {
        return this.steps.filter(step => step.direction === "Sell");
    }

    /**
     * Trading path'in kullanılan exchange'lerini getirir
     */
    getExchanges() {
        const exchanges = new Set();
        this.steps.forEach(step => {
            if (step.pair?.exchange?.name) {
                exchanges.add(step.pair.exchange.name);
            }
        });
        return Array.from(exchanges);
    }

    /**
     * Trading path'in kullanılan asset'lerini getirir
     */
    getAssets() {
        const assets = new Set();
        this.steps.forEach(step => {
            if (step.startingAsset?.name) assets.add(step.startingAsset.name);
            if (step.finishingAsset?.name) assets.add(step.finishingAsset.name);
        });
        return Array.from(assets);
    }

    /**
     * Trading path'in karmaşıklık seviyesini getirir
     */
    getComplexityLevel() {
        const stepCount = this.steps.length;
        if (stepCount <= 2) return "Basit";
        if (stepCount <= 4) return "Orta";
        if (stepCount <= 6) return "Karmaşık";
        return "Çok Karmaşık";
    }

    /**
     * Trading path'in risk seviyesini getirir
     */
    getRiskLevel() {
        const exchanges = this.getExchanges().length;
        const steps = this.steps.length;
        
        if (exchanges === 1 && steps <= 2) return "Düşük";
        if (exchanges <= 2 && steps <= 4) return "Orta";
        if (exchanges <= 3 && steps <= 6) return "Yüksek";
        return "Çok Yüksek";
    }

    /**
     * Örnek trading path verisi
     */
    static getSampleData() {
        return [
            new TradingPath({
                id: 1,
                tradingPathGroupId: 1,
                friendlyName: "BTC-USDT Arbitraj",
                steps: [
                    new TradeAction({
                        id: 1,
                        tradingPathId: 1,
                        pair: { id: 1, asset1: { name: "BTC" }, asset2: { name: "USDT" }, exchange: { name: "Binance" } },
                        direction: "Buy",
                        tradeOrder: 1,
                        isStarter: true
                    }),
                    new TradeAction({
                        id: 2,
                        tradingPathId: 1,
                        pair: { id: 2, asset1: { name: "BTC" }, asset2: { name: "USDT" }, exchange: { name: "Coinbase" } },
                        direction: "Sell",
                        tradeOrder: 2,
                        isStarter: false
                    })
                ],
                stepCount: 2,
                minimumOrderInUsd: 100,
                executionLimit: 10000,
                targetReturn: 0.005,
                slippageProtection: 0.3,
                orderDelayMs: 1000,
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new TradingPath({
                id: 2,
                tradingPathGroupId: 1,
                friendlyName: "ETH-USDT Cross Exchange",
                steps: [
                    new TradeAction({
                        id: 3,
                        tradingPathId: 2,
                        pair: { id: 3, asset1: { name: "ETH" }, asset2: { name: "USDT" }, exchange: { name: "Kraken" } },
                        direction: "Buy",
                        tradeOrder: 1,
                        isStarter: true
                    }),
                    new TradeAction({
                        id: 4,
                        tradingPathId: 2,
                        pair: { id: 4, asset1: { name: "ETH" }, asset2: { name: "USDT" }, exchange: { name: "Bybit" } },
                        direction: "Sell",
                        tradeOrder: 2,
                        isStarter: false
                    })
                ],
                stepCount: 2,
                minimumOrderInUsd: 50,
                executionLimit: 5000,
                targetReturn: 0.008,
                slippageProtection: 0.5,
                orderDelayMs: 1500,
                dateAdded: new Date("2024-01-15T10:30:00")
            }),
            new TradingPath({
                id: 3,
                tradingPathGroupId: 2,
                friendlyName: "ADA-SOL-USDT Triangle",
                steps: [
                    new TradeAction({
                        id: 5,
                        tradingPathId: 3,
                        pair: { id: 5, asset1: { name: "ADA" }, asset2: { name: "USDT" }, exchange: { name: "KuCoin" } },
                        direction: "Buy",
                        tradeOrder: 1,
                        isStarter: true
                    }),
                    new TradeAction({
                        id: 6,
                        tradingPathId: 3,
                        pair: { id: 6, asset1: { name: "ADA" }, asset2: { name: "SOL" }, exchange: { name: "OKX" } },
                        direction: "Sell",
                        tradeOrder: 2,
                        isStarter: false
                    }),
                    new TradeAction({
                        id: 7,
                        tradingPathId: 3,
                        pair: { id: 7, asset1: { name: "SOL" }, asset2: { name: "USDT" }, exchange: { name: "Gate.io" } },
                        direction: "Sell",
                        tradeOrder: 3,
                        isStarter: false
                    })
                ],
                stepCount: 3,
                minimumOrderInUsd: 25,
                executionLimit: 2500,
                targetReturn: 0.012,
                slippageProtection: 0.8,
                orderDelayMs: 2000,
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new TradingPath({
                id: 4,
                tradingPathGroupId: 2,
                friendlyName: "DOT-LINK-MATIC Cycle",
                steps: [
                    new TradeAction({
                        id: 8,
                        tradingPathId: 4,
                        pair: { id: 8, asset1: { name: "DOT" }, asset2: { name: "USDT" }, exchange: { name: "Huobi" } },
                        direction: "Buy",
                        tradeOrder: 1,
                        isStarter: true
                    }),
                    new TradeAction({
                        id: 9,
                        tradingPathId: 4,
                        pair: { id: 9, asset1: { name: "DOT" }, asset2: { name: "LINK" }, exchange: { name: "Bitfinex" } },
                        direction: "Sell",
                        tradeOrder: 2,
                        isStarter: false
                    }),
                    new TradeAction({
                        id: 10,
                        tradingPathId: 4,
                        pair: { id: 10, asset1: { name: "LINK" }, asset2: { name: "MATIC" }, exchange: { name: "Deribit" } },
                        direction: "Sell",
                        tradeOrder: 3,
                        isStarter: false
                    }),
                    new TradeAction({
                        id: 11,
                        tradingPathId: 4,
                        pair: { id: 11, asset1: { name: "MATIC" }, asset2: { name: "USDT" }, exchange: { name: "Binance" } },
                        direction: "Sell",
                        tradeOrder: 4,
                        isStarter: false
                    })
                ],
                stepCount: 4,
                minimumOrderInUsd: 20,
                executionLimit: 2000,
                targetReturn: 0.015,
                slippageProtection: 1.0,
                orderDelayMs: 2500,
                dateAdded: new Date("2024-01-15T11:30:00")
            }),
            new TradingPath({
                id: 5,
                tradingPathGroupId: 3,
                friendlyName: "BTC-ETH-USD Complex",
                steps: [
                    new TradeAction({
                        id: 12,
                        tradingPathId: 5,
                        pair: { id: 12, asset1: { name: "BTC" }, asset2: { name: "USD" }, exchange: { name: "Coinbase" } },
                        direction: "Buy",
                        tradeOrder: 1,
                        isStarter: true
                    }),
                    new TradeAction({
                        id: 13,
                        tradingPathId: 5,
                        pair: { id: 13, asset1: { name: "BTC" }, asset2: { name: "ETH" }, exchange: { name: "Kraken" } },
                        direction: "Sell",
                        tradeOrder: 2,
                        isStarter: false
                    }),
                    new TradeAction({
                        id: 14,
                        tradingPathId: 5,
                        pair: { id: 14, asset1: { name: "ETH" }, asset2: { name: "USD" }, exchange: { name: "Bybit" } },
                        direction: "Sell",
                        tradeOrder: 3,
                        isStarter: false
                    }),
                    new TradeAction({
                        id: 15,
                        tradingPathId: 5,
                        pair: { id: 15, asset1: { name: "USD" }, asset2: { name: "BTC" }, exchange: { name: "KuCoin" } },
                        direction: "Buy",
                        tradeOrder: 4,
                        isStarter: false
                    })
                ],
                stepCount: 4,
                minimumOrderInUsd: 1000,
                executionLimit: 50000,
                targetReturn: 0.02,
                slippageProtection: 1.5,
                orderDelayMs: 3000,
                dateAdded: new Date("2024-01-15T12:00:00")
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
    window.TradingPath = TradingPath;
    window.PathInvalidationReason = PathInvalidationReason;
} 