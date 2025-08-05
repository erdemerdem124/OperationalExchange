/**
 * Order Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Order } from '../models.js/Order.js';

export class OrderWidget {
    constructor(containerId = 'order-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.orders = [];
        
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
        this.orders = Order.getSampleData();
        
        // Saatleri en yeni saatten en eskiye göre sırala
        this.orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log('Order sample data loaded:', this.orders);
    }

    setupEventListeners() {
        // Form submit event listener
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveOrders();
            });
        }

        // Input change event listeners
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateOrderValue(e.target.name, e.target.value);
            });
        });
    }

    updateOrderValue(name, value) {
        console.log(`Order updated: ${name} = ${value}`);
    }

    saveOrders() {
        console.log('Saving orders:', this.orders);
        alert('Emirler kaydedildi!');
    }

    getFormattedTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    }

    getAssetName(order) {
        // Hisse isimleri için mapping
        const stockNames = {
            'BTC/USDT': 'ASELS',
            'ETH/USD': 'THYAO',
            'ADA/USDT': 'KRDMD',
            'SOL/USDT': 'TUPRS',
            'DOT/USDT': 'BTC/USDT',
            'LINK/USDT': 'GARAN',
            'MATIC/USDT': 'AKBNK',
            'AVAX/USDT': 'SASA'
        };
        
        if (order.pair && order.pair.baseAsset && order.pair.quoteAsset) {
            const pairName = `${order.pair.baseAsset.name}/${order.pair.quoteAsset.name}`;
            return stockNames[pairName] || pairName;
        }
        
        // Eğer pair bilgisi yoksa, order ID'sine göre hisse ataması yap
        const stockMapping = {
            1: 'ASELS',
            2: 'THYAO', 
            3: 'KRDMD',
            4: 'TUPRS',
            5: 'BTC/USDT'
        };
        
        return stockMapping[order.id] || 'ASELS';
    }

    getOrderTypeName(order) {
        switch(order.orderType) {
            case 'Market': return 'Piyasa';
            case 'Limit': return 'Limit';
            case 'StopLoss': return 'Stop Loss';
            case 'TakeProfit': return 'Take Profit';
            default: return order.orderType;
        }
    }

    getDirectionName(order) {
        switch(order.direction) {
            case 'Buy': return 'Alış';
            case 'Sell': return 'Satış';
            default: return order.direction;
        }
    }

    getStateName(order) {
        switch(order.state) {
            case 'New': return 'Beklemede';
            case 'PartiallyFilled': return 'Kısmen Gerçekleşti';
            case 'Filled': return 'Aktif';
            case 'Cancelled': return 'Beklemede';
            case 'Rejected': return 'Beklemede';
            case 'Expired': return 'Beklemede';
            case 'PartiallyFilledCancelled': return 'Kısmen Gerçekleşti';
            default: return 'Beklemede';
        }
    }

    getRemainingAmount(order) {
        return order.amount - order.executedAmount;
    }

    getFormattedPrice(order) {
        if (order.orderType === 'Market') {
            return '-';
        }
        return order.price.toFixed(2).replace('.', ',');
    }

    getFormattedAmount(amount) {
        // Lot mantığı: 999 ise 999, 1000 ise 1.000
        if (amount >= 1000) {
            return amount.toLocaleString('tr-TR');
        } else if (amount < 1) {
            // 0.01 gibi küçük değerler için nokta kullan
            return amount.toFixed(2);
        }
        return amount.toString();
    }

    render() {
        this.container.innerHTML = `
            <style>
                #kripto-acik-emirler {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #1b5e20;
                    color: white;
                }
                #kripto-acik-emirler th {
                    background-color: #1b5e20;
                    color: white;
                    font-weight: bold;
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                }
                #kripto-acik-emirler td {
                    padding: 8px;
                    text-align: center;
                    border: 1px solid #2e7d32;
                    background-color: #2e7d32;
                }
                #kripto-acik-emirler tr:hover td {
                    background-color: #388e3c;
                }
                #kripto-acik-emirler p {
                    margin: 0;
                    font-size: 0.875rem;
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
                <table id="kripto-acik-emirler" style="min-width: 225px; border-collapse: collapse">
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
                    </colgroup>
                    <tbody>
                        <tr>
                            <th colspan="1" rowspan="1">
                                <p><strong>Sıra</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Saat</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Varlık</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Emir Türü</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Yön</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Fiyat</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Adet</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Kalan Adet</strong></p>
                            </th>
                            <th colspan="1" rowspan="1">
                                <p><strong>Durum</strong></p>
                            </th>
                                        </tr>
                        ${this.orders.map((order, index) => this.renderOrderRow(order, index + 1)).join('')}
                                    </tbody>
                                </table>
            </form>
        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderOrderRow(order, rowNumber) {
        return `
            <tr>
                <td colspan="1" rowspan="1">
                    <p>${rowNumber}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedTime(order.timestamp)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getAssetName(order)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getOrderTypeName(order)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getDirectionName(order)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedPrice(order)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedAmount(order.amount)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getFormattedAmount(this.getRemainingAmount(order))}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p>${this.getStateName(order)}</p>
                </td>
            </tr>
        `;
    }

    updateData(newData) {
        this.orders = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.OrderWidget = OrderWidget;
} 