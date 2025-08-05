// Ana uygulama dosyası - Modüler yapı için optimize edildi
// DTO handler'ları dinamik olarak yüklenecek

// SignalR bağlantısı
let connection = null;

// Uygulama başlatma
async function initializeApp() {
    let signalRReady = false;
    try {
        // SignalR bağlantısını kur
        connection = new signalR.HubConnectionBuilder()
            .withUrl("/signalrhub")
            .withAutomaticReconnect([0, 2000, 10000, 30000])
            .build();

        // Bağlantı olayları
        connection.onreconnected((connectionId) => {
            console.log("SignalR yeniden bağlandı. Connection ID:", connectionId);
        });

        connection.onclose((error) => {
            console.log("SignalR bağlantısı kapandı:", error);
        });

        // Bağlantıyı başlat
        await connection.start();
        console.log("SignalR bağlantısı başarıyla kuruldu");
        signalRReady = true;

        // SignalR mesajlarını dinle
        setupSignalRListeners();
    } catch (error) {
        console.error("Uygulama başlatılırken hata (SignalR):", error);
    }
    
    // SignalR olmasa bile örnek veriyi yükle
    // DOM hazır olduğunda çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSampleData);
    } else {
        loadSampleData();
    }
}

// SignalR mesajlarını dinle - Modüler yapı için optimize edildi
function setupSignalRListeners() {
    // Dinamik handler sistemi - Umbraco content'teki widget'lar tarafından kullanılacak
    const signalREvents = [
        "ReceiveArbitrage", "ReceiveOpportunity", "ReceiveAsset", "ReceiveAssetWithoutDisplayInfo",
        "ReceiveBalanceSnapshot", "ReceiveBistSpotFuturesArbitrage", "ReceiveBistSpotFuturesArbitrageOpportunity",
        "ReceiveCapital", "ReceiveCryptoTransfer", "ReceiveExchangeConfiguration", "ReceiveExchange",
        "ReceiveOrderbook", "ReceiveOrder", "ReceivePair", "ReceivePairWithoutDisplayInfo",
        "ReceivePosition", "ReceiveRobotConfiguration", "ReceiveTradeAction", "ReceiveTradingFee",
        "ReceiveTradingPath", "ReceiveTradingPathConfiguration", "ReceiveTradingPathGroup",
        "ReceiveWalletIdentifier", "ReceiveWithdrawalFee", "ReceivePortfolio"
    ];
    
    signalREvents.forEach(eventName => {
        connection.on(eventName, function (data) {
            console.log(`${eventName} verisi alındı:`, data);
            
            // Global event sistemi - Umbraco content'teki widget'lar dinleyebilir
            window.dispatchEvent(new CustomEvent('signalRData', {
                detail: { eventName, data }
            }));
            
            // Eski handler'ları çağır (geriye uyumluluk için)
            const handlerName = `handle${eventName.replace('Receive', '')}Data`;
            if (window[handlerName] && typeof window[handlerName] === 'function') {
                window[handlerName](data);
            }
        });
    });
}

// Örnek verileri yükle (test için)
function loadSampleData() {
    console.log("Örnek veriler yükleniyor...");
    
    // Modüler yapı için örnek veri yükleme sistemi
    // Umbraco content'teki widget'lar kendi verilerini yükleyecek
    console.log("Modüler yapı hazır - Umbraco content'te widget'lar kullanılabilir");
}

// Widget sistemi - Umbraco content'te kullanılacak
window.WidgetSystem = {
    // Widget kaydet
    registerWidget(widgetName, config) {
        console.log(`Widget kaydedildi: ${widgetName}`, config);
        window[widgetName] = config;
    },
    
    // Widget çalıştır
    executeWidget(widgetName, data) {
        const widget = window[widgetName];
        if (widget && typeof widget.render === 'function') {
            widget.render(data);
        }
    },
    
    // SignalR verilerini dinle
    listenToSignalR(eventName, callback) {
        window.addEventListener('signalRData', (event) => {
            if (event.detail.eventName === eventName) {
                callback(event.detail.data);
            }
        });
    }
};

// Uygulamayı başlat
initializeApp(); 