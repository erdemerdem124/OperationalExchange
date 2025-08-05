// Genel SignalR bağlantısı ve temel fonksiyonlar
class SignalRManager {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000; // 3 saniye
        this.dataHandlers = {}; // DTO handler'ları için
    }

    // SignalR bağlantısını başlat
    async startConnection() {
        try {
            // SignalR hub bağlantısını oluştur
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/signalrhub")
                .withAutomaticReconnect([0, 2000, 10000, 30000]) // Otomatik yeniden bağlanma
                .build();

            // Bağlantı açıldığında
            this.connection.onreconnected((connectionId) => {
                console.log("SignalR yeniden bağlandı. Connection ID:", connectionId);
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.onReconnected(connectionId);
            });

            // Bağlantı kapandığında
            this.connection.onclose((error) => {
                console.log("SignalR bağlantısı kapandı:", error);
                this.isConnected = false;
                this.onDisconnected(error);
            });

            // Bağlantıyı başlat
            await this.connection.start();
            this.isConnected = true;
            console.log("SignalR bağlantısı başarıyla kuruldu");
            
            // Data listener'ları kur
            this.setupDataListeners();
            
            this.onConnected();

        } catch (error) {
            console.error("SignalR bağlantısı kurulamadı:", error);
            this.handleConnectionError(error);
        }
    }

    // Bağlantı başarılı olduğunda çağrılacak fonksiyon (override edilebilir)
    onConnected() {
        console.log("SignalR bağlantısı hazır");
    }

    // Yeniden bağlandığında çağrılacak fonksiyon (override edilebilir)
    onReconnected(connectionId) {
        console.log("Yeniden bağlandı:", connectionId);
    }

    // Bağlantı kesildiğinde çağrılacak fonksiyon (override edilebilir)
    onDisconnected(error) {
        console.log("Bağlantı kesildi:", error);
    }

    // Bağlantı hatası işleme
    handleConnectionError(error) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Yeniden bağlanma denemesi ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => {
                this.startConnection();
            }, this.reconnectInterval);
        } else {
            console.error("Maksimum yeniden bağlanma denemesi aşıldı");
        }
    }

    // Hub metodunu çağır
    async invoke(methodName, ...args) {
        if (this.isConnected && this.connection) {
            try {
                return await this.connection.invoke(methodName, ...args);
            } catch (error) {
                console.error(`Hub metodu çağrılırken hata: ${methodName}`, error);
                throw error;
            }
        } else {
            throw new Error("SignalR bağlantısı mevcut değil");
        }
    }

    // Hub'dan gelen mesajları dinle
    on(methodName, callback) {
        if (this.connection) {
            this.connection.on(methodName, callback);
        }
    }

    // Hub'dan gelen mesaj dinlemeyi durdur
    off(methodName) {
        if (this.connection) {
            this.connection.off(methodName);
        }
    }

    // Bağlantıyı kapat
    async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.isConnected = false;
            console.log("SignalR bağlantısı kapatıldı");
        }
    }

    // Bağlantı durumunu kontrol et
    getConnectionState() {
        return this.connection ? this.connection.state : 'Disconnected';
    }

    // DTO Handler'ı kaydet
    registerDataHandler(dataType, handler) {
        this.dataHandlers[dataType] = handler;
        console.log(`Data handler kaydedildi: ${dataType}`);
    }

    // DTO Handler'ı al
    getDataHandler(dataType) {
        return this.dataHandlers[dataType];
    }

    // Tüm DTO Handler'larını listele
    getAllDataHandlers() {
        return Object.keys(this.dataHandlers);
    }

    // Genel veri işleme fonksiyonu
    handleData(dataType, data) {
        const handler = this.getDataHandler(dataType);
        if (handler) {
            handler(data);
        } else {
            console.warn(`Handler bulunamadı: ${dataType}`);
        }
    }

    // SignalR mesajlarını dinle ve handler'lara yönlendir
    setupDataListeners() {
        // Arbitrage verisi
        this.connection.on("ReceiveArbitrage", (data) => {
            this.handleData('arbitrage', data);
        });

        // Order verisi
        this.connection.on("ReceiveOrder", (data) => {
            this.handleData('order', data);
        });

        // Portfolio verisi
        this.connection.on("ReceivePortfolio", (data) => {
            this.handleData('portfolio', data);
        });

        // Fırsat verisi
        this.connection.on("ReceiveOpportunity", (data) => {
            this.handleData('opportunity', data);
        });
    }
}

// Global SignalR manager instance'ı
window.signalRManager = new SignalRManager();

// Sayfa yüklendiğinde SignalR bağlantısını başlat
document.addEventListener('DOMContentLoaded', function() {
    // SignalR script'inin yüklenip yüklenmediğini kontrol et
    if (typeof signalR !== 'undefined') {
        window.signalRManager.startConnection();
    } else {
        console.error("SignalR script yüklenmemiş!");
    }
});

// Sayfa kapatılırken bağlantıyı kapat
window.addEventListener('beforeunload', function() {
    if (window.signalRManager) {
        window.signalRManager.stopConnection();
    }
}); 