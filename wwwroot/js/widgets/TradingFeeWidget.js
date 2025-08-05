/**
 * TradingFee Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { TradingFee } from '../models.js/TradingFee.js';

export class TradingFeeWidget {
    constructor(containerId = 'trading-fee-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.tradingFees = [];
        this.filters = {
            exchangeName: '',
            feeType: '',
            tier: '',
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
        this.tradingFees = TradingFee.getSampleData();
        console.log('TradingFee sample data loaded:', this.tradingFees);
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
        const searchInput = this.container.querySelector('#searchTradingFees');
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
        const refreshBtn = this.container.querySelector('#refreshTradingFees');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni trading fee butonu
        const addBtn = this.container.querySelector('#addTradingFee');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddTradingFeeModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            exchangeName: '',
            feeType: '',
            tier: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchTradingFees');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterTradingFees() {
        return this.tradingFees.filter(fee => {
            // Exchange adı filtresi
            if (this.filters.exchangeName && this.filters.exchangeName !== '') {
                if (!fee.getExchangeName().toLowerCase().includes(this.filters.exchangeName.toLowerCase())) {
                    return false;
                }
            }

            // Fee tip filtresi
            if (this.filters.feeType && this.filters.feeType !== '') {
                if (this.filters.feeType === 'maker' && fee.getAverageMakerFee() === 0) return false;
                if (this.filters.feeType === 'taker' && fee.getAverageTakerFee() === 0) return false;
            }

            // Tier filtresi
            if (this.filters.tier && this.filters.tier !== '') {
                if (this.filters.tier === 'vip' && !fee.isVip()) return false;
                if (this.filters.tier === 'premium' && !fee.isPremium()) return false;
                if (this.filters.tier === 'standard' && (fee.isVip() || fee.isPremium())) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${fee.getExchangeName()} ${fee.getPrimaryMakerFeePercentage()} ${fee.getPrimaryTakerFeePercentage()} ${fee.getAverageMakerFee()} ${fee.getAverageTakerFee()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredTradingFees = this.filterTradingFees();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-3">
                            <div class="row align-items-end">
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Exchange</label>
                                    <input type="text" class="form-control" data-filter="exchangeName" 
                                           placeholder="Exchange adı ara...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Fee Tipi</label>
                                    <select class="form-select" data-filter="feeType">
                                        <option value="">Tümü</option>
                                        <option value="maker">Maker</option>
                                        <option value="taker">Taker</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Tier</label>
                                    <select class="form-select" data-filter="tier">
                                        <option value="">Tümü</option>
                                        <option value="vip">VIP</option>
                                        <option value="premium">Premium</option>
                                        <option value="standard">Standard</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Arama</label>
                                    <input type="text" class="form-control" id="searchTradingFees" 
                                           placeholder="Exchange, fee rate veya tier ara...">
                                </div>
                                <div class="col-md-2">
                                    <div class="d-flex gap-2 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshTradingFees" class="btn btn-primary">
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
                                    <h5 class="card-title text-primary">Toplam Fee</h5>
                                    <h3 class="text-primary">${filteredTradingFees.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">VIP</h5>
                                    <h3 class="text-success">${filteredTradingFees.filter(f => f.isVip()).length}</h3>
                                    <small class="text-muted">Düşük fee'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Premium</h5>
                                    <h3 class="text-warning">${filteredTradingFees.filter(f => f.isPremium()).length}</h3>
                                    <small class="text-muted">Orta fee'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ort. Maker</h5>
                                    <h3 class="text-info">${this.getAverageMakerFee().toFixed(4)}%</h3>
                                    <small class="text-muted">Ortalama maker</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Ort. Taker</h5>
                                    <h3 class="text-secondary">${this.getAverageTakerFee().toFixed(4)}%</h3>
                                    <small class="text-muted">Ortalama taker</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Aktif</h5>
                                    <h3 class="text-dark">${filteredTradingFees.filter(f => f.isActive()).length}</h3>
                                    <small class="text-muted">Aktif exchange'ler</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trading Fee Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-percentage"></i> Trading Fee Listesi
                            </h5>
                            <button id="addTradingFee" class="btn btn-success">
                                <i class="fas fa-plus"></i> Yeni Trading Fee
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Exchange</th>
                                            <th>Primary Maker</th>
                                            <th>Primary Taker</th>
                                            <th>Secondary</th>
                                            <th>Tertiary</th>
                                            <th>Ortalama</th>
                                            <th>Tier</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredTradingFees.length === 0 ? 
                                            '<tr><td colspan="9" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredTradingFees.map(fee => this.renderTradingFeeRow(fee)).join('')
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

    renderTradingFeeRow(fee) {
        const tierClass = fee.isVip() ? 'bg-success' : fee.isPremium() ? 'bg-warning' : 'bg-secondary';
        const tierText = fee.isVip() ? 'VIP' : fee.isPremium() ? 'Premium' : 'Standard';
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${fee.id}</strong>
                        <br><small class="text-muted">Hash: ${fee.getHash()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${fee.getExchangeName()}</strong>
                        <br><small class="text-muted">${fee.getDateAddedFormatted()}</small>
                    </div>
                </td>
                <td>
                    <div class="text-success">
                        <strong>${fee.getPrimaryMakerFeePercentage().toFixed(4)}%</strong>
                        <br><small class="text-muted">${fee.primaryMakerFeeRate.toFixed(6)}</small>
                    </div>
                </td>
                <td>
                    <div class="text-danger">
                        <strong>${fee.getPrimaryTakerFeePercentage().toFixed(4)}%</strong>
                        <br><small class="text-muted">${fee.primaryTakerFeeRate.toFixed(6)}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <small class="text-success">Maker: ${fee.getSecondaryMakerFeePercentage().toFixed(4)}%</small>
                        <br><small class="text-danger">Taker: ${fee.getSecondaryTakerFeePercentage().toFixed(4)}%</small>
                    </div>
                </td>
                <td>
                    <div>
                        <small class="text-success">Maker: ${fee.getTertiaryMakerFeePercentage().toFixed(4)}%</small>
                        <br><small class="text-danger">Taker: ${fee.getTertiaryTakerFeePercentage().toFixed(4)}%</small>
                    </div>
                </td>
                <td>
                    <div>
                        <small class="text-success">Maker: ${fee.getAverageMakerFee().toFixed(4)}%</small>
                        <br><small class="text-danger">Taker: ${fee.getAverageTakerFee().toFixed(4)}%</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${tierClass}">${tierText}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="TradingFeeWidget.showTradingFeeDetails(${fee.getHash()})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="TradingFeeWidget.editTradingFee(${fee.getHash()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="TradingFeeWidget.analyzeTradingFee(${fee.getHash()})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="TradingFeeWidget.configureTradingFee(${fee.getHash()})">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageMakerFee() {
        if (this.tradingFees.length === 0) return 0;
        const totalFee = this.tradingFees.reduce((sum, fee) => {
            return sum + fee.getAverageMakerFee();
        }, 0);
        return (totalFee / this.tradingFees.length) * 100;
    }

    getAverageTakerFee() {
        if (this.tradingFees.length === 0) return 0;
        const totalFee = this.tradingFees.reduce((sum, fee) => {
            return sum + fee.getAverageTakerFee();
        }, 0);
        return (totalFee / this.tradingFees.length) * 100;
    }

    showAddTradingFeeModal() {
        console.log('Yeni trading fee ekleme modalı');
        alert('Yeni trading fee ekleme özelliği yakında eklenecek');
    }

    static showTradingFeeDetails(feeHash) {
        console.log('Trading fee detayları:', feeHash);
        alert(`Trading Fee Hash: ${feeHash} detayları yakında eklenecek`);
    }

    static editTradingFee(feeHash) {
        console.log('Trading fee düzenleme:', feeHash);
        alert(`Trading Fee Hash: ${feeHash} düzenleme yakında eklenecek`);
    }

    static analyzeTradingFee(feeHash) {
        console.log('Trading fee analizi:', feeHash);
        alert(`Trading Fee Hash: ${feeHash} analizi yakında eklenecek`);
    }

    static configureTradingFee(feeHash) {
        console.log('Trading fee konfigürasyon:', feeHash);
        alert(`Trading Fee Hash: ${feeHash} konfigürasyon yakında eklenecek`);
    }

    updateData(newData) {
        this.tradingFees = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingFeeWidget = TradingFeeWidget;
} 