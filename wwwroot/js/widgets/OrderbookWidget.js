/**
 * Orderbook Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Orderbook } from '../models.js/Orderbook.js';

export class OrderbookWidget {
    constructor(containerId = 'orderbook-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.orderbooks = [];
        this.filters = {
            pairName: '',
            isUpdateData: '',
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
        this.orderbooks = Orderbook.getSampleData();
        console.log('Orderbook sample data loaded:', this.orderbooks);
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
        const searchInput = this.container.querySelector('#searchOrderbooks');
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
        const refreshBtn = this.container.querySelector('#refreshOrderbooks');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni orderbook butonu
        const addBtn = this.container.querySelector('#addOrderbook');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddOrderbookModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            pairName: '',
            isUpdateData: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchOrderbooks');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterOrderbooks() {
        return this.orderbooks.filter(orderbook => {
            // Pair adı filtresi
            if (this.filters.pairName && this.filters.pairName !== '') {
                if (!orderbook.pair?.toString().toLowerCase().includes(this.filters.pairName.toLowerCase())) {
                    return false;
                }
            }

            // Update data filtresi
            if (this.filters.isUpdateData && this.filters.isUpdateData !== '') {
                const isUpdateData = this.filters.isUpdateData === 'true';
                if (orderbook.isUpdateData !== isUpdateData) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${orderbook.pair?.toString() || ''} ${orderbook.getTimestampFormatted()} ${orderbook.getSpreadFormatted()}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredOrderbooks = this.filterOrderbooks();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Pair</label>
                                    <input type="text" class="form-control form-control-sm" data-filter="pairName" 
                                           placeholder="Pair adı ara...">
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Veri Tipi</label>
                                    <select class="form-select form-select-sm" data-filter="isUpdateData">
                                        <option value="">Tümü</option>
                                        <option value="false">Snapshot</option>
                                        <option value="true">Update</option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchOrderbooks" 
                                           placeholder="Pair, timestamp veya spread ara...">
                                </div>
                                <div class="col-md-2">
                                    <div class="d-flex gap-1 mt-4">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshOrderbooks" class="btn btn-primary btn-sm">
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
                                    <h5 class="card-title text-primary">Toplam Orderbook</h5>
                                    <h3 class="text-primary">${filteredOrderbooks.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Güncel</h5>
                                    <h3 class="text-success">${filteredOrderbooks.filter(o => !o.isStale()).length}</h3>
                                    <small class="text-muted">5 saniye içinde</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Snapshot</h5>
                                    <h3 class="text-warning">${filteredOrderbooks.filter(o => !o.isUpdateData).length}</h3>
                                    <small class="text-muted">Tam veri</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Update</h5>
                                    <h3 class="text-info">${filteredOrderbooks.filter(o => o.isUpdateData).length}</h3>
                                    <small class="text-muted">Güncelleme</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Ortalama Spread</h5>
                                    <h3 class="text-secondary">${this.getAverageSpread().toFixed(4)}%</h3>
                                    <small class="text-muted">Tüm orderbook'lar</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Toplam Volume</h5>
                                    <h3 class="text-dark">${this.getTotalVolume().toFixed(2)}</h3>
                                    <small class="text-muted">Ask + Bid</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Orderbook Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-book"></i> Orderbook Listesi
                            </h5>
                            <button id="addOrderbook" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Orderbook
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Pair</th>
                                            <th>Best Ask</th>
                                            <th>Best Bid</th>
                                            <th>Spread</th>
                                            <th>Mid Price</th>
                                            <th>Ask Levels</th>
                                            <th>Bid Levels</th>
                                            <th>Timestamp</th>
                                            <th>Durum</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredOrderbooks.length === 0 ? 
                                            '<tr><td colspan="10" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredOrderbooks.map(orderbook => this.renderOrderbookRow(orderbook)).join('')
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

    renderOrderbookRow(orderbook) {
        const spread = orderbook.getSpread();
        const spreadPercentage = orderbook.getSpreadPercentage();
        const midPrice = orderbook.getMidPrice();
        const isStale = orderbook.isStale();
        
        return `
            <tr>
                <td>
                    <span class="badge bg-secondary">${orderbook.pair?.toString() || 'Unknown'}</span>
                    ${orderbook.isUpdateData ? '<br><small class="text-info">Update</small>' : '<br><small class="text-success">Snapshot</small>'}
                </td>
                <td>
                    <div class="text-danger">
                        <strong>${orderbook.bestAskPrice.toFixed(8)}</strong>
                        <br><small>${orderbook.bestAskSize.toFixed(8)}</small>
                    </div>
                </td>
                <td>
                    <div class="text-success">
                        <strong>${orderbook.bestBidPrice.toFixed(8)}</strong>
                        <br><small>${orderbook.bestBidSize.toFixed(8)}</small>
                    </div>
                </td>
                <td>
                    <span class="badge ${spreadPercentage > 1 ? 'bg-danger' : spreadPercentage > 0.5 ? 'bg-warning' : 'bg-success'}">
                        ${spread.toFixed(8)}
                        <br><small>${spreadPercentage.toFixed(4)}%</small>
                    </span>
                </td>
                <td>
                    <strong>${midPrice.toFixed(8)}</strong>
                </td>
                <td>
                    <span class="badge bg-danger">${orderbook.asks.size}</span>
                    <br><small>${orderbook.getTotalAskVolume().toFixed(8)}</small>
                </td>
                <td>
                    <span class="badge bg-success">${orderbook.bids.size}</span>
                    <br><small>${orderbook.getTotalBidVolume().toFixed(8)}</small>
                </td>
                <td>
                    <small>${orderbook.getTimestampFormatted()}</small>
                </td>
                <td>
                    ${isStale ? 
                        '<span class="badge bg-warning"><i class="fas fa-clock"></i> Eski</span>' : 
                        '<span class="badge bg-success"><i class="fas fa-check"></i> Güncel</span>'
                    }
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="OrderbookWidget.showOrderbookDetails(${orderbook.getHash()})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="OrderbookWidget.editOrderbook(${orderbook.getHash()})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="OrderbookWidget.showDepthChart(${orderbook.getHash()})">
                            <i class="fas fa-chart-line"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    getAverageSpread() {
        if (this.orderbooks.length === 0) return 0;
        const totalSpread = this.orderbooks.reduce((sum, orderbook) => {
            return sum + orderbook.getSpreadPercentage();
        }, 0);
        return totalSpread / this.orderbooks.length;
    }

    getTotalVolume() {
        return this.orderbooks.reduce((sum, orderbook) => {
            return sum + orderbook.getTotalAskVolume() + orderbook.getTotalBidVolume();
        }, 0);
    }

    showAddOrderbookModal() {
        console.log('Yeni orderbook ekleme modalı');
        alert('Yeni orderbook ekleme özelliği yakında eklenecek');
    }

    static showOrderbookDetails(orderbookHash) {
        console.log('Orderbook detayları:', orderbookHash);
        alert(`Orderbook Hash: ${orderbookHash} detayları yakında eklenecek`);
    }

    static editOrderbook(orderbookHash) {
        console.log('Orderbook düzenleme:', orderbookHash);
        alert(`Orderbook Hash: ${orderbookHash} düzenleme yakında eklenecek`);
    }

    static showDepthChart(orderbookHash) {
        console.log('Orderbook depth chart:', orderbookHash);
        alert(`Orderbook Hash: ${orderbookHash} depth chart yakında eklenecek`);
    }

    updateData(newData) {
        this.orderbooks = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.OrderbookWidget = OrderbookWidget;
} 