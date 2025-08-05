/**
 * Pair Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Pair } from '../models.js/Pair.js';

export class PairWidget {
    constructor(containerId = 'pair-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.pairs = [];
        this.filters = {
            pairName: '',
            context: '',
            tradingFeeLevel: '',
            exchangeName: '',
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
        this.pairs = Pair.getSampleData();
        console.log('Pair sample data loaded:', this.pairs);
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
        const searchInput = this.container.querySelector('#searchPairs');
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
        const refreshBtn = this.container.querySelector('#refreshPairs');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni pair butonu
        const addBtn = this.container.querySelector('#addPair');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddPairModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            pairName: '',
            context: '',
            tradingFeeLevel: '',
            exchangeName: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchPairs');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterPairs() {
        return this.pairs.filter(pair => {
            // Pair adı filtresi
            if (this.filters.pairName && this.filters.pairName !== '') {
                if (!pair.toString().toLowerCase().includes(this.filters.pairName.toLowerCase())) {
                    return false;
                }
            }

            // Context filtresi
            if (this.filters.context && this.filters.context !== '') {
                if (pair.context !== this.filters.context) return false;
            }

            // Trading fee level filtresi
            if (this.filters.tradingFeeLevel && this.filters.tradingFeeLevel !== '') {
                if (pair.tradingFeeLevel !== this.filters.tradingFeeLevel) return false;
            }

            // Exchange adı filtresi
            if (this.filters.exchangeName && this.filters.exchangeName !== '') {
                if (!pair.exchange?.name.toLowerCase().includes(this.filters.exchangeName.toLowerCase())) {
                    return false;
                }
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${pair.toString()} ${pair.exchange?.name || ''} ${pair.getContextName()} ${pair.getTradingFeeLevelName()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredPairs = this.filterPairs();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Pair</label>
                                    <input type="text" class="form-control form-control-sm" data-filter="pairName" 
                                           placeholder="Pair adı ara...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Context</label>
                                    <select class="form-select form-select-sm" data-filter="context">
                                        <option value="">Tümü</option>
                                        <option value="Spot">Spot</option>
                                        <option value="Futures">Futures</option>
                                        <option value="Options">Options</option>
                                        <option value="Margin">Margin</option>
                                        <option value="OTC">OTC</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Fee Level</label>
                                    <select class="form-select form-select-sm" data-filter="tradingFeeLevel">
                                        <option value="">Tümü</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="VIP">VIP</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Exchange</label>
                                    <input type="text" class="form-control form-control-sm" data-filter="exchangeName" 
                                           placeholder="Exchange adı ara...">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchPairs" 
                                           placeholder="Pair, exchange, context veya fee level ara...">
                                </div>
                                <div class="col-md-1">
                                    <div class="d-flex gap-1 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i>
                                        </button>
                                        <button id="refreshPairs" class="btn btn-primary btn-sm">
                                            <i class="fas fa-sync-alt"></i>
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
                                    <h5 class="card-title text-primary">Toplam Pair</h5>
                                    <h3 class="text-primary">${filteredPairs.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Aktif</h5>
                                    <h3 class="text-success">${filteredPairs.filter(p => p.isActive).length}</h3>
                                    <small class="text-muted">Trading'de</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Spot</h5>
                                    <h3 class="text-warning">${filteredPairs.filter(p => p.context === 'Spot').length}</h3>
                                    <small class="text-muted">Spot trading</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Futures</h5>
                                    <h3 class="text-info">${filteredPairs.filter(p => p.context === 'Futures').length}</h3>
                                    <small class="text-muted">Vadeli işlemler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Ortalama Fee</h5>
                                    <h3 class="text-secondary">${this.getAverageFee().toFixed(3)}%</h3>
                                    <small class="text-muted">Taker fee</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Exchange'ler</h5>
                                    <h3 class="text-dark">${this.getUniqueExchanges().length}</h3>
                                    <small class="text-muted">Farklı borsa</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Pair Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-exchange-alt"></i> Pair Listesi
                            </h5>
                            <button id="addPair" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Pair
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Pair</th>
                                            <th>Exchange</th>
                                            <th>Context</th>
                                            <th>Fee Level</th>
                                            <th>Taker/Maker Fee</th>
                                            <th>Min/Max Order</th>
                                            <th>Precision</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredPairs.length === 0 ? 
                                            '<tr><td colspan="9" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredPairs.map(pair => this.renderPairRow(pair)).join('')
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

    renderPairRow(pair) {
        return `
            <tr>
                <td>
                    <div>
                        <strong>${pair.asset1?.name || 'Unknown'}/${pair.asset2?.name || 'Unknown'}</strong>
                        <br><small class="text-muted">ID: ${pair.id}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-info">${pair.exchange?.name || 'Unknown'}</span>
                </td>
                <td>
                    <span class="badge ${pair.getContextBadgeClass()}">${pair.getContextName()}</span>
                </td>
                <td>
                    <span class="badge ${pair.getTradingFeeLevelBadgeClass()}">${pair.getTradingFeeLevelName()}</span>
                </td>
                <td>
                    <div>
                        <small class="text-danger">Taker: ${pair.getTakerFeePercentage().toFixed(4)}%</small>
                        <br><small class="text-success">Maker: ${pair.getMakerFeePercentage().toFixed(4)}%</small>
                    </div>
                </td>
                <td>
                    <div>
                        <small>Min: ${pair.getMinimumOrderAmountFormatted()}</small>
                        <br><small>Max: ${pair.getMaximumOrderAmountFormatted()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <small>Lot: ${pair.lotDigit}</small>
                        <br><small>Price: ${pair.priceDigit}</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${pair.getStatusBadgeClass()}">${pair.getStatusText()}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="PairWidget.showPairDetails(${pair.getHash()})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="PairWidget.editPair(${pair.getHash()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="PairWidget.configurePair(${pair.getHash()})">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="PairWidget.activatePair(${pair.getHash()})">
                            <i class="fas fa-toggle-on"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageFee() {
        if (this.pairs.length === 0) return 0;
        const totalFee = this.pairs.reduce((sum, pair) => {
            return sum + pair.getTakerFeePercentage();
        }, 0);
        return totalFee / this.pairs.length;
    }

    getUniqueExchanges() {
        const exchanges = new Set();
        this.pairs.forEach(pair => {
            if (pair.exchange?.name) {
                exchanges.add(pair.exchange.name);
            }
        });
        return Array.from(exchanges);
    }

    showAddPairModal() {
        console.log('Yeni pair ekleme modalı');
        alert('Yeni pair ekleme özelliği yakında eklenecek');
    }

    static showPairDetails(pairHash) {
        console.log('Pair detayları:', pairHash);
        alert(`Pair Hash: ${pairHash} detayları yakında eklenecek`);
    }

    static editPair(pairHash) {
        console.log('Pair düzenleme:', pairHash);
        alert(`Pair Hash: ${pairHash} düzenleme yakında eklenecek`);
    }

    static configurePair(pairHash) {
        console.log('Pair konfigürasyon:', pairHash);
        alert(`Pair Hash: ${pairHash} konfigürasyon yakında eklenecek`);
    }

    static activatePair(pairHash) {
        console.log('Pair aktivasyon:', pairHash);
        alert(`Pair Hash: ${pairHash} aktivasyon yakında eklenecek`);
    }

    updateData(newData) {
        this.pairs = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.PairWidget = PairWidget;
} 