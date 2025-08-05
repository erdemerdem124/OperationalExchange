/**
 * TradingPathGroup Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { TradingPathGroup } from '../models.js/TradingPathGroup.js';

export class TradingPathGroupWidget {
    constructor(containerId = 'trading-path-group-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.tradingPathGroups = [];
        this.filters = {
            complexity: '',
            riskLevel: '',
            speedLevel: '',
            securityLevel: '',
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
        this.tradingPathGroups = TradingPathGroup.getSampleData();
        console.log('TradingPathGroup sample data loaded:', this.tradingPathGroups);
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
        const searchInput = this.container.querySelector('#searchTradingPathGroups');
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
        const refreshBtn = this.container.querySelector('#refreshTradingPathGroups');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni group butonu
        const addBtn = this.container.querySelector('#addTradingPathGroup');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddTradingPathGroupModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            complexity: '',
            riskLevel: '',
            speedLevel: '',
            securityLevel: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchTradingPathGroups');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterTradingPathGroups() {
        return this.tradingPathGroups.filter(group => {
            // Karmaşıklık filtresi
            if (this.filters.complexity && this.filters.complexity !== '') {
                if (group.getComplexityLevel() !== this.filters.complexity) return false;
            }

            // Risk level filtresi
            if (this.filters.riskLevel && this.filters.riskLevel !== '') {
                if (group.getRiskLevel() !== this.filters.riskLevel) return false;
            }

            // Hız level filtresi
            if (this.filters.speedLevel && this.filters.speedLevel !== '') {
                if (group.getSpeedLevel() !== this.filters.speedLevel) return false;
            }

            // Güvenlik level filtresi
            if (this.filters.securityLevel && this.filters.securityLevel !== '') {
                if (group.getSecurityLevel() !== this.filters.securityLevel) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${group.id} ${group.userFriendlyString} ${group.uniqueInputString} ${group.getComplexityLevel()} ${group.getRiskLevel()} ${group.getSpeedLevel()} ${group.getSecurityLevel()} ${group.getPerformanceLevel()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredGroups = this.filterTradingPathGroups();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-3">
                            <div class="row align-items-end">
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
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Hız</label>
                                    <select class="form-select" data-filter="speedLevel">
                                        <option value="">Tümü</option>
                                        <option value="Anında">Anında</option>
                                        <option value="Hızlı">Hızlı</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Yavaş">Yavaş</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Güvenlik</label>
                                    <select class="form-select" data-filter="securityLevel">
                                        <option value="">Tümü</option>
                                        <option value="Çok Güvenli">Çok Güvenli</option>
                                        <option value="Güvenli">Güvenli</option>
                                        <option value="Orta">Orta</option>
                                        <option value="Riskli">Riskli</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Arama</label>
                                    <input type="text" class="form-control" id="searchTradingPathGroups" 
                                           placeholder="Group adı, asset veya performans ara...">
                                </div>
                                <div class="col-md-1">
                                    <div class="d-flex gap-2 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshTradingPathGroups" class="btn btn-primary">
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
                                    <h5 class="card-title text-primary">Toplam Group</h5>
                                    <h3 class="text-primary">${filteredGroups.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Aktif</h5>
                                    <h3 class="text-success">${filteredGroups.filter(g => g.isActiveGroup()).length}</h3>
                                    <small class="text-muted">Çalışan gruplar</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Karmaşık</h5>
                                    <h3 class="text-warning">${filteredGroups.filter(g => g.getComplexityLevel() === 'Karmaşık' || g.getComplexityLevel() === 'Çok Karmaşık').length}</h3>
                                    <small class="text-muted">Karmaşık gruplar</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-danger">
                                <div class="card-body">
                                    <h5 class="card-title text-danger">Yüksek Risk</h5>
                                    <h3 class="text-danger">${filteredGroups.filter(g => g.getRiskLevel() === 'Yüksek' || g.getRiskLevel() === 'Çok Yüksek').length}</h3>
                                    <small class="text-muted">Yüksek riskli</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ort. Exchange</h5>
                                    <h3 class="text-info">${this.getAverageExchangeCount().toFixed(1)}</h3>
                                    <small class="text-muted">Ortalama exchange</small>
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

                <!-- Trading Path Group Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-layer-group"></i> Trading Path Group Listesi
                            </h5>
                            <button id="addTradingPathGroup" class="btn btn-success">
                                <i class="fas fa-plus"></i> Yeni Group
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Group Adı</th>
                                            <th>Assets & Exchanges</th>
                                            <th>Limitler (USD)</th>
                                            <th>Timing (ms)</th>
                                            <th>Karmaşıklık & Risk</th>
                                            <th>Hız & Güvenlik</th>
                                            <th>Performans</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredGroups.length === 0 ? 
                                            '<tr><td colspan="10" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredGroups.map(group => this.renderGroupRow(group)).join('')
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

    renderGroupRow(group) {
        const complexityClass = this.getComplexityBadgeClass(group.getComplexityLevel());
        const riskClass = group.getRiskBadgeClass();
        const speedClass = group.getSpeedBadgeClass();
        const securityClass = group.getSecurityBadgeClass();
        const performanceClass = group.getPerformanceBadgeClass();
        const statusClass = group.isActiveGroup() ? 'bg-success' : 'bg-danger';
        const statusText = group.isActiveGroup() ? 'Aktif' : 'Pasif';
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${group.id}</strong>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${group.userFriendlyString}</strong>
                        <br><small class="text-muted">${group.uniqueInputString}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${group.getAssetCount()} Asset</strong>
                        <br><small class="text-muted">${group.getExchangeCount()} Exchange</small>
                        <br><small class="text-muted">${group.startingAsset?.name || 'N/A'} → ${group.finishingAsset?.name || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>$${group.maxOrderAmountUSD.toLocaleString()}</strong>
                        <br><small class="text-muted">Min: $${group.minOrderAmountUSD}</small>
                        <br><small class="text-muted">Limit: $${group.moneyLimitUSD.toLocaleString()}</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${group.orderDelayMs}ms</strong>
                        <br><small class="text-muted">Inter: ${group.interArbitrageDelayMs}ms</small>
                        <br><small class="text-muted">Life: ${group.opportunityLifeSpanThresholdMs}ms</small>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${complexityClass}">${group.getComplexityLevel()}</span>
                        <br><span class="badge ${riskClass}">${group.getRiskLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${speedClass}">${group.getSpeedLevel()}</span>
                        <br><span class="badge ${securityClass}">${group.getSecurityLevel()}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${performanceClass}">${group.getPerformanceScore()}</span>
                        <br><small class="text-muted">${group.getPerformanceLevel()}</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="TradingPathGroupWidget.showGroupDetails(${group.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="TradingPathGroupWidget.editGroup(${group.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="TradingPathGroupWidget.analyzeGroup(${group.id})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="TradingPathGroupWidget.optimizeGroup(${group.id})">
                            <i class="fas fa-magic"></i>
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

    getAverageExchangeCount() {
        if (this.tradingPathGroups.length === 0) return 0;
        const totalExchanges = this.tradingPathGroups.reduce((sum, group) => {
            return sum + group.getExchangeCount();
        }, 0);
        return totalExchanges / this.tradingPathGroups.length;
    }

    getAveragePerformanceScore() {
        if (this.tradingPathGroups.length === 0) return 0;
        const totalScore = this.tradingPathGroups.reduce((sum, group) => {
            return sum + group.getPerformanceScore();
        }, 0);
        return totalScore / this.tradingPathGroups.length;
    }

    showAddTradingPathGroupModal() {
        console.log('Yeni trading path group ekleme modalı');
        alert('Yeni trading path group ekleme özelliği yakında eklenecek');
    }

    static showGroupDetails(groupId) {
        console.log('Group detayları:', groupId);
        alert(`Group ID: ${groupId} detayları yakında eklenecek`);
    }

    static editGroup(groupId) {
        console.log('Group düzenleme:', groupId);
        alert(`Group ID: ${groupId} düzenleme yakında eklenecek`);
    }

    static analyzeGroup(groupId) {
        console.log('Group analizi:', groupId);
        alert(`Group ID: ${groupId} analizi yakında eklenecek`);
    }

    static optimizeGroup(groupId) {
        console.log('Group optimizasyonu:', groupId);
        alert(`Group ID: ${groupId} optimizasyonu yakında eklenecek`);
    }

    updateData(newData) {
        this.tradingPathGroups = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.TradingPathGroupWidget = TradingPathGroupWidget;
} 