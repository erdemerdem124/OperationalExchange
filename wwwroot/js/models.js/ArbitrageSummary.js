/**
 * Arbitrage DTO Model
 * Represents a completed arbitrage execution in high-frequency trading systems.
 */
export class ArbitrageSummary {
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
        return new ArbitrageSummary(data);
    }

    /**
     * Create sample data for testing
     */
    static getSampleData() {
        return [
            new ArbitrageSummary({
                id: 1,
                friendlyId: "ARB-BITCI-TRY-001",
                dateAdded: new Date("2025-02-05T12:45:15"),
                status: "Completed",
                initialCapital: 6000.00,
                realizedReturn: 300.00,
                realizedReturnRatio: 0.0156,
                totalDurationUs: 8000000,
                marketRiskDurationUs: 3000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BITCI-TRY" },
                orders: [
                    { id: 1, lot: 200, price: 186.00 },
                    { id: 2, lot: 200, price: 184.00 },
                    { id: 3, lot: 200, price: 185.00 }
                ]
            }),
            new ArbitrageSummary({
                id: 2,
                friendlyId: "ARB-PARIBU-USDT-002",
                dateAdded: new Date("2025-02-05T12:10:00"),
                status: "Completed",
                initialCapital: 4000.00,
                realizedReturn: 300.00,
                realizedReturnRatio: 0.0150,
                totalDurationUs: 4000000,
                marketRiskDurationUs: 1500000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "PARIBU-USDT" },
                orders: [
                    { id: 4, lot: 300, price: 27.00 },
                    { id: 5, lot: 350, price: 27.25 },
                    { id: 6, lot: 300, price: 27.50 }
                ]
            }),
            new ArbitrageSummary({
                id: 3,
                friendlyId: "ARB-BITEXEN-TRY-003",
                dateAdded: new Date("2025-02-04T16:25:40"),
                status: "Completed",
                initialCapital: 3000.00,
                realizedReturn: 90.00,
                realizedReturnRatio: 0.0135,
                totalDurationUs: 6400000,
                marketRiskDurationUs: 2000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BITEXEN-TRY" },
                orders: [
                    { id: 7, lot: 500, price: 90.10 },
                    { id: 8, lot: 500, price: 91.00 },
                    { id: 9, lot: 500, price: 91.20 }
                ]
            }),
            new ArbitrageSummary({
                id: 4,
                friendlyId: "ARB-BTCTURK-USDT-004",
                dateAdded: new Date("2025-02-04T15:50:15"),
                status: "Completed",
                initialCapital: 2000.00,
                realizedReturn: 69.00,
                realizedReturnRatio: 0.0145,
                totalDurationUs: 5700000,
                marketRiskDurationUs: 1800000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "BTCTURK-USDT" },
                orders: [
                    { id: 10, lot: 150, price: 39.90 },
                    { id: 11, lot: 200, price: 40.10 },
                    { id: 12, lot: 150, price: 40.40 }
                ]
            }),
            new ArbitrageSummary({
                id: 5,
                friendlyId: "ARB-ICRYPEX-TRY-005",
                dateAdded: new Date("2025-02-03T11:12:55"),
                status: "Completed",
                initialCapital: 5000.00,
                realizedReturn: 50.00,
                realizedReturnRatio: 0.0090,
                totalDurationUs: 3200000,
                marketRiskDurationUs: 1000000,
                isDemo: false,
                isFinalized: true,
                isSuccessful: true,
                tradingPath: { name: "ICRYPEX-TRY" },
                orders: [
                    { id: 13, lot: 100, price: 48.00 },
                    { id: 14, lot: 100, price: 48.60 },
                    { id: 15, lot: 100, price: 48.90 }
                ]
            })
        ];
    }
} 