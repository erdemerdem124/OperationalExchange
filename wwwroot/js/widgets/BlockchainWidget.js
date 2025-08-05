/**
 * Blockchain Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

import { Blockchain } from '../models.js/Blockchain.js';

export class BlockchainWidget {
    constructor(containerId = 'blockchain-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.blockchains = [];
        this.filters = {
            blockchainType: '',
            networkId: '',
            status: '',
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
        this.blockchains = Blockchain.getSampleData();
        console.log('Blockchain sample data loaded:', this.blockchains);
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
        const searchInput = this.container.querySelector('#searchBlockchains');
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
        const refreshBtn = this.container.querySelector('#refreshBlockchains');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadSampleData();
                this.render();
            });
        }

        // Yeni blockchain butonu
        const addBtn = this.container.querySelector('#addBlockchain');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showAddBlockchainModal();
            });
        }
    }

    clearFilters() {
        this.filters = {
            blockchainType: '',
            networkId: '',
            status: '',
            search: ''
        };

        // Form elementlerini temizle
        const filterElements = this.container.querySelectorAll('[data-filter]');
        filterElements.forEach(element => {
            element.value = '';
        });

        const searchInput = this.container.querySelector('#searchBlockchains');
        if (searchInput) {
            searchInput.value = '';
        }

        this.render();
    }

    filterBlockchains() {
        return this.blockchains.filter(blockchain => {
            // Blockchain tipi filtresi
            if (this.filters.blockchainType && blockchain.blockchainType !== this.filters.blockchainType) {
                return false;
            }

            // Network ID filtresi
            if (this.filters.networkId && this.filters.networkId !== '') {
                const networkId = parseInt(this.filters.networkId);
                if (blockchain.networkId !== networkId) return false;
            }

            // Durum filtresi (Mainnet/Testnet)
            if (this.filters.status && this.filters.status !== '') {
                const isTestnet = this.filters.status === 'testnet';
                const isMainnet = this.filters.status === 'mainnet';
                
                if (isTestnet && blockchain.networkId >= 1 && blockchain.networkId <= 999) return false;
                if (isMainnet && blockchain.networkId > 999) return false;
            }

            // Arama filtresi
            if (this.filters.search && this.filters.search !== '') {
                const searchTerm = this.filters.search.toLowerCase();
                const searchText = `${blockchain.name} ${blockchain.blockchainType} ${blockchain.networkId} ${blockchain.rpcUrl}`.toLowerCase();
                if (!searchText.includes(searchTerm)) return false;
            }

            return true;
        });
    }

    render() {
        const filteredBlockchains = this.filterBlockchains();
        
        this.container.innerHTML = `
                <!-- Filtreler -->
                <div class="filters-section mb-4">
                    <div class="card">
                        <div class="card-body py-2">
                            <div class="row align-items-end">
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Blockchain Tipi</label>
                                    <select class="form-select form-select-sm" data-filter="blockchainType">
                                        <option value="">Tümü</option>
                                        <option value="ETH">Ethereum</option>
                                        <option value="BSC">Binance Smart Chain</option>
                                        <option value="POLYGON">Polygon</option>
                                        <option value="ARBITRUM">Arbitrum</option>
                                        <option value="OPTIMISM">Optimism</option>
                                        <option value="AVALANCHE">Avalanche</option>
                                        <option value="FANTOM">Fantom</option>
                                        <option value="CRONOS">Cronos</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Network ID</label>
                                    <select class="form-select form-select-sm" data-filter="networkId">
                                        <option value="">Tümü</option>
                                        <option value="1">1 (ETH Mainnet)</option>
                                        <option value="56">56 (BSC Mainnet)</option>
                                        <option value="137">137 (Polygon)</option>
                                        <option value="42161">42161 (Arbitrum)</option>
                                        <option value="10">10 (Optimism)</option>
                                        <option value="43114">43114 (Avalanche)</option>
                                        <option value="250">250 (Fantom)</option>
                                        <option value="25">25 (Cronos)</option>
                                        <option value="5">5 (ETH Goerli)</option>
                                        <option value="97">97 (BSC Testnet)</option>
                                    </select>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Durum</label>
                                    <select class="form-select form-select-sm" data-filter="status">
                                        <option value="">Tümü</option>
                                        <option value="mainnet">Mainnet</option>
                                        <option value="testnet">Testnet</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label text-white mb-1" style="font-size: 1.1rem;">Arama</label>
                                    <input type="text" class="form-control form-control-sm" id="searchBlockchains" 
                                           placeholder="Blockchain adı, tip veya RPC URL ara...">
                                </div>
                                <div class="col-md-3">
                                    <div class="d-flex gap-1">
                                        <button id="clear-filters" class="btn btn-outline-secondary btn-sm">
                                            <i class="fas fa-times"></i> Temizle
                                        </button>
                                        <button id="refreshBlockchains" class="btn btn-primary btn-sm">
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
                                    <h5 class="card-title text-primary">Toplam Blockchain</h5>
                                    <h3 class="text-primary">${filteredBlockchains.length}</h3>
                                    <small class="text-muted">Filtrelenmiş</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-success">
                                <div class="card-body">
                                    <h5 class="card-title text-success">Mainnet</h5>
                                    <h3 class="text-success">${filteredBlockchains.filter(b => b.networkId >= 1 && b.networkId <= 999).length}</h3>
                                    <small class="text-muted">Üretim ağları</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-warning">
                                <div class="card-body">
                                    <h5 class="card-title text-warning">Testnet</h5>
                                    <h3 class="text-warning">${filteredBlockchains.filter(b => b.networkId > 999).length}</h3>
                                    <small class="text-muted">Test ağları</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-info">
                                <div class="card-body">
                                    <h5 class="card-title text-info">Ethereum</h5>
                                    <h3 class="text-info">${filteredBlockchains.filter(b => b.blockchainType === 'ETH').length}</h3>
                                    <small class="text-muted">ETH tabanlı</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-secondary">
                                <div class="card-body">
                                    <h5 class="card-title text-secondary">Layer 2</h5>
                                    <h3 class="text-secondary">${filteredBlockchains.filter(b => ['ARBITRUM', 'OPTIMISM', 'POLYGON'].includes(b.blockchainType)).length}</h3>
                                    <small class="text-muted">Ölçeklendirme</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="card text-center border-dark">
                                <div class="card-body">
                                    <h5 class="card-title text-dark">Alternatif</h5>
                                    <h3 class="text-dark">${filteredBlockchains.filter(b => ['BSC', 'AVALANCHE', 'FANTOM', 'CRONOS'].includes(b.blockchainType)).length}</h3>
                                    <small class="text-muted">Diğer ağlar</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Blockchain Tablosu -->
                <div class="table-section">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">
                                <i class="fas fa-link"></i> Blockchain Listesi
                            </h5>
                            <button id="addBlockchain" class="btn btn-success btn-sm">
                                <i class="fas fa-plus"></i> Yeni Blockchain
                            </button>
                        </div>
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>Blockchain</th>
                                            <th>Tip</th>
                                            <th>Network ID</th>
                                            <th>Durum</th>
                                            <th>RPC URL</th>
                                            <th>Son Güncelleme</th>
                                            <th>İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredBlockchains.length === 0 ? 
                                            '<tr><td colspan="7" class="text-center text-muted py-4"><i class="fas fa-search"></i> Sonuç bulunamadı</td></tr>' :
                                            filteredBlockchains.map(blockchain => this.renderBlockchainRow(blockchain)).join('')
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

    renderBlockchainRow(blockchain) {
        const isTestnet = blockchain.networkId > 999;
        const statusBadge = isTestnet ? 'bg-warning' : 'bg-success';
        const statusText = isTestnet ? 'Testnet' : 'Mainnet';
        
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="blockchain-icon me-2">
                            <i class="fas ${blockchain.getBlockchainIcon()}"></i>
                        </div>
                        <div>
                            <strong>${blockchain.name}</strong>
                            <br><small class="text-muted">ID: ${blockchain.id}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge ${blockchain.getBlockchainTypeBadgeClass()}">
                        ${blockchain.getBlockchainTypeName()}
                    </span>
                </td>
                <td>
                    <code class="text-info">${blockchain.networkId}</code>
                </td>
                <td>
                    <span class="badge ${statusBadge}">${statusText}</span>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 200px;" title="${blockchain.rpcUrl}">
                        <small class="text-muted">${blockchain.rpcUrl}</small>
                    </div>
                </td>
                <td>
                    ${blockchain.dateAdded ? new Date(blockchain.dateAdded).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="BlockchainWidget.showBlockchainDetails(${blockchain.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="BlockchainWidget.editBlockchain(${blockchain.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="BlockchainWidget.deleteBlockchain(${blockchain.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    showAddBlockchainModal() {
        console.log('Yeni blockchain ekleme modalı');
        alert('Yeni blockchain ekleme özelliği yakında eklenecek');
    }

    static showBlockchainDetails(blockchainId) {
        console.log('Blockchain detayları:', blockchainId);
        alert(`Blockchain ID: ${blockchainId} detayları yakında eklenecek`);
    }

    static editBlockchain(blockchainId) {
        console.log('Blockchain düzenleme:', blockchainId);
        alert(`Blockchain ID: ${blockchainId} düzenleme yakında eklenecek`);
    }

    static deleteBlockchain(blockchainId) {
        if (confirm('Bu blockchain\'i silmek istediğinizden emin misiniz?')) {
            console.log('Blockchain silme:', blockchainId);
            alert(`Blockchain ID: ${blockchainId} silme yakında eklenecek`);
        }
    }

    updateData(newData) {
        this.blockchains = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.BlockchainWidget = BlockchainWidget;
} 