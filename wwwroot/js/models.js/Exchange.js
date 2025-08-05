/**
 * Exchange DTO - HFT operasyonları için minimum gerekli özelliklerle kripto para borsasını temsil eder
 * Yüksek frekanslı ticaret için optimize edilmiş, minimum bellek kullanımı
 */

import { Asset } from './Asset.js';
import { Blockchain } from './Blockchain.js';

export class Exchange {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.name = data.name || "";
        this.isCurrencyConvertor = data.isCurrencyConvertor || false;
        this.context = data.context || "Spot";
        this.exchangeType = data.exchangeType || "CEX";
        this.routerAddress = data.routerAddress || null;
        this.factoryAddress = data.factoryAddress || null;
        this.blockchain = data.blockchain ? new Blockchain(data.blockchain) : null;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this._hash = data._hash || null;
        
        // Aktiflik ve risk faktörü
        this.isActive = data.isActive || true;
        this.riskFactor = data.riskFactor || 50;
        this.accumulateProfitIn = data.accumulateProfitIn ? new Asset(data.accumulateProfitIn) : null;
        
        // Integrator ayarları
        this.restIntegratorNeedsToBeInitialized = data.restIntegratorNeedsToBeInitialized || false;
        this.restIntegratorClassName = data.restIntegratorClassName || "";
        this.socketIntegratorNeedsToBeInitialized = data.socketIntegratorNeedsToBeInitialized || false;
        this.socketIntegratorClassName = data.socketIntegratorClassName || "";
        this.fixIntegratorNeedsToBeInitialized = data.fixIntegratorNeedsToBeInitialized || false;
        this.fixIntegratorClassName = data.fixIntegratorClassName || "";
        
        // Trading fee ayarları
        this.tradingFeesAutomated = data.tradingFeesAutomated || true;
        
        // Integration tipleri
        this.integrationOrderbookSubscription = data.integrationOrderbookSubscription || "REST";
        this.integrationBalanceSubscription = data.integrationBalanceSubscription || "REST";
        this.integrationNewLimitOrderSubmission = data.integrationNewLimitOrderSubmission || "REST";
        this.integrationNewMarketOrderSubmission = data.integrationNewMarketOrderSubmission || "REST";
        this.integrationOrderCancellation = data.integrationOrderCancellation || "REST";
        this.integrationOrderUpdate = data.integrationOrderUpdate || "REST";
        this.integrationOrderInfoQuerying = data.integrationOrderInfoQuerying || "REST";
        this.integrationGoodTillDate = data.integrationGoodTillDate || "REST";
        this.integrationDayOrder = data.integrationDayOrder || "REST";
        this.integrationFillOrKill = data.integrationFillOrKill || "REST";
        this.integrationFillAndKill = data.integrationFillAndKill || "REST";
        this.integrationDepositInfoQuerying = data.integrationDepositInfoQuerying || "REST";
        this.integrationWitdrawalInfoQuerying = data.integrationWitdrawalInfoQuerying || "REST";
        this.integrationCryptoWithdrawalSubmission = data.integrationCryptoWithdrawalSubmission || "REST";
        this.integrationFiatWithdrawalSubmission = data.integrationFiatWithdrawalSubmission || "REST";
        
        // API bilgileri
        this.apiKey = data.apiKey || "";
        this.apiSecret = data.apiSecret || "";
        this.apiPassphrase = data.apiPassphrase || "";
        this.apiUrl = data.apiUrl || "";
        this.wsUrl = data.wsUrl || "";
    }

    /**
     * Exchange'in string temsilini döndürür
     */
    toString() {
        return this.name;
    }

    /**
     * İki exchange'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.name === other.name;
    }

    /**
     * Exchange için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = this.name;
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
     * Exchange'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === "") {
            errors.push("Exchange adı boş olamaz");
        }
        
        if (this.riskFactor < 0 || this.riskFactor > 100) {
            errors.push("Risk faktörü 0-100 arasında olmalıdır");
        }
        
        if (this.exchangeType === "DEX" && !this.blockchain) {
            errors.push("DEX exchange'ler için blockchain gerekli");
        }
        
        if (this.exchangeType === "DEX" && !this.routerAddress) {
            errors.push("DEX exchange'ler için router adresi gerekli");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Exchange'i kopyalar
     */
    clone() {
        return new Exchange({
            ...this,
            blockchain: this.blockchain ? this.blockchain.clone() : null,
            accumulateProfitIn: this.accumulateProfitIn ? this.accumulateProfitIn.clone() : null,
            _hash: null // Hash'i yeniden hesaplanacak
        });
    }

    /**
     * Exchange'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Exchange(data);
        } catch (error) {
            console.error("Exchange JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Exchange'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Exchange JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir exchange objesi oluşturur (static method)
     */
    static create(name, exchangeType = "CEX", isCurrencyConvertor = false) {
        return new Exchange({
            name: name,
            exchangeType: exchangeType,
            isCurrencyConvertor: isCurrencyConvertor
        });
    }

    /**
     * Exchange tipini kontrol eder (static method)
     */
    static isValidExchangeType(exchangeType) {
        const validTypes = ["CEX", "DEX"];
        return validTypes.includes(exchangeType.toUpperCase());
    }

    /**
     * Trade context'i kontrol eder (static method)
     */
    static isValidTradeContext(context) {
        const validContexts = ["Spot", "Futures", "Margin"];
        return validContexts.includes(context);
    }

    /**
     * Integration tipini kontrol eder (static method)
     */
    static isValidIntegrationType(integrationType) {
        const validTypes = ["REST", "Socket", "FIX"];
        return validTypes.includes(integrationType);
    }

    /**
     * Exchange tipi adını getirir
     */
    getExchangeTypeName() {
        switch(this.exchangeType.toUpperCase()) {
            case 'CEX': return 'Merkezi Borsa';
            case 'DEX': return 'Merkezi Olmayan Borsa';
            default: return this.exchangeType;
        }
    }

    /**
     * Trade context adını getirir
     */
    getTradeContextName() {
        switch(this.context) {
            case 'Spot': return 'Spot';
            case 'Futures': return 'Vadeli İşlemler';
            case 'Margin': return 'Marjin';
            default: return this.context;
        }
    }

    /**
     * Exchange tipi badge rengini getirir
     */
    getExchangeTypeBadgeClass() {
        switch(this.exchangeType.toUpperCase()) {
            case 'CEX': return 'bg-primary';
            case 'DEX': return 'bg-success';
            default: return 'bg-secondary';
        }
    }

    /**
     * Trade context badge rengini getirir
     */
    getTradeContextBadgeClass() {
        switch(this.context) {
            case 'Spot': return 'bg-info';
            case 'Futures': return 'bg-warning';
            case 'Margin': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    /**
     * Exchange ikonunu getirir
     */
    getExchangeIcon() {
        switch(this.exchangeType.toUpperCase()) {
            case 'CEX': return 'fa-building';
            case 'DEX': return 'fa-link';
            default: return 'fa-exchange-alt';
        }
    }

    /**
     * Risk seviyesini getirir
     */
    getRiskLevel() {
        if (this.riskFactor <= 25) return { level: 'Düşük', class: 'bg-success' };
        if (this.riskFactor <= 50) return { level: 'Orta', class: 'bg-warning' };
        if (this.riskFactor <= 75) return { level: 'Yüksek', class: 'bg-danger' };
        return { level: 'Çok Yüksek', class: 'bg-dark' };
    }

    /**
     * Aktiflik durumunu getirir
     */
    getActiveStatus() {
        return this.isActive ? 
            { status: 'Aktif', class: 'bg-success' } : 
            { status: 'Pasif', class: 'bg-secondary' };
    }

    /**
     * Örnek exchange verisi
     */
    static getSampleData() {
        return [
            new Exchange({
                id: 1,
                name: "Binance",
                exchangeType: "CEX",
                context: "Spot",
                isCurrencyConvertor: true,
                isActive: true,
                riskFactor: 30,
                accumulateProfitIn: new Asset({ name: "USDT" }),
                apiUrl: "https://api.binance.com",
                wsUrl: "wss://stream.binance.com:9443",
                dateAdded: new Date("2024-01-15")
            }),
            new Exchange({
                id: 2,
                name: "Coinbase",
                exchangeType: "CEX",
                context: "Spot",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 25,
                accumulateProfitIn: new Asset({ name: "USD" }),
                apiUrl: "https://api.coinbase.com",
                wsUrl: "wss://ws-feed.pro.coinbase.com",
                dateAdded: new Date("2024-01-16")
            }),
            new Exchange({
                id: 3,
                name: "Uniswap V3",
                exchangeType: "DEX",
                context: "Spot",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 60,
                blockchain: new Blockchain({ name: "Ethereum", networkId: 1 }),
                routerAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
                factoryAddress: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
                dateAdded: new Date("2024-01-17")
            }),
            new Exchange({
                id: 4,
                name: "PancakeSwap",
                exchangeType: "DEX",
                context: "Spot",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 55,
                blockchain: new Blockchain({ name: "Binance Smart Chain", networkId: 56 }),
                routerAddress: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
                factoryAddress: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
                dateAdded: new Date("2024-01-18")
            }),
            new Exchange({
                id: 5,
                name: "Kraken",
                exchangeType: "CEX",
                context: "Spot",
                isCurrencyConvertor: true,
                isActive: true,
                riskFactor: 35,
                accumulateProfitIn: new Asset({ name: "USD" }),
                apiUrl: "https://api.kraken.com",
                wsUrl: "wss://ws.kraken.com",
                dateAdded: new Date("2024-01-19")
            }),
            new Exchange({
                id: 6,
                name: "Bybit",
                exchangeType: "CEX",
                context: "Futures",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 70,
                accumulateProfitIn: new Asset({ name: "USDT" }),
                apiUrl: "https://api.bybit.com",
                wsUrl: "wss://stream.bybit.com",
                dateAdded: new Date("2024-01-20")
            }),
            new Exchange({
                id: 7,
                name: "SushiSwap",
                exchangeType: "DEX",
                context: "Spot",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 65,
                blockchain: new Blockchain({ name: "Ethereum", networkId: 1 }),
                routerAddress: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
                factoryAddress: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac",
                dateAdded: new Date("2024-01-21")
            }),
            new Exchange({
                id: 8,
                name: "FTX",
                exchangeType: "CEX",
                context: "Futures",
                isCurrencyConvertor: false,
                isActive: false,
                riskFactor: 100,
                accumulateProfitIn: new Asset({ name: "USD" }),
                apiUrl: "https://ftx.com/api",
                wsUrl: "wss://ftx.com/ws/",
                dateAdded: new Date("2024-01-22")
            }),
            new Exchange({
                id: 9,
                name: "dYdX",
                exchangeType: "DEX",
                context: "Futures",
                isCurrencyConvertor: false,
                isActive: true,
                riskFactor: 75,
                blockchain: new Blockchain({ name: "Ethereum", networkId: 1 }),
                dateAdded: new Date("2024-01-23")
            }),
            new Exchange({
                id: 10,
                name: "KuCoin",
                exchangeType: "CEX",
                context: "Spot",
                isCurrencyConvertor: true,
                isActive: true,
                riskFactor: 40,
                accumulateProfitIn: new Asset({ name: "USDT" }),
                apiUrl: "https://api.kucoin.com",
                wsUrl: "wss://ws-api.kucoin.com",
                dateAdded: new Date("2024-01-24")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Exchange = Exchange;
} 