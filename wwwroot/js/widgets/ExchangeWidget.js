/**
 * Exchange Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Exchange } from '../models.js/Exchange.js';

export class ExchangeWidget {
    constructor(containerId = 'exchange-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.exchanges = [];
        this.filters = {
            exchangeType: '',
            context: '',
            isActive: '',
            riskLevel: '',
            search: ''
        };
        
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
        this.exchanges = Exchange.getSampleData();
        console.log('Exchange sample data loaded:', this.exchanges);
    }

    setupEventListeners() {
        // Filtre event listener'ları
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.addEventListener('change', (e) => {
                this.filters[e.target.dataset.filter] = e.target.value;
                this.render();
            });
        });

        // Arama event listener'ı
        const searchInput = this.container.querySelector('#searchExchanges');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.render();
            });
        }

        // Temizle butonu
        const clearBtn = this.container.querySelector('#clear-filters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Yenile butonu
        const refreshBtn = this.container.querySelector('#refreshExchanges');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni exchange butonu
        const addBtn = this.container.querySelector('#addExchange');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddExchangeModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            exchangeType: '',
            context: '',
            isActive: '',
            riskLevel: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchExchanges');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterExchanges() {
        return this.exchanges.filter(exchange => {
            // Exchange tipi filtresi
            if (this.filters.exchangeType && exchange.exchangeType !== this.filters.exchangeType) {
                return false;
            }

            // Context filtresi
            if (this.filters.context && exchange.context !== this.filters.context) {
                return false;
            }

            // Aktiflik filtresi
            if (this.filters.isActive && this.filters.isActive !== '') {
                const isActive = this.filters.isActive === 'true';
                if (exchange.isActive !== isActive) return false;
            }

            // Risk seviyesi filtresi
            if (this.filters.riskLevel && this.filters.riskLevel !== '') {
                const riskLevel = this.filters.riskLevel;
                const exchangeRisk = exchange.getRiskLevel().level;
                if (riskLevel !== exchangeRisk) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${exchange.name} ${exchange.exchangeType} ${exchange.context} ${exchange.blockchain?.name || ''}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredExchanges = this.filterExchanges();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Exchange Tipi</label>
                                    <select class="form-select form-select-sm" data-filter="exchangeType">
                                        <option value="">Tümü</option>
                                        <option value="CEX">CEX</option>
                                        <option value="DEX">DEX</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">İşlem Tipi</label>
                                    <select class="form-select form-select-sm" data-filter="context">
                                        <option value="">Tümü</option>
                                        <option value="Spot">Spot</option>
                                        <option value="Futures">Vadeli İşlemler</option>
                                        <option value="Margin">Marjin</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Durum</label>
                                    <select class="form-select form-select-sm" data-filter="isActive">
                                        <option value="">Tümü</option>
                                        <option value="true">Aktif</option>
                                        <option value="false">Pasif</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Risk Seviyesi</label>
                                    <select class="form-select form-select-sm" data-filter="riskLevel">
                                        <option value="">Tümü</option>
                                        <option value="Düşük">Düşük</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Yüksek">Yüksek</option>
                                        <option value="Çok Yüksek">Çok Yüksek</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchExchanges" 
                                           placeholder="Exchange adı veya tip ara...">
                                </div>
                                <div class="col-md-2">
                                    <div class="d-flex gap-1">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshExchanges" class="btn btn-primary btn-sm">
                                            <i class="fas fa-sync-alt"></i> Yenile
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- İstatistikler -->
                <div class="statistics-section mb-4">
                    <div class="row">
                        <div class="col-md-2">
                            <div class="card text-center border-primary">
                                <div class="card-body">
                                    <h5 class="card-title text-primary">Toplam Exchange</h5>
                                    <h3 class="text-primary">${filteredExchanges.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Aktif</h5>
                                    <h3 class="text-success">${filteredExchanges.filter(e => e.isActive).length}</h3>
                                    <small class="text-muted">Çalışan borsalar</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">CEX</h5>
                                    <h3 class="text-warning">${filteredExchanges.filter(e => e.exchangeType === 'CEX').length}</h3>
                                    <small class="text-muted">Merkezi borsalar</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">DEX</h5>
                                    <h3 class="text-info">${filteredExchanges.filter(e => e.exchangeType === 'DEX').length}</h3>
                                    <small class="text-muted">Merkezi olmayan</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Spot</h5>
                                    <h3 class="text-secondary">${filteredExchanges.filter(e => e.context === 'Spot').length}</h3>
                                    <small class="text-muted">Anlık işlemler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Futures</h5>
                                    <h3 class="text-dark">${filteredExchanges.filter(e => e.context === 'Futures').length}</h3>
                                    <small class="text-muted">Vadeli işlemler</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Exchange Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-exchange-alt"></i> Exchange Listesi
                            </h5>
                            <button id="addExchange" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Exchange
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Exchange</th>
                                            <th>Tip</th>
                                            <th>İşlem Tipi</th>
                                            <th>Risk</th>
                                            <th>Durum</th>
                                            <th>Blockchain</th>
                                            <th>Son Güncelleme</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredExchanges.length === 0 ? 
                                            '<tr><td colspan="8" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredExchanges.map(exchange => this.renderExchangeRow(exchange)).join('')
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderExchangeRow(exchange) {
        const riskLevel = exchange.getRiskLevel();
        const activeStatus = exchange.getActiveStatus();
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="exchange-icon me-2">
                            <i class="fas ${exchange.getExchangeIcon()}"></i>
                        </div>
                        <div>
                            <strong>${exchange.name}</strong>
                            ${exchange.isCurrencyConvertor ? '<br><small class="text-info">Para Dönüştürücü</small>' : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${exchange.getExchangeTypeBadgeClass()}">
                        ${exchange.getExchangeTypeName()}
                    </span>
                </td>
                <td>
                    <span class="badge ${exchange.getTradeContextBadgeClass()}">
                        ${exchange.getTradeContextName()}
                    </span>
                </td>
                <td>
                    <span class="badge ${riskLevel.class}">
                        ${riskLevel.level} (${exchange.riskFactor})
                    </span>
                </td>
                <td>
                    <span class="badge ${activeStatus.class}">
                        ${activeStatus.status}
                    </span>
                </td>
                <td>
                    ${exchange.blockchain ? 
                        `<span class="badge bg-secondary">${exchange.blockchain.name}</span>` : 
                        '<span class="text-muted">-</span>'
                    }
                </td>
                <td>
                    ${exchange.dateAdded ? new Date(exchange.dateAdded).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="ExchangeWidget.showExchangeDetails(${exchange.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="ExchangeWidget.editExchange(${exchange.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="ExchangeWidget.deleteExchange(${exchange.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    showAddExchangeModal() {
        console.log('Yeni exchange ekleme modalı');
        alert('Yeni exchange ekleme özelliği yakında eklenecek');
    }

    static showExchangeDetails(exchangeId) {
        console.log('Exchange detayları:', exchangeId);
        alert(`Exchange ID: ${exchangeId} detayları yakında eklenecek`);
    }

    static editExchange(exchangeId) {
        console.log('Exchange düzenleme:', exchangeId);
        alert(`Exchange ID: ${exchangeId} düzenleme yakında eklenecek`);
    }

    static deleteExchange(exchangeId) {
        if (confirm('Bu exchange\'i silmek istediğinizden emin misiniz?')) {
            console.log('Exchange silme:', exchangeId);
            alert(`Exchange ID: ${exchangeId} silme yakında eklenecek`);
        }
    }

    updateData(newData) {
        this.exchanges = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.ExchangeWidget = ExchangeWidget;
} 