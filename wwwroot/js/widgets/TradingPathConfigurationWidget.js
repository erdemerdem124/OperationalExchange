/**
 * TradingPathConfiguration Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { TradingPathConfiguration } from '../models.js/TradingPathConfiguration.js';

export class TradingPathConfigurationWidget {
    constructor(containerId = 'trading-path-configuration-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.configurations = [];
        this.filters = {
            tradingPathId: '',
            status: '',
            riskLevel: '',
            aggressiveness: '',
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
        this.configurations = TradingPathConfiguration.getSampleData();
        console.log('TradingPathConfiguration sample data loaded:', this.configurations);
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
        const searchInput = this.container.querySelector('#searchTradingPathConfigurations');
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
        const refreshBtn = this.container.querySelector('#refreshTradingPathConfigurations');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni configuration butonu
        const addBtn = this.container.querySelector('#addTradingPathConfiguration');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddTradingPathConfigurationModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            tradingPathId: '',
            status: '',
            riskLevel: '',
            aggressiveness: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchTradingPathConfigurations');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterConfigurations() {
        return this.configurations.filter(config => {
            // Trading path ID filtresi
            if (this.filters.tradingPathId && this.filters.tradingPathId !== '') {
                if (config.tradingPathId.toString() !== this.filters.tradingPathId) return false;
            }

            // Status filtresi
            if (this.filters.status && this.filters.status !== '') {
                if (this.filters.status === 'active' && !config.isActiveConfiguration()) return false;
                if (this.filters.status === 'disabled' && !config.isDisabled()) return false;
                if (this.filters.status === 'locked' && !config.isLockedConfiguration()) return false;
            }

            // Risk level filtresi
            if (this.filters.riskLevel && this.filters.riskLevel !== '') {
                if (config.getRiskLevel() !== this.filters.riskLevel) return false;
            }

            // Agresiflik filtresi
            if (this.filters.aggressiveness && this.filters.aggressiveness !== '') {
                if (config.getAggressivenessLevel() !== this.filters.aggressiveness) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${config.tradingPathId} ${config.getVolumeAssetName()} ${config.getTargetReturnPercentage()} ${config.getRiskLevel()} ${config.getAggressivenessLevel()} ${config.getPerformanceLevel()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredConfigurations = this.filterConfigurations();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-3">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Path ID</label>
                                    <input type="number" class="form-control" data-filter="tradingPathId" 
                                           placeholder="Path ID...">
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
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Risk</label>
                                    <select class="form-select" data-filter="riskLevel">
                                        <option value="">Tümü</option>
                                        <option value="Düşük">Düşük</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Yüksek">Yüksek</option>
                                        <option value="Çok Yüksek">Çok Yüksek</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Agresiflik</label>
                                    <select class="form-select" data-filter="aggressiveness">
                                        <option value="">Tümü</option>
                                        <option value="Konservatif">Konservatif</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Agresif">Agresif</option>
                                        <option value="Çok Agresif">Çok Agresif</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Arama</label>
                                    <input type="text" class="form-control" id="searchTradingPathConfigurations" 
                                           placeholder="Path ID, asset veya performans ara...">
                                </div>
                                <div class="col-md-1">
                                    <div class="d-flex gap-2 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshTradingPathConfigurations" class="btn btn-primary">
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
                                    <h5 class="card-title text-primary">Toplam Config</h5>
                                    <h3 class="text-primary">${filteredConfigurations.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Aktif</h5>
                                    <h3 class="text-success">${filteredConfigurations.filter(c => c.isActiveConfiguration()).length}</h3>
                                    <small class="text-muted">Çalışan config'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Yüksek Risk</h5>
                                    <h3 class="text-warning">${filteredConfigurations.filter(c => c.getRiskLevel() === 'Yüksek' || c.getRiskLevel() === 'Çok Yüksek').length}</h3>
                                    <small class="text-muted">Yüksek riskli</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-danger">
                                <div class="card-body">
                                    <h5 class="card-title text-danger">Agresif</h5>
                                    <h3 class="text-danger">${filteredConfigurations.filter(c => c.getAggressivenessLevel() === 'Agresif' || c.getAggressivenessLevel() === 'Çok Agresif').length}</h3>
                                    <small class="text-muted">Agresif config'ler</small>
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
                                    <h5 class="card-title text-dark">Ort. Performans</h5>
                                    <h3 class="text-dark">${this.getAveragePerformanceScore().toFixed(0)}</h3>
                                    <small class="text-muted">Ortalama skor</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Trading Path Configuration Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-cogs"></i> Trading Path Configuration Listesi
                            </h5>
                            <button id="addTradingPathConfiguration" class="btn btn-success">
                                <i class="fas fa-plus"></i> Yeni Configuration
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Path ID</th>
                                            <th>Volume Asset</th>
                                            <th>Target Return</th>
                                            <th>Execution Limit</th>
                                            <th>Risk & Agresiflik</th>
                                            <th>Hız & Güvenlik</th>
                                            <th>Performans</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredConfigurations.length === 0 ? 
                                            '<tr><td colspan="10" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredConfigurations.map(config => this.renderConfigurationRow(config)).join('')
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

    renderConfigurationRow(config) {
        const statusClass = config.isActiveConfiguration() ? 'bg-success' : config.isLockedConfiguration() ? 'bg-warning' : 'bg-danger';
        const statusText = config.getDisabledReason();
        const riskClass = config.getRiskBadgeClass();
        const aggressivenessClass = config.getAggressivenessBadgeClass();
        const speedClass = config.getSpeedBadgeClass();
        const securityClass = config.getSecurityBadgeClass();
        const performanceClass = config.getPerformanceBadgeClass();
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${config.id}</strong>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge bg-info">Path ${config.tradingPathId}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${config.getVolumeAssetName()}</strong>
                        <br><small class="text-muted">Max: ${config.maximumTradeVolumeAmount}</small>
                    </div>
                </td>
                <td>
                    <div class="text-success">
                        <strong>${config.getTargetReturnPercentage().toFixed(2)}%</strong>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${config.executionLimit.toLocaleString()}</strong>
                        <br><small class="text-muted">${config.getVolumeAssetName()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${riskClass}">${config.getRiskLevel()}</span>
                        <br><span class="badge ${aggressivenessClass}">${config.getAggressivenessLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${speedClass}">${config.getSpeedLevel()}</span>
                        <br><span class="badge ${securityClass}">${config.getSecurityLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${performanceClass}">${config.getPerformanceScore()}</span>
                        <br><small class="text-muted">${config.getPerformanceLevel()}</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="TradingPathConfigurationWidget.showConfigurationDetails(${config.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="TradingPathConfigurationWidget.editConfiguration(${config.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="TradingPathConfigurationWidget.analyzeConfiguration(${config.id})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="TradingPathConfigurationWidget.optimizeConfiguration(${config.id})">
                            <i class="fas fa-magic"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageTargetReturn() {
        if (this.configurations.length === 0) return 0;
        const totalReturn = this.configurations.reduce((sum, config) => {
            return sum + config.getTargetReturnPercentage();
        }, 0);
        return totalReturn / this.configurations.length;
    }

    getAveragePerformanceScore() {
        if (this.configurations.length === 0) return 0;
        const totalScore = this.configurations.reduce((sum, config) => {
            return sum + config.getPerformanceScore();
        }, 0);
        return totalScore / this.configurations.length;
    }

    showAddTradingPathConfigurationModal() {
        console.log('Yeni trading path configuration ekleme modalı');
        alert('Yeni trading path configuration ekleme özelliği yakında eklenecek');
    }

    static showConfigurationDetails(configId) {
        console.log('Configuration detayları:', configId);
        alert(`Configuration ID: ${configId} detayları yakında eklenecek`);
    }

    static editConfiguration(configId) {
        console.log('Configuration düzenleme:', configId);
        alert(`Configuration ID: ${configId} düzenleme yakında eklenecek`);
    }

    static analyzeConfiguration(configId) {
        console.log('Configuration analizi:', configId);
        alert(`Configuration ID: ${configId} analizi yakında eklenecek`);
    }

    static optimizeConfiguration(configId) {
        console.log('Configuration optimizasyonu:', configId);
        alert(`Configuration ID: ${configId} optimizasyonu yakında eklenecek`);
    }

    updateData(newData) {
        this.configurations = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingPathConfigurationWidget = TradingPathConfigurationWidget;
} 