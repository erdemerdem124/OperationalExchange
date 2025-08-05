// Borsa verileri için gerçek zamanlı veri yönetimi
class BorsaDataManager {
    constructor() {
        this.borsaData = [];
        this.signalRManager = window.signalRManager;
        this.dataType = 'borsa';
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
            console.log("Borsa başlangıç verileri alındı:", data);
            if (data.borsa) {
                this.borsaData = data.borsa;
                this.refreshDisplay();
            }
        });

        // Borsa verisi güncellendiğinde
        this.signalRManager.on("BorsaDataUpdated", (data) => {
            console.log("Borsa verisi güncellendi:", data);
            this.updateBorsaData(data);
            this.refreshDisplay();
        });

        // Yeni işlem eklendiğinde
        this.signalRManager.on("NewTradeAdded", (trade) => {
            console.log("Yeni borsa işlemi eklendi:", trade);
            this.addNewTrade(trade);
            this.refreshDisplay();
        });

        // İşlem durumu değiştiğinde
        this.signalRManager.on("TradeStatusChanged", (tradeId, status) => {
            console.log("Borsa işlem durumu değişti:", tradeId, status);
            this.updateTradeStatus(tradeId, status);
            this.refreshDisplay();
        });

        // Gerçek zamanlı fiyat güncellemesi
        this.signalRManager.on("RealTimePriceUpdated", (symbol, price, exchange) => {
            if (exchange.toLowerCase().includes('borsa') || exchange.toLowerCase().includes('bist')) {
                console.log("Borsa fiyat güncellendi:", symbol, price, exchange);
                this.updatePriceDisplay(symbol, price, exchange);
            }
        });
    }

    // Tüm borsa verilerini getir
    getAllBorsaData() {
        return this.borsaData;
    }

    // ID'ye göre borsa verisi getir
    getBorsaById(id) {
        return this.borsaData.find(item => item.id === id);
    }

    // Borsa verisini güncelle
    updateBorsaData(newData) {
        this.borsaData = newData;
    }

    // Yeni işlem ekle
    addNewTrade(trade) {
        this.borsaData.unshift(trade);
        this.showNotification(`Yeni borsa işlemi: ${trade.symbol}`, 'success');
    }

    // İşlem durumunu güncelle
    updateTradeStatus(tradeId, status) {
        const trade = this.borsaData.find(t => t.id === tradeId);
        if (trade) {
            trade.status = status;
            this.showNotification(`İşlem durumu güncellendi: ${status}`, 'info');
        }
    }

    // Fiyat güncellemesi
    updatePriceDisplay(symbol, price, exchange) {
        const priceElement = document.querySelector(`[data-borsa-symbol="${symbol}"]`);
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
        this.renderBorsaTable();
        this.updateStatistics();
    }

    // Borsa tablosunu render et
    renderBorsaTable() {
        const container = document.getElementById('borsa-table-container');
        if (!container) return;

        if (this.borsaData.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Borsa verileri yükleniyor...
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Sembol</th>
                        <th>Fiyat</th>
                        <th>Değişim</th>
                        <th>Hacim</th>
                        <th>Son Güncelleme</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.borsaData.map(item => `
                        <tr>
                            <td><strong>${item.symbol}</strong></td>
                            <td data-borsa-symbol="${item.symbol}">${item.price?.toFixed(2) || 'N/A'}</td>
                            <td class="${item.change >= 0 ? 'text-success' : 'text-danger'}">
                                ${item.change >= 0 ? '+' : ''}${item.change?.toFixed(2) || 'N/A'}%
                            </td>
                            <td>${item.volume?.toLocaleString() || 'N/A'}</td>
                            <td>${item.lastUpdate ? new Date(item.lastUpdate).toLocaleString('tr-TR') : 'N/A'}</td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="borsaManager.showDetails(${item.id})">
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

    // İstatistikleri güncelle
    updateStatistics() {
        const totalVolume = this.borsaData.reduce((sum, item) => sum + (item.volume || 0), 0);
        const avgChange = this.borsaData.length > 0 ? 
            this.borsaData.reduce((sum, item) => sum + (item.change || 0), 0) / this.borsaData.length : 0;

        const statsContainer = document.getElementById('borsa-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Hacim</h5>
                                <h3 class="text-primary">${totalVolume.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Ortalama Değişim</h5>
                                <h3 class="${avgChange >= 0 ? 'text-success' : 'text-danger'}">
                                    ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Sembol</h5>
                                <h3 class="text-info">${this.borsaData.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Detayları göster
    showDetails(id) {
        const item = this.getBorsaById(id);
        if (!item) return;

        const detailsHTML = `
            <div class="modal fade" id="borsaDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Borsa Detayları - ${item.symbol}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Sembol:</strong> ${item.symbol}</p>
                                    <p><strong>Fiyat:</strong> ${item.price?.toFixed(2) || 'N/A'}</p>
                                    <p><strong>Değişim:</strong> 
                                        <span class="${item.change >= 0 ? 'text-success' : 'text-danger'}">
                                            ${item.change >= 0 ? '+' : ''}${item.change?.toFixed(2) || 'N/A'}%
                                        </span>
                                    </p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Hacim:</strong> ${item.volume?.toLocaleString() || 'N/A'}</p>
                                    <p><strong>Yüksek:</strong> ${item.high?.toFixed(2) || 'N/A'}</p>
                                    <p><strong>Düşük:</strong> ${item.low?.toFixed(2) || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const existingModal = document.getElementById('borsaDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        document.body.insertAdjacentHTML('beforeend', detailsHTML);
        const modal = new bootstrap.Modal(document.getElementById('borsaDetailsModal'));
        modal.show();
    }

    // Server'a veri gönder
    async sendBorsaData(data) {
        try {
            await this.signalRManager.invoke("UpdateBorsaData", data);
        } catch (error) {
            console.error("Borsa verisi gönderilirken hata:", error);
        }
    }
}

// Global borsa manager instance'ı
window.borsaManager = new BorsaDataManager();

// Sayfa yüklendiğinde display'i başlat
document.addEventListener('DOMContentLoaded', function() {
    if (window.borsaManager) {
        const checkConnection = setInterval(() => {
            if (window.borsaManager.isInitialized) {
                window.borsaManager.refreshDisplay();
                clearInterval(checkConnection);
            }
        }, 100);
    }
}); 