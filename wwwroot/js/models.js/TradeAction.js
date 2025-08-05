/**
 * TradeAction DTO - Arbitraj operasyonu içindeki atomik trading aksiyonunu temsil eder
 * Yüksek frekanslı ticaret için optimize edilmiş minimum bellek kullanımı
 * Sadece temel veriler veritabanı I/O yükünü azaltmak için saklanır
 * 
 * Ana Tasarım Prensipleri:
 * - Bellek tahsisi azaltmak için minimum özellik sayısı
 * - Referans tipler yerine value tipler tercih edilir
 * - Türetilmiş veriler için computed properties
 * - Veritabanı annotation'larının stratejik kullanımı
 * 
 * İş Bağlamı:
 * - Çok aşamalı arbitraj operasyonlarının bir parçası
 * - Trading path'teki bireysel adımları takip etmek için kullanılır
 * - Hem spot hem de futures trading'i destekler
 */

import { Pair } from './Pair.js';

export class TradeAction {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.tradingPathId = data.tradingPathId || 0;
        this.pairId = data.pairId || 0;
        this.pair = data.pair ? new Pair(data.pair) : null;
        this.direction = data.direction || "Buy";
        this.tradeOrder = data.tradeOrder || 0;
        this.isStarter = data.isStarter !== undefined ? data.isStarter : false;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.notionPageId = data.notionPageId || null;
        this._hash = data._hash || null;
    }

    /**
     * Trade action'ın insan tarafından okunabilir temsilini döndürür
     * Format: "Buy/Sell - PairName"
     */
    toString() {
        const directionText = this.direction === "Buy" ? "Buy" : "Sell";
        return `${directionText} - ${this.pair?.toString() || 'Unknown Pair'}`;
    }

    /**
     * Bu aksiyonda takas edilen asset
     * Computed property - capital flow'u belirlemek için
     */
    get startingAsset() {
        if (!this.pair) return null;
        return this.direction === "Buy" ? this.pair.asset2 : this.pair.asset1;
    }

    /**
     * Bu aksiyonda elde edilen asset
     * Computed property - capital flow'u belirlemek için
     */
    get finishingAsset() {
        if (!this.pair) return null;
        return this.direction === "Buy" ? this.pair.asset1 : this.pair.asset2;
    }

    /**
     * Trade'in yürütüldüğü exchange
     * Computed property - exchange-specific logic için
     */
    get startingExchange() {
        return this.pair?.exchange || null;
    }

    /**
     * Trade yürütme sonrası exchange
     * Cross-exchange arbitraj desteği için korunur
     */
    get finishingExchange() {
        return this.pair?.exchange || null;
    }

    /**
     * Trade action için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = `${this.tradingPathId} ${this.tradeOrder}`;
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
     * İki trade action'ın eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.id === other.id && 
               this.tradingPathId === other.tradingPathId && 
               this.tradeOrder === other.tradeOrder;
    }

    /**
     * Trade action'ı doğrular
     */
    validate() {
        const errors = [];
        
        if (this.tradingPathId <= 0) {
            errors.push("Trading path ID gerekli");
        }
        
        if (this.pairId <= 0) {
            errors.push("Pair ID gerekli");
        }
        
        if (!this.pair) {
            errors.push("Pair gerekli");
        }
        
        if (!this.direction || (this.direction !== "Buy" && this.direction !== "Sell")) {
            errors.push("Geçerli direction gerekli (Buy/Sell)");
        }
        
        if (this.tradeOrder < 0) {
            errors.push("Trade order negatif olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Trade action'ı kopyalar
     */
    clone() {
        return new TradeAction({
            ...this,
            pair: this.pair ? this.pair.clone() : null,
            dateAdded: new Date(this.dateAdded),
            _hash: null
        });
    }

    /**
     * Trade action'ı JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new TradeAction(data);
        } catch (error) {
            console.error("TradeAction JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Trade action'ı JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                tradingPathId: this.tradingPathId,
                pairId: this.pairId,
                pair: this.pair,
                direction: this.direction,
                tradeOrder: this.tradeOrder,
                isStarter: this.isStarter,
                dateAdded: this.dateAdded.toISOString(),
                notionPageId: this.notionPageId
            });
        } catch (error) {
            console.error("TradeAction JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir trade action objesi oluşturur (static method)
     */
    static create(tradingPathId, pair, direction, tradeOrder, isStarter = false) {
        return new TradeAction({
            tradingPathId: tradingPathId,
            pairId: pair?.id || 0,
            pair: pair,
            direction: direction,
            tradeOrder: tradeOrder,
            isStarter: isStarter
        });
    }

    /**
     * Direction badge rengini getirir
     */
    getDirectionBadgeClass() {
        switch(this.direction) {
            case 'Buy': return 'bg-success';
            case 'Sell': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Direction adını getirir
     */
    getDirectionName() {
        switch(this.direction) {
            case 'Buy': return 'Alış';
            case 'Sell': return 'Satış';
            default: return this.direction || 'Bilinmeyen';
        }
    }

    /**
     * Starter badge rengini getirir
     */
    getStarterBadgeClass() {
        return this.isStarter ? 'bg-primary' : 'bg-secondary';
    }

    /**
     * Starter adını getirir
     */
    getStarterName() {
        return this.isStarter ? 'Başlangıç' : 'Ara';
    }

    /**
     * Tarihi formatlar
     */
    getDateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Trade action'ın aktif olup olmadığını kontrol eder
     */
    isActive() {
        return this.pair && this.pair.isActive;
    }

    /**
     * Trade action'ın buy olup olmadığını kontrol eder
     */
    isBuy() {
        return this.direction === "Buy";
    }

    /**
     * Trade action'ın sell olup olmadığını kontrol eder
     */
    isSell() {
        return this.direction === "Sell";
    }

    /**
     * Trade action'ın starter olup olmadığını kontrol eder
     */
    isStarterAction() {
        return this.isStarter;
    }

    /**
     * Asset flow'unu getirir
     */
    getAssetFlow() {
        if (!this.startingAsset || !this.finishingAsset) return 'N/A';
        return `${this.startingAsset.name} → ${this.finishingAsset.name}`;
    }

    /**
     * Exchange bilgisini getirir
     */
    getExchangeInfo() {
        if (!this.startingExchange) return 'N/A';
        return this.startingExchange.name;
    }

    /**
     * Örnek trade action verisi
     */
    static getSampleData() {
        return [
            new TradeAction({
                id: 1,
                tradingPathId: 1,
                pairId: 1,
                pair: new Pair({
                    id: 1,
                    asset1: { id: 1, name: "BTC" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 1, name: "Binance" }
                }),
                direction: "Buy",
                tradeOrder: 1,
                isStarter: true,
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new TradeAction({
                id: 2,
                tradingPathId: 1,
                pairId: 2,
                pair: new Pair({
                    id: 2,
                    asset1: { id: 3, name: "ETH" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 2, name: "Coinbase" }
                }),
                direction: "Sell",
                tradeOrder: 2,
                isStarter: false,
                dateAdded: new Date("2024-01-15T10:05:00")
            }),
            new TradeAction({
                id: 3,
                tradingPathId: 2,
                pairId: 3,
                pair: new Pair({
                    id: 3,
                    asset1: { id: 5, name: "ADA" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 3, name: "Kraken" }
                }),
                direction: "Buy",
                tradeOrder: 1,
                isStarter: true,
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new TradeAction({
                id: 4,
                tradingPathId: 2,
                pairId: 4,
                pair: new Pair({
                    id: 4,
                    asset1: { id: 6, name: "SOL" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 4, name: "Bybit" }
                }),
                direction: "Sell",
                tradeOrder: 2,
                isStarter: false,
                dateAdded: new Date("2024-01-15T11:05:00")
            }),
            new TradeAction({
                id: 5,
                tradingPathId: 3,
                pairId: 5,
                pair: new Pair({
                    id: 5,
                    asset1: { id: 7, name: "DOT" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 5, name: "KuCoin" }
                }),
                direction: "Buy",
                tradeOrder: 1,
                isStarter: true,
                dateAdded: new Date("2024-01-15T12:00:00")
            }),
            new TradeAction({
                id: 6,
                tradingPathId: 3,
                pairId: 6,
                pair: new Pair({
                    id: 6,
                    asset1: { id: 8, name: "LINK" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 1, name: "Binance" }
                }),
                direction: "Sell",
                tradeOrder: 2,
                isStarter: false,
                dateAdded: new Date("2024-01-15T12:05:00")
            }),
            new TradeAction({
                id: 7,
                tradingPathId: 4,
                pairId: 7,
                pair: new Pair({
                    id: 7,
                    asset1: { id: 9, name: "MATIC" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 2, name: "Coinbase" }
                }),
                direction: "Buy",
                tradeOrder: 1,
                isStarter: true,
                dateAdded: new Date("2024-01-15T13:00:00")
            }),
            new TradeAction({
                id: 8,
                tradingPathId: 4,
                pairId: 8,
                pair: new Pair({
                    id: 8,
                    asset1: { id: 10, name: "AVAX" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 3, name: "Kraken" }
                }),
                direction: "Sell",
                tradeOrder: 2,
                isStarter: false,
                dateAdded: new Date("2024-01-15T13:05:00")
            }),
            new TradeAction({
                id: 9,
                tradingPathId: 5,
                pairId: 9,
                pair: new Pair({
                    id: 9,
                    asset1: { id: 1, name: "BTC" },
                    asset2: { id: 4, name: "USD" },
                    exchange: { id: 4, name: "Bybit" }
                }),
                direction: "Buy",
                tradeOrder: 1,
                isStarter: true,
                dateAdded: new Date("2024-01-15T14:00:00")
            }),
            new TradeAction({
                id: 10,
                tradingPathId: 5,
                pairId: 10,
                pair: new Pair({
                    id: 10,
                    asset1: { id: 3, name: "ETH" },
                    asset2: { id: 4, name: "USD" },
                    exchange: { id: 5, name: "KuCoin" }
                }),
                direction: "Sell",
                tradeOrder: 2,
                isStarter: false,
                dateAdded: new Date("2024-01-15T14:05:00")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradeAction = TradeAction;
} 