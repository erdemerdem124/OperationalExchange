/**
 * Quote Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Quote } from '../models.js/Quote.js';

export class QuoteWidget {
    constructor(containerId = 'quote-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.quotes = [];
        this.filters = {
            minPrice: '',
            maxPrice: '',
            minSpread: '',
            maxSpread: '',
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
        this.quotes = Quote.getSampleData();
        console.log('Quote sample data loaded:', this.quotes);
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
        const searchInput = this.container.querySelector('#searchQuotes');
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
        const refreshBtn = this.container.querySelector('#refreshQuotes');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni quote butonu
        const addBtn = this.container.querySelector('#addQuote');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddQuoteModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            minPrice: '',
            maxPrice: '',
            minSpread: '',
            maxSpread: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchQuotes');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterQuotes() {
        return this.quotes.filter(quote => {
            // Minimum fiyat filtresi
            if (this.filters.minPrice && this.filters.minPrice !== '') {
                const minPrice = parseFloat(this.filters.minPrice);
                if (quote.lastPrice < minPrice) return false;
            }

            // Maximum fiyat filtresi
            if (this.filters.maxPrice && this.filters.maxPrice !== '') {
                const maxPrice = parseFloat(this.filters.maxPrice);
                if (quote.lastPrice > maxPrice) return false;
            }

            // Minimum spread filtresi
            if (this.filters.minSpread && this.filters.minSpread !== '') {
                const minSpread = parseFloat(this.filters.minSpread);
                if (!quote.spread || quote.spread < minSpread) return false;
            }

            // Maximum spread filtresi
            if (this.filters.maxSpread && this.filters.maxSpread !== '') {
                const maxSpread = parseFloat(this.filters.maxSpread);
                if (!quote.spread || quote.spread > maxSpread) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${quote.askPrice} ${quote.bidPrice} ${quote.lastPrice} ${quote.spread} ${quote.midPrice}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredQuotes = this.filterQuotes();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Min Fiyat</label>
                                    <input type="number" step="0.00000001" class="form-control form-control-sm" data-filter="minPrice" 
                                           placeholder="Min fiyat...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Max Fiyat</label>
                                    <input type="number" step="0.00000001" class="form-control form-control-sm" data-filter="maxPrice" 
                                           placeholder="Max fiyat...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Min Spread</label>
                                    <input type="number" step="0.00000001" class="form-control form-control-sm" data-filter="minSpread" 
                                           placeholder="Min spread...">
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Max Spread</label>
                                    <input type="number" step="0.00000001" class="form-control form-control-sm" data-filter="maxSpread" 
                                           placeholder="Max spread...">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchQuotes" 
                                           placeholder="Fiyat, spread veya mid price ara...">
                                </div>
                                <div class="col-md-1">
                                    <div class="d-flex gap-1 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i>
                                        </button>
                                        <button id="refreshQuotes" class="btn btn-primary btn-sm">
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
                                    <h5 class="card-title text-primary">Toplam Quote</h5>
                                    <h3 class="text-primary">${filteredQuotes.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Geçerli</h5>
                                    <h3 class="text-success">${filteredQuotes.filter(q => q.isValid()).length}</h3>
                                    <small class="text-muted">Valid quotes</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Ortalama Spread</h5>
                                    <h3 class="text-warning">${this.getAverageSpread().toFixed(8)}</h3>
                                    <small class="text-muted">Fiyat farkı</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ortalama Mid</h5>
                                    <h3 class="text-info">${this.getAverageMidPrice().toFixed(8)}</h3>
                                    <small class="text-muted">Orta fiyat</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Min Spread</h5>
                                    <h3 class="text-secondary">${this.getMinSpread().toFixed(8)}</h3>
                                    <small class="text-muted">En düşük</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Max Spread</h5>
                                    <h3 class="text-dark">${this.getMaxSpread().toFixed(8)}</h3>
                                    <small class="text-muted">En yüksek</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quote Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-chart-line"></i> Quote Listesi
                            </h5>
                            <button id="addQuote" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Quote
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Ask Price/Size</th>
                                            <th>Bid Price/Size</th>
                                            <th>Last Price</th>
                                            <th>Spread</th>
                                            <th>Mid Price</th>
                                            <th>Spread %</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredQuotes.length === 0 ? 
                                            '<tr><td colspan="9" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredQuotes.map(quote => this.renderQuoteRow(quote)).join('')
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

    renderQuoteRow(quote) {
        const isValid = quote.isValid();
        const isStale = quote.isStale();
        
        return `
            <tr>
                <td>
                    <div>
                        <small>${quote.getTimestampFormatted()}</small>
                        <br><small class="text-muted">Hash: ${quote.getHash()}</small>
                    </div>
                </td>
                <td>
                    <div class="text-danger">
                        <strong>${quote.askPrice?.toFixed(8) || 'N/A'}</strong>
                        <br><small>Size: ${quote.askSize?.toFixed(8) || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div class="text-success">
                        <strong>${quote.bidPrice?.toFixed(8) || 'N/A'}</strong>
                        <br><small>Size: ${quote.bidSize?.toFixed(8) || 'N/A'}</small>
                    </div>
                </td>
                <td>
                    <div class="text-info">
                        <strong>${quote.lastPrice?.toFixed(8) || 'N/A'}</strong>
                    </div>
                </td>
                <td>
                    <div class="text-warning">
                        <strong>${quote.getSpreadFormatted()}</strong>
                    </div>
                </td>
                <td>
                    <div class="text-secondary">
                        <strong>${quote.getMidPriceFormatted()}</strong>
                    </div>
                </td>
                <td>
                    <div>
                        <span class="badge ${this.getSpreadPercentageBadgeClass(quote.spreadPercentage)}">
                            ${quote.spreadPercentage?.toFixed(4) || 'N/A'}%
                        </span>
                    </div>
                </td>
                <td>
                    <div>
                        ${isStale ? 
                            '<span class="badge bg-warning">Eski</span>' :
                            isValid ? 
                                '<span class="badge bg-success">Geçerli</span>' :
                                '<span class="badge bg-danger">Geçersiz</span>'
                        }
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="QuoteWidget.showQuoteDetails(${quote.getHash()})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="QuoteWidget.editQuote(${quote.getHash()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="QuoteWidget.analyzeQuote(${quote.getHash()})">
                            <i class="fas fa-chart-bar"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="QuoteWidget.exportQuote(${quote.getHash()})">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageSpread() {
        const validQuotes = this.quotes.filter(q => q.spread !== null);
        if (validQuotes.length === 0) return 0;
        const totalSpread = validQuotes.reduce((sum, quote) => sum + quote.spread, 0);
        return totalSpread / validQuotes.length;
    }

    getAverageMidPrice() {
        const validQuotes = this.quotes.filter(q => q.midPrice !== null);
        if (validQuotes.length === 0) return 0;
        const totalMidPrice = validQuotes.reduce((sum, quote) => sum + quote.midPrice, 0);
        return totalMidPrice / validQuotes.length;
    }

    getMinSpread() {
        const validQuotes = this.quotes.filter(q => q.spread !== null);
        if (validQuotes.length === 0) return 0;
        return Math.min(...validQuotes.map(q => q.spread));
    }

    getMaxSpread() {
        const validQuotes = this.quotes.filter(q => q.spread !== null);
        if (validQuotes.length === 0) return 0;
        return Math.max(...validQuotes.map(q => q.spread));
    }

    getSpreadPercentageBadgeClass(percentage) {
        if (!percentage) return 'bg-secondary';
        if (percentage < 0.01) return 'bg-success';
        if (percentage < 0.1) return 'bg-warning';
        return 'bg-danger';
    }

    showAddQuoteModal() {
        console.log('Yeni quote ekleme modalı');
        alert('Yeni quote ekleme özelliği yakında eklenecek');
    }

    static showQuoteDetails(quoteHash) {
        console.log('Quote detayları:', quoteHash);
        alert(`Quote Hash: ${quoteHash} detayları yakında eklenecek`);
    }

    static editQuote(quoteHash) {
        console.log('Quote düzenleme:', quoteHash);
        alert(`Quote Hash: ${quoteHash} düzenleme yakında eklenecek`);
    }

    static analyzeQuote(quoteHash) {
        console.log('Quote analizi:', quoteHash);
        alert(`Quote Hash: ${quoteHash} analizi yakında eklenecek`);
    }

    static exportQuote(quoteHash) {
        console.log('Quote export:', quoteHash);
        alert(`Quote Hash: ${quoteHash} export yakında eklenecek`);
    }

    updateData(newData) {
        this.quotes = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.QuoteWidget = QuoteWidget;
} 