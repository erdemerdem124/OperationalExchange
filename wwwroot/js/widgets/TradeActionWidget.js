/**
 * TradeAction Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { TradeAction } from '../models.js/TradeAction.js';

export class TradeActionWidget {
    constructor(containerId = 'trade-action-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.tradeActions = [];
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
            return;
        }

        // Statik veri ile başlat
        this.loadSampleData();
        this.render();
        this.setupEventListeners();
    }

    loadSampleData() {
        this.tradeActions = TradeAction.getSampleData();
        console.log('TradeAction sample data loaded:', this.tradeActions);
    }

    setupEventListeners() {
        // Form submit event listener
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTradeActions();
            });
        }

        // Input change event listeners
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateTradeActionValue(e.target.name, e.target.value);
            });
        });
    }

    updateTradeActionValue(name, value) {
        console.log(`TradeAction updated: ${name} = ${value}`);
    }

    saveTradeActions() {
        console.log('Saving trade actions:', this.tradeActions);
        alert('İşlemler kaydedildi!');
    }

    getFormattedTime(dateAdded) {
        const date = new Date(dateAdded);
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    getAssetName(tradeAction) {
        // Hisse isimleri için mapping
        const stockNames = {
            'BTC/USDT': 'ASELS',
            'ETH/USDT': 'KCHOL',
            'ADA/USDT': 'SISE',
            'SOL/USDT': 'TUPRS',
            'DOT/USDT': 'GARAN',
            'LINK/USDT': 'AKBNK',
            'MATIC/USDT': 'THYAO',
            'AVAX/USDT': 'BIMAS',
            'BTC/USD': 'EREGL',
            'ETH/USD': 'KRDMD'
        };
        
        if (tradeAction.pair && tradeAction.pair.asset1 && tradeAction.pair.asset2) {
            const pairName = `${tradeAction.pair.asset1.name}/${tradeAction.pair.asset2.name}`;
            return stockNames[pairName] || pairName;
        }
        return `Hisse ${tradeAction.pairId || tradeAction.id}`;
    }

    getDirectionName(tradeAction) {
        // Trading path ID'ye göre yön belirleme
        const directions = {
            1: 'DÜZ EYLÜL',
            2: 'TERS EKİM',
            3: 'DÜZ KASIM',
            4: 'TERS ARALIK',
            5: 'DÜZ OCAK'
        };
        return directions[tradeAction.tradingPathId] || `Path ${tradeAction.tradingPathId}`;
    }

    getStepNumber(tradeAction) {
        return `${tradeAction.tradeOrder}/2`;
    }

    getOrderDirection(tradeAction) {
        return tradeAction.direction === 'Buy' ? 'AL' : 'SAT';
    }

    getRandomAmount() {
        const amounts = [500, 800, 1000, 1200, 1500, 2000];
        return amounts[Math.floor(Math.random() * amounts.length)];
    }

    getRandomPrice() {
        const prices = [45.20, 48.10, 52.30, 56.80, 62.40, 68.90, 75.20, 82.10, 89.40, 95.60, 102.30, 156.80];
        return prices[Math.floor(Math.random() * prices.length)];
    }

    getRandomDuration() {
        const durations = ['30 dakika', '45 dakika', '1 saat', '1.5 saat', '2 saat', '3 saat'];
        return durations[Math.floor(Math.random() * durations.length)];
    }

    getRandomExpectedReturn() {
        const returns = [8.5, 12.4, 15.2, 16.8, 18.3, 20.1, 22.1, 25.6, 28.9, 32.4];
        return returns[Math.floor(Math.random() * returns.length)];
    }

    getFormattedPrice(price) {
        return price.toFixed(2).replace('.', ',');
    }

    getFormattedAmount(amount) {
        return amount.toLocaleString('tr-TR');
    }

    getFormattedReturn(returnValue) {
        return `${returnValue.toFixed(1)}%`;
    }

    render() {
        this.container.innerHTML = `
            <style>
                #kripto-acik-bist-vadeli-islemler-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #1b5e20;
                    color: white;
                }
                #kripto-acik-bist-vadeli-islemler-table th {
                    background-color: #1b5e20;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                }
                #kripto-acik-bist-vadeli-islemler-table td {
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                    background-color: #2e7d32;
                }
                #kripto-acik-bist-vadeli-islemler-table tr:hover td {
                    background-color: #388e3c;
                }
                #kripto-acik-bist-vadeli-islemler-table p {
                    margin: 0;
                    font-size: 0.875rem;
                }
                .y-blue {
                    color: #2196f3 !important;
                }
                .kucuk-kaydet-btn {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
                .kucuk-kaydet-btn:hover {
                    background-color: #0056b3;
                }
            </style>
            
            <form>
                <table id="kripto-acik-bist-vadeli-islemler-table" style="min-width: 250px">
                    <colgroup>
                        <col style="min-width: 25px">
                        <col style="min-width: 25px">
                        <col style="min-width: 25px">
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
                                <p>Sıra</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Saat</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Varlık</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Yön</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Adım</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Emir Yönü</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Miktar</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Fiyat</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Süre</p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p>Beklenen Getiri</p>
                            </th>
                                        </tr>
                        ${this.tradeActions.map((tradeAction, index) => this.renderTradeActionRow(tradeAction, index + 1)).join('')}
                                    </tbody>
                                </table>
                <div style="display: flex; justify-content: center; margin-top: 16px;">
                    <button type="submit" class="kucuk-kaydet-btn">Kaydet</button>
                </div>
            </form>
        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderTradeActionRow(tradeAction, rowNumber) {
        return `
            <tr>
                <td colspan="1" rowspan="1">
                    <p>${rowNumber}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedTime(tradeAction.dateAdded)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getAssetName(tradeAction)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p><span class="y-blue">${this.getDirectionName(tradeAction)}</span></p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getStepNumber(tradeAction)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getOrderDirection(tradeAction)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedAmount(this.getRandomAmount())}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedPrice(this.getRandomPrice())}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getRandomDuration()}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedReturn(this.getRandomExpectedReturn())}</p>
                </td>
            </tr>
        `;
    }

    updateData(newData) {
        this.tradeActions = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradeActionWidget = TradeActionWidget;
} 