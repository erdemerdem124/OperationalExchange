/**
 * Quote DTO - Yüksek frekanslı ticaret sistemlerinde market quote'unu temsil eder
 * Her fiyat ve boyutu ayrı ayrı saklar (paketlenmiş yapı değil)
 */

export class Quote {
    constructor(data = {}) {
        this.timestamp = data.timestamp || Date.now() * 1000;
        this.askPrice = data.askPrice || null;
        this.askSize = data.askSize || null;
        this.bidPrice = data.bidPrice || null;
        this.bidSize = data.bidSize || null;
        this.lastPrice = data.lastPrice || null;
    }

    /**
     * Ask ve bid fiyatları arasındaki spread'i hesaplar
     */
    get spread() {
        if (this.askPrice === null || this.bidPrice === null) return null;
        return this.askPrice - this.bidPrice;
    }

    /**
     * Ask ve bid arasındaki orta fiyatı hesaplar
     */
    get midPrice() {
        if (this.askPrice === null || this.bidPrice === null) return null;
        return (this.askPrice + this.bidPrice) / 2;
    }

    /**
     * Spread yüzdesini hesaplar
     */
    get spreadPercentage() {
        if (!this.spread || !this.bidPrice) return null;
        return (this.spread / this.bidPrice) * 100;
    }

    /**
     * Quote'un string temsilini döndürür
     */
    toString() {
        return `Quote: Ask(${this.askPrice}/${this.askSize}) Bid(${this.bidPrice}/${this.bidSize}) Last(${this.lastPrice}) Time(${this.timestamp})`;
    }

    /**
     * Quote için hash değeri hesaplar
     */
    getHash() {
        const str = `${this.timestamp}_${this.askPrice}_${this.bidPrice}_${this.lastPrice}`;
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
     * İki quote'un eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.timestamp === other.timestamp &&
               this.askPrice === other.askPrice &&
               this.askSize === other.askSize &&
               this.bidPrice === other.bidPrice &&
               this.bidSize === other.bidSize &&
               this.lastPrice === other.lastPrice;
    }

    /**
     * Quote'u doğrular
     */
    validate() {
        const errors = [];
        
        if (this.timestamp <= 0) {
            errors.push("Geçerli timestamp gerekli");
        }
        
        if (this.askPrice !== null && this.askPrice < 0) {
            errors.push("Ask price negatif olamaz");
        }
        
        if (this.bidPrice !== null && this.bidPrice < 0) {
            errors.push("Bid price negatif olamaz");
        }
        
        if (this.lastPrice !== null && this.lastPrice < 0) {
            errors.push("Last price negatif olamaz");
        }
        
        if (this.askSize !== null && this.askSize < 0) {
            errors.push("Ask size negatif olamaz");
        }
        
        if (this.bidSize !== null && this.bidSize < 0) {
            errors.push("Bid size negatif olamaz");
        }
        
        // Spread kontrolü
        if (this.askPrice !== null && this.bidPrice !== null && this.askPrice <= this.bidPrice) {
            errors.push("Ask price bid price'dan büyük olmalı");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Quote'u kopyalar
     */
    clone() {
        return new Quote({
            timestamp: this.timestamp,
            askPrice: this.askPrice,
            askSize: this.askSize,
            bidPrice: this.bidPrice,
            bidSize: this.bidSize,
            lastPrice: this.lastPrice
        });
    }

    /**
     * Quote'u JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Quote(data);
        } catch (error) {
            console.error("Quote JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Quote'u JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                timestamp: this.timestamp,
                askPrice: this.askPrice,
                askSize: this.askSize,
                bidPrice: this.bidPrice,
                bidSize: this.bidSize,
                lastPrice: this.lastPrice
            });
        } catch (error) {
            console.error("Quote JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir quote objesi oluşturur (static method)
     */
    static create(askPrice, askSize, bidPrice, bidSize, lastPrice, timestamp = null) {
        return new Quote({
            askPrice: askPrice,
            askSize: askSize,
            bidPrice: bidPrice,
            bidSize: bidSize,
            lastPrice: lastPrice,
            timestamp: timestamp || Date.now() * 1000
        });
    }

    /**
     * Timestamp'i okunabilir formatta getirir
     */
    getTimestampFormatted() {
        const date = new Date(this.timestamp / 1000);
        return date.toLocaleString('tr-TR');
    }

    /**
     * Spread'i okunabilir formatta getirir
     */
    getSpreadFormatted() {
        if (!this.spread) return 'N/A';
        const percentage = this.spreadPercentage || 0;
        return `${this.spread.toFixed(8)} (${percentage.toFixed(4)}%)`;
    }

    /**
     * Mid price'i okunabilir formatta getirir
     */
    getMidPriceFormatted() {
        if (!this.midPrice) return 'N/A';
        return this.midPrice.toFixed(8);
    }

    /**
     * Quote'un boş olup olmadığını kontrol eder
     */
    isEmpty() {
        return this.askPrice === null && this.bidPrice === null && this.lastPrice === null;
    }

    /**
     * Quote'un güncel olup olmadığını kontrol eder (5 saniye içinde)
     */
    isStale(maxAgeMs = 5000) {
        const currentTime = Date.now() * 1000;
        return (currentTime - this.timestamp) > maxAgeMs * 1000;
    }

    /**
     * Quote'un geçerli olup olmadığını kontrol eder
     */
    isValid() {
        return this.askPrice !== null && this.bidPrice !== null && this.askPrice > this.bidPrice;
    }

    /**
     * Örnek quote verisi
     */
    static getSampleData() {
        return [
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 45000.50,
                askSize: 0.1,
                bidPrice: 44999.50,
                bidSize: 0.12,
                lastPrice: 45000.00
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 2800.00,
                askSize: 2.5,
                bidPrice: 2799.50,
                bidSize: 2.8,
                lastPrice: 2799.75
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 0.4500,
                askSize: 1000,
                bidPrice: 0.4495,
                bidSize: 1100,
                lastPrice: 0.4498
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 95.50,
                askSize: 50,
                bidPrice: 95.45,
                bidSize: 55,
                lastPrice: 95.48
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 7.25,
                askSize: 200,
                bidPrice: 7.24,
                bidSize: 170,
                lastPrice: 7.245
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 1800.00,
                askSize: 1.5,
                bidPrice: 1799.50,
                bidSize: 1.8,
                lastPrice: 1799.75
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 0.85,
                askSize: 5000,
                bidPrice: 0.8495,
                bidSize: 5200,
                lastPrice: 0.8498
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 120.00,
                askSize: 25,
                bidPrice: 119.95,
                bidSize: 30,
                lastPrice: 119.98
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 2.50,
                askSize: 1000,
                bidPrice: 2.49,
                bidSize: 1100,
                lastPrice: 2.495
            }),
            new Quote({
                timestamp: Date.now() * 1000,
                askPrice: 35000.00,
                askSize: 0.05,
                bidPrice: 34999.50,
                bidSize: 0.06,
                lastPrice: 34999.75
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Quote = Quote;
} 