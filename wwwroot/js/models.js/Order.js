/**
 * Order DTO - Yüksek frekanslı ticaret sisteminde bir emri temsil eder
 * Her flag ve state özelliği ayrı ayrı saklanır (bit packing yok)
 * Çoklu borsalarda ticaret takibi ve yürütme için temel entity
 */

import { Pair } from './Pair.js';

export class Order {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.exchangeOrderId = data.exchangeOrderId || "0";
        this.exchangeClientId = data.exchangeClientId || "";
        this.pairId = data.pairId || 0;
        this.pair = data.pair ? new Pair(data.pair) : null;
        this.exchangeName = data.exchangeName || "";
        this.arbitrageId = data.arbitrageId || null;
        
        // Order durumları
        this.isDemo = data.isDemo || false;
        this.isManual = data.isManual || false;
        this.isSent = data.isSent || false;
        this.manualOperationCompleted = data.manualOperationCompleted || false;
        
        // Order yürütme parametreleri
        this.executionMethod = data.executionMethod || "GoodTillCancelled";
        this.price = data.price || 0;
        this.amount = data.amount || 0;
        this.executedAmount = data.executedAmount || 0;
        this.avgExecutedPrice = data.avgExecutedPrice || 0;
        this.orderType = data.orderType || "Limit";
        this.direction = data.direction || "Buy";
        this.state = data.state || "New";
        
        // Zamanlama metrikleri (mikrosaniye cinsinden)
        this.timestamp = data.timestamp || 0;
        this.finishedAt = data.finishedAt || null;
        this.durationUs = data.durationUs || null;
        
        // Trading fee bilgileri
        this.tradingFee = data.tradingFee || 0;
        
        // Bakiye takibi (risk yönetimi için)
        this.startingBalanceAsset1Amount = data.startingBalanceAsset1Amount || 0;
        this.startingBalanceAsset2Amount = data.startingBalanceAsset2Amount || 0;
        this.finishingBalanceAsset1Amount = data.finishingBalanceAsset1Amount || 0;
        this.finishingBalanceAsset2Amount = data.finishingBalanceAsset2Amount || 0;
        
        // Ticaret yürütme detayları
        this.givenAmount = data.givenAmount || 0;
        this.givenCurrency = data.givenCurrency || null;
        this.takenAmount = data.takenAmount || 0;
        this.takenCurrency = data.takenCurrency || null;
        
        // Hata işleme ve açıklamalar
        this.errorMessage = data.errorMessage || null;
        this.description = data.description || null;
        
        // Denetim zaman damgaları
        this.dateUpdated = data.dateUpdated ? new Date(data.dateUpdated) : new Date();
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        
        // In-memory collection (persist edilmez)
        this.executedTrades = new Set();
        
        // Notion page ID
        this.notionPageId = data.notionPageId || "";
        
        // Return drop count
        this.returnDropCount = data.returnDropCount || 0;
        
        this._hash = data._hash || null;
    }

    /**
     * Order'un string temsilini döndürür
     */
    toString() {
        return `${this.exchangeClientId} - ${this.pair?.toString() || this.pairId} - ${this.direction} ${this.amount} @ ${this.price}`;
    }

    /**
     * İki order'un eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.exchangeClientId === other.exchangeClientId && 
               this.exchangeOrderId === other.exchangeOrderId;
    }

    /**
     * Order için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = this.exchangeClientId;
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
     * Order'un aktif olup olmadığını kontrol eder
     */
    get isActive() {
        return !(this.state === "Cancelled" ||
                this.state === "Filled" ||
                this.state === "PartiallyFilledCancelled" ||
                this.state === "Rejected");
    }

    /**
     * Order durumunu getirir (geriye uyumluluk için)
     */
    get status() {
        switch(this.state) {
            case 'New': return 'Created';
            case 'PartiallyFilled': return 'PartiallyFilled';
            case 'Filled': return 'Filled';
            case 'Cancelled': return 'Cancelled';
            case 'PendingCancel': return 'Pending';
            case 'Rejected': return 'Rejected';
            case 'Expired': return 'Expired';
            case 'PartiallyFilledCancelled': return 'Cancelled';
            default: return 'Created';
        }
    }

    /**
     * Order tipini getirir (geriye uyumluluk için)
     */
    get type() {
        return this.orderType;
    }

    /**
     * Order'u doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.exchangeClientId || this.exchangeClientId.trim() === "") {
            errors.push("Exchange Client ID boş olamaz");
        }
        
        if (this.pairId <= 0) {
            errors.push("Geçerli bir Pair ID gerekli");
        }
        
        if (this.price <= 0) {
            errors.push("Fiyat 0'dan büyük olmalı");
        }
        
        if (this.amount <= 0) {
            errors.push("Miktar 0'dan büyük olmalı");
        }
        
        if (!Order.isValidOrderType(this.orderType)) {
            errors.push("Geçersiz order tipi");
        }
        
        if (!Order.isValidDirection(this.direction)) {
            errors.push("Geçersiz yön");
        }
        
        if (!Order.isValidOrderState(this.state)) {
            errors.push("Geçersiz order durumu");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Order'u kopyalar
     */
    clone() {
        return new Order({
            ...this,
            pair: this.pair ? this.pair.clone() : null,
            executedTrades: new Set(this.executedTrades),
            _hash: null // Hash'i yeniden hesaplanacak
        });
    }

    /**
     * Order'u JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Order(data);
        } catch (error) {
            console.error("Order JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Order'u JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Order JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir order objesi oluşturur (static method)
     */
    static create(exchangeClientId, pairId, direction, orderType, amount, price, exchangeName) {
        return new Order({
            exchangeClientId: exchangeClientId,
            pairId: pairId,
            direction: direction,
            orderType: orderType,
            amount: amount,
            price: price,
            exchangeName: exchangeName
        });
    }

    /**
     * Order tipini kontrol eder (static method)
     */
    static isValidOrderType(orderType) {
        const validTypes = ["Market", "Limit", "StopLoss", "TakeProfit", "StopLossLimit", "TakeProfitLimit"];
        return validTypes.includes(orderType);
    }

    /**
     * Direction'ı kontrol eder (static method)
     */
    static isValidDirection(direction) {
        const validDirections = ["Buy", "Sell"];
        return validDirections.includes(direction);
    }

    /**
     * Order state'ini kontrol eder (static method)
     */
    static isValidOrderState(state) {
        const validStates = ["New", "PartiallyFilled", "Filled", "Cancelled", "PendingCancel", "Rejected", "Expired", "PartiallyFilledCancelled"];
        return validStates.includes(state);
    }

    /**
     * Execution method'u kontrol eder (static method)
     */
    static isValidExecutionMethod(method) {
        const validMethods = ["GoodTillCancelled", "ImmediateOrCancel", "FillOrKill", "GoodTillDate", "DayOrder"];
        return validMethods.includes(method);
    }

    /**
     * Order tipi adını getirir
     */
    getOrderTypeName() {
        switch(this.orderType) {
            case 'Market': return 'Piyasa';
            case 'Limit': return 'Limit';
            case 'StopLoss': return 'Stop Loss';
            case 'TakeProfit': return 'Take Profit';
            case 'StopLossLimit': return 'Stop Loss Limit';
            case 'TakeProfitLimit': return 'Take Profit Limit';
            default: return this.orderType;
        }
    }

    /**
     * Direction adını getirir
     */
    getDirectionName() {
        switch(this.direction) {
            case 'Buy': return 'Alış';
            case 'Sell': return 'Satış';
            default: return this.direction;
        }
    }

    /**
     * Order state adını getirir
     */
    getStateName() {
        switch(this.state) {
            case 'New': return 'Yeni';
            case 'PartiallyFilled': return 'Kısmen Dolu';
            case 'Filled': return 'Dolu';
            case 'Cancelled': return 'İptal Edildi';
            case 'PendingCancel': return 'İptal Bekliyor';
            case 'Rejected': return 'Reddedildi';
            case 'Expired': return 'Süresi Doldu';
            case 'PartiallyFilledCancelled': return 'Kısmen Dolu İptal';
            default: return this.state;
        }
    }

    /**
     * Execution method adını getirir
     */
    getExecutionMethodName() {
        switch(this.executionMethod) {
            case 'GoodTillCancelled': return 'İptal Edilene Kadar Geçerli';
            case 'ImmediateOrCancel': return 'Anında veya İptal';
            case 'FillOrKill': return 'Doldur veya İptal Et';
            case 'GoodTillDate': return 'Tarihe Kadar Geçerli';
            case 'DayOrder': return 'Günlük Emir';
            default: return this.executionMethod;
        }
    }

    /**
     * Order tipi badge rengini getirir
     */
    getOrderTypeBadgeClass() {
        switch(this.orderType) {
            case 'Market': return 'bg-danger';
            case 'Limit': return 'bg-primary';
            case 'StopLoss': return 'bg-warning';
            case 'TakeProfit': return 'bg-success';
            case 'StopLossLimit': return 'bg-warning';
            case 'TakeProfitLimit': return 'bg-success';
            default: return 'bg-secondary';
        }
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
     * Order state badge rengini getirir
     */
    getStateBadgeClass() {
        switch(this.state) {
            case 'New': return 'bg-primary';
            case 'PartiallyFilled': return 'bg-warning';
            case 'Filled': return 'bg-success';
            case 'Cancelled': return 'bg-secondary';
            case 'PendingCancel': return 'bg-info';
            case 'Rejected': return 'bg-danger';
            case 'Expired': return 'bg-dark';
            case 'PartiallyFilledCancelled': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    /**
     * Order ikonunu getirir
     */
    getOrderIcon() {
        switch(this.direction) {
            case 'Buy': return 'fa-arrow-up';
            case 'Sell': return 'fa-arrow-down';
            default: return 'fa-exchange-alt';
        }
    }

    /**
     * Toplam değeri hesaplar
     */
    getTotalValue() {
        return this.price * this.amount;
    }

    /**
     * Yürütülen toplam değeri hesaplar
     */
    getExecutedTotalValue() {
        return this.avgExecutedPrice * this.executedAmount;
    }

    /**
     * Yürütme yüzdesini hesaplar
     */
    getExecutionPercentage() {
        if (this.amount === 0) return 0;
        return (this.executedAmount / this.amount) * 100;
    }

    /**
     * Süreyi hesaplar (mikrosaniye cinsinden)
     */
    getDuration() {
        if (!this.finishedAt || !this.timestamp) return null;
        return this.finishedAt - this.timestamp;
    }

    /**
     * Süreyi okunabilir formatta getirir
     */
    getDurationFormatted() {
        const duration = this.getDuration();
        if (!duration) return '-';
        
        if (duration < 1000) return `${duration.toFixed(2)} μs`;
        if (duration < 1000000) return `${(duration / 1000).toFixed(2)} ms`;
        return `${(duration / 1000000).toFixed(2)} s`;
    }

    /**
     * Örnek order verisi
     */
    static getSampleData() {
        return [
            new Order({
                id: 1,
                exchangeOrderId: "coinbase_55555",
                exchangeClientId: "client_005",
                pairId: 5,
                pair: { id: 5, baseAsset: { name: "BTC" }, quoteAsset: { name: "USDT" } },
                exchangeName: "Coinbase",
                arbitrageId: 4,
                isDemo: false,
                isManual: false,
                isSent: false,
                executionMethod: "ImmediateOrCancel",
                price: 0,
                amount: 0.01,
                executedAmount: 0,
                avgExecutedPrice: 0,
                orderType: "Market",
                direction: "Sell",
                state: "New",
                timestamp: new Date("2024-01-15T11:20:31").getTime(),
                tradingFee: 0.005,
                startingBalanceAsset1Amount: 5,
                startingBalanceAsset2Amount: 14000,
                givenAmount: 0,
                givenCurrency: "BTC",
                takenAmount: 0,
                takenCurrency: "USDT",
                description: "BTC/USDT satış emri",
                dateAdded: new Date("2024-01-15T11:20:31"),
                dateUpdated: new Date("2024-01-15T11:20:31")
            }),
            new Order({
                id: 2,
                exchangeOrderId: "binance_44444",
                exchangeClientId: "client_004",
                pairId: 4,
                pair: { id: 4, baseAsset: { name: "SOL" }, quoteAsset: { name: "USDT" } },
                exchangeName: "Binance",
                arbitrageId: 3,
                isDemo: false,
                isManual: false,
                isSent: true,
                executionMethod: "GoodTillCancelled",
                price: 830.00,
                amount: 50,
                executedAmount: 0,
                avgExecutedPrice: 0,
                orderType: "Limit",
                direction: "Buy",
                state: "Filled",
                timestamp: new Date("2024-01-15T11:15:55").getTime(),
                finishedAt: null,
                tradingFee: 0.001,
                startingBalanceAsset1Amount: 1000,
                startingBalanceAsset2Amount: 45000,
                finishingBalanceAsset1Amount: 999.9,
                finishingBalanceAsset2Amount: 45000,
                givenAmount: 4500.05,
                givenCurrency: "USDT",
                takenAmount: 0.1,
                takenCurrency: "BTC",
                description: "TUPRS alış emri",
                dateAdded: new Date("2024-01-15T11:15:55"),
                dateUpdated: new Date("2024-01-15T11:15:55")
            }),
            new Order({
                id: 3,
                exchangeOrderId: "coinbase_67890",
                exchangeClientId: "client_002",
                pairId: 2,
                pair: { id: 2, baseAsset: { name: "ETH" }, quoteAsset: { name: "USD" } },
                exchangeName: "Coinbase",
                arbitrageId: 2,
                isDemo: true,
                isManual: true,
                isSent: false,
                executionMethod: "ImmediateOrCancel",
                price: 0,
                amount: 300,
                executedAmount: 0,
                avgExecutedPrice: 0,
                orderType: "Market",
                direction: "Sell",
                state: "New",
                timestamp: new Date("2024-01-15T11:10:12").getTime(),
                tradingFee: 0.005,
                startingBalanceAsset1Amount: 5,
                startingBalanceAsset2Amount: 14000,
                givenAmount: 0,
                givenCurrency: "ETH",
                takenAmount: 0,
                takenCurrency: "USD",
                description: "THYAO satış emri",
                dateAdded: new Date("2024-01-15T11:10:12"),
                dateUpdated: new Date("2024-01-15T11:10:12")
            }),
            new Order({
                id: 4,
                exchangeOrderId: "binance_12345",
                exchangeClientId: "client_001",
                pairId: 1,
                pair: { id: 1, baseAsset: { name: "BTC" }, quoteAsset: { name: "USDT" } },
                exchangeName: "Binance",
                arbitrageId: 1,
                isDemo: false,
                isManual: false,
                isSent: true,
                executionMethod: "GoodTillCancelled",
                price: 41.80,
                amount: 500,
                executedAmount: 300,
                avgExecutedPrice: 41.80,
                orderType: "Limit",
                direction: "Buy",
                state: "PartiallyFilled",
                timestamp: new Date("2024-01-15T11:05:00").getTime(),
                finishedAt: null,
                tradingFee: 0.001,
                startingBalanceAsset1Amount: 1000,
                startingBalanceAsset2Amount: 45000,
                finishingBalanceAsset1Amount: 999.9,
                finishingBalanceAsset2Amount: 45000,
                givenAmount: 4500.05,
                givenCurrency: "USDT",
                takenAmount: 0.1,
                takenCurrency: "BTC",
                description: "ASELS alış emri",
                dateAdded: new Date("2024-01-15T11:05:00"),
                dateUpdated: new Date("2024-01-15T11:05:00")
            }),
            new Order({
                id: 5,
                exchangeOrderId: "kraken_11111",
                exchangeClientId: "client_003",
                pairId: 3,
                pair: { id: 3, baseAsset: { name: "ADA" }, quoteAsset: { name: "USDT" } },
                exchangeName: "Kraken",
                arbitrageId: null,
                isDemo: false,
                isManual: false,
                isSent: true,
                executionMethod: "FillOrKill",
                price: 23.40,
                amount: 1000,
                executedAmount: 0,
                avgExecutedPrice: 0,
                orderType: "Limit",
                direction: "Sell",
                state: "New",
                timestamp: new Date("2024-01-15T10:45:47").getTime(),
                tradingFee: 0.002,
                startingBalanceAsset1Amount: 0,
                startingBalanceAsset2Amount: 500,
                finishingBalanceAsset1Amount: 500,
                finishingBalanceAsset2Amount: 275,
                givenAmount: 225,
                givenCurrency: "USDT",
                takenAmount: 500,
                takenCurrency: "ADA",
                description: "KRDMD satış emri",
                dateAdded: new Date("2024-01-15T10:45:47"),
                dateUpdated: new Date("2024-01-15T10:45:47")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Order = Order;
} 