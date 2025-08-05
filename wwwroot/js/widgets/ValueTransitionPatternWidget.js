/**
 * ValueTransitionPattern Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { ValueTransitionPattern } from '../models.js/ValueTransitionPattern.js';

export class ValueTransitionPatternWidget {
    constructor(containerId = 'value-transition-pattern-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.patterns = [];
        this.filters = {
            complexity: '',
            riskLevel: '',
            completionStatus: '',
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
        this.patterns = ValueTransitionPattern.getSampleData();
        console.log('ValueTransitionPattern sample data loaded:', this.patterns);
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
        const searchInput = this.container.querySelector('#searchValueTransitionPatterns');
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
        const refreshBtn = this.container.querySelector('#refreshValueTransitionPatterns');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni pattern butonu
        const addBtn = this.container.querySelector('#addValueTransitionPattern');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddValueTransitionPatternModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            complexity: '',
            riskLevel: '',
            completionStatus: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchValueTransitionPatterns');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterPatterns() {
        return this.patterns.filter(pattern => {
            // Karmaşıklık filtresi
            if (this.filters.complexity && this.filters.complexity !== '') {
                if (pattern.complexityLevel !== this.filters.complexity) return false;
            }

            // Risk level filtresi
            if (this.filters.riskLevel && this.filters.riskLevel !== '') {
                if (pattern.riskLevel !== this.filters.riskLevel) return false;
            }

            // Tamamlanma durumu filtresi
            if (this.filters.completionStatus && this.filters.completionStatus !== '') {
                if (this.filters.completionStatus === 'complete' && !pattern.isValid) return false;
                if (this.filters.completionStatus === 'incomplete' && pattern.isValid) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${pattern.complexityLevel} ${pattern.riskLevel} ${pattern.performanceLevel} ${pattern.totalTransitionCount} ${pattern.parallelTransitionCount}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredPatterns = this.filterPatterns();
        
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
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Durum</label>
                                    <select class="form-select" data-filter="completionStatus">
                                        <option value="">Tümü</option>
                                        <option value="complete">Tamamlanmış</option>
                                        <option value="incomplete">Eksik</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label text-white mb-2" style="font-size: 1.2rem;">Arama</label>
                                    <input type="text" class="form-control" id="searchValueTransitionPatterns" 
                                           placeholder="Karmaşıklık, risk veya performans ara...">
                                </div>
                                <div class="col-md-2">
                                    <div class="d-flex gap-2 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshValueTransitionPatterns" class="btn btn-primary">
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
                                    <h5 class="card-title text-primary">Toplam Pattern</h5>
                                    <h3 class="text-primary">${filteredPatterns.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Tamamlanmış</h5>
                                    <h3 class="text-success">${filteredPatterns.filter(p => p.isValid).length}</h3>
                                    <small class="text-muted">Geçerli pattern'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Karmaşık</h5>
                                    <h3 class="text-warning">${filteredPatterns.filter(p => p.complexityLevel === 'Karmaşık' || p.complexityLevel === 'Çok Karmaşık').length}</h3>
                                    <small class="text-muted">Karmaşık pattern'ler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-danger">
                                <div class="card-body">
                                    <h5 class="card-title text-danger">Yüksek Risk</h5>
                                    <h3 class="text-danger">${filteredPatterns.filter(p => p.riskLevel === 'Yüksek' || p.riskLevel === 'Çok Yüksek').length}</h3>
                                    <small class="text-muted">Yüksek riskli</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ort. Chain</h5>
                                    <h3 class="text-info">${this.getAverageChainCount().toFixed(1)}</h3>
                                    <small class="text-muted">Ortalama chain</small>
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

                <!-- Value Transition Pattern Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-project-diagram"></i> Value Transition Pattern Listesi
                            </h5>
                            <button id="addValueTransitionPattern" class="btn btn-success">
                                <i class="fas fa-plus"></i> Yeni Pattern
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Pattern Detayları</th>
                                            <th>Chain & Transition</th>
                                            <th>Tamamlanma Durumu</th>
                                            <th>Karmaşıklık & Risk</th>
                                            <th>Performans</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredPatterns.length === 0 ? 
                                            '<tr><td colspan="8" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredPatterns.map((pattern, index) => this.renderPatternRow(pattern, index)).join('')
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

    renderPatternRow(pattern, index) {
        const complexityClass = pattern.getComplexityBadgeClass();
        const riskClass = pattern.getRiskBadgeClass();
        const performanceClass = pattern.getPerformanceBadgeClass();
        const statusClass = pattern.isValid ? 'bg-success' : 'bg-danger';
        const statusText = pattern.isValid ? 'Geçerli' : 'Geçersiz';
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${index + 1}</strong>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>Pattern ${index + 1}</strong>
                        <br><small class="text-muted">${pattern.totalTransitionCount} transition</small>
                        <br><small class="text-muted">${pattern.parallelTransitionCount} paralel chain</small>
                    </div>
                </td>
                <td>
                    <div>
                        <strong>${pattern.tradingChains.length} Chain</strong>
                        <br><small class="text-muted">${pattern.completeTradingChains.length} tamamlanmış</small>
                        <br><small class="text-muted">${pattern.incompleteTradingChains.length} eksik</small>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${statusClass}">${statusText}</span>
                        <br><small class="text-muted">${pattern.completeTradingChains.length}/${pattern.tradingChains.length}</small>
                        <br><small class="text-muted">${((pattern.completeTradingChains.length / Math.max(pattern.tradingChains.length, 1)) * 100).toFixed(1)}%</small>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${complexityClass}">${pattern.complexityLevel}</span>
                        <br><span class="badge ${riskClass}">${pattern.riskLevel}</span>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${performanceClass}">${pattern.performanceScore}</span>
                        <br><small class="text-muted">${pattern.performanceLevel}</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="ValueTransitionPatternWidget.showPatternDetails(${index})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="ValueTransitionPatternWidget.editPattern(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="ValueTransitionPatternWidget.analyzePattern(${index})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="ValueTransitionPatternWidget.optimizePattern(${index})">
                            <i class="fas fa-magic"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageChainCount() {
        if (this.patterns.length === 0) return 0;
        const totalChains = this.patterns.reduce((sum, pattern) => {
            return sum + pattern.tradingChains.length;
        }, 0);
        return totalChains / this.patterns.length;
    }

    getAveragePerformanceScore() {
        if (this.patterns.length === 0) return 0;
        const totalScore = this.patterns.reduce((sum, pattern) => {
            return sum + pattern.performanceScore;
        }, 0);
        return totalScore / this.patterns.length;
    }

    showAddValueTransitionPatternModal() {
        console.log('Yeni value transition pattern ekleme modalı');
        alert('Yeni value transition pattern ekleme özelliği yakında eklenecek');
    }

    static showPatternDetails(patternIndex) {
        console.log('Pattern detayları:', patternIndex);
        alert(`Pattern ${patternIndex + 1} detayları yakında eklenecek`);
    }

    static editPattern(patternIndex) {
        console.log('Pattern düzenleme:', patternIndex);
        alert(`Pattern ${patternIndex + 1} düzenleme yakında eklenecek`);
    }

    static analyzePattern(patternIndex) {
        console.log('Pattern analizi:', patternIndex);
        alert(`Pattern ${patternIndex + 1} analizi yakında eklenecek`);
    }

    static optimizePattern(patternIndex) {
        console.log('Pattern optimizasyonu:', patternIndex);
        alert(`Pattern ${patternIndex + 1} optimizasyonu yakında eklenecek`);
    }

    updateData(newData) {
        this.patterns = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.ValueTransitionPatternWidget = ValueTransitionPatternWidget;
} 