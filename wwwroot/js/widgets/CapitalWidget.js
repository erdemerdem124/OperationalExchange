/**
 * Capital Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Capital } from '../models.js/Capital.js';
import { Asset } from '../models.js/Asset.js';

export class CapitalWidget {
    constructor(containerId = 'capital-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.capitals = [];
        this.filters = {
            currencyType: '',
            minAmount: '',
            maxAmount: '',
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
        this.capitals = Capital.getSampleData();
        console.log('Capital sample data loaded:', this.capitals);
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
        const searchInput = this.container.querySelector('#searchCapitals');
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
        const refreshBtn = this.container.querySelector('#refreshCapitals');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni capital butonu
        const addBtn = this.container.querySelector('#addCapital');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddCapitalModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            currencyType: '',
            minAmount: '',
            maxAmount: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchCapitals');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterCapitals() {
        return this.capitals.filter(capital => {
            // Para birimi tipi filtresi
            if (this.filters.currencyType) {
                if (this.filters.currencyType === 'fiat' && !Asset.isFiatCurrency(capital.currency)) return false;
                if (this.filters.currencyType === 'stablecoin' && !Asset.isStableCoin(capital.currency)) return false;
                if (this.filters.currencyType === 'crypto' && (Asset.isFiatCurrency(capital.currency) || Asset.isStableCoin(capital.currency))) return false;
            }

            // Min miktar filtresi
            if (this.filters.minAmount && this.filters.minAmount !== '') {
                const minAmount = parseFloat(this.filters.minAmount);
                if (capital.amount < minAmount) return false;
            }

            // Max miktar filtresi
            if (this.filters.maxAmount && this.filters.maxAmount !== '') {
                const maxAmount = parseFloat(this.filters.maxAmount);
                if (capital.amount > maxAmount) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${capital.currency.name} ${capital.amount} ${capital.currency.assetType || ''}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredCapitals = this.filterCapitals();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Para Birimi Tipi</label>
                                    <select class="form-select form-select-sm" data-filter="currencyType">
                                        <option value="">Tümü</option>
                                        <option value="fiat">Fiat Para</option>
                                        <option value="stablecoin">Stablecoin</option>
                                        <option value="crypto">Kripto</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Min Miktar</label>
                                    <input type="number" class="form-control form-control-sm" data-filter="minAmount" placeholder="0.00">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchCapitals" 
                                           placeholder="Para birimi veya miktar ara...">
                                </div>
                                <div class="col-md-3">
                                    <div class="d-flex gap-1">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshCapitals" class="btn btn-primary btn-sm">
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
                                    <h5 class="card-title text-primary">Toplam Capital</h5>
                                    <h3 class="text-primary">${filteredCapitals.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Toplam USD Değeri</h5>
                                    <h3 class="text-success">${this.getTotalUsdValue(filteredCapitals).toFixed(2)} USD</h3>
                                    <small class="text-muted">Tüm sermayeler</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Fiat Para</h5>
                                    <h3 class="text-warning">${filteredCapitals.filter(c => Asset.isFiatCurrency(c.currency)).length}</h3>
                                    <small class="text-muted">USD, EUR, TRY</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Stablecoin</h5>
                                    <h3 class="text-info">${filteredCapitals.filter(c => Asset.isStableCoin(c.currency)).length}</h3>
                                    <small class="text-muted">USDT, USDC</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Kripto</h5>
                                    <h3 class="text-secondary">${filteredCapitals.filter(c => !Asset.isFiatCurrency(c.currency) && !Asset.isStableCoin(c.currency)).length}</h3>
                                    <small class="text-muted">BTC, ETH, BNB</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Ortalama</h5>
                                    <h3 class="text-dark">${this.getAverageAmount(filteredCapitals).toFixed(2)}</h3>
                                    <small class="text-muted">Miktar ortalaması</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Capital Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-coins"></i> Capital Listesi
                            </h5>
                            <button id="addCapital" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Capital
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Para Birimi</th>
                                            <th>Miktar</th>
                                            <th>Formatlanmış</th>
                                            <th>USD Karşılığı</th>
                                            <th>Tip</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredCapitals.length === 0 ? 
                                            '<tr><td colspan="7" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredCapitals.map(capital => this.renderCapitalRow(capital)).join('')
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

    renderCapitalRow(capital) {
        const usdEquivalent = capital.getUsdEquivalent();
        const isPositive = capital.isPositive();
        const isZero = capital.isZero();
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="currency-icon me-2">
                            <i class="fas ${this.getCurrencyIcon(capital.currency)}"></i>
                        </div>
                        <div>
                            <strong>${capital.currency.name}</strong>
                            <br><small class="text-muted">${this.getCurrencyTypeName(capital.currency)}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="fw-bold ${isPositive ? 'text-success' : isZero ? 'text-muted' : 'text-danger'}">
                        ${capital.amount.toFixed(8)}
                    </span>
                </td>
                <td>
                    <span class="text-info">${capital.getFormattedAmount()}</span>
                </td>
                <td>
                    <span class="text-success">$${usdEquivalent.toFixed(2)}</span>
                </td>
                <td>
                    <span class="badge ${this.getCurrencyTypeBadgeClass(capital.currency)}">
                        ${this.getCurrencyTypeName(capital.currency)}
                    </span>
                </td>
                <td>
                    <span class="badge ${isPositive ? 'bg-success' : isZero ? 'bg-secondary' : 'bg-danger'}">
                        ${isPositive ? 'Pozitif' : isZero ? 'Sıfır' : 'Negatif'}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="CapitalWidget.showCapitalDetails('${capital.currency.name}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="CapitalWidget.editCapital('${capital.currency.name}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="CapitalWidget.deleteCapital('${capital.currency.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getCurrencyIcon(currency) {
        if (Asset.isFiatCurrency(currency)) return 'fa-dollar-sign';
        if (Asset.isStableCoin(currency)) return 'fa-coins';
        if (currency.name === 'BTC') return 'fa-bitcoin';
        if (currency.name === 'ETH') return 'fa-ethereum';
        if (currency.name === 'BNB') return 'fa-coins';
        return 'fa-coins';
    }

    getCurrencyTypeName(currency) {
        if (Asset.isFiatCurrency(currency)) return 'Fiat';
        if (Asset.isStableCoin(currency)) return 'Stablecoin';
        return 'Kripto';
    }

    getCurrencyTypeBadgeClass(currency) {
        if (Asset.isFiatCurrency(currency)) return 'bg-success';
        if (Asset.isStableCoin(currency)) return 'bg-warning';
        return 'bg-info';
    }

    getTotalUsdValue(capitals) {
        return capitals.reduce((total, capital) => {
            return total + capital.getUsdEquivalent();
        }, 0);
    }

    getAverageAmount(capitals) {
        if (capitals.length === 0) return 0;
        const total = capitals.reduce((sum, capital) => sum + capital.amount, 0);
        return total / capitals.length;
    }

    showAddCapitalModal() {
        console.log('Yeni capital ekleme modalı');
        alert('Yeni capital ekleme özelliği yakında eklenecek');
    }

    static showCapitalDetails(currencyName) {
        console.log('Capital detayları:', currencyName);
        alert(`Capital ${currencyName} detayları yakında eklenecek`);
    }

    static editCapital(currencyName) {
        console.log('Capital düzenleme:', currencyName);
        alert(`Capital ${currencyName} düzenleme yakında eklenecek`);
    }

    static deleteCapital(currencyName) {
        if (confirm(`Bu capital (${currencyName})'i silmek istediğinizden emin misiniz?`)) {
            console.log('Capital silme:', currencyName);
            alert(`Capital ${currencyName} silme yakında eklenecek`);
        }
    }

    updateData(newData) {
        this.capitals = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.CapitalWidget = CapitalWidget;
} 