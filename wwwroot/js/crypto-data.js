// Kripto para verileri için gerçek zamanlı veri yönetimi
class CryptoDataManager {
    constructor() {
        this.cryptoData = [];
        this.signalRManager = window.signalRManager;
        this.dataType = 'crypto';
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.signalRManager && this.signalRManager.isConnected) {
            this.setupSignalRListeners();
            this.registerWithSignalR();
            this.isInitialized = true;
        } else {
            const checkConnection = setInterval(() => {
                if (this.signalRManager && this.signalRManager.isConnected) {
                    this.setupSignalRListeners();
                    this.registerWithSignalR();
                    this.isInitialized = true;
                    clearInterval(checkConnection);
                }
            }, 100);
        }
    }

    registerWithSignalR() {
        if (this.signalRManager) {
            this.signalRManager.registerDataManager(this.dataType, this);
        }
    }

    setupSignalRListeners() {
        // Başlangıç verilerini al
        this.signalRManager.on("InitialData", (data) => {
            console.log("Kripto başlangıç verileri alındı:", data);
            if (data.crypto) {
                this.cryptoData = data.crypto;
                this.refreshDisplay();
            }
        });

        // Kripto verisi güncellendiğinde
        this.signalRManager.on("CryptoDataUpdated", (data) => {
            console.log("Kripto verisi güncellendi:", data);
            this.updateCryptoData(data);
            this.refreshDisplay();
        });

        // Yeni işlem eklendiğinde
        this.signalRManager.on("NewTradeAdded", (trade) => {
            console.log("Yeni kripto işlemi eklendi:", trade);
            this.addNewTrade(trade);
            this.refreshDisplay();
        });

        // İşlem durumu değiştiğinde
        this.signalRManager.on("TradeStatusChanged", (tradeId, status) => {
            console.log("Kripto işlem durumu değişti:", tradeId, status);
            this.updateTradeStatus(tradeId, status);
            this.refreshDisplay();
        });

        // Gerçek zamanlı fiyat güncellemesi
        this.signalRManager.on("RealTimePriceUpdated", (symbol, price, exchange) => {
            if (exchange.toLowerCase().includes('binance') || 
                exchange.toLowerCase().includes('coinbase') || 
                exchange.toLowerCase().includes('kraken') ||
                exchange.toLowerCase().includes('crypto')) {
                console.log("Kripto fiyat güncellendi:", symbol, price, exchange);
                this.updatePriceDisplay(symbol, price, exchange);
            }
        });
    }

    // Tüm kripto verilerini getir
    getAllCryptoData() {
        return this.cryptoData;
    }

    // ID'ye göre kripto verisi getir
    getCryptoById(id) {
        return this.cryptoData.find(item => item.id === id);
    }

    // Sembol'e göre kripto verisi getir
    getCryptoBySymbol(symbol) {
        return this.cryptoData.find(item => item.symbol === symbol);
    }

    // Kripto verisini güncelle
    updateCryptoData(newData) {
        this.cryptoData = newData;
    }

    // Yeni işlem ekle
    addNewTrade(trade) {
        this.cryptoData.unshift(trade);
        this.showNotification(`Yeni kripto işlemi: ${trade.symbol}`, 'success');
    }

    // İşlem durumunu güncelle
    updateTradeStatus(tradeId, status) {
        const trade = this.cryptoData.find(t => t.id === tradeId);
        if (trade) {
            trade.status = status;
            this.showNotification(`İşlem durumu güncellendi: ${status}`, 'info');
        }
    }

    // Fiyat güncellemesi
    updatePriceDisplay(symbol, price, exchange) {
        const priceElement = document.querySelector(`[data-crypto-symbol="${symbol}"]`);
        if (priceElement) {
            const oldPrice = parseFloat(priceElement.textContent.replace(/[^\d.-]/g, ''));
            const newPrice = parseFloat(price);
            
            priceElement.textContent = price.toFixed(2);
            
            // Fiyat değişim animasyonu
            if (newPrice > oldPrice) {
                priceElement.classList.add('price-up');
            } else if (newPrice < oldPrice) {
                priceElement.classList.add('price-down');
            }
            
            setTimeout(() => {
                priceElement.classList.remove('price-up', 'price-down');
            }, 1000);
        }
    }

    // Bildirim göster
    showNotification(message, type = 'info') {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;
        
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        setTimeout(() => {
            toastElement.remove();
        }, 5000);
    }

    // Display'i yenile
    refreshDisplay() {
        this.renderCryptoTable();
        this.updateStatistics();
    }

    // Kripto tablosunu render et
    renderCryptoTable() {
        const container = document.getElementById('crypto-table-container');
        if (!container) return;

        if (this.cryptoData.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Kripto verileri yükleniyor...
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Sembol</th>
                        <th>Fiyat (USDT)</th>
                        <th>24s Değişim</th>
                        <th>24s Hacim</th>
                        <th>Market Cap</th>
                        <th>Exchange</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.cryptoData.map(item => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.icon || '/images/crypto-default.png'}" 
                                         alt="${item.symbol}" 
                                         class="me-2" 
                                         style="width: 24px; height: 24px;">
                                    <strong>${item.symbol}</strong>
                                </div>
                            </td>
                            <td data-crypto-symbol="${item.symbol}">${item.price?.toFixed(2) || 'N/A'}</td>
                            <td class="${item.change24h >= 0 ? 'text-success' : 'text-danger'}">
                                ${item.change24h >= 0 ? '+' : ''}${item.change24h?.toFixed(2) || 'N/A'}%
                            </td>
                            <td>${item.volume24h ? this.formatVolume(item.volume24h) : 'N/A'}</td>
                            <td>${item.marketCap ? this.formatMarketCap(item.marketCap) : 'N/A'}</td>
                            <td>
                                <span class="badge bg-secondary">${item.exchange || 'N/A'}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="cryptoManager.showDetails(${item.id})">
                                    Detay
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    // Hacim formatla
    formatVolume(volume) {
        if (volume >= 1e9) {
            return (volume / 1e9).toFixed(2) + 'B';
        } else if (volume >= 1e6) {
            return (volume / 1e6).toFixed(2) + 'M';
        } else if (volume >= 1e3) {
            return (volume / 1e3).toFixed(2) + 'K';
        }
        return volume.toFixed(2);
    }

    // Market cap formatla
    formatMarketCap(marketCap) {
        if (marketCap >= 1e12) {
            return (marketCap / 1e12).toFixed(2) + 'T';
        } else if (marketCap >= 1e9) {
            return (marketCap / 1e9).toFixed(2) + 'B';
        } else if (marketCap >= 1e6) {
            return (marketCap / 1e6).toFixed(2) + 'M';
        }
        return marketCap.toFixed(2);
    }

    // İstatistikleri güncelle
    updateStatistics() {
        const totalMarketCap = this.cryptoData.reduce((sum, item) => sum + (item.marketCap || 0), 0);
        const totalVolume = this.cryptoData.reduce((sum, item) => sum + (item.volume24h || 0), 0);
        const avgChange = this.cryptoData.length > 0 ? 
            this.cryptoData.reduce((sum, item) => sum + (item.change24h || 0), 0) / this.cryptoData.length : 0;

        const statsContainer = document.getElementById('crypto-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Market Cap</h5>
                                <h3 class="text-primary">${this.formatMarketCap(totalMarketCap)}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">24s Toplam Hacim</h5>
                                <h3 class="text-info">${this.formatVolume(totalVolume)}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Ortalama Değişim</h5>
                                <h3 class="${avgChange >= 0 ? 'text-success' : 'text-danger'}">
                                    ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Coin</h5>
                                <h3 class="text-warning">${this.cryptoData.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Detayları göster
    showDetails(id) {
        const item = this.getCryptoById(id);
        if (!item) return;

        const detailsHTML = `
            <div class="modal fade" id="cryptoDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Kripto Detayları - ${item.symbol}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Sembol:</strong> ${item.symbol}</p>
                                    <p><strong>Fiyat:</strong> ${item.price?.toFixed(2) || 'N/A'} USDT</p>
                                    <p><strong>24s Değişim:</strong> 
                                        <span class="${item.change24h >= 0 ? 'text-success' : 'text-danger'}">
                                            ${item.change24h >= 0 ? '+' : ''}${item.change24h?.toFixed(2) || 'N/A'}%
                                        </span>
                                    </p>
                                    <p><strong>Exchange:</strong> ${item.exchange || 'N/A'}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>24s Hacim:</strong> ${item.volume24h ? this.formatVolume(item.volume24h) : 'N/A'}</p>
                                    <p><strong>Market Cap:</strong> ${item.marketCap ? this.formatMarketCap(item.marketCap) : 'N/A'}</p>
                                    <p><strong>Yüksek (24s):</strong> ${item.high24h?.toFixed(2) || 'N/A'}</p>
                                    <p><strong>Düşük (24s):</strong> ${item.low24h?.toFixed(2) || 'N/A'}</p>
                                </div>
                            </div>
                            ${item.description ? `
                                <div class="mt-3">
                                    <h6>Açıklama:</h6>
                                    <p>${item.description}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('cryptoDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', detailsHTML);
        const modal = new bootstrap.Modal(document.getElementById('cryptoDetailsModal'));
        modal.show();
    }

    // Server'a veri gönder
    async sendCryptoData(data) {
        try {
            await this.signalRManager.invoke("UpdateCryptoData", data);
        } catch (error) {
            console.error("Kripto verisi gönderilirken hata:", error);
        }
    }
}

// Global kripto manager instance'ı
window.cryptoManager = new CryptoDataManager();

// Sayfa yüklendiğinde display'i başlat
document.addEventListener('DOMContentLoaded', function() {
    if (window.cryptoManager) {
        const checkConnection = setInterval(() => {
            if (window.cryptoManager.isInitialized) {
                window.cryptoManager.refreshDisplay();
                clearInterval(checkConnection);
            }
        }, 100);
    }
}); 