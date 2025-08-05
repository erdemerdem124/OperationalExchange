/**
 * Orderbook DTO - Yüksek frekanslı ticaret operasyonları için optimize edilmiş gerçek zamanlı orderbook snapshot'ını temsil eder
 * Bid/ask fiyat seviyelerini minimum bellek kullanımı ve verimli erişim desenleriyle korur
 * Arbitraj fırsatı tespiti ve yürütme için temel bileşen
 * 
 * Performans Optimizasyonları:
 * - O(log n) fiyat seviyesi erişimi için Map kullanır
 * - Analiz sırasında sıralama yapmamak için önceden sıralanmış bid/ask seviyelerini korur
 * - Özellik sayısını minimize eder ve mümkün olduğunda value type'ları kullanır
 * - HFT operasyonları için gerekli olan sadece temel özellikleri uygular
 */

import { Pair } from './Pair.js';

export class Orderbook {
    constructor(data = {}) {
        this.timestampUs = data.timestampUs || Date.now() * 1000;
        this.pair = data.pair ? new Pair(data.pair) : null;
        this.isUpdateData = data.isUpdateData || false;
        
        // Asks ve Bids için Map kullan (SortedDictionary yerine)
        this.asks = new Map();
        this.bids = new Map();
        
        // Eğer data'dan geliyorsa, sıralı şekilde yükle
        if (data.asks) {
            Object.entries(data.asks)
                .sort(([a], [b]) => parseFloat(a) - parseFloat(b)) // Ascending order
                .forEach(([price, size]) => {
                    this.asks.set(parseFloat(price), parseFloat(size));
                });
        }
        
        if (data.bids) {
            Object.entries(data.bids)
                .sort(([a], [b]) => parseFloat(b) - parseFloat(a)) // Descending order
                .forEach(([price, size]) => {
                    this.bids.set(parseFloat(price), parseFloat(size));
                });
        }
    }

    /**
     * Best ask price - dictionary lookup olmadan hızlı erişim için
     */
    get bestAskPrice() {
        if (this.asks.size === 0) return 0;
        return Array.from(this.asks.keys())[0];
    }

    /**
     * Best ask size - dictionary lookup olmadan hızlı erişim için
     */
    get bestAskSize() {
        if (this.asks.size === 0) return 0;
        return Array.from(this.asks.values())[0];
    }

    /**
     * Best bid price - dictionary lookup olmadan hızlı erişim için
     */
    get bestBidPrice() {
        if (this.bids.size === 0) return 0;
        return Array.from(this.bids.keys())[0];
    }

    /**
     * Best bid size - dictionary lookup olmadan hızlı erişim için
     */
    get bestBidSize() {
        if (this.bids.size === 0) return 0;
        return Array.from(this.bids.values())[0];
    }

    /**
     * Orderbook'un string temsilini döndürür
     */
    toString() {
        return `${this.timestampUs} ${this.pair?.toString() || 'Unknown'} Ask:${this.asks.size}, Bid:${this.bids.size}, ` +
               `BestAsk: ${this.bestAskPrice}, BestAskSize: ${this.bestAskSize}, ` +
               `BestBid: ${this.bestBidPrice}, BestBidSize: ${this.bestBidSize}`;
    }

    /**
     * Orderbook için hash değeri hesaplar
     */
    getHash() {
        if (!this.pair?.toString()) return null;
        const str = this.pair.toString() + this.timestampUs.toString();
        return this.computeHash(str);
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
     * Ask seviyesi ekler
     */
    addAsk(price, size) {
        this.asks.set(price, size);
        // Sıralı tutmak için yeniden sırala
        this.sortAsks();
    }

    /**
     * Bid seviyesi ekler
     */
    addBid(price, size) {
        this.bids.set(price, size);
        // Sıralı tutmak için yeniden sırala
        this.sortBids();
    }

    /**
     * Ask seviyesini günceller
     */
    updateAsk(price, size) {
        if (size <= 0) {
            this.asks.delete(price);
        } else {
            this.asks.set(price, size);
        }
        this.sortAsks();
    }

    /**
     * Bid seviyesini günceller
     */
    updateBid(price, size) {
        if (size <= 0) {
            this.bids.delete(price);
        } else {
            this.bids.set(price, size);
        }
        this.sortBids();
    }

    /**
     * Ask seviyesini siler
     */
    removeAsk(price) {
        this.asks.delete(price);
    }

    /**
     * Bid seviyesini siler
     */
    removeBid(price) {
        this.bids.delete(price);
    }

    /**
     * Asks'ı ascending order'da sıralar
     */
    sortAsks() {
        const sortedEntries = Array.from(this.asks.entries())
            .sort(([a], [b]) => a - b);
        
        this.asks.clear();
        sortedEntries.forEach(([price, size]) => {
            this.asks.set(price, size);
        });
    }

    /**
     * Bids'ı descending order'da sıralar
     */
    sortBids() {
        const sortedEntries = Array.from(this.bids.entries())
            .sort(([a], [b]) => b - a);
        
        this.bids.clear();
        sortedEntries.forEach(([price, size]) => {
            this.bids.set(price, size);
        });
    }

    /**
     * Spread hesaplar
     */
    getSpread() {
        if (this.bestAskPrice <= 0 || this.bestBidPrice <= 0) return 0;
        return this.bestAskPrice - this.bestBidPrice;
    }

    /**
     * Spread yüzdesini hesaplar
     */
    getSpreadPercentage() {
        const spread = this.getSpread();
        if (spread <= 0 || this.bestBidPrice <= 0) return 0;
        return (spread / this.bestBidPrice) * 100;
    }

    /**
     * Mid price hesaplar
     */
    getMidPrice() {
        if (this.bestAskPrice <= 0 || this.bestBidPrice <= 0) return 0;
        return (this.bestAskPrice + this.bestBidPrice) / 2;
    }

    /**
     * Toplam ask volume hesaplar
     */
    getTotalAskVolume() {
        return Array.from(this.asks.values()).reduce((sum, size) => sum + size, 0);
    }

    /**
     * Toplam bid volume hesaplar
     */
    getTotalBidVolume() {
        return Array.from(this.bids.values()).reduce((sum, size) => sum + size, 0);
    }

    /**
     * Belirli bir fiyat seviyesine kadar olan ask volume'u hesaplar
     */
    getAskVolumeUpTo(price) {
        return Array.from(this.asks.entries())
            .filter(([askPrice]) => askPrice <= price)
            .reduce((sum, [, size]) => sum + size, 0);
    }

    /**
     * Belirli bir fiyat seviyesine kadar olan bid volume'u hesaplar
     */
    getBidVolumeUpTo(price) {
        return Array.from(this.bids.entries())
            .filter(([bidPrice]) => bidPrice >= price)
            .reduce((sum, [, size]) => sum + size, 0);
    }

    /**
     * Orderbook'u doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.pair) {
            errors.push("Pair gerekli");
        }
        
        if (this.timestampUs <= 0) {
            errors.push("Geçerli timestamp gerekli");
        }
        
        // Ask fiyatlarının ascending order'da olduğunu kontrol et
        const askPrices = Array.from(this.asks.keys());
        for (let i = 1; i < askPrices.length; i++) {
            if (askPrices[i] <= askPrices[i-1]) {
                errors.push("Ask fiyatları ascending order'da olmalı");
                break;
            }
        }
        
        // Bid fiyatlarının descending order'da olduğunu kontrol et
        const bidPrices = Array.from(this.bids.keys());
        for (let i = 1; i < bidPrices.length; i++) {
            if (bidPrices[i] >= bidPrices[i-1]) {
                errors.push("Bid fiyatları descending order'da olmalı");
                break;
            }
        }
        
        // Spread kontrolü
        if (this.bestAskPrice > 0 && this.bestBidPrice > 0 && this.bestAskPrice <= this.bestBidPrice) {
            errors.push("Best ask fiyatı best bid fiyatından büyük olmalı");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Orderbook'u kopyalar
     */
    clone() {
        const cloned = new Orderbook({
            timestampUs: this.timestampUs,
            pair: this.pair ? this.pair.clone() : null,
            isUpdateData: this.isUpdateData
        });
        
        // Asks ve Bids'ı kopyala
        this.asks.forEach((size, price) => {
            cloned.asks.set(price, size);
        });
        
        this.bids.forEach((size, price) => {
            cloned.bids.set(price, size);
        });
        
        return cloned;
    }

    /**
     * Orderbook'u JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Orderbook(data);
        } catch (error) {
            console.error("Orderbook JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Orderbook'u JSON'a dönüştürür
     */
    toJson() {
        try {
            const asksObj = {};
            this.asks.forEach((size, price) => {
                asksObj[price] = size;
            });
            
            const bidsObj = {};
            this.bids.forEach((size, price) => {
                bidsObj[price] = size;
            });
            
            return JSON.stringify({
                timestampUs: this.timestampUs,
                pair: this.pair,
                isUpdateData: this.isUpdateData,
                asks: asksObj,
                bids: bidsObj
            });
        } catch (error) {
            console.error("Orderbook JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir orderbook objesi oluşturur (static method)
     */
    static create(pair) {
        return new Orderbook({ pair: pair });
    }

    /**
     * İki orderbook'u karşılaştırır
     */
    equals(other) {
        if (!other) return false;
        return this.pair?.equals(other.pair) && 
               this.timestampUs === other.timestampUs;
    }

    /**
     * Orderbook'un boş olup olmadığını kontrol eder
     */
    isEmpty() {
        return this.asks.size === 0 && this.bids.size === 0;
    }

    /**
     * Orderbook'un güncel olup olmadığını kontrol eder (5 saniye içinde)
     */
    isStale(maxAgeMs = 5000) {
        const currentTime = Date.now() * 1000;
        return (currentTime - this.timestampUs) > maxAgeMs * 1000;
    }

    /**
     * Timestamp'i okunabilir formatta getirir
     */
    getTimestampFormatted() {
        const date = new Date(this.timestampUs / 1000);
        return date.toLocaleString('tr-TR');
    }

    /**
     * Spread'i okunabilir formatta getirir
     */
    getSpreadFormatted() {
        const spread = this.getSpread();
        const percentage = this.getSpreadPercentage();
        return `${spread.toFixed(8)} (${percentage.toFixed(4)}%)`;
    }

    /**
     * Örnek orderbook verisi
     */
    static getSampleData() {
        return [
            new Orderbook({
                pair: new Pair({
                    id: 1,
                    asset1: { id: 1, name: "BTC" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 1, name: "Binance" }
                }),
                timestampUs: Date.now() * 1000,
                asks: {
                    45000.50: 0.1,
                    45001.00: 0.2,
                    45001.50: 0.15,
                    45002.00: 0.3,
                    45002.50: 0.25
                },
                bids: {
                    44999.50: 0.12,
                    44999.00: 0.18,
                    44998.50: 0.22,
                    44998.00: 0.16,
                    44997.50: 0.28
                }
            }),
            new Orderbook({
                pair: new Pair({
                    id: 2,
                    asset1: { id: 3, name: "ETH" },
                    asset2: { id: 4, name: "USD" },
                    exchange: { id: 2, name: "Coinbase" }
                }),
                timestampUs: Date.now() * 1000,
                asks: {
                    2800.00: 2.5,
                    2800.50: 1.8,
                    2801.00: 3.2,
                    2801.50: 2.1,
                    2802.00: 1.9
                },
                bids: {
                    2799.50: 2.8,
                    2799.00: 1.5,
                    2798.50: 3.1,
                    2798.00: 2.4,
                    2797.50: 1.7
                }
            }),
            new Orderbook({
                pair: new Pair({
                    id: 3,
                    asset1: { id: 5, name: "ADA" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 3, name: "Kraken" }
                }),
                timestampUs: Date.now() * 1000,
                asks: {
                    0.4500: 1000,
                    0.4505: 1500,
                    0.4510: 2000,
                    0.4515: 1200,
                    0.4520: 1800
                },
                bids: {
                    0.4495: 1100,
                    0.4490: 1600,
                    0.4485: 1900,
                    0.4480: 1400,
                    0.4475: 1700
                }
            }),
            new Orderbook({
                pair: new Pair({
                    id: 4,
                    asset1: { id: 6, name: "SOL" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 4, name: "Bybit" }
                }),
                timestampUs: Date.now() * 1000,
                asks: {
                    95.50: 50,
                    95.55: 75,
                    95.60: 60,
                    95.65: 80,
                    95.70: 45
                },
                bids: {
                    95.45: 55,
                    95.40: 70,
                    95.35: 65,
                    95.30: 85,
                    95.25: 50
                }
            }),
            new Orderbook({
                pair: new Pair({
                    id: 5,
                    asset1: { id: 7, name: "DOT" },
                    asset2: { id: 2, name: "USDT" },
                    exchange: { id: 5, name: "KuCoin" }
                }),
                timestampUs: Date.now() * 1000,
                asks: {
                    7.25: 200,
                    7.26: 150,
                    7.27: 180,
                    7.28: 120,
                    7.29: 160
                },
                bids: {
                    7.24: 170,
                    7.23: 140,
                    7.22: 190,
                    7.21: 130,
                    7.20: 180
                }
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Orderbook = Orderbook;
} 