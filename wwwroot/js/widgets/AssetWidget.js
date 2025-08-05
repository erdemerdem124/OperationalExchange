/**
 * Asset Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Asset } from '../models.js/Asset.js';

export class AssetWidget {
    constructor(containerId = 'asset-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.assets = [];
        
        // Sadece Umbraco panel içinde çalışsın
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
            return;
        }

        // Statik veri ile başlat (SignalR gelene kadar)
        this.loadSampleData();
        this.render();
        this.setupEventListeners();
    }

    loadSampleData() {
        this.assets = Asset.getSampleData();
        console.log('Asset sample data loaded:', this.assets);
    }

    setupEventListeners() {
        // Yenile butonu
        const refreshBtn = this.container.querySelector('#refreshAssets');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }
    }



    filterAssets() {
        return this.assets;
    }

    render() {
        const filteredAssets = this.filterAssets();
        
        // TRY ve USD toplamlarını hesapla
        const tryAsset = filteredAssets.find(a => a.name === 'TRY');
        const usdAsset = filteredAssets.find(a => a.name === 'USD');
        
        this.container.innerHTML = `
            <style>
                #kripto-coin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: center;
                    background-color: #1b5e20;
                    color: white;
                }
                #kripto-coin-table th,
                #kripto-coin-table td {
                    padding: 8px;
                    border: 1px solid #2e7d32;
                }
                #kripto-coin-table th {
                    background-color: #1b5e20;
                    font-weight: bold;
                }
                #kripto-coin-table td {
                    background-color: #2e7d32;
                }
                #kripto-coin-table tr:hover td {
                    background-color: #388e3c;
                }
            </style>
            
                            <div class="table-responsive">
                <table id="kripto-coin-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>BtcTürk</th>
                            <th>Paribu</th>
                            <th>Icrypex</th>
                            <th>Bitci</th>
                            <th>Bitexen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                        ${filteredAssets.map(asset => this.renderAssetRow(asset)).join('')}
                        <tr>
                            <td colspan="6" style="border-bottom:2px solid #fff;"></td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">TOPLAM TRY</td>
                            <td>${tryAsset ? tryAsset.btcTurkPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${tryAsset ? tryAsset.paribuPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${tryAsset ? tryAsset.icrypexPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${tryAsset ? tryAsset.bitciPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${tryAsset ? tryAsset.bitexenPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                        </tr>
                        <tr>
                            <td style="font-weight:bold;">TOPLAM USD</td>
                            <td>${usdAsset ? usdAsset.btcTurkPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${usdAsset ? usdAsset.paribuPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${usdAsset ? usdAsset.icrypexPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${usdAsset ? usdAsset.bitciPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                            <td>${usdAsset ? usdAsset.bitexenPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td>
                        </tr>
                                    </tbody>
                                </table>
                            </div>



        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderAssetRow(asset) {
        const formatPrice = (price) => {
            if (price < 1) {
                return price.toLocaleString('tr-TR', {
                    minimumFractionDigits: asset.displayDecimals,
                    maximumFractionDigits: asset.displayDecimals
                }).replace('.', ',');
            }
            return price.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        };

        return `
            <tr>
                <td><b>${asset.name}</b></td>
                <td>${formatPrice(asset.btcTurkPrice)}</td>
                <td>${formatPrice(asset.paribuPrice)}</td>
                <td>${formatPrice(asset.icrypexPrice)}</td>
                <td>${formatPrice(asset.bitciPrice)}</td>
                <td>${formatPrice(asset.bitexenPrice)}</td>
            </tr>
        `;
    }





    updateData(newData) {
        this.assets = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.AssetWidget = AssetWidget;
}