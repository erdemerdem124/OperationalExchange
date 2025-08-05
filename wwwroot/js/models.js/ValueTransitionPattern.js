/**
 * ValueTransitionPattern DTO - Trading chain'lerin geçiş desenlerini temsil eder
 * Arbitraj operasyonlarında value transition'ları yönetir
 */

import { TradeAction } from './TradeAction.js';

export class ValueTransitionPattern {
    constructor(data = {}) {
        this.tradingChains = data.tradingChains ? 
            data.tradingChains.map(chain => chain.map(action => new TradeAction(action))) : 
            [];
    }

    /**
     * Tüm trading action'ları getirir
     */
    get allActions() {
        return this.tradingChains.flatMap(chain => chain);
    }

    /**
     * Toplam transition sayısını getirir
     */
    get totalTransitionCount() {
        return this.tradingChains.reduce((total, chain) => total + chain.length, 0);
    }

    /**
     * Paralel transition sayısını getirir
     */
    get parallelTransitionCount() {
        return this.tradingChains.length;
    }

    /**
     * Eksik trading chain'leri getirir (2'den az action veya aynı asset/exchange ile başlayıp biten)
     */
    get incompleteTradingChains() {
        return this.tradingChains.filter(chain => {
            if (!chain || chain.length < 2) return true;
            
            const firstAction = chain[0];
            const lastAction = chain[chain.length - 1];
            
            if (!firstAction || !lastAction) return true;
            
            return firstAction.startingAsset?.name === lastAction.finishingAsset?.name &&
                   firstAction.startingExchange?.name === lastAction.finishingExchange?.name;
        });
    }

    /**
     * Eksik trading chain'leri getirir (3'ten az action veya aynı asset/exchange ile başlayıp biten)
     */
    get incompleteTradingChainsTrio() {
        return this.tradingChains.filter(chain => {
            if (!chain || chain.length < 3) return true;
            
            const firstAction = chain[0];
            const lastAction = chain[chain.length - 1];
            
            if (!firstAction || !lastAction) return true;
            
            return firstAction.startingAsset?.name === lastAction.finishingAsset?.name &&
                   firstAction.startingExchange?.name === lastAction.finishingExchange?.name;
        });
    }

    /**
     * Tamamlanmış trading chain'leri getirir
     */
    get completeTradingChains() {
        return this.tradingChains.filter(chain => {
            if (!chain || chain.length < 2) return false;
            
            const firstAction = chain[0];
            const lastAction = chain[chain.length - 1];
            
            if (!firstAction || !lastAction) return false;
            
            return firstAction.startingAsset?.name !== lastAction.finishingAsset?.name ||
                   firstAction.startingExchange?.name !== lastAction.finishingExchange?.name;
        });
    }

    /**
     * Tamamlanmış trio trading chain'leri getirir
     */
    get completeTradingChainsTrio() {
        return this.tradingChains.filter(chain => {
            if (!chain || chain.length < 3) return false;
            
            const firstAction = chain[0];
            const lastAction = chain[chain.length - 1];
            
            if (!firstAction || !lastAction) return false;
            
            return firstAction.startingAsset?.name !== lastAction.finishingAsset?.name ||
                   firstAction.startingExchange?.name !== lastAction.finishingExchange?.name;
        });
    }

    /**
     * Pattern'in geçerli olup olmadığını kontrol eder
     */
    get isValid() {
        return this.completeTradingChains.length > 0;
    }

    /**
     * Pattern'in karmaşıklık seviyesini getirir
     */
    get complexityLevel() {
        const chainCount = this.tradingChains.length;
        const avgChainLength = this.totalTransitionCount / Math.max(chainCount, 1);
        
        if (chainCount <= 1 && avgChainLength <= 2) return "Basit";
        if (chainCount <= 2 && avgChainLength <= 3) return "Orta";
        if (chainCount <= 3 && avgChainLength <= 4) return "Karmaşık";
        return "Çok Karmaşık";
    }

    /**
     * Pattern'in risk seviyesini getirir
     */
    get riskLevel() {
        const incompleteCount = this.incompleteTradingChains.length;
        const totalCount = this.tradingChains.length;
        const incompleteRatio = totalCount > 0 ? incompleteCount / totalCount : 0;
        
        if (incompleteRatio === 0) return "Düşük";
        if (incompleteRatio <= 0.25) return "Orta";
        if (incompleteRatio <= 0.5) return "Yüksek";
        return "Çok Yüksek";
    }

    /**
     * Pattern'in performans skorunu hesaplar
     */
    get performanceScore() {
        let score = 0;
        
        // Tamamlanmış chain oranına göre puan
        const completeRatio = this.tradingChains.length > 0 ? 
            this.completeTradingChains.length / this.tradingChains.length : 0;
        score += completeRatio * 40;
        
        // Chain sayısına göre puan
        if (this.tradingChains.length >= 4) score += 25;
        else if (this.tradingChains.length >= 3) score += 20;
        else if (this.tradingChains.length >= 2) score += 15;
        else score += 10;
        
        // Ortalama chain uzunluğuna göre puan
        const avgLength = this.totalTransitionCount / Math.max(this.tradingChains.length, 1);
        if (avgLength >= 4) score += 25;
        else if (avgLength >= 3) score += 20;
        else if (avgLength >= 2) score += 15;
        else score += 10;
        
        return Math.min(Math.round(score), 100);
    }

    /**
     * Pattern'in performans seviyesini getirir
     */
    get performanceLevel() {
        const score = this.performanceScore;
        if (score >= 80) return "Mükemmel";
        if (score >= 60) return "İyi";
        if (score >= 40) return "Orta";
        if (score >= 20) return "Zayıf";
        return "Çok Zayıf";
    }

    /**
     * Pattern'in performans badge rengini getirir
     */
    getPerformanceBadgeClass() {
        const score = this.performanceScore;
        if (score >= 80) return 'bg-success';
        if (score >= 60) return 'bg-info';
        if (score >= 40) return 'bg-warning';
        if (score >= 20) return 'bg-danger';
        return 'bg-secondary';
    }

    /**
     * Karmaşıklık badge rengini getirir
     */
    getComplexityBadgeClass() {
        switch(this.complexityLevel) {
            case 'Basit': return 'bg-success';
            case 'Orta': return 'bg-info';
            case 'Karmaşık': return 'bg-warning';
            case 'Çok Karmaşık': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Risk badge rengini getirir
     */
    getRiskBadgeClass() {
        switch(this.riskLevel) {
            case 'Düşük': return 'bg-success';
            case 'Orta': return 'bg-info';
            case 'Yüksek': return 'bg-warning';
            case 'Çok Yüksek': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Pattern'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.tradingChains || this.tradingChains.length === 0) {
            errors.push("En az bir trading chain gerekli");
        }
        
        this.tradingChains.forEach((chain, index) => {
            if (!chain || chain.length === 0) {
                errors.push(`Chain ${index + 1} boş olamaz`);
            }
            
            chain.forEach((action, actionIndex) => {
                if (!action) {
                    errors.push(`Chain ${index + 1}, Action ${actionIndex + 1} geçersiz`);
                }
            });
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Pattern'i kopyalar
     */
    clone() {
        return new ValueTransitionPattern({
            tradingChains: this.tradingChains.map(chain => 
                chain.map(action => action.clone())
            )
        });
    }

    /**
     * Pattern'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new ValueTransitionPattern(data);
        } catch (error) {
            console.error("ValueTransitionPattern JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Pattern'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                tradingChains: this.tradingChains.map(chain => 
                    chain.map(action => action.toJson ? action.toJson() : action)
                )
            });
        } catch (error) {
            console.error("ValueTransitionPattern JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir pattern objesi oluşturur (static method)
     */
    static create(tradingChains = []) {
        return new ValueTransitionPattern({ tradingChains });
    }

    /**
     * Pattern istatistiklerini getirir
     */
    getStatistics() {
        return {
            totalChains: this.tradingChains.length,
            completeChains: this.completeTradingChains.length,
            incompleteChains: this.incompleteTradingChains.length,
            totalTransitions: this.totalTransitionCount,
            parallelTransitions: this.parallelTransitionCount,
            avgChainLength: this.tradingChains.length > 0 ? 
                this.totalTransitionCount / this.tradingChains.length : 0,
            completionRate: this.tradingChains.length > 0 ? 
                this.completeTradingChains.length / this.tradingChains.length : 0,
            complexityLevel: this.complexityLevel,
            riskLevel: this.riskLevel,
            performanceScore: this.performanceScore,
            performanceLevel: this.performanceLevel
        };
    }

    /**
     * Örnek value transition pattern verisi
     */
    static getSampleData() {
        return [
            new ValueTransitionPattern({
                tradingChains: [
                    [
                        {
                            id: 1,
                            tradingPathId: 1,
                            pairId: 1,
                            pair: { id: 1, asset1: { name: "BTC" }, asset2: { name: "USDT" }, exchange: { name: "Binance" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 2,
                            tradingPathId: 1,
                            pairId: 2,
                            pair: { id: 2, asset1: { name: "BTC" }, asset2: { name: "USDT" }, exchange: { name: "Coinbase" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        }
                    ]
                ]
            }),
            new ValueTransitionPattern({
                tradingChains: [
                    [
                        {
                            id: 3,
                            tradingPathId: 2,
                            pairId: 3,
                            pair: { id: 3, asset1: { name: "ETH" }, asset2: { name: "USDT" }, exchange: { name: "Kraken" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 4,
                            tradingPathId: 2,
                            pairId: 4,
                            pair: { id: 4, asset1: { name: "ETH" }, asset2: { name: "USDT" }, exchange: { name: "Bybit" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        }
                    ],
                    [
                        {
                            id: 5,
                            tradingPathId: 2,
                            pairId: 5,
                            pair: { id: 5, asset1: { name: "ADA" }, asset2: { name: "USDT" }, exchange: { name: "KuCoin" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 6,
                            tradingPathId: 2,
                            pairId: 6,
                            pair: { id: 6, asset1: { name: "ADA" }, asset2: { name: "USDT" }, exchange: { name: "OKX" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        }
                    ]
                ]
            }),
            new ValueTransitionPattern({
                tradingChains: [
                    [
                        {
                            id: 7,
                            tradingPathId: 3,
                            pairId: 7,
                            pair: { id: 7, asset1: { name: "SOL" }, asset2: { name: "USDT" }, exchange: { name: "Gate.io" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 8,
                            tradingPathId: 3,
                            pairId: 8,
                            pair: { id: 8, asset1: { name: "SOL" }, asset2: { name: "USDT" }, exchange: { name: "Huobi" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        },
                        {
                            id: 9,
                            tradingPathId: 3,
                            pairId: 9,
                            pair: { id: 9, asset1: { name: "SOL" }, asset2: { name: "USDT" }, exchange: { name: "Bitfinex" } },
                            direction: "Buy",
                            tradeOrder: 3,
                            isStarter: false
                        }
                    ]
                ]
            }),
            new ValueTransitionPattern({
                tradingChains: [
                    [
                        {
                            id: 10,
                            tradingPathId: 4,
                            pairId: 10,
                            pair: { id: 10, asset1: { name: "DOT" }, asset2: { name: "USDT" }, exchange: { name: "Deribit" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 11,
                            tradingPathId: 4,
                            pairId: 11,
                            pair: { id: 11, asset1: { name: "LINK" }, asset2: { name: "USDT" }, exchange: { name: "Binance" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        }
                    ],
                    [
                        {
                            id: 12,
                            tradingPathId: 4,
                            pairId: 12,
                            pair: { id: 12, asset1: { name: "MATIC" }, asset2: { name: "USDT" }, exchange: { name: "Coinbase" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 13,
                            tradingPathId: 4,
                            pairId: 13,
                            pair: { id: 13, asset1: { name: "MATIC" }, asset2: { name: "USDT" }, exchange: { name: "Kraken" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        }
                    ],
                    [
                        {
                            id: 14,
                            tradingPathId: 4,
                            pairId: 14,
                            pair: { id: 14, asset1: { name: "DOT" }, asset2: { name: "USDT" }, exchange: { name: "Bybit" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        }
                    ]
                ]
            }),
            new ValueTransitionPattern({
                tradingChains: [
                    [
                        {
                            id: 15,
                            tradingPathId: 5,
                            pairId: 15,
                            pair: { id: 15, asset1: { name: "BTC" }, asset2: { name: "USD" }, exchange: { name: "Coinbase" } },
                            direction: "Buy",
                            tradeOrder: 1,
                            isStarter: true
                        },
                        {
                            id: 16,
                            tradingPathId: 5,
                            pairId: 16,
                            pair: { id: 16, asset1: { name: "ETH" }, asset2: { name: "USD" }, exchange: { name: "Kraken" } },
                            direction: "Sell",
                            tradeOrder: 2,
                            isStarter: false
                        },
                        {
                            id: 17,
                            tradingPathId: 5,
                            pairId: 17,
                            pair: { id: 17, asset1: { name: "ETH" }, asset2: { name: "USD" }, exchange: { name: "Bybit" } },
                            direction: "Buy",
                            tradeOrder: 3,
                            isStarter: false
                        },
                        {
                            id: 18,
                            tradingPathId: 5,
                            pairId: 18,
                            pair: { id: 18, asset1: { name: "BTC" }, asset2: { name: "USD" }, exchange: { name: "KuCoin" } },
                            direction: "Sell",
                            tradeOrder: 4,
                            isStarter: false
                        }
                    ]
                ]
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.ValueTransitionPattern = ValueTransitionPattern;
} 