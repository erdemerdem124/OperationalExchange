// ArbitrageDto için gerçek zamanlı veri yönetimi
class ArbitrageDataManager {
    constructor() {
        this.arbitrageData = []; // Artık boş başlıyor, veriler SignalR'dan gelecek
        this.signalRManager = window.signalRManager;
        this.dataType = 'arbitrage';
        this.isInitialized = false;
        this.init();
    }

    init() {
        // SignalR bağlantısı hazır olduğunda
        if (this.signalRManager && this.signalRManager.isConnected) {
            this.setupSignalRListeners();
            this.registerWithSignalR();
            this.isInitialized = true;
        } else {
            // Bağlantı henüz hazır değilse bekle
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

    // SignalR Manager'a kaydet
    registerWithSignalR() {
        if (this.signalRManager) {
            this.signalRManager.registerDataManager(this.dataType, this);
        }
    }

    setupSignalRListeners() {
        // Başlangıç verilerini al
        this.signalRManager.on("InitialData", (data) => {
            console.log("Başlangıç verileri alındı:", data);
            if (data.arbitrages) {
                this.arbitrageData = data.arbitrages;
                this.refreshDisplay();
            }
        });

        // Arbitraj verisi güncellendiğinde
        this.signalRManager.on("ArbitrageDataUpdated", (data) => {
            console.log("Arbitraj verisi güncellendi:", data);
            this.updateArbitrageData(data);
            this.refreshDisplay();
        });

        // Yeni arbitraj eklendiğinde
        this.signalRManager.on("NewArbitrageAdded", (arbitrage) => {
            console.log("Yeni arbitraj eklendi:", arbitrage);
            this.addNewArbitrage(arbitrage);
            this.refreshDisplay();
        });

        // Arbitraj durumu değiştiğinde
        this.signalRManager.on("ArbitrageStatusChanged", (id, status) => {
            console.log("Arbitraj durumu değişti:", id, status);
            this.updateArbitrageStatus(id, status);
            this.refreshDisplay();
        });

        // Yeni arbitraj fırsatı
        this.signalRManager.on("NewArbitrageOpportunity", (opportunity) => {
            console.log("Yeni arbitraj fırsatı:", opportunity);
            this.handleNewOpportunity(opportunity);
        });

        // Gerçek zamanlı fiyat güncellemesi
        this.signalRManager.on("RealTimePriceUpdated", (symbol, price, exchange) => {
            console.log("Fiyat güncellendi:", symbol, price, exchange);
            this.updatePriceDisplay(symbol, price, exchange);
        });
    }

    // Tüm arbitraj verilerini getir
    getAllArbitrageData() {
        return this.arbitrageData;
    }

    // ID'ye göre arbitraj getir
    getArbitrageById(id) {
        return this.arbitrageData.find(arb => arb.id === id);
    }

    // Başarılı arbitrajları getir
    getSuccessfulArbitrages() {
        return this.arbitrageData.filter(arb => arb.isSuccessful === true);
    }

    // Demo arbitrajları getir
    getDemoArbitrages() {
        return this.arbitrageData.filter(arb => arb.isDemo === true);
    }

    // Finalize edilmemiş arbitrajları getir
    getPendingArbitrages() {
        return this.arbitrageData.filter(arb => arb.isFinalized === false);
    }

    // Tarih aralığına göre arbitrajları getir
    getArbitragesByDateRange(startDate, endDate) {
        return this.arbitrageData.filter(arb => {
            const arbDate = new Date(arb.dateAdded);
            return arbDate >= startDate && arbDate <= endDate;
        });
    }

    // Toplam kar/zarar hesapla
    calculateTotalProfit() {
        return this.arbitrageData
            .filter(arb => arb.isFinalized)
            .reduce((total, arb) => total + arb.realizedReturn, 0);
    }

    // Ortalama getiri oranı hesapla
    calculateAverageReturnRatio() {
        const finalizedArbs = this.arbitrageData.filter(arb => arb.isFinalized);
        if (finalizedArbs.length === 0) return 0;
        
        const totalRatio = finalizedArbs.reduce((total, arb) => total + arb.realizedReturnRatio, 0);
        return totalRatio / finalizedArbs.length;
    }

    // Arbitraj verisini güncelle
    updateArbitrageData(newData) {
        this.arbitrageData = newData;
    }

    // Yeni arbitraj ekle
    addNewArbitrage(arbitrage) {
        this.arbitrageData.unshift(arbitrage); // En başa ekle
        
        // Yeni arbitraj bildirimi göster
        this.showNotification(`Yeni arbitraj eklendi: ${arbitrage.friendlyId}`, 'success');
    }

    // Arbitraj durumunu güncelle
    updateArbitrageStatus(id, status) {
        const arbitrage = this.getArbitrageById(id);
        if (arbitrage) {
            arbitrage.isSuccessful = status.isSuccessful;
            arbitrage.isFinalized = status.isFinalized;
            
            // Durum değişikliği bildirimi göster
            const statusText = status.isSuccessful ? 'Başarılı' : status.isSuccessful === false ? 'Başarısız' : 'Beklemede';
            this.showNotification(`Arbitraj durumu güncellendi: ${statusText}`, 'info');
        }
    }

    // Yeni fırsat işle
    handleNewOpportunity(opportunity) {
        // Yeni fırsat bildirimi göster
        this.showNotification(`Yeni arbitraj fırsatı: ${opportunity.symbol}`, 'warning');
        
        // Fırsat listesini güncelle (eğer varsa)
        this.updateOpportunityList(opportunity);
    }

    // Fiyat güncellemesi
    updatePriceDisplay(symbol, price, exchange) {
        // Fiyat gösterimini güncelle (eğer varsa)
        const priceElement = document.querySelector(`[data-symbol="${symbol}"]`);
        if (priceElement) {
            priceElement.textContent = price.toFixed(2);
            priceElement.classList.add('price-updated');
            setTimeout(() => {
                priceElement.classList.remove('price-updated');
            }, 1000);
        }
    }

    // Bildirim göster
    showNotification(message, type = 'info') {
        // Bootstrap toast veya alert kullanarak bildirim göster
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
        
        // Toast container'a ekle
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        // Toast'u göster
        const toastElement = toastContainer.lastElementChild;
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // 5 saniye sonra otomatik kaldır
        setTimeout(() => {
            toastElement.remove();
        }, 5000);
    }

    // Fırsat listesini güncelle
    updateOpportunityList(opportunity) {
        const opportunityContainer = document.getElementById('opportunity-list');
        if (opportunityContainer) {
            const opportunityHTML = `
                <div class="opportunity-item border-bottom p-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${opportunity.symbol}</strong>
                            <small class="text-muted">${opportunity.exchange}</small>
                        </div>
                        <div class="text-end">
                            <div class="text-success">${opportunity.profit.toFixed(2)} USDT</div>
                            <small class="text-muted">${(opportunity.profitRatio * 100).toFixed(2)}%</small>
                        </div>
                    </div>
                </div>
            `;
            opportunityContainer.insertAdjacentHTML('afterbegin', opportunityHTML);
        }
    }

    // Display'i yenile
    refreshDisplay() {
        this.renderArbitrageTable();
        this.updateStatistics();
    }

    // Arbitraj tablosunu render et
    renderArbitrageTable() {
        const container = document.getElementById('arbitrage-table-container');
        if (!container) return;

        if (this.arbitrageData.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Veriler yükleniyor...
                </div>
            `;
            return;
        }

        const tableHTML = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tarih</th>
                        <th>Trading Path</th>
                        <th>Kar/Zarar</th>
                        <th>Getiri Oranı</th>
                        <th>Durum</th>
                        <th>Demo</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.arbitrageData.map(arb => `
                        <tr class="${arb.isSuccessful ? 'table-success' : arb.isSuccessful === false ? 'table-danger' : 'table-warning'}">
                            <td>${arb.friendlyId}</td>
                            <td>${new Date(arb.dateAdded).toLocaleString('tr-TR')}</td>
                            <td>${arb.tradingPath}</td>
                            <td class="${arb.realizedReturn >= 0 ? 'text-success' : 'text-danger'}">
                                ${arb.realizedReturn.toFixed(2)} USDT
                            </td>
                            <td class="${arb.realizedReturnRatio >= 0 ? 'text-success' : 'text-danger'}">
                                ${(arb.realizedReturnRatio * 100).toFixed(2)}%
                            </td>
                            <td>
                                <span class="badge ${arb.isSuccessful ? 'bg-success' : arb.isSuccessful === false ? 'bg-danger' : 'bg-warning'}">
                                    ${arb.isSuccessful ? 'Başarılı' : arb.isSuccessful === false ? 'Başarısız' : 'Beklemede'}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${arb.isDemo ? 'bg-info' : 'bg-secondary'}">
                                    ${arb.isDemo ? 'Demo' : 'Gerçek'}
                                </span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-primary" onclick="arbitrageManager.showOrders(${arb.id})">
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
        const totalProfit = this.calculateTotalProfit();
        const avgReturn = this.calculateAverageReturnRatio();
        const successfulCount = this.getSuccessfulArbitrages().length;
        const totalCount = this.arbitrageData.length;

        const statsContainer = document.getElementById('arbitrage-stats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div class="row">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam Kar/Zarar</h5>
                                <h3 class="${totalProfit >= 0 ? 'text-success' : 'text-danger'}">
                                    ${totalProfit.toFixed(2)} USDT
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Ortalama Getiri</h5>
                                <h3 class="${avgReturn >= 0 ? 'text-success' : 'text-danger'}">
                                    ${(avgReturn * 100).toFixed(2)}%
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Başarı Oranı</h5>
                                <h3 class="text-info">
                                    ${totalCount > 0 ? ((successfulCount / totalCount) * 100).toFixed(1) : 0}%
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <h5 class="card-title">Toplam İşlem</h5>
                                <h3 class="text-primary">${totalCount}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Order detaylarını göster
    showOrders(arbitrageId) {
        const arbitrage = this.getArbitrageById(arbitrageId);
        if (!arbitrage) return;

        const ordersHTML = `
            <div class="modal fade" id="ordersModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Arbitraj Detayları - ${arbitrage.friendlyId}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <strong>Trading Path:</strong> ${arbitrage.tradingPath}
                                </div>
                                <div class="col-md-6">
                                    <strong>Kar/Zarar:</strong> 
                                    <span class="${arbitrage.realizedReturn >= 0 ? 'text-success' : 'text-danger'}">
                                        ${arbitrage.realizedReturn.toFixed(2)} USDT
                                    </span>
                                </div>
                            </div>
                            <h6>İşlemler:</h6>
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Side</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Exchange</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${arbitrage.orders.map(order => `
                                        <tr>
                                            <td>${order.symbol}</td>
                                            <td>
                                                <span class="badge ${order.side === 'Buy' ? 'bg-success' : 'bg-danger'}">
                                                    ${order.side}
                                                </span>
                                            </td>
                                            <td>${order.quantity}</td>
                                            <td>${order.price}</td>
                                            <td>${order.exchange}</td>
                                            <td>
                                                <span class="badge bg-success">${order.status}</span>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eğer modal zaten varsa kaldır
        const existingModal = document.getElementById('ordersModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Yeni modal ekle ve göster
        document.body.insertAdjacentHTML('beforeend', ordersHTML);
        const modal = new bootstrap.Modal(document.getElementById('ordersModal'));
        modal.show();
    }

    // Server'a veri gönder
    async sendArbitrageData(data) {
        try {
            await this.signalRManager.invoke("UpdateArbitrageData", data);
        } catch (error) {
            console.error("Arbitraj verisi gönderilirken hata:", error);
        }
    }
}

// Global arbitraj manager instance'ı
window.arbitrageManager = new ArbitrageDataManager();

// Sayfa yüklendiğinde display'i başlat
document.addEventListener('DOMContentLoaded', function() {
    if (window.arbitrageManager) {
        // SignalR bağlantısı hazır olduğunda display'i yenile
        const checkConnection = setInterval(() => {
            if (window.arbitrageManager.isInitialized) {
                window.arbitrageManager.refreshDisplay();
                clearInterval(checkConnection);
            }
        }, 100);
    }
    
    // Yeni widget sistemini yükle
    loadWidgets();
});

// Widget'ları yükle
async function loadWidgets() {
    try {
        // Sadece "arbitraj işlemleri" sayfasında widget'ları yükle
        const currentPage = document.querySelector('.card-header .title-text')?.textContent?.toLowerCase();
        
        if (currentPage && (currentPage.includes('arbitraj işlemleri') || currentPage.includes('arbitraj'))) {
            console.log('Arbitraj sayfası tespit edildi, widget\'lar yüklenecek');
        } else {
            console.log('Arbitraj sayfası değil, widget\'lar yüklenmedi');
        }
    } catch (error) {
        console.error('Widget yüklenirken hata:', error);
    }
} 