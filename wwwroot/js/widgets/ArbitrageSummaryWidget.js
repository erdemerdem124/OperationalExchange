/**
 * ArbitrageSummary Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { ArbitrageSummary } from '../models.js/ArbitrageSummary.js';

export class ArbitrageSummaryWidget {
    constructor(containerId = 'arbitrage-summary-widget-container', dateType = 'today') {
        this.containerId = containerId;
        this.dateType = dateType; // 'today', 'yesterday', 'day2', 'day3', 'day4'
        this.container = document.getElementById(containerId);
        this.arbitrages = [];
        this.summaryData = [];
        
        if (this.container) {
        this.init();
        } else {
            console.warn(`Container with id '${containerId}' not found`);
        }
    }

    init() {
        try {
            console.log('ArbitrageSummary Widget init başlıyor...');
            
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
                this.container = document.createElement('div');
                this.container.id = this.containerId;
                document.body.appendChild(this.container);
        }

            console.log('Sample data yükleniyor...');
        this.loadSampleData();
            
            console.log('Özet veriler hesaplanıyor...');
            this.calculateSummaryData();
            
            console.log('Render yapılıyor...');
        this.render();
            
            console.log('Widget başarıyla başlatıldı!');
        } catch (error) {
            console.error('Widget init hatası:', error);
        }
    }

    loadSampleData() {
        const today = new Date();
        let targetDate;
        
        switch (this.dateType) {
            case 'yesterday':
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 1);
                break;
            case 'day2':
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 2);
                break;
            case 'day3':
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 3);
                break;
            case 'day4':
                targetDate = new Date(today);
                targetDate.setDate(today.getDate() - 4);
                break;
            default: // 'today'
                targetDate = today;
                break;
        }
        
        // Tarih formatını ayarla
        const dateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD formatı
        
        if (this.dateType === 'yesterday') {
            // DÜN için veriler (ikinci resim)
            this.arbitrages = [
                new ArbitrageSummary({
                    id: 1, friendlyId: `ARB-BITCI-TRY-${dateStr}-001`, dateAdded: new Date(`${dateStr}T12:45:15`),
                    status: "Completed", initialCapital: 12000.00, realizedReturn: 180.00, realizedReturnRatio: 0.0150,
                    totalDurationUs: 8000000, marketRiskDurationUs: 3000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITCI-TRY" },
                    orders: [{ id: 1, lot: 200, price: 186.00 }, { id: 2, lot: 200, price: 184.00 }, { id: 3, lot: 200, price: 185.00 }]
                }),
                new ArbitrageSummary({
                    id: 2, friendlyId: `ARB-BTCTURK-USDT-${dateStr}-002`, dateAdded: new Date(`${dateStr}T12:10:00`),
                    status: "Completed", initialCapital: 5500.00, realizedReturn: 120.00, realizedReturnRatio: 0.0218,
                    totalDurationUs: 4000000, marketRiskDurationUs: 1500000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BTCTURK-USDT" },
                    orders: [{ id: 4, lot: 300, price: 27.00 }, { id: 5, lot: 350, price: 27.25 }, { id: 6, lot: 300, price: 27.50 }]
                }),
                new ArbitrageSummary({
                    id: 3, friendlyId: `ARB-PARIBU-TRY-${dateStr}-003`, dateAdded: new Date(`${dateStr}T16:25:40`),
                    status: "Completed", initialCapital: 20000.00, realizedReturn: 250.00, realizedReturnRatio: 0.0125,
                    totalDurationUs: 6400000, marketRiskDurationUs: 2000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "PARIBU-TRY" },
                    orders: [{ id: 7, lot: 500, price: 90.10 }, { id: 8, lot: 500, price: 91.00 }, { id: 9, lot: 500, price: 91.20 }]
                }),
                new ArbitrageSummary({
                    id: 4, friendlyId: `ARB-ICRYPEX-USDT-${dateStr}-004`, dateAdded: new Date(`${dateStr}T15:50:15`),
                    status: "Completed", initialCapital: 1200.00, realizedReturn: 95.00, realizedReturnRatio: 0.0792,
                    totalDurationUs: 5700000, marketRiskDurationUs: 1800000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "ICRYPEX-USDT" },
                    orders: [{ id: 10, lot: 150, price: 39.90 }, { id: 11, lot: 200, price: 40.10 }, { id: 12, lot: 150, price: 40.40 }]
                }),
                new ArbitrageSummary({
                    id: 5, friendlyId: `ARB-BITEXEN-TRY-${dateStr}-005`, dateAdded: new Date(`${dateStr}T11:12:55`),
                    status: "Completed", initialCapital: 15000.00, realizedReturn: 130.00, realizedReturnRatio: 0.0087,
                    totalDurationUs: 3200000, marketRiskDurationUs: 1000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITEXEN-TRY" },
                    orders: [{ id: 13, lot: 100, price: 48.00 }, { id: 14, lot: 100, price: 48.60 }, { id: 15, lot: 100, price: 48.90 }]
                })
            ];
        } else if (this.dateType === 'day2') {
            // DÜNDEN ÖNCEKİ GÜN için veriler (resimdeki veriler)
            this.arbitrages = [
                new ArbitrageSummary({
                    id: 1, friendlyId: `ARB-BTCTURK-USDT-${dateStr}-001`, dateAdded: new Date(`${dateStr}T12:45:15`),
                    status: "Completed", initialCapital: 8000.00, realizedReturn: 120.00, realizedReturnRatio: 0.0180,
                    totalDurationUs: 8000000, marketRiskDurationUs: 3000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BTCTURK-USDT" },
                    orders: [{ id: 1, lot: 200, price: 186.00 }, { id: 2, lot: 200, price: 184.00 }, { id: 3, lot: 200, price: 185.00 }]
                }),
                new ArbitrageSummary({
                    id: 2, friendlyId: `ARB-PARIBU-TRY-${dateStr}-002`, dateAdded: new Date(`${dateStr}T12:10:00`),
                    status: "Completed", initialCapital: 7500.00, realizedReturn: 110.00, realizedReturnRatio: 0.0165,
                    totalDurationUs: 4000000, marketRiskDurationUs: 1500000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "PARIBU-TRY" },
                    orders: [{ id: 4, lot: 300, price: 27.00 }, { id: 5, lot: 350, price: 27.25 }, { id: 6, lot: 300, price: 27.50 }]
                }),
                new ArbitrageSummary({
                    id: 3, friendlyId: `ARB-ICRYPEX-USDT-${dateStr}-003`, dateAdded: new Date(`${dateStr}T16:25:40`),
                    status: "Completed", initialCapital: 10000.00, realizedReturn: 200.00, realizedReturnRatio: 0.0200,
                    totalDurationUs: 6400000, marketRiskDurationUs: 2000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "ICRYPEX-USDT" },
                    orders: [{ id: 7, lot: 500, price: 90.10 }, { id: 8, lot: 500, price: 91.00 }, { id: 9, lot: 500, price: 91.20 }]
                }),
                new ArbitrageSummary({
                    id: 4, friendlyId: `ARB-BITCI-TRY-${dateStr}-004`, dateAdded: new Date(`${dateStr}T15:50:15`),
                    status: "Completed", initialCapital: 12000.00, realizedReturn: 150.00, realizedReturnRatio: 0.0190,
                    totalDurationUs: 5700000, marketRiskDurationUs: 1800000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITCI-TRY" },
                    orders: [{ id: 10, lot: 150, price: 39.90 }, { id: 11, lot: 200, price: 40.10 }, { id: 12, lot: 150, price: 40.40 }]
                }),
                new ArbitrageSummary({
                    id: 5, friendlyId: `ARB-BITEXEN-USDT-${dateStr}-005`, dateAdded: new Date(`${dateStr}T11:12:55`),
                    status: "Completed", initialCapital: 18000.00, realizedReturn: 210.00, realizedReturnRatio: 0.0210,
                    totalDurationUs: 3200000, marketRiskDurationUs: 1000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITEXEN-USDT" },
                    orders: [{ id: 13, lot: 100, price: 48.00 }, { id: 14, lot: 100, price: 48.60 }, { id: 15, lot: 100, price: 48.90 }]
                })
            ];
        } else if (this.dateType === 'day3') {
            // 3 GÜN ÖNCE için veriler (resimdeki veriler)
            this.arbitrages = [
                new ArbitrageSummary({
                    id: 1, friendlyId: `ARB-BITEXEN-USDT-${dateStr}-001`, dateAdded: new Date(`${dateStr}T12:45:15`),
                    status: "Completed", initialCapital: 3500.00, realizedReturn: 280.00, realizedReturnRatio: 0.0320,
                    totalDurationUs: 8000000, marketRiskDurationUs: 3000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITEXEN-USDT" },
                    orders: [{ id: 1, lot: 200, price: 186.00 }, { id: 2, lot: 200, price: 184.00 }, { id: 3, lot: 200, price: 185.00 }]
                }),
                new ArbitrageSummary({
                    id: 2, friendlyId: `ARB-BTCTURK-TRY-${dateStr}-002`, dateAdded: new Date(`${dateStr}T12:10:00`),
                    status: "Completed", initialCapital: 6200.00, realizedReturn: 150.00, realizedReturnRatio: 0.0175,
                    totalDurationUs: 4000000, marketRiskDurationUs: 1500000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BTCTURK-TRY" },
                    orders: [{ id: 4, lot: 300, price: 27.00 }, { id: 5, lot: 350, price: 27.25 }, { id: 6, lot: 300, price: 27.50 }]
                }),
                new ArbitrageSummary({
                    id: 3, friendlyId: `ARB-PARIBU-USDT-${dateStr}-003`, dateAdded: new Date(`${dateStr}T16:25:40`),
                    status: "Completed", initialCapital: 8000.00, realizedReturn: 190.00, realizedReturnRatio: 0.0240,
                    totalDurationUs: 6400000, marketRiskDurationUs: 2000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "PARIBU-USDT" },
                    orders: [{ id: 7, lot: 500, price: 90.10 }, { id: 8, lot: 500, price: 91.00 }, { id: 9, lot: 500, price: 91.20 }]
                }),
                new ArbitrageSummary({
                    id: 4, friendlyId: `ARB-ICRYPEX-TRY-${dateStr}-004`, dateAdded: new Date(`${dateStr}T15:50:15`),
                    status: "Completed", initialCapital: 10000.00, realizedReturn: 300.00, realizedReturnRatio: 0.0310,
                    totalDurationUs: 5700000, marketRiskDurationUs: 1800000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "ICRYPEX-TRY" },
                    orders: [{ id: 10, lot: 150, price: 39.90 }, { id: 11, lot: 200, price: 40.10 }, { id: 12, lot: 150, price: 40.40 }]
                }),
                new ArbitrageSummary({
                    id: 5, friendlyId: `ARB-BITCI-USDT-${dateStr}-005`, dateAdded: new Date(`${dateStr}T11:12:55`),
                    status: "Completed", initialCapital: 4500.00, realizedReturn: 130.00, realizedReturnRatio: 0.0290,
                    totalDurationUs: 3200000, marketRiskDurationUs: 1000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITCI-USDT" },
                    orders: [{ id: 13, lot: 100, price: 48.00 }, { id: 14, lot: 100, price: 48.60 }, { id: 15, lot: 100, price: 48.90 }]
                })
            ];
        } else if (this.dateType === 'day4') {
            // 4 GÜN ÖNCE için veriler (resimdeki veriler)
            this.arbitrages = [
                new ArbitrageSummary({
                    id: 1, friendlyId: `ARB-PARIBU-USDT-${dateStr}-001`, dateAdded: new Date(`${dateStr}T12:45:15`),
                    status: "Completed", initialCapital: 12000.00, realizedReturn: 350.00, realizedReturnRatio: 0.0292,
                    totalDurationUs: 8000000, marketRiskDurationUs: 3000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "PARIBU-USDT" },
                    orders: [{ id: 1, lot: 200, price: 186.00 }, { id: 2, lot: 200, price: 184.00 }, { id: 3, lot: 200, price: 185.00 }]
                }),
                new ArbitrageSummary({
                    id: 2, friendlyId: `ARB-BTCTURK-TRY-${dateStr}-002`, dateAdded: new Date(`${dateStr}T12:10:00`),
                    status: "Completed", initialCapital: 4500.00, realizedReturn: 200.00, realizedReturnRatio: 0.0444,
                    totalDurationUs: 4000000, marketRiskDurationUs: 1500000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BTCTURK-TRY" },
                    orders: [{ id: 4, lot: 300, price: 27.00 }, { id: 5, lot: 350, price: 27.25 }, { id: 6, lot: 300, price: 27.50 }]
                }),
                new ArbitrageSummary({
                    id: 3, friendlyId: `ARB-ICRYPEX-USDT-${dateStr}-003`, dateAdded: new Date(`${dateStr}T16:25:40`),
                    status: "Completed", initialCapital: 7000.00, realizedReturn: 150.00, realizedReturnRatio: 0.0214,
                    totalDurationUs: 6400000, marketRiskDurationUs: 2000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "ICRYPEX-USDT" },
                    orders: [{ id: 7, lot: 500, price: 90.10 }, { id: 8, lot: 500, price: 91.00 }, { id: 9, lot: 500, price: 91.20 }]
                }),
                new ArbitrageSummary({
                    id: 4, friendlyId: `ARB-BITCI-TRY-${dateStr}-004`, dateAdded: new Date(`${dateStr}T15:50:15`),
                    status: "Completed", initialCapital: 15000.00, realizedReturn: 400.00, realizedReturnRatio: 0.0267,
                    totalDurationUs: 5700000, marketRiskDurationUs: 1800000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITCI-TRY" },
                    orders: [{ id: 10, lot: 150, price: 39.90 }, { id: 11, lot: 200, price: 40.10 }, { id: 12, lot: 150, price: 40.40 }]
                }),
                new ArbitrageSummary({
                    id: 5, friendlyId: `ARB-BITEXEN-USDT-${dateStr}-005`, dateAdded: new Date(`${dateStr}T11:12:55`),
                    status: "Completed", initialCapital: 20000.00, realizedReturn: 90.00, realizedReturnRatio: 0.0045,
                    totalDurationUs: 3200000, marketRiskDurationUs: 1000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITEXEN-USDT" },
                    orders: [{ id: 13, lot: 100, price: 48.00 }, { id: 14, lot: 100, price: 48.60 }, { id: 15, lot: 100, price: 48.90 }]
                })
            ];
        } else {
            // BUGÜN için veriler (ilk resim)
            this.arbitrages = [
                new ArbitrageSummary({
                    id: 1, friendlyId: `ARB-BITCI-TRY-${dateStr}-001`, dateAdded: new Date(`${dateStr}T12:45:15`),
                    status: "Completed", initialCapital: 6000.00, realizedReturn: 300.00, realizedReturnRatio: 0.0500,
                    totalDurationUs: 8000000, marketRiskDurationUs: 3000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITCI-TRY" },
                    orders: [{ id: 1, lot: 200, price: 186.00 }, { id: 2, lot: 200, price: 184.00 }, { id: 3, lot: 200, price: 185.00 }]
                }),
                new ArbitrageSummary({
                    id: 2, friendlyId: `ARB-PARIBU-USDT-${dateStr}-002`, dateAdded: new Date(`${dateStr}T12:10:00`),
                    status: "Completed", initialCapital: 4000.00, realizedReturn: 300.00, realizedReturnRatio: 0.0750,
                    totalDurationUs: 4000000, marketRiskDurationUs: 1500000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "PARIBU-USDT" },
                    orders: [{ id: 4, lot: 300, price: 27.00 }, { id: 5, lot: 350, price: 27.25 }, { id: 6, lot: 300, price: 27.50 }]
                }),
                new ArbitrageSummary({
                    id: 3, friendlyId: `ARB-BITEXEN-TRY-${dateStr}-003`, dateAdded: new Date(`${dateStr}T16:25:40`),
                    status: "Completed", initialCapital: 3000.00, realizedReturn: 90.00, realizedReturnRatio: 0.0300,
                    totalDurationUs: 6400000, marketRiskDurationUs: 2000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BITEXEN-TRY" },
                    orders: [{ id: 7, lot: 500, price: 90.10 }, { id: 8, lot: 500, price: 91.00 }, { id: 9, lot: 500, price: 91.20 }]
                }),
                new ArbitrageSummary({
                    id: 4, friendlyId: `ARB-BTCTURK-USDT-${dateStr}-004`, dateAdded: new Date(`${dateStr}T15:50:15`),
                    status: "Completed", initialCapital: 2000.00, realizedReturn: 69.00, realizedReturnRatio: 0.0345,
                    totalDurationUs: 5700000, marketRiskDurationUs: 1800000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "BTCTURK-USDT" },
                    orders: [{ id: 10, lot: 150, price: 39.90 }, { id: 11, lot: 200, price: 40.10 }, { id: 12, lot: 150, price: 40.40 }]
                }),
                new ArbitrageSummary({
                    id: 5, friendlyId: `ARB-ICRYPEX-TRY-${dateStr}-005`, dateAdded: new Date(`${dateStr}T11:12:55`),
                    status: "Completed", initialCapital: 5000.00, realizedReturn: 50.00, realizedReturnRatio: 0.0100,
                    totalDurationUs: 3200000, marketRiskDurationUs: 1000000, isDemo: false, isFinalized: true, isSuccessful: true,
                    tradingPath: { name: "ICRYPEX-TRY" },
                    orders: [{ id: 13, lot: 100, price: 48.00 }, { id: 14, lot: 100, price: 48.60 }, { id: 15, lot: 100, price: 48.90 }]
                })
            ];
        }
        
        console.log(`${this.dateType} (${dateStr}) Arbitrage sample data loaded:`, this.arbitrages);
        this.calculateSummaryData();
    }

    calculateSummaryData() {
        // Borsa bazında gruplandır
        const groupedByExchange = {};
        
        console.log('Arbitrage verileri:', this.arbitrages);
        
        this.arbitrages.forEach(arb => {
            const exchangeName = this.getBorsaName(arb.tradingPath.name);
            // Trading path'e göre yön belirle
            const direction = arb.tradingPath.name.includes('TRY') ? 'TRY Trio' : 'USDT Trio';
            
            console.log(`Trading Path: ${arb.tradingPath.name}, Exchange: ${exchangeName}, Direction: ${direction}`);
            
            if (!groupedByExchange[exchangeName]) {
                groupedByExchange[exchangeName] = {
                    exchange: exchangeName,
                    direction: direction,
                    volume: 0,
                    grossProfit: 0,
                    netProfit: 0,
                    grossProfitMargin: 0,
                    netProfitMargin: 0,
                    count: 0
                };
            }
            
            const summary = groupedByExchange[exchangeName];
            summary.volume += arb.initialCapital;
            summary.grossProfit += arb.realizedReturn;
            summary.count++;
            
            // Net kar hesaplama - ikinci resimdeki değerlere göre ayarla
            let netProfit;
            if (this.dateType === 'yesterday') {
                // Dün için özel net kar değerleri (ikinci resim)
                const netProfitMap = {
                    'Bitci': 156.00,
                    'BtcTürk': 109.00,
                    'Paribu': 210.00,
                    'Icrypex': 92.60,
                    'Bitexen': 100.00
                };
                netProfit = netProfitMap[exchangeName] || (arb.realizedReturn - (arb.initialCapital * 0.002));
            } else if (this.dateType === 'day2') {
                // Dünden önceki gün için özel net kar değerleri
                const netProfitMap = {
                    'BtcTürk': 95.00,
                    'Paribu': 85.00,
                    'Icrypex': 160.00,
                    'Bitci': 130.00,
                    'Bitexen': 175.00
                };
                netProfit = netProfitMap[exchangeName] || (arb.realizedReturn - (arb.initialCapital * 0.002));
            } else if (this.dateType === 'day3') {
                // 3 gün önce için özel net kar değerleri
                const netProfitMap = {
                    'Bitexen': 220.00,
                    'BtcTürk': 120.00,
                    'Paribu': 155.00,
                    'Icrypex': 260.00,
                    'Bitci': 105.00
                };
                netProfit = netProfitMap[exchangeName] || (arb.realizedReturn - (arb.initialCapital * 0.002));
            } else if (this.dateType === 'day4') {
                // 4 gün önce için özel net kar değerleri (resimdeki veriler)
                const netProfitMap = {
                    'Paribu': 300.00,
                    'BtcTürk': 170.00,
                    'Icrypex': 120.00,
                    'Bitci': 350.00,
                    'Bitexen': 75.00
                };
                netProfit = netProfitMap[exchangeName] || (arb.realizedReturn - (arb.initialCapital * 0.002));
            } else {
                // Diğer günler için normal komisyon hesaplama
                const commission = arb.initialCapital * 0.002;
                netProfit = arb.realizedReturn - commission;
            }
            summary.netProfit += netProfit;
        });
        
        // Ortalama marjları hesapla
        Object.values(groupedByExchange).forEach(summary => {
            summary.grossProfitMargin = (summary.grossProfit / summary.volume) * 100;
            summary.netProfitMargin = (summary.netProfit / summary.volume) * 100;
        });
        
        this.summaryData = Object.values(groupedByExchange);
        console.log('Özet veriler hesaplandı:', this.summaryData);
    }

    getBorsaName(tradingPath) {
        const borsaMap = {
            'BITCI-TRY': 'Bitci',
            'BITCI-USDT': 'Bitci',
            'PARIBU-USDT': 'Paribu',
            'PARIBU-TRY': 'Paribu',
            'BITEXEN-TRY': 'Bitexen',
            'BITEXEN-USDT': 'Bitexen',
            'BTCTURK-USDT': 'BtcTürk',
            'BTCTURK-TRY': 'BtcTürk',
            'ICRYPEX-USDT': 'Icrypex',
            'ICRYPEX-TRY': 'Icrypex'
        };
        return borsaMap[tradingPath] || tradingPath;
    }

    getBorsaClass(exchangeName) {
        const borsaMap = {
            'BtcTürk': 'y-red',
            'Paribu': 'y-black',
            'Icrypex': 'y-purple',
            'Bitexen': 'y-yellow',
            'Bitci': 'y-brown'
        };
        return borsaMap[exchangeName] || 'y-black';
    }

    getDirectionClass(direction) {
        return direction === 'TRY Trio' ? 'y-orange' : 'y-blue';
    }

    formatVolume(volume) {
        return volume.toLocaleString('tr-TR');
    }

    formatProfit(profit) {
        return profit.toFixed(2).replace('.', ',');
    }

    formatMargin(margin) {
        return `%${margin.toFixed(2).replace('.', ',')}`;
    }

    render() {
        this.container.innerHTML = `
            <style>
                .kripto-responsive-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #1b5e20;
                    color: white;
                }
                .kripto-responsive-table th {
                    background-color: #1a5b16;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    text-align: center;
                    border: none;
                }
                .kripto-responsive-table td {
                    padding: 8px;
                    text-align: center;
                    border: none;
                    background-color: #2e7d32;
                    color: white;
                    font-weight: normal;
                }
                .kripto-responsive-table tr:hover td {
                    background-color: #388e3c;
                }
                /* Exchange color classes */
                .y-red { color: #ff4444 !important; }
                .y-black { color: #000000 !important; }
                .y-purple { color: #9c27b0 !important; }
                .y-brown { color: #8d6e63 !important; }
                .y-yellow { color: #ffeb3b !important; }
                .y-orange { color: #ff9800 !important; }
                .y-blue { color: #2196f3 !important; }
                .y-white { color: #ffffff !important; }
                /* Direction color classes */
                .direction-try { color: #ff9800 !important; }
                .direction-usdt { color: #2196f3 !important; }
            </style>

            <table class="kripto-responsive-table" id="kripto-0-ozet-bist-vadeli-islemler-table" style="min-width: 175px">
                                    <colgroup>
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                    <col style="min-width: 25px">
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th colspan="1" rowspan="1">
                            <p>BORSA</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>YÖN</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>HACİM</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>BRÜT KAR</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>NET KAR</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>BRÜT KAR MARJI</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                            <p>NET KAR MARJI</p>
                                            </th>
                                        </tr>
                    ${this.summaryData.map(summary => this.renderSummaryRow(summary)).join('')}
                                    </tbody>
                                </table>
        `;
    }

    renderSummaryRow(summary) {
        return `
            <tr>
                <td colspan="1" rowspan="1"><p class="${this.getBorsaClass(summary.exchange)}" style="${summary.exchange === 'Paribu' ? 'color: #000000 !important;' : ''}">${summary.exchange}</p></td>
                <td colspan="1" rowspan="1"><p class="${this.getDirectionClass(summary.direction)}">${summary.direction}</p></td>
                <td colspan="1" rowspan="1"><p>${this.formatVolume(summary.volume)}</p></td>
                <td colspan="1" rowspan="1"><p>${this.formatProfit(summary.grossProfit)}</p></td>
                <td colspan="1" rowspan="1"><p>${this.formatProfit(summary.netProfit)}</p></td>
                <td colspan="1" rowspan="1"><p>${this.formatMargin(summary.grossProfitMargin)}</p></td>
                <td colspan="1" rowspan="1"><p>${this.formatMargin(summary.netProfitMargin)}</p></td>
            </tr>
        `;
    }

    updateData(newData) {
        this.arbitrages = newData.map(item => new ArbitrageSummary(item));
        this.calculateSummaryData();
        this.render();
    }
}

// Global erişim için
if (typeof window !== 'undefined') {
    window.ArbitrageSummaryWidget = ArbitrageSummaryWidget;
}

// Widget'ı otomatik başlat
document.addEventListener('DOMContentLoaded', () => {
    // Bugün
    const todayContainer = document.getElementById('arbitrage-summary-today-container');
    if (todayContainer && !window.arbitrageSummaryTodayInstance) {
        window.arbitrageSummaryTodayInstance = new ArbitrageSummaryWidget('arbitrage-summary-today-container', 'today');
    }
    
    // Dün
    const yesterdayContainer = document.getElementById('arbitrage-summary-yesterday-container');
    if (yesterdayContainer && !window.arbitrageSummaryYesterdayInstance) {
        window.arbitrageSummaryYesterdayInstance = new ArbitrageSummaryWidget('arbitrage-summary-yesterday-container', 'yesterday');
    }
    
    // 2 gün önce
    const day2Container = document.getElementById('arbitrage-summary-day2-container');
    if (day2Container && !window.arbitrageSummaryDay2Instance) {
        window.arbitrageSummaryDay2Instance = new ArbitrageSummaryWidget('arbitrage-summary-day2-container', 'day2');
    }
    
    // 3 gün önce
    const day3Container = document.getElementById('arbitrage-summary-day3-container');
    if (day3Container && !window.arbitrageSummaryDay3Instance) {
        window.arbitrageSummaryDay3Instance = new ArbitrageSummaryWidget('arbitrage-summary-day3-container', 'day3');
    }
    
    // 4 gün önce
    const day4Container = document.getElementById('arbitrage-summary-day4-container');
    if (day4Container && !window.arbitrageSummaryDay4Instance) {
        window.arbitrageSummaryDay4Instance = new ArbitrageSummaryWidget('arbitrage-summary-day4-container', 'day4');
    }
}); 