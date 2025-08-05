/**
 * Balance Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Balance, BalanceEntry } from '../models.js/Balance.js';
import { Asset } from '../models.js/Asset.js';

export class BalanceWidget {
    constructor(containerId = 'balance-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.balances = [];
        
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
        this.balances = [
            Balance.getSampleData(),
            new Balance({
                id: 2,
                exchange: "Coinbase",
                dateAdded: new Date("2024-01-16")
            }),
            new Balance({
                id: 3,
                blockchain: "Ethereum",
                dateAdded: new Date("2024-01-17")
            })
        ];

        // İkinci bakiye için örnek veriler
        this.balances[1].set(new Asset({ name: "USDT" }), new BalanceEntry({
            currency: new Asset({ name: "USDT" }),
            available: 5000.00,
            total: 5000.00
        }));
        this.balances[1].set(new Asset({ name: "ETH" }), new BalanceEntry({
            currency: new Asset({ name: "ETH" }),
            available: 1.5,
            total: 1.5
        }));

        // Üçüncü bakiye için örnek veriler
        this.balances[2].set(new Asset({ name: "ETH" }), new BalanceEntry({
            currency: new Asset({ name: "ETH" }),
            available: 3.0,
            total: 3.0
        }));
        this.balances[2].set(new Asset({ name: "USDC" }), new BalanceEntry({
            currency: new Asset({ name: "USDC" }),
            available: 2000.00,
            total: 2000.00
        }));

        console.log('Balance sample data loaded:', this.balances);
    }

    setupEventListeners() {
        // Form submit event listener
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveBalances();
            });
        }

        // Input change event listeners
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateBalanceValue(e.target.name, e.target.value);
            });
        });
    }

    updateBalanceValue(name, value) {
        console.log(`Balance updated: ${name} = ${value}`);
    }

    saveBalances() {
        console.log('Saving balances:', this.balances);
        alert('Portföy kaydedildi!');
    }

    getAssetName(asset) {
        // Hisse isimleri için mapping
        const stockNames = {
            'USDT': 'ASELS',
            'BTC': 'TUPRS',
            'ETH': 'SISE',
            'USD': 'THYAO',
            'EUR': 'KCHOL',
            'USDC': 'GARAN'
        };
        
        return stockNames[asset.name] || asset.name;
    }

    getLotAmount(entry) {
        // Gerçekçi lot miktarları
        const lots = [50, 100, 250, 300, 500, 1000, 1500, 2000];
        return lots[Math.floor(Math.random() * lots.length)];
    }

    getAmount(entry, lot) {
        // Gerçekçi fiyatlar ve tutarlar
        const prices = [28, 30, 42, 56, 84, 120, 140, 180];
        const price = prices[Math.floor(Math.random() * prices.length)];
        return lot * price;
    }

    getFormattedLot(lot) {
        return lot.toLocaleString('tr-TR');
    }

    getFormattedAmount(amount) {
        return amount.toLocaleString('tr-TR', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }

    getTotalAmount() {
        let total = 0;
        this.balances.forEach(balance => {
            balance.entries.forEach((entry, asset) => {
                const lot = this.getLotAmount(entry);
                const amount = this.getAmount(entry, lot);
                total += amount;
            });
        });
        return total;
    }

    render() {
        this.container.innerHTML = `
            <style>
                #kripto-portfoy-saglama-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #1b5e20;
                    color: white;
                    font-size: 1.1em;
                }
                #kripto-portfoy-saglama-table th {
                    background-color: #1b5e20;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                }
                #kripto-portfoy-saglama-table td {
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                    background-color: #2e7d32;
                }
                #kripto-portfoy-saglama-table tr:hover td {
                    background-color: #388e3c;
                }
                #kripto-portfoy-saglama-table p {
                    margin: 0;
                    font-size: 1.1em;
                }
                #kripto-portfoy-saglama-table hr {
                    margin: 6px 0px;
                    border-right: none;
                    border-bottom: none;
                    border-left: none;
                    border-image: initial;
                    border-top: 1.5px solid rgb(224, 224, 224);
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
                <table id="kripto-portfoy-saglama-table" style="min-width: 75px; border-collapse: collapse; width: 100%; font-size: 1.1em">
                    <colgroup>
                        <col style="min-width: 25px">
                        <col style="min-width: 25px">
                        <col style="min-width: 25px">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th colspan="1" rowspan="1">
                                <p><strong>Hisse</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Lot</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Tutar</strong></p>
                            </th>
                        </tr>
                        ${this.renderBalanceRows()}
                        <tr>
                            <td colspan="3" rowspan="1">
                                <hr style="margin: 6px 0px; border-right: none; border-bottom: none; border-left: none; border-image: initial; border-top: 1.5px solid rgb(224, 224, 224);">
                            </td>
                        </tr>
                        <tr>
                            <td colspan="1" rowspan="1">
                                <p><strong>TOPLAM</strong></p>
                            </td>
                            <td colspan="1" rowspan="1">
                                <p></p>
                            </td>
                            <td colspan="1" rowspan="1">
                                <p><strong>${this.getFormattedAmount(this.getTotalAmount())}</strong></p>
                            </td>
                                        </tr>
                                    </tbody>
                                </table>
            </form>
        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderBalanceRows() {
        const rows = [];
        
        this.balances.forEach(balance => {
            balance.entries.forEach((entry, asset) => {
                const stockName = this.getAssetName(asset);
                const lot = this.getLotAmount(entry);
                const amount = this.getAmount(entry, lot);
                
                rows.push(`
                    <tr>
                        <td colspan="1" rowspan="1">
                            <p>${stockName}</p>
                </td>
                        <td colspan="1" rowspan="1">
                            <p>${this.getFormattedLot(lot)}</p>
                </td>
                        <td colspan="1" rowspan="1">
                            <p>${this.getFormattedAmount(amount)}</p>
                </td>
            </tr>
                `);
            });
        });
        
        return rows.join('');
    }

    updateData(newData) {
        this.balances = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.BalanceWidget = BalanceWidget;
} 