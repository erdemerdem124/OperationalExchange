// ArbitrageOpportunity Widget - Modüler yapı için
// Umbraco content'te kullanılacak

import { ArbitrageOpportunity } from '../models.js/ArbitrageOpportunity.js';

export class ArbitrageOpportunityWidget {
    constructor(containerId = 'arbitrage-opportunity-widget-container', type = 'USDT') {
        this.containerId = containerId;
        this.type = type; // 'USDT' veya 'TRY'
        this.container = document.getElementById(containerId);
        
        console.log('ArbitrageOpportunityWidget constructor çağrıldı, container:', this.container, 'type:', this.type);
        
        // Container yoksa hata ver
        if (!this.container) {
            console.error('Container bulunamadı:', containerId);
            return;
        }
        
        // Widget zaten yüklenmişse tekrar yükleme
        if (window.arbitrageOpportunityWidgetLoaded) {
            console.log('Widget zaten yüklenmiş, tekrar yüklenmedi');
            return;
        }
        
        console.log('Yeni ArbitrageOpportunityWidget instance oluşturuluyor...');
        
        this.opportunities = [];
        this.filteredOpportunities = [];
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
            return;
        }

        console.log('Container bulundu, render başlıyor...');

        // Statik veri ile başlat (SignalR gelene kadar)
        this.loadSampleData();
        this.render();
        this.setupEventListeners();
        
        console.log('Widget başlatıldı');
    }

    loadSampleData() {
        this.opportunities = ArbitrageOpportunity.getSampleData(this.type);
        this.filteredOpportunities = [...this.opportunities];
        console.log(`${this.type} ArbitrageOpportunity sample data loaded:`, this.opportunities);
    }

    setupEventListeners() {
        // Filtreleme kaldırıldı - event listener'lar gerekli değil
    }

    clearFilters() {
        // Filtreleme kaldırıldı - bu metod artık gerekli değil
    }

    filterOpportunities() {
        // Filtreleme kaldırıldı - tüm verileri döndür
        return this.opportunities;
    }

    render() {
        const filteredOpportunities = this.opportunities; // Filtreleme kaldırıldı
        const title = this.type === 'TRY' ? 'TRY Fırsatlar' : 'USDT Fırsatlar';

        this.container.innerHTML = `
            <div class="arbitrage-opportunity-widget">
                <style>
                    #kripto-bist-vadeli-ters-firsatlar-table {
                        width: 100%;
                        border-collapse: collapse;
                        background-color: #1b5e20;
                        color: white;
                        border: none !important;
                    }
                    #kripto-bist-vadeli-ters-firsatlar-table th {
                        background-color: #1b5e20;
                        color: white;
                        font-weight: bold;
                        padding: 8px;
                        text-align: center;
                        border: none !important;
                        border-bottom: none !important;
                        border-top: none !important;
                        border-left: none !important;
                        border-right: none !important;
                    }
                    #kripto-bist-vadeli-ters-firsatlar-table td {
                        padding: 8px;
                        text-align: center;
                        border: none !important;
                        border-bottom: none !important;
                        border-top: none !important;
                        border-left: none !important;
                        border-right: none !important;
                        background-color: #2e7d32;
                    }
                    #kripto-bist-vadeli-ters-firsatlar-table tr {
                        border: none !important;
                        border-bottom: none !important;
                        border-top: none !important;
                        border-left: none !important;
                        border-right: none !important;
                    }
                    #kripto-bist-vadeli-ters-firsatlar-table tr:hover td {
                        background-color: #388e3c;
                    }
                    .y-orange {
                        color: #ffa726 !important;
                    }
                    .y-red {
                        color: #ef5350 !important;
                    }
                    .y-purple {
                        color: #ab47bc !important;
                    }
                    .y-brown {
                        color: #8d6e63 !important;
                    }
                    .y-yellow {
                        color: #ffee58 !important;
                    }
                    .y-black {
                        color: #ffffff !important;
                    }
                </style>
                            <div class="table-responsive">
                    <table id="kripto-bist-vadeli-ters-firsatlar-table" style="min-width: 250px; font-size: 0.875rem">
                        <colgroup>
                            ${Array(10).fill('<col style="min-width: 25px">').join('')}
                        </colgroup>
                        <tbody>
                            <tr>
                                ${[
                                    'BORSA', 'YÖN', 'LOT 1', 'FİYAT 1', 'LOT 2', 
                                    'FİYAT 2', 'LOT 3', 'FİYAT 3', 'BRÜT KAR MARJI', 'NET KAR MARJI'
                                ].map(header => `
                                    <th colspan="1" rowspan="1">
                                        <p class="text-white" style="font-size: 0.875rem">${header}</p>
                                    </th>
                                `).join('')}
                                        </tr>
                                        ${filteredOpportunities.length > 0 ? 
                                            filteredOpportunities.map(opp => this.renderOpportunityRow(opp)).join('') :
                                '<tr><td colspan="10" class="text-center text-muted py-4">Arbitrage fırsatı bulunamadı.</td></tr>'
                                        }
                                    </tbody>
                                </table>
                </div>
            </div>
        `;
    }

    renderOpportunityRow(opp) {
        return `
            <tr>
                <td colspan="1" rowspan="1">
                    <p class="${opp.getExchangeClass()}" style="font-size: 0.875rem; ${opp.exchange === 'Paribu' ? 'color: #000000 !important;' : ''}">${opp.exchange}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p><span class="${opp.type === 'TRY' ? 'y-orange' : 'y-blue'}" style="font-size: 0.875rem">${opp.direction}</span></p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.lot1}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.getFormattedPrice(opp.price1)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.lot2}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.getFormattedPrice(opp.price2)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.lot3}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.getFormattedPrice(opp.price3)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.getFormattedMargin(opp.grossProfitMargin)}</p>
                </td>
                <td colspan="1" rowspan="1">
                    <p class="text-white" style="font-size: 0.875rem">${opp.getFormattedMargin(opp.netProfitMargin)}</p>
                </td>
            </tr>
        `;
    }
    

    // Helper methods
    getAverageReturn(opportunities) {
        if (opportunities.length === 0) return '0.00';
        const total = opportunities.reduce((sum, opp) => sum + opp.expectedReturnRatio, 0);
        return ((total / opportunities.length) * 100).toFixed(4);
    }

    getAverageReturnClass(opportunities) {
        const avg = parseFloat(this.getAverageReturn(opportunities));
        return avg > 0 ? 'text-success' : 'text-danger';
    }

    getActiveRate(opportunities) {
        if (opportunities.length === 0) return '0.0';
        const active = opportunities.filter(opp => !opp.isExpired).length;
        return ((active / opportunities.length) * 100).toFixed(1);
    }

    getAverageLatency(opportunities) {
        if (opportunities.length === 0) return '0';
        const total = opportunities.reduce((sum, opp) => sum + opp.latency, 0);
        return Math.round(total / opportunities.length);
    }

    getTotalVolume(opportunities) {
        const total = opportunities.reduce((sum, opp) => sum + opp.usdVolume, 0);
        return total.toFixed(2);
    }

    // Static methods for global actions
    static showDetails(opportunityId) {
        console.log(`ArbitrageOpportunity detayları gösteriliyor: ${opportunityId}`);
        // TODO: Modal veya sayfa açma
    }

    static execute(opportunityId) {
        console.log(`ArbitrageOpportunity uygulanıyor: ${opportunityId}`);
        // TODO: Fırsatı uygulama
    }

    static showChart(opportunityId) {
        console.log(`ArbitrageOpportunity grafiği gösteriliyor: ${opportunityId}`);
        // TODO: Grafik gösterimi
    }

    static duplicate(opportunityId) {
        console.log(`ArbitrageOpportunity kopyalanıyor: ${opportunityId}`);
        // TODO: Kopyalama işlemi
    }

    static refreshData() {
        console.log('ArbitrageOpportunity verileri yenileniyor...');
        // TODO: SignalR ile veri yenileme
    }

    static exportData() {
        console.log('ArbitrageOpportunity verileri dışa aktarılıyor...');
        // TODO: CSV/Excel export
    }

    // SignalR entegrasyonu için
    updateData(newData) {
        this.opportunities = newData.map(item => new ArbitrageOpportunity({...item, type: this.type}));
        this.filteredOpportunities = [...this.opportunities];
        this.render();
    }
}

// Global erişim için
window.ArbitrageOpportunityWidget = ArbitrageOpportunityWidget; 

// Widget'ı otomatik başlat
document.addEventListener('DOMContentLoaded', () => {
    console.log('ArbitrageOpportunityWidget yükleniyor...');
    try {
        // USDT Fırsatlar için
        const usdtContainer = document.getElementById('usdt-opportunities-container');
        if (usdtContainer && !window.usdtOpportunityWidgetInstance) {
            console.log('USDT Opportunity Widget instance oluşturuluyor...');
            window.usdtOpportunityWidgetInstance = new ArbitrageOpportunityWidget('usdt-opportunities-container', 'USDT');
        }
        
        // TRY Fırsatlar için
        const tryContainer = document.getElementById('try-opportunities-container');
        if (tryContainer && !window.tryOpportunityWidgetInstance) {
            console.log('TRY Opportunity Widget instance oluşturuluyor...');
            window.tryOpportunityWidgetInstance = new ArbitrageOpportunityWidget('try-opportunities-container', 'TRY');
        }
    } catch (error) {
        console.error('Widget başlatılırken hata:', error);
    }
}); 