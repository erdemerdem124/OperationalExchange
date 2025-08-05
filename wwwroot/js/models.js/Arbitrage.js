/**
 * Arbitrage DTO Model
 * Represents a completed arbitrage execution in high-frequency trading systems.
 */
export class Arbitrage {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.friendlyId = data.friendlyId || '';
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.status = data.status || 'Pending';
        this.initialCapital = data.initialCapital || 0;
        this.orders = data.orders || [];
        this.tradingPath = data.tradingPath || null;
        this.realizedReturn = data.realizedReturn || 0;
        this.realizedReturnRatio = data.realizedReturnRatio || 0;
        this.totalDurationUs = data.totalDurationUs || 0;
        this.marketRiskDurationUs = data.marketRiskDurationUs || 0;
        this.isDemo = data.isDemo || false;
        this.isFinalized = data.isFinalized || false;
        this.isSuccessful = data.isSuccessful || null;
        this.notionPageId = data.notionPageId || null;
        this._hash = data._hash || null;
    }

    /**
     * Get ordered orders by ID
     */
    get orderedOrders() {
        return this.orders.sort((a, b) => a.id - b.id);
    }

    /**
     * Get first order
     */
    get firstOrder() {
        return this.orderedOrders.length > 0 ? this.orderedOrders[0] : null;
    }

    /**
     * Get last order
     */
    get lastOrder() {
        return this.orderedOrders.length > 0 ? this.orderedOrders[this.orderedOrders.length - 1] : null;
    }

    /**
     * Compute hash based on FriendlyId
     */
    getHash() {
        if (this._hash === null) {
            this._hash = this.friendlyId ? this.computeHash(this.friendlyId) : 0;
        }
        return this._hash;
    }

    /**
     * Simple hash computation function
     */
    computeHash(str) {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    /**
     * Get status text for display
     */
    getStatusText() {
        switch (this.status) {
            case 'Pending': return 'Beklemede';
            case 'Executing': return 'İşleniyor';
            case 'Completed': return 'Tamamlandı';
            case 'Failed': return 'Başarısız';
            case 'Cancelled': return 'İptal Edildi';
            default: return this.status || 'Bilinmeyen';
        }
    }

    /**
     * Get status badge class for UI
     */
    getStatusBadgeClass() {
        switch (this.status) {
            case 'Completed': return 'bg-success';
            case 'Failed': return 'bg-danger';
            case 'Executing': return 'bg-warning';
            case 'Cancelled': return 'bg-secondary';
            default: return 'bg-info';
        }
    }

    /**
     * Get success status text
     */
    getSuccessText() {
        if (this.isSuccessful === null) return 'Beklemede';
        return this.isSuccessful ? 'Başarılı' : 'Başarısız';
    }

    /**
     * Get success badge class
     */
    getSuccessBadgeClass() {
        if (this.isSuccessful === null) return 'bg-warning';
        return this.isSuccessful ? 'bg-success' : 'bg-danger';
    }

    /**
     * Get demo status text
     */
    getDemoText() {
        return this.isDemo ? 'Demo' : 'Gerçek';
    }

    /**
     * Get demo badge class
     */
    getDemoBadgeClass() {
        return this.isDemo ? 'bg-info' : 'bg-secondary';
    }

    /**
     * Format realized return for display
     */
    getFormattedRealizedReturn() {
        return `${this.realizedReturn >= 0 ? '+' : ''}${this.realizedReturn.toFixed(8)}`;
    }

    /**
     * Format realized return ratio for display
     */
    getFormattedRealizedReturnRatio() {
        return `${this.realizedReturnRatio >= 0 ? '+' : ''}${(this.realizedReturnRatio * 100).toFixed(2)}%`;
    }

    /**
     * Get realized return text color class
     */
    getRealizedReturnTextClass() {
        return this.realizedReturn >= 0 ? 'text-success' : 'text-danger';
    }

    /**
     * Get realized return ratio text color class
     */
    getRealizedReturnRatioTextClass() {
        return this.realizedReturnRatio >= 0 ? 'text-success' : 'text-danger';
    }

    /**
     * Format date for display
     */
    getFormattedDate() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Get duration in milliseconds
     */
    getDurationMs() {
        return this.totalDurationUs / 1000;
    }

    /**
     * Get market risk duration in milliseconds
     */
    getMarketRiskDurationMs() {
        return this.marketRiskDurationUs / 1000;
    }

    /**
     * Format duration for display
     */
    getFormattedDuration() {
        const ms = this.getDurationMs();
        if (ms < 1000) return `${ms.toFixed(2)} ms`;
        if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
        return `${(ms / 60000).toFixed(2)} min`;
    }

    /**
     * Check if arbitrage is profitable
     */
    isProfitable() {
        return this.realizedReturn > 0;
    }

    /**
     * Check if arbitrage is finalized
     */
    isCompleted() {
        return this.isFinalized;
    }

    /**
     * Get trading path name
     */
    getTradingPathName() {
        return this.tradingPath?.name || 'Bilinmeyen';
    }

    /**
     * Get orders count
     */
    getOrdersCount() {
        return this.orders.length;
    }

    /**
     * Create from API data
     */
    static fromApi(data) {
        return new Arbitrage(data);
    }

    /**
     * Create sample data for testing
     */
    static getSampleData() {
        return [
            new Arbitrage({
                id: 1,
                friendlyId: "ARB-BTC-ETH-USDT-20250205-001",
                dateAdded: new Date("2025-02-05T12:45:15"),
                status: "Completed",
                initialCapital: 37200.00,
                realizedReturn: -2.00,
                realizedReturnRatio: -0.0108,
                totalDurationUs: 8000000,
                marketRiskDurationUs: 3000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: false,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 1, lot: 200, price: 186.00 },
                    { id: 2, lot: 200, price: 184.00 },
                    { id: 3, lot: 200, price: 185.00 }
                ]
            }),
            new Arbitrage({
                id: 2,
                friendlyId: "ARB-ETH-BTC-USDT-20250205-002",
                dateAdded: new Date("2025-02-05T12:10:00"),
                status: "Completed",
                initialCapital: 25875.00,
                realizedReturn: 0.50,
                realizedReturnRatio: 0.0185,
                totalDurationUs: 4000000,
                marketRiskDurationUs: 1500000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ETH-BTC-USDT" },
                orders: [
                    { id: 4, lot: 300, price: 27.00 },
                    { id: 5, lot: 350, price: 27.25 },
                    { id: 6, lot: 300, price: 27.50 }
                ]
            }),
            new Arbitrage({
                id: 3,
                friendlyId: "ARB-ADA-BTC-USDT-20250204-003",
                dateAdded: new Date("2025-02-04T16:25:40"),
                status: "Completed",
                initialCapital: 45550.00,
                realizedReturn: 1.10,
                realizedReturnRatio: 0.0122,
                totalDurationUs: 6400000,
                marketRiskDurationUs: 2000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ADA-BTC-USDT" },
                orders: [
                    { id: 7, lot: 500, price: 90.10 },
                    { id: 8, lot: 500, price: 91.00 },
                    { id: 9, lot: 500, price: 91.20 }
                ]
            }),
            new Arbitrage({
                id: 4,
                friendlyId: "ARB-DOGE-SOL-USDT-20250204-004",
                dateAdded: new Date("2025-02-04T15:50:15"),
                status: "Completed",
                initialCapital: 20000.00,
                realizedReturn: 0.80,
                realizedReturnRatio: 0.0125,
                totalDurationUs: 5700000,
                marketRiskDurationUs: 1800000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "DOGE-SOL-USDT" },
                orders: [
                    { id: 10, lot: 150, price: 39.90 },
                    { id: 11, lot: 200, price: 40.10 },
                    { id: 12, lot: 150, price: 40.40 }
                ]
            }),
            new Arbitrage({
                id: 5,
                friendlyId: "ARB-MATIC-AVAX-USDT-20250203-005",
                dateAdded: new Date("2025-02-03T11:12:55"),
                status: "Completed",
                initialCapital: 14550.00,
                realizedReturn: 0.90,
                realizedReturnRatio: 0.0187,
                totalDurationUs: 3200000,
                marketRiskDurationUs: 1000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "MATIC-AVAX-USDT" },
                orders: [
                    { id: 13, lot: 100, price: 48.00 },
                    { id: 14, lot: 100, price: 48.60 },
                    { id: 15, lot: 100, price: 48.90 }
                ]
            }),
            new Arbitrage({
                id: 6,
                friendlyId: "ARB-BTC-ETH-USDT-20250203-006",
                dateAdded: new Date("2025-02-03T10:03:40"),
                status: "Completed",
                initialCapital: 12250.00,
                realizedReturn: 0.75,
                realizedReturnRatio: 0.0123,
                totalDurationUs: 4500000,
                marketRiskDurationUs: 1400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 16, lot: 250, price: 16.20 },
                    { id: 17, lot: 250, price: 16.30 },
                    { id: 18, lot: 250, price: 16.40 }
                ]
            }),
            new Arbitrage({
                id: 7,
                friendlyId: "ARB-MATIC-AVAX-USDT-20250202-007",
                dateAdded: new Date("2025-02-02T13:15:20"),
                status: "Completed",
                initialCapital: 14960.00,
                realizedReturn: 1.32,
                realizedReturnRatio: 0.0266,
                totalDurationUs: 6000000,
                marketRiskDurationUs: 2000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "MATIC-AVAX-USDT" },
                orders: [
                    { id: 19, lot: 220, price: 22.50 },
                    { id: 20, lot: 220, price: 22.90 },
                    { id: 21, lot: 220, price: 23.10 }
                ]
            }),
            new Arbitrage({
                id: 8,
                friendlyId: "ARB-ADA-BTC-USDT-20250202-008",
                dateAdded: new Date("2025-02-02T11:05:40"),
                status: "Completed",
                initialCapital: 18900.00,
                realizedReturn: 0.70,
                realizedReturnRatio: 0.0187,
                totalDurationUs: 5300000,
                marketRiskDurationUs: 1700000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ADA-BTC-USDT" },
                orders: [
                    { id: 22, lot: 180, price: 37.40 },
                    { id: 23, lot: 200, price: 37.90 },
                    { id: 24, lot: 180, price: 38.10 }
                ]
            }),
            new Arbitrage({
                id: 9,
                friendlyId: "ARB-ETH-BTC-USDT-20250201-009",
                dateAdded: new Date("2025-02-01T14:10:10"),
                status: "Completed",
                initialCapital: 82350.00,
                realizedReturn: 1.00,
                realizedReturnRatio: 0.0110,
                totalDurationUs: 5000000,
                marketRiskDurationUs: 1600000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ETH-BTC-USDT" },
                orders: [
                    { id: 25, lot: 300, price: 91.00 },
                    { id: 26, lot: 300, price: 91.50 },
                    { id: 27, lot: 300, price: 92.00 }
                ]
            }),
            new Arbitrage({
                id: 10,
                friendlyId: "ARB-DOGE-SOL-USDT-20250201-010",
                dateAdded: new Date("2025-02-01T10:00:05"),
                status: "Completed",
                initialCapital: 15840.00,
                realizedReturn: 0.85,
                realizedReturnRatio: 0.0215,
                totalDurationUs: 7500000,
                marketRiskDurationUs: 2400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "DOGE-SOL-USDT" },
                orders: [
                    { id: 28, lot: 400, price: 18.60 },
                    { id: 29, lot: 420, price: 19.10 },
                    { id: 30, lot: 400, price: 19.40 }
                ]
            }),
            new Arbitrage({
                id: 11,
                friendlyId: "ARB-BTC-ETH-USDT-20250131-011",
                dateAdded: new Date("2025-01-31T16:00:00"),
                status: "Completed",
                initialCapital: 63500.00,
                realizedReturn: 0.50,
                realizedReturnRatio: 0.0079,
                totalDurationUs: 3800000,
                marketRiskDurationUs: 1200000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 31, lot: 500, price: 63.00 },
                    { id: 32, lot: 500, price: 63.30 },
                    { id: 33, lot: 500, price: 63.50 }
                ]
            }),
            new Arbitrage({
                id: 12,
                friendlyId: "ARB-ADA-BTC-USDT-20250131-012",
                dateAdded: new Date("2025-01-31T09:15:10"),
                status: "Completed",
                initialCapital: 22950.00,
                realizedReturn: 0.70,
                realizedReturnRatio: 0.0119,
                totalDurationUs: 4000000,
                marketRiskDurationUs: 1300000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ADA-BTC-USDT" },
                orders: [
                    { id: 34, lot: 180, price: 42.00 },
                    { id: 35, lot: 180, price: 42.30 },
                    { id: 36, lot: 180, price: 42.50 }
                ]
            }),
            new Arbitrage({
                id: 13,
                friendlyId: "ARB-MATIC-AVAX-USDT-20250130-013",
                dateAdded: new Date("2025-01-30T14:00:30"),
                status: "Completed",
                initialCapital: 53200.00,
                realizedReturn: 0.70,
                realizedReturnRatio: 0.0093,
                totalDurationUs: 4900000,
                marketRiskDurationUs: 1500000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "MATIC-AVAX-USDT" },
                orders: [
                    { id: 37, lot: 350, price: 75.40 },
                    { id: 38, lot: 350, price: 75.80 },
                    { id: 39, lot: 350, price: 76.10 }
                ]
            }),
            new Arbitrage({
                id: 14,
                friendlyId: "ARB-ETH-BTC-USDT-20250130-014",
                dateAdded: new Date("2025-01-30T09:30:00"),
                status: "Completed",
                initialCapital: 30000.00,
                realizedReturn: 0.60,
                realizedReturnRatio: 0.0113,
                totalDurationUs: 3200000,
                marketRiskDurationUs: 1000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ETH-BTC-USDT" },
                orders: [
                    { id: 40, lot: 280, price: 53.00 },
                    { id: 41, lot: 300, price: 53.40 },
                    { id: 42, lot: 280, price: 53.60 }
                ]
            }),
            new Arbitrage({
                id: 15,
                friendlyId: "ARB-DOGE-SOL-USDT-20250129-015",
                dateAdded: new Date("2025-01-29T15:45:15"),
                status: "Completed",
                initialCapital: 17800.00,
                realizedReturn: 0.80,
                realizedReturnRatio: 0.0181,
                totalDurationUs: 4400000,
                marketRiskDurationUs: 1400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "DOGE-SOL-USDT" },
                orders: [
                    { id: 43, lot: 200, price: 44.10 },
                    { id: 44, lot: 200, price: 44.50 },
                    { id: 45, lot: 200, price: 44.90 }
                ]
            }),
            new Arbitrage({
                id: 16,
                friendlyId: "ARB-BTC-ETH-USDT-20250129-016",
                dateAdded: new Date("2025-01-29T12:10:55"),
                status: "Completed",
                initialCapital: 30450.00,
                realizedReturn: 1.10,
                realizedReturnRatio: 0.0150,
                totalDurationUs: 6600000,
                marketRiskDurationUs: 2100000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 46, lot: 500, price: 60.00 },
                    { id: 47, lot: 500, price: 60.40 },
                    { id: 48, lot: 500, price: 60.90 }
                ]
            }),
            new Arbitrage({
                id: 17,
                friendlyId: "ARB-MATIC-AVAX-USDT-20250128-017",
                dateAdded: new Date("2025-01-28T15:20:00"),
                status: "Completed",
                initialCapital: 18400.00,
                realizedReturn: 0.90,
                realizedReturnRatio: 0.0194,
                totalDurationUs: 5000000,
                marketRiskDurationUs: 1600000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "MATIC-AVAX-USDT" },
                orders: [
                    { id: 49, lot: 250, price: 36.10 },
                    { id: 50, lot: 250, price: 36.50 },
                    { id: 51, lot: 250, price: 36.80 }
                ]
            }),
            new Arbitrage({
                id: 18,
                friendlyId: "ARB-DOGE-SOL-USDT-20250128-018",
                dateAdded: new Date("2025-01-28T10:30:45"),
                status: "Completed",
                initialCapital: 14940.00,
                realizedReturn: 0.80,
                realizedReturnRatio: 0.0163,
                totalDurationUs: 4600000,
                marketRiskDurationUs: 1500000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "DOGE-SOL-USDT" },
                orders: [
                    { id: 52, lot: 300, price: 49.00 },
                    { id: 53, lot: 300, price: 49.50 },
                    { id: 54, lot: 300, price: 49.80 }
                ]
            }),
            new Arbitrage({
                id: 19,
                friendlyId: "ARB-ETH-BTC-USDT-20250127-019",
                dateAdded: new Date("2025-01-27T14:45:10"),
                status: "Completed",
                initialCapital: 10150.00,
                realizedReturn: 0.90,
                realizedReturnRatio: 0.0212,
                totalDurationUs: 5300000,
                marketRiskDurationUs: 1700000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ETH-BTC-USDT" },
                orders: [
                    { id: 55, lot: 350, price: 28.30 },
                    { id: 56, lot: 350, price: 28.60 },
                    { id: 57, lot: 350, price: 28.90 }
                ]
            }),
            new Arbitrage({
                id: 20,
                friendlyId: "ARB-ADA-BTC-USDT-20250127-020",
                dateAdded: new Date("2025-01-27T11:10:25"),
                status: "Completed",
                initialCapital: 33000.00,
                realizedReturn: 0.70,
                realizedReturnRatio: 0.0085,
                totalDurationUs: 4400000,
                marketRiskDurationUs: 1400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ADA-BTC-USDT" },
                orders: [
                    { id: 58, lot: 400, price: 82.20 },
                    { id: 59, lot: 400, price: 82.50 },
                    { id: 60, lot: 400, price: 82.90 }
                ]
            }),
            new Arbitrage({
                id: 21,
                friendlyId: "ARB-BTC-ETH-USDT-20250126-021",
                dateAdded: new Date("2025-01-26T13:35:15"),
                status: "Completed",
                initialCapital: 19500.00,
                realizedReturn: 1.20,
                realizedReturnRatio: 0.0211,
                totalDurationUs: 6100000,
                marketRiskDurationUs: 1900000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 61, lot: 500, price: 19.00 },
                    { id: 62, lot: 500, price: 19.40 },
                    { id: 63, lot: 500, price: 19.60 }
                ]
            }),
            new Arbitrage({
                id: 22,
                friendlyId: "ARB-MATIC-AVAX-USDT-20250126-022",
                dateAdded: new Date("2025-01-26T09:20:00"),
                status: "Completed",
                initialCapital: 14200.00,
                realizedReturn: 0.60,
                realizedReturnRatio: 0.0093,
                totalDurationUs: 3900000,
                marketRiskDurationUs: 1200000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "MATIC-AVAX-USDT" },
                orders: [
                    { id: 64, lot: 200, price: 64.00 },
                    { id: 65, lot: 220, price: 64.40 },
                    { id: 66, lot: 200, price: 64.60 }
                ]
            }),
            new Arbitrage({
                id: 23,
                friendlyId: "ARB-DOGE-SOL-USDT-20250125-023",
                dateAdded: new Date("2025-01-25T16:55:10"),
                status: "Completed",
                initialCapital: 14040.00,
                realizedReturn: 0.80,
                realizedReturnRatio: 0.0155,
                totalDurationUs: 4700000,
                marketRiskDurationUs: 1500000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "DOGE-SOL-USDT" },
                orders: [
                    { id: 67, lot: 180, price: 38.80 },
                    { id: 68, lot: 180, price: 39.10 },
                    { id: 69, lot: 180, price: 39.40 }
                ]
            }),
            new Arbitrage({
                id: 24,
                friendlyId: "ARB-ETH-BTC-USDT-20250125-024",
                dateAdded: new Date("2025-01-25T11:25:00"),
                status: "Completed",
                initialCapital: 15002.00,
                realizedReturn: 0.70,
                realizedReturnRatio: 0.0121,
                totalDurationUs: 4300000,
                marketRiskDurationUs: 1400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ETH-BTC-USDT" },
                orders: [
                    { id: 70, lot: 260, price: 57.70 },
                    { id: 71, lot: 260, price: 58.10 },
                    { id: 72, lot: 260, price: 58.40 }
                ]
            }),
            new Arbitrage({
                id: 25,
                friendlyId: "ARB-ADA-BTC-USDT-20250124-025",
                dateAdded: new Date("2025-01-24T13:00:30"),
                status: "Completed",
                initialCapital: 17600.00,
                realizedReturn: 1.00,
                realizedReturnRatio: 0.0275,
                totalDurationUs: 5900000,
                marketRiskDurationUs: 1900000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ADA-BTC-USDT" },
                orders: [
                    { id: 73, lot: 300, price: 29.00 },
                    { id: 74, lot: 320, price: 29.40 },
                    { id: 75, lot: 300, price: 29.80 }
                ]
            }),
            new Arbitrage({
                id: 26,
                friendlyId: "ARB-BTC-ETH-USDT-20250124-026",
                dateAdded: new Date("2025-01-24T10:05:45"),
                status: "Completed",
                initialCapital: 67600.00,
                realizedReturn: 0.80,
                realizedReturnRatio: 0.0095,
                totalDurationUs: 4500000,
                marketRiskDurationUs: 1400000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTC-ETH-USDT" },
                orders: [
                    { id: 76, lot: 400, price: 84.20 },
                    { id: 77, lot: 400, price: 84.60 },
                    { id: 78, lot: 400, price: 85.00 }
                ]
            })
        ];
    }
} 