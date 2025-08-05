// ArbitrageOpportunity DTO - JavaScript sınıfı
// USDT ve TRY fırsatları için tek model

export class ArbitrageOpportunity {
    constructor(data = {}) {
        // Basic properties
        this.id = data.id || 0;
        this.exchange = data.exchange || '';
        this.direction = data.direction || 'USDT Trio';
        this.type = data.type || 'USDT'; // 'USDT' veya 'TRY'
        
        // Lot and Price data
        this.lot1 = data.lot1 || 0;
        this.price1 = data.price1 || 0;
        this.lot2 = data.lot2 || 0;
        this.price2 = data.price2 || 0;
        this.lot3 = data.lot3 || 0;
        this.price3 = data.price3 || 0;
        
        // Profit margins
        this.grossProfitMargin = data.grossProfitMargin || 0;
        this.netProfitMargin = data.netProfitMargin || 0;
        
        // Legacy properties (for compatibility)
        this.tradingPath = data.tradingPath || { name: this.exchange };
        this.timestampUs = data.timestampUs || Date.now() * 1000;
        this.latency = data.latency || 0;
        this.marketDirection = data.marketDirection || 0;
        this.laggingStep = data.laggingStep || 'Buy';
        this.usdVolume = data.usdVolume || 0;
        this.expectedReturnRatio = data.expectedReturnRatio || 0;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this.lifeSpan = data.lifeSpan || 5000;
        this.startingVolume = data.startingVolume || 0;
        this.coinVolume = data.coinVolume || 0;
        this.returnCalculation = data.returnCalculation || 'Standard';
        this.arbitrageCalculation = data.arbitrageCalculation || null;
        this.priceLevels = data.priceLevels || [];
        this.limitProfitablePrices = data.limitProfitablePrices || [];
        this._hash = data._hash || null;
    }

    // Getters for derived values
    get timestamp() {
        return new Date(this.timestampUs / 1000);
    }
    
    // Yön belirleme
    getDirection() {
        return this.type === 'TRY' ? 'TRY Trio' : 'USDT Trio';
    }
    
    // Exchange class belirleme
    getExchangeClass() {
        const exchangeMap = {
            'Paribu': 'y-black',
            'BtcTürk': 'y-red', 
            'Icrypex': 'y-purple',
            'Bitci': 'y-brown',
            'Bitexen': 'y-yellow'
        };
        return exchangeMap[this.exchange] || 'y-black';
    }
    
    // Formatlanmış değerler
    getFormattedPrice(price) {
        return price.toLocaleString('tr-TR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }
    
    getFormattedMargin(margin) {
        return `%${margin.toFixed(2).replace('.', ',')}`;
    }

    get latencyMs() {
        return this.latency;
    }

    get latencyFormatted() {
        if (this.latency < 1000) {
            return `${this.latency} ms`;
        } else {
            return `${(this.latency / 1000).toFixed(2)} s`;
        }
    }

    get marketDirectionText() {
        if (this.marketDirection > 0.1) return 'Yükseliş';
        if (this.marketDirection < -0.1) return 'Düşüş';
        return 'Yatay';
    }

    get marketDirectionClass() {
        if (this.marketDirection > 0.1) return 'text-success';
        if (this.marketDirection < -0.1) return 'text-danger';
        return 'text-warning';
    }

    get laggingStepText() {
        return this.laggingStep === 'Buy' ? 'Alış' : 'Satış';
    }

    get laggingStepClass() {
        return this.laggingStep === 'Buy' ? 'text-success' : 'text-danger';
    }

    get expectedReturnPercent() {
        return (this.expectedReturnRatio * 100).toFixed(4);
    }

    get expectedReturnClass() {
        return this.expectedReturnRatio > 0 ? 'text-success' : 'text-danger';
    }

    get usdVolumeFormatted() {
        return this.usdVolume.toFixed(6);
    }

    get dateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    get isExpired() {
        const now = Date.now();
        const opportunityTime = this.timestampUs / 1000;
        return (now - opportunityTime) > this.lifeSpan;
    }

    get status() {
        if (this.isExpired) return 'Expired';
        return 'Active';
    }

    get statusText() {
        return this.isExpired ? 'Süresi Doldu' : 'Aktif';
    }

    get statusClass() {
        return this.isExpired ? 'text-danger' : 'text-success';
    }

    get statusBadgeClass() {
        return this.isExpired ? 'bg-danger' : 'bg-success';
    }

    // Helper methods for UI
    getFormattedDate() {
        return this.dateAdded.toLocaleDateString('tr-TR') + ' ' + 
               this.dateAdded.toLocaleTimeString('tr-TR');
    }

    getFormattedTimestamp() {
        return this.timestamp.toLocaleDateString('tr-TR') + ' ' + 
               this.timestamp.toLocaleTimeString('tr-TR');
    }

    getFormattedExpectedReturn() {
        const sign = this.expectedReturnRatio >= 0 ? '+' : '';
        return `${sign}${this.expectedReturnPercent}%`;
    }

    getFormattedUsdVolume() {
        return `${this.usdVolumeFormatted} USD`;
    }

    getFormattedMarketDirection() {
        const sign = this.marketDirection >= 0 ? '+' : '';
        return `${sign}${(this.marketDirection * 100).toFixed(2)}%`;
    }

    getExchangeData() {
        const exchanges = [
            { name: 'Paribu', class: 'y-black' },
            { name: 'BtcTürk', class: 'y-red' },
            { name: 'Icrypex', class: 'y-purple' },
            { name: 'Bitci', class: 'y-brown' },
            { name: 'Bitexen', class: 'y-yellow' }
        ];
        return exchanges[(this.id - 1) % exchanges.length];
    }

    getTradingPathName() {
        return this.getExchangeData().name || 'Bilinmeyen Path';
    }

    getTradingPathClass() {
        return this.getExchangeData().class || 'y-black';
    }

    getPriceLevelsCount() {
        return this.priceLevels.length;
    }

    getLimitPricesCount() {
        return this.limitProfitablePrices.length;
    }

    // Static methods
    static fromApi(data) {
        return new ArbitrageOpportunity(data);
    }

    static getSampleData(type = 'USDT') {
        if (type === 'USDT') {
        return [
            new ArbitrageOpportunity({
                id: 1,
                    exchange: 'Paribu',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 500,
                    price1: 153.70,
                    lot2: 500,
                    price2: 154.20,
                    lot3: 500,
                    price3: 154.80,
                    grossProfitMargin: 1.56,
                    netProfitMargin: 1.23
                }),
            new ArbitrageOpportunity({
                id: 2,
                    exchange: 'BtcTürk',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 300,
                    price1: 154.20,
                    lot2: 300,
                    price2: 154.80,
                    lot3: 300,
                    price3: 155.40,
                    grossProfitMargin: 2.34,
                    netProfitMargin: 1.89
            }),
            new ArbitrageOpportunity({
                id: 3,
                    exchange: 'Icrypex',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 400,
                    price1: 152.50,
                    lot2: 400,
                    price2: 153.10,
                    lot3: 400,
                    price3: 153.70,
                    grossProfitMargin: 1.78,
                    netProfitMargin: 1.45
            }),
            new ArbitrageOpportunity({
                id: 4,
                    exchange: 'Bitci',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 250,
                    price1: 155.80,
                    lot2: 250,
                    price2: 156.40,
                    lot3: 250,
                    price3: 157.00,
                    grossProfitMargin: 2.89,
                    netProfitMargin: 2.34
            }),
            new ArbitrageOpportunity({
                id: 5,
                    exchange: 'Bitexen',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 350,
                    price1: 151.20,
                    lot2: 350,
                    price2: 151.80,
                    lot3: 350,
                    price3: 152.40,
                    grossProfitMargin: 1.92,
                    netProfitMargin: 1.56
            }),
            new ArbitrageOpportunity({
                id: 6,
                    exchange: 'Paribu',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 600,
                    price1: 156.30,
                    lot2: 600,
                    price2: 156.90,
                    lot3: 600,
                    price3: 157.50,
                    grossProfitMargin: 3.12,
                    netProfitMargin: 2.67
            }),
            new ArbitrageOpportunity({
                id: 7,
                    exchange: 'BtcTürk',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 450,
                    price1: 157.40,
                    lot2: 450,
                    price2: 158.00,
                    lot3: 450,
                    price3: 158.60,
                    grossProfitMargin: 2.45,
                    netProfitMargin: 2.01
            }),
            new ArbitrageOpportunity({
                id: 8,
                    exchange: 'Icrypex',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 320,
                    price1: 158.90,
                    lot2: 320,
                    price2: 159.50,
                    lot3: 320,
                    price3: 160.10,
                    grossProfitMargin: 2.78,
                    netProfitMargin: 2.23
                }),
                new ArbitrageOpportunity({
                    id: 9,
                    exchange: 'Bitci',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 280,
                    price1: 160.20,
                    lot2: 280,
                    price2: 160.80,
                    lot3: 280,
                    price3: 161.40,
                    grossProfitMargin: 2.67,
                    netProfitMargin: 2.12
                }),
                new ArbitrageOpportunity({
                    id: 10,
                    exchange: 'Bitexen',
                    direction: 'USDT Trio',
                    type: 'USDT',
                    lot1: 380,
                    price1: 161.70,
                    lot2: 380,
                    price2: 162.30,
                    lot3: 380,
                    price3: 162.90,
                    grossProfitMargin: 2.34,
                    netProfitMargin: 1.89
                })
            ];
        } else {
            return [
                new ArbitrageOpportunity({
                    id: 1,
                    exchange: 'Paribu',
                    direction: 'TRY Trio',
                    type: 'TRY',
                    lot1: 400,
                    price1: 82.50,
                    lot2: 400,
                    price2: 83.10,
                    lot3: 400,
                    price3: 83.70,
                    grossProfitMargin: 1.45,
                    netProfitMargin: 1.12
                }),
                new ArbitrageOpportunity({
                    id: 2,
                    exchange: 'BtcTürk',
                    direction: 'TRY Trio',
                    type: 'TRY',
                    lot1: 300,
                    price1: 83.20,
                    lot2: 300,
                    price2: 83.80,
                    lot3: 300,
                    price3: 84.40,
                    grossProfitMargin: 2.12,
                    netProfitMargin: 1.67
                }),
                new ArbitrageOpportunity({
                    id: 3,
                    exchange: 'Icrypex',
                    direction: 'TRY Trio',
                    type: 'TRY',
                    lot1: 350,
                    price1: 81.80,
                    lot2: 350,
                    price2: 82.40,
                    lot3: 350,
                    price3: 83.00,
                    grossProfitMargin: 1.89,
                    netProfitMargin: 1.56
                }),
                new ArbitrageOpportunity({
                    id: 4,
                    exchange: 'Bitci',
                    direction: 'TRY Trio',
                    type: 'TRY',
                    lot1: 250,
                    price1: 84.10,
                    lot2: 250,
                    price2: 84.70,
                    lot3: 250,
                    price3: 85.30,
                    grossProfitMargin: 2.56,
                    netProfitMargin: 2.01
                }),
                new ArbitrageOpportunity({
                    id: 5,
                    exchange: 'Bitexen',
                    direction: 'TRY Trio',
                    type: 'TRY',
                    lot1: 320,
                    price1: 80.90,
                    lot2: 320,
                    price2: 81.50,
                    lot3: 320,
                    price3: 82.10,
                    grossProfitMargin: 2.23,
                    netProfitMargin: 1.78
                })
            ];
        }
    }

    // Hash computation
    getHash() {
        if (this._hash === null) {
            this._hash = this.toString().split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0);
        }
        return this._hash;
    }

    toString() {
        return `Return ${this.getFormattedExpectedReturn()}, Latency ${this.latencyFormatted}`;
    }
}

// Global erişim için
window.ArbitrageOpportunity = ArbitrageOpportunity; 