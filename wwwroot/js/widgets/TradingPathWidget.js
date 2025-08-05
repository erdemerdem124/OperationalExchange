/**
 * TradingPath Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { TradingPath } from '../models.js/TradingPath.js';

export class TradingPathWidget {
    constructor(containerId = 'trading-path-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.tradingPaths = [];
        this.filters = {
            groupId: '',
            status: '',
            complexity: '',
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
        this.tradingPaths = TradingPath.getSampleData();
        console.log('TradingPath sample data loaded:', this.tradingPaths);
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
        const searchInput = this.container.querySelector('#searchTradingPaths');
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
        const refreshBtn = this.container.querySelector('#refreshTradingPaths');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni trading path butonu
        const addBtn = this.container.querySelector('#addTradingPath');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddTradingPathModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            groupId: '',
            status: '',
            complexity: '',
            riskLevel: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchTradingPaths');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterTradingPaths() {
        return this.tradingPaths.filter(path => {
            // Group ID filtresi
            if (this.filters.groupId && this.filters.groupId !== '') {
                if (path.tradingPathGroupId.toString() !== this.filters.groupId) return false;
            }

            // Status filtresi
            if (this.filters.status && this.filters.status !== '') {
                if (this.filters.status === 'active' && !path.isActivePath()) return false;
                if (this.filters.status === 'disabled' && !path.isDisabled()) return false;
                if (this.filters.status === 'locked' && !path.isLockedPath()) return false;
            }

            // Complexity filtresi
            if (this.filters.complexity && this.filters.complexity !== '') {
                if (path.getComplexityLevel() !== this.filters.complexity) return false;
            }

            // Risk level filtresi
            if (this.filters.riskLevel && this.filters.riskLevel !== '') {
                if (path.getRiskLevel() !== this.filters.riskLevel) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${path.friendlyName} ${path.getExchanges().join(' ')} ${path.getAssets().join(' ')} ${path.getComplexityLevel()} ${path.getRiskLevel()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredTradingPaths = this.filterTradingPaths();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-3">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Group ID</label>
                                    <input type="number" class="form-control" data-filter="groupId" 
                                           placeholder="Group ID...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Durum</label>
                                    <select class="form-select" data-filter="status">
                                        <option value="">Tümü</option>
                                        <option value="active">Aktif</option>
                                        <option value="disabled">Devre Dışı</option>
                                        <option value="locked">Kilitli</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Karmaşıklık</label>
                                    <select class="form-select" data-filter="complexity">
                                        <option value="">Tümü</option>
                                        <option value="Basit">Basit</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Karmaşık">Karmaşık</option>
                                        <option value="Çok Karmaşık">Çok Karmaşık</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Risk</label>
                                    <select class="form-select" data-filter="riskLevel">
                                        <option value="">Tümü</option>
                                        <option value="Düşük">Düşük</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Yüksek">Yüksek</option>
                                        <option value="Çok Yüksek">Çok Yüksek</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Arama</label>
                                    <input type="text" class="form-control" id="searchTradingPaths" 
                                           placeholder="Path adı, exchange veya asset ara...">
                                </div>
                                <div class="col-md-1">
                                    <div class="d-flex gap-2 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshTradingPaths" class="btn btn-primary">
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
                                    <h5 class="card-title text-primary">Toplam Path</h5>
                                    <h3 class="text-primary">${filteredTradingPaths.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Aktif</h5>
                                    <h3 class="text-success">${filteredTradingPaths.filter(p => p.isActivePath()).length}</h3>
                                    <small class="text-muted">Çalışan path'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Karmaşık</h5>
                                    <h3 class="text-warning">${filteredTradingPaths.filter(p => p.getComplexityLevel() === 'Karmaşık' || p.getComplexityLevel() === 'Çok Karmaşık').length}</h3>
                                    <small class="text-muted">Karmaşık path'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-danger">
                                <div class="card-body">
                                    <h5 class="card-title text-danger">Yüksek Risk</h5>
                                    <h3 class="text-danger">${filteredTradingPaths.filter(p => p.getRiskLevel() === 'Yüksek' || p.getRiskLevel() === 'Çok Yüksek').length}</h3>
                                    <small class="text-muted">Yüksek riskli</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ort. Return</h5>
                                    <h3 class="text-info">${this.getAverageTargetReturn().toFixed(2)}%</h3>
                                    <small class="text-muted">Ortalama hedef</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Ort. Steps</h5>
                                    <h3 class="text-dark">${this.getAverageSteps().toFixed(1)}</h3>
                                    <small class="text-muted">Ortalama adım</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trading Path Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-route"></i> Trading Path Listesi
                            </h5>
                            <button id="addTradingPath" class="btn btn-success">
                                <i class="fas fa-plus"></i> Yeni Trading Path
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Path Adı</th>
                                            <th>Group</th>
                                            <th>Steps</th>
                                            <th>Exchanges</th>
                                            <th>Assets</th>
                                            <th>Target Return</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredTradingPaths.length === 0 ? 
                                            '<tr><td colspan="9" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredTradingPaths.map(path => this.renderTradingPathRow(path)).join('')
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

    renderTradingPathRow(path) {
        const statusClass = path.isActivePath() ? 'bg-success' : path.isLockedPath() ? 'bg-warning' : 'bg-danger';
        const statusText = path.getDisabledReason();
        const complexityClass = this.getComplexityBadgeClass(path.getComplexityLevel());
        const riskClass = this.getRiskBadgeClass(path.getRiskLevel());
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${path.id}</strong>
                        <br><small class="text-muted">Hash: ${path.getHash()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${path.friendlyName}</strong>
                        <br><small class="text-muted">${path.getDateAddedFormatted()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge bg-info">Group ${path.tradingPathGroupId}</span>
                        <br><small class="text-muted">ID: ${path.tradingPathGroupId}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${path.getTotalSteps()}</strong>
                        <br><span class="badge ${complexityClass}">${path.getComplexityLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <small>${path.getExchanges().join(', ')}</small>
                        <br><span class="badge ${riskClass}">${path.getRiskLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <small>${path.getAssets().join(', ')}</small>
                    </div>
                </td>
                <td>
                    <div class="text-success">
                        <strong>${path.getTargetReturnPercentage().toFixed(2)}%</strong>
                        <br><small class="text-muted">${path.minimumOrderInUsd}$ min</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="TradingPathWidget.showTradingPathDetails(${path.getHash()})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="TradingPathWidget.editTradingPath(${path.getHash()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="TradingPathWidget.analyzeTradingPath(${path.getHash()})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="TradingPathWidget.executeTradingPath(${path.getHash()})">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getComplexityBadgeClass(complexity) {
        switch(complexity) {
            case 'Basit': return 'bg-success';
            case 'Orta': return 'bg-info';
            case 'Karmaşık': return 'bg-warning';
            case 'Çok Karmaşık': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    getRiskBadgeClass(risk) {
        switch(risk) {
            case 'Düşük': return 'bg-success';
            case 'Orta': return 'bg-warning';
            case 'Yüksek': return 'bg-danger';
            case 'Çok Yüksek': return 'bg-dark';
            default: return 'bg-secondary';
        }
    }

    getAverageTargetReturn() {
        if (this.tradingPaths.length === 0) return 0;
        const totalReturn = this.tradingPaths.reduce((sum, path) => {
            return sum + path.getTargetReturnPercentage();
        }, 0);
        return totalReturn / this.tradingPaths.length;
    }

    getAverageSteps() {
        if (this.tradingPaths.length === 0) return 0;
        const totalSteps = this.tradingPaths.reduce((sum, path) => {
            return sum + path.getTotalSteps();
        }, 0);
        return totalSteps / this.tradingPaths.length;
    }

    showAddTradingPathModal() {
        console.log('Yeni trading path ekleme modalı');
        alert('Yeni trading path ekleme özelliği yakında eklenecek');
    }

    static showTradingPathDetails(pathHash) {
        console.log('Trading path detayları:', pathHash);
        alert(`Trading Path Hash: ${pathHash} detayları yakında eklenecek`);
    }

    static editTradingPath(pathHash) {
        console.log('Trading path düzenleme:', pathHash);
        alert(`Trading Path Hash: ${pathHash} düzenleme yakında eklenecek`);
    }

    static analyzeTradingPath(pathHash) {
        console.log('Trading path analizi:', pathHash);
        alert(`Trading Path Hash: ${pathHash} analizi yakında eklenecek`);
    }

    static executeTradingPath(pathHash) {
        console.log('Trading path yürütme:', pathHash);
        alert(`Trading Path Hash: ${pathHash} yürütme yakında eklenecek`);
    }

    updateData(newData) {
        this.tradingPaths = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingPathWidget = TradingPathWidget;
} 