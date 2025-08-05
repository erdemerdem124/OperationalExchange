/**
 * Arbitrage Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Arbitrage } from '../models.js/Arbitrage.js';

export class ArbitrageWidget {
    constructor(containerId = 'arbitrage-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.arbitrages = [];
        
        this.init();
    }

    init() {
        try {
            console.log('Widget init başlıyor...');
            
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
                // Container yoksa oluştur
                this.container = document.createElement('div');
                this.container.id = this.containerId;
                document.body.appendChild(this.container);
        }

            console.log('Sample data yükleniyor...');
        this.loadSampleData();
            
            console.log('Render yapılıyor...');
        this.render();
            
            console.log('Event listener\'lar ayarlanıyor...');
        this.setupEventListeners();
            
            console.log('Widget başarıyla başlatıldı!');
        } catch (error) {
            console.error('Widget init hatası:', error);
        }
    }

    loadSampleData() {
        this.arbitrages = Arbitrage.getSampleData();
        console.log('Arbitrage sample data loaded:', this.arbitrages);
    }

    setupEventListeners() {
        // Event listener'lar burada olacak (gerekirse)
    }



    filterArbitrages() {
        return this.arbitrages;
    }

    render() {
        const filteredArbitrages = this.filterArbitrages();
        
        this.container.innerHTML = `
            <style>
                #kapanmis-bist-vadeli-islemler-table {
                    width: 100%;
                    border-collapse: collapse;
                    background-color: #1b5e20;
                    color: white;
                }
                #kapanmis-bist-vadeli-islemler-table th {
                    background-color: #1a5b16 !important;
                    color: white !important;
                    font-weight: bold !important;
                    padding: 8px !important;
                    text-align: center !important;
                    border: none !important;
                }
                .card #kapanmis-bist-vadeli-islemler-table th,
                .main-container #kapanmis-bist-vadeli-islemler-table th,
                .panel #kapanmis-bist-vadeli-islemler-table th,
                .accordion-body #kapanmis-bist-vadeli-islemler-table th {
                    background-color: #1a5b16 !important;
                    color: white !important;
                    border: none !important;
                }
                #kapanmis-bist-vadeli-islemler-table td {
                    padding: 8px !important;
                    text-align: center !important;
                    border: none !important;
                    background-color: #2e7d32 !important;
                    color: white !important;
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table td[colspan] {
                    text-align: center !important;
                    border: none !important;
                    background-color: #2e7d32 !important;
                    color: white !important;
                    font-weight: normal !important;
                }
                .card #kapanmis-bist-vadeli-islemler-table td,
                .main-container #kapanmis-bist-vadeli-islemler-table td,
                .panel #kapanmis-bist-vadeli-islemler-table td,
                .accordion-body #kapanmis-bist-vadeli-islemler-table td {
                    color: white !important;
                    border: none !important;
                    background-color: #2e7d32 !important;
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table tr:hover td {
                    background-color: #388e3c;
                }
                .y-orange {
                    color: #ff9800 !important;
                }
                .y-red {
                    color: #f44336 !important;
                }
                .y-purple {
                    color: #9c27b0 !important;
                }
                .y-brown {
                    color: #8d6e63 !important;
                }
                .y-yellow {
                    color: #ffeb3b !important;
                }
                .y-black {
                    color: #000000 !important;
                }
                #kapanmis-bist-vadeli-islemler-table .y-black {
                    color: #000000 !important;
                }
                #kapanmis-bist-vadeli-islemler-table td .y-black {
                    color: #000000 !important;
                }
                #kapanmis-bist-vadeli-islemler-table p.y-black {
                    color: #000000 !important;
                }
                #kapanmis-bist-vadeli-islemler-table *[class*="y-black"] {
                    color: #000000 !important;
                }
                #kapanmis-bist-vadeli-islemler-table td p[class*="y-black"] {
                    color: #000000 !important;
                }
                .y-blue {
                    color: #2196f3 !important;
                }
                #kapanmis-bist-vadeli-islemler-table p {
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table td p {
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table td span {
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table * {
                    font-weight: normal !important;
                }
                #kapanmis-bist-vadeli-islemler-table th p {
                    font-weight: bold !important;
                }
            </style>




                <!-- Detaylı Tablo -->
                <div class="table-section" style="width: 100%; margin: 0; padding: 0;">
                    <div class="card" style="width: 100%; margin: 0; padding: 0; border-radius: 0;">
                        <div class="card-body p-0" style="width: 100%; margin: 0; padding: 0;">
                            <div class="table-responsive" style="width: 100%; margin: 0; padding: 0;">
                                <table id="kapanmis-bist-vadeli-islemler-table" style="width: 100%; min-width: 100%; font-size: 0.875rem; margin: 0; padding: 0;">
                                    <colgroup>
                                        ${Array(16).fill('<col style="min-width: 25px">').join('')}
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Tarih</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Saat</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Borsa</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Yön</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Lot 1</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Fiyat 1</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Lot 2</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Fiyat 2</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Lot 3</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Fiyat 3</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Brüt Kar Marjı</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Brüt Kar</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Komisyon</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Net Kar Marjı</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Net Kar</p>
                                            </th>
                                            <th colspan="1" rowspan="1">
                                                <p class="text-white" style="font-size: 0.875rem">Süre</p>
                                            </th>
                                        </tr>
                                    <tbody>
                                        ${filteredArbitrages.length > 0 ? 
                                            filteredArbitrages.map(arb => this.renderArbitrageRow(arb)).join('') :
                                            '<tr><td colspan="16" style="padding: 8px; border: none; background-color: #2e7d32; color: white; text-align: center;">Filtre kriterlerine uygun arbitrage işlemi bulunamadı.</td></tr>'
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        `;

        // Event listener'ları yeniden bağla
        this.setupEventListeners();
    }

    renderArbitrageRow(arb) {
        const date = new Date(arb.dateAdded);
        const formattedDate = date.toLocaleDateString('tr-TR').replace(/\./g, '-');
        const formattedTime = date.toLocaleTimeString('tr-TR');
        
        return `
            <tr>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${formattedDate}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${formattedTime}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="${this.getBorsaClass(this.getBorsaName(arb.tradingPath.name))}" style="font-size: 0.875rem; ${this.getBorsaName(arb.tradingPath.name) === 'Paribu' ? 'color: #000000 !important;' : ''}">${this.getBorsaName(arb.tradingPath.name)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p><span class="${arb.id % 2 === 0 ? 'y-orange' : 'y-blue'}" style="font-size: 0.875rem">${arb.id % 2 === 0 ? 'TRY Trio' : 'USDT Trio'}</span></p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${arb.orders[0]?.lot || 0}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${(arb.orders[0]?.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${arb.orders[1]?.lot || 0}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${(arb.orders[1]?.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${arb.orders[2]?.lot || 0}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${(arb.orders[2]?.price || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">%${(arb.realizedReturnRatio * 100).toFixed(2).replace('.', ',')}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${arb.realizedReturn.toFixed(2).replace('.', ',')}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${this.calculateCommission(arb).toFixed(2).replace('.', ',')}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">%${this.calculateNetMargin(arb).toFixed(2).replace('.', ',')}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${this.calculateNetProfit(arb).toFixed(2).replace('.', ',')}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${(arb.totalDurationUs / 1000000).toFixed(2)} sn</p>
                </td>
            </tr>
        `;
    }

    getBorsaClass(tradingPath) {
        const borsaMap = {
            'BtcTürk': 'y-red',
            'Paribu': 'y-black',
            'Icrypex': 'y-purple',
            'Bitexen': 'y-yellow',
            'Bitci': 'y-brown',
            'LINK-UNI-USDT': 'y-red',
            'DOT-ATOM-USDT': 'y-yellow',
            'XRP-LTC-USDT': 'y-purple'
        };
        return borsaMap[tradingPath] || 'y-black';
    }
    
    getBorsaName(tradingPath) {
        const borsaMap = {
            'BTC-ETH-USDT': 'BtcTürk',
            'ETH-BTC-USDT': 'Paribu',
            'ADA-BTC-USDT': 'Icrypex',
            'DOGE-SOL-USDT': 'Bitci',
            'MATIC-AVAX-USDT': 'Bitexen',
            'LINK-UNI-USDT': 'LINK-UNI-USDT',
            'DOT-ATOM-USDT': 'DOT-ATOM-USDT',
            'XRP-LTC-USDT': 'XRP-LTC-USDT'
        };
        return borsaMap[tradingPath] || tradingPath;
    }
    
    calculateCommission(arb) {
        return arb.initialCapital * 0.002; // Örnek komisyon oranı %0.2
    }
    
    calculateNetMargin(arb) {
        const commission = this.calculateCommission(arb);
        const netProfit = arb.realizedReturn - commission;
        return (netProfit / arb.initialCapital) * 100;
    }
    
    calculateNetProfit(arb) {
        const commission = this.calculateCommission(arb);
        return arb.realizedReturn - commission;
    }

    exportToExcel() {
        const filteredArbitrages = this.filterArbitrages();
        
        // Excel için veri hazırla
        const excelData = [
            ['Tarih', 'Saat', 'Borsa', 'Yön', 'Lot 1', 'Fiyat 1', 'Lot 2', 'Fiyat 2', 'Lot 3', 'Fiyat 3', 'Brüt Kar Marjı', 'Brüt Kar', 'Komisyon', 'Net Kar Marjı', 'Net Kar', 'Süre']
        ];

        filteredArbitrages.forEach(arb => {
            const date = new Date(arb.dateAdded);
            const formattedDate = date.toLocaleDateString('tr-TR').replace(/\./g, '-');
            const formattedTime = date.toLocaleTimeString('tr-TR');
            
            excelData.push([
                formattedDate,
                formattedTime,
                this.getBorsaName(arb.tradingPath.name),
                arb.id % 2 === 0 ? 'TRY Trio' : 'USDT Trio',
                arb.orders[0]?.lot || 0,
                (arb.orders[0]?.price || 0).toFixed(2),
                arb.orders[1]?.lot || 0,
                (arb.orders[1]?.price || 0).toFixed(2),
                arb.orders[2]?.lot || 0,
                (arb.orders[2]?.price || 0).toFixed(2),
                `${(arb.realizedReturnRatio * 100).toFixed(2)}%`,
                arb.realizedReturn.toFixed(2),
                this.calculateCommission(arb).toFixed(2),
                `${this.calculateNetMargin(arb).toFixed(2)}%`,
                this.calculateNetProfit(arb).toFixed(2),
                `${(arb.totalDurationUs / 1000000).toFixed(2)} sn`
            ]);
        });

        // CSV formatına çevir
        const csvContent = excelData.map(row => 
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        // Dosya indir
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `gunluk_islem_dokumu.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }



    // Statik metodlar - global erişim için
    static showDetails(arbitrageId) {
        console.log('Arbitrage detayları gösteriliyor:', arbitrageId);
        // Modal implementasyonu burada olacak
        alert(`Arbitrage ID: ${arbitrageId} detayları gösterilecek`);
    }

    static showOrders(arbitrageId) {
        console.log('Arbitrage siparişleri gösteriliyor:', arbitrageId);
        // Modal implementasyonu burada olacak
        alert(`Arbitrage ID: ${arbitrageId} siparişleri gösterilecek`);
    }

    static showChart(arbitrageId) {
        console.log('Arbitrage grafiği gösteriliyor:', arbitrageId);
        // Chart implementasyonu burada olacak
        alert(`Arbitrage ID: ${arbitrageId} grafiği gösterilecek`);
    }

    static duplicate(arbitrageId) {
        console.log('Arbitrage kopyalanıyor:', arbitrageId);
        // Kopyalama implementasyonu burada olacak
        alert(`Arbitrage ID: ${arbitrageId} kopyalanacak`);
    }

    static refreshData() {
        console.log('Veriler yenileniyor...');
        // Yenileme implementasyonu burada olacak
        alert('Veriler yenileniyor...');
    }

    static exportData() {
        console.log('Veriler dışa aktarılıyor...');
        // Dışa aktarma implementasyonu burada olacak
        alert('Veriler dışa aktarılıyor...');
    }

    // SignalR entegrasyonu için metod
    updateData(newData) {
        this.arbitrages = newData.map(item => new Arbitrage(item));
        this.render();
    }
}

// Global erişim için
window.ArbitrageWidget = ArbitrageWidget; 

// Widget'ı otomatik başlat
document.addEventListener('DOMContentLoaded', () => {
    console.log('ArbitrageWidget yükleniyor...');
    try {
        const container = document.getElementById('arbitrage-widget-container');
        if (!container) {
            console.error('Container bulunamadı! Yeni container oluşturuluyor...');
            const newContainer = document.createElement('div');
            newContainer.id = 'arbitrage-widget-container';
            document.body.appendChild(newContainer);
        }
        
        if (!window.arbitrageWidgetInstance) {
            console.log('Yeni widget instance oluşturuluyor...');
            window.arbitrageWidgetInstance = new ArbitrageWidget('arbitrage-widget-container');
        }
    } catch (error) {
        console.error('Widget başlatılırken hata:', error);
    }
});

// Panel tıklama olayını dinle
document.addEventListener('DOMContentLoaded', () => {
    const panel = document.querySelector('#arbitrage-panel'); // Panel ID'sini doğru şekilde ayarlayın
    if (panel) {
        panel.addEventListener('click', () => {
            if (!window.arbitrageWidgetInstance) {
                window.arbitrageWidgetInstance = new ArbitrageWidget('arbitrage-widget-container');
            }
        });
    }
}); 