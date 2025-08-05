/**
 * RobotConfiguration DTO - HFT robot ayarları için konfigürasyon entity'sini temsil eder
 * Order ve Arbitrage operasyonları için optimize edilmiş yüksek frekanslı ticaret sistemlerinde
 * Bu sınıf hafif ve performans odaklı hızlı veritabanı operasyonları için tasarlanmıştır
 */

export class RobotConfiguration {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.type = data.type || "Order";
        this.name = data.name || "";
        this.userFriendlyName = data.userFriendlyName || "";
        this.cssClass = data.cssClass || "";
        this.customerFriendlyName = data.customerFriendlyName || "";
        this.editorType = data.editorType || "Textbox";
        this.unit = data.unit || "";
        this.digitCount = data.digitCount || 2;
        this.editorChangeStep = data.editorChangeStep || 0.01;
        
        // Değer alanları
        this.boolValue = data.boolValue !== undefined ? data.boolValue : null;
        this.doubleValue = data.doubleValue !== undefined ? data.doubleValue : null;
        this.stringValue = data.stringValue || null;
        this.percentageValue = data.percentageValue !== undefined ? data.percentageValue : null;
        
        this.orderNumber = data.orderNumber || 0;
        this.isVisible = data.isVisible !== undefined ? data.isVisible : true;
        this.dateAdded = data.dateAdded ? new Date(data.dateAdded) : new Date();
        this._hash = data._hash || null;
    }

    /**
     * Konfigürasyon için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            this._hash = this.computeHash(this.type);
        }
        return this._hash;
    }

    /**
     * String için basit hash hesaplama
     */
    computeHash(str) {
        if (!str) return 0;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32-bit integer'a dönüştür
        }
        return Math.abs(hash);
    }

    /**
     * İki konfigürasyonun eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.id === other.id && 
               this.type === other.type && 
               this.name === other.name;
    }

    /**
     * Konfigürasyonu doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === '') {
            errors.push("Konfigürasyon adı gerekli");
        }
        
        if (this.name && this.name.length > 32) {
            errors.push("Konfigürasyon adı 32 karakterden uzun olamaz");
        }
        
        if (!this.type) {
            errors.push("Konfigürasyon tipi gerekli");
        }
        
        if (this.digitCount < 0) {
            errors.push("Digit count negatif olamaz");
        }
        
        if (this.editorChangeStep < 0) {
            errors.push("Editor change step negatif olamaz");
        }
        
        if (this.orderNumber < 0) {
            errors.push("Order number negatif olamaz");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Konfigürasyonu kopyalar
     */
    clone() {
        return new RobotConfiguration({
            ...this,
            dateAdded: new Date(this.dateAdded),
            _hash: null
        });
    }

    /**
     * Konfigürasyonu JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new RobotConfiguration(data);
        } catch (error) {
            console.error("RobotConfiguration JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Konfigürasyonu JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify({
                id: this.id,
                type: this.type,
                name: this.name,
                userFriendlyName: this.userFriendlyName,
                cssClass: this.cssClass,
                customerFriendlyName: this.customerFriendlyName,
                editorType: this.editorType,
                unit: this.unit,
                digitCount: this.digitCount,
                editorChangeStep: this.editorChangeStep,
                boolValue: this.boolValue,
                doubleValue: this.doubleValue,
                stringValue: this.stringValue,
                percentageValue: this.percentageValue,
                orderNumber: this.orderNumber,
                isVisible: this.isVisible,
                dateAdded: this.dateAdded.toISOString()
            });
        } catch (error) {
            console.error("RobotConfiguration JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir konfigürasyon objesi oluşturur (static method)
     */
    static create(type, name, userFriendlyName) {
        return new RobotConfiguration({
            type: type,
            name: name,
            userFriendlyName: userFriendlyName
        });
    }

    /**
     * Tip badge rengini getirir
     */
    getTypeBadgeClass() {
        switch(this.type) {
            case 'Order': return 'bg-primary';
            case 'Arbitrage': return 'bg-success';
            case 'Risk': return 'bg-warning';
            case 'Performance': return 'bg-info';
            case 'System': return 'bg-secondary';
            default: return 'bg-dark';
        }
    }

    /**
     * Tip adını getirir
     */
    getTypeName() {
        switch(this.type) {
            case 'Order': return 'Sipariş';
            case 'Arbitrage': return 'Arbitraj';
            case 'Risk': return 'Risk';
            case 'Performance': return 'Performans';
            case 'System': return 'Sistem';
            default: return this.type || 'Bilinmeyen';
        }
    }

    /**
     * Editor tip badge rengini getirir
     */
    getEditorTypeBadgeClass() {
        switch(this.editorType) {
            case 'Textbox': return 'bg-primary';
            case 'Dropdown': return 'bg-success';
            case 'Checkbox': return 'bg-warning';
            case 'Slider': return 'bg-info';
            case 'ColorPicker': return 'bg-secondary';
            default: return 'bg-dark';
        }
    }

    /**
     * Editor tip adını getirir
     */
    getEditorTypeName() {
        switch(this.editorType) {
            case 'Textbox': return 'Metin Kutusu';
            case 'Dropdown': return 'Açılır Liste';
            case 'Checkbox': return 'Onay Kutusu';
            case 'Slider': return 'Kaydırıcı';
            case 'ColorPicker': return 'Renk Seçici';
            default: return this.editorType || 'Bilinmeyen';
        }
    }

    /**
     * Görünürlük badge rengini getirir
     */
    getVisibilityBadgeClass() {
        return this.isVisible ? 'bg-success' : 'bg-secondary';
    }

    /**
     * Görünürlük adını getirir
     */
    getVisibilityName() {
        return this.isVisible ? 'Görünür' : 'Gizli';
    }

    /**
     * Değer tipini getirir
     */
    getValueType() {
        if (this.boolValue !== null) return 'Boolean';
        if (this.doubleValue !== null) return 'Decimal';
        if (this.stringValue !== null) return 'String';
        if (this.percentageValue !== null) return 'Percentage';
        return 'None';
    }

    /**
     * Değeri formatlar
     */
    getFormattedValue() {
        if (this.boolValue !== null) {
            return this.boolValue ? 'Evet' : 'Hayır';
        }
        if (this.doubleValue !== null) {
            return this.doubleValue.toFixed(this.digitCount) + (this.unit ? ` ${this.unit}` : '');
        }
        if (this.stringValue !== null) {
            return this.stringValue;
        }
        if (this.percentageValue !== null) {
            return this.percentageValue.toFixed(this.digitCount) + '%';
        }
        return 'N/A';
    }

    /**
     * Tarihi formatlar
     */
    getDateAddedFormatted() {
        return this.dateAdded.toLocaleString('tr-TR');
    }

    /**
     * Konfigürasyonun aktif olup olmadığını kontrol eder
     */
    isActive() {
        return this.isVisible;
    }

    /**
     * Konfigürasyonun sistem tipinde olup olmadığını kontrol eder
     */
    isSystemType() {
        return this.type === 'System';
    }

    /**
     * Konfigürasyonun order tipinde olup olmadığını kontrol eder
     */
    isOrderType() {
        return this.type === 'Order';
    }

    /**
     * Konfigürasyonun arbitraj tipinde olup olmadığını kontrol eder
     */
    isArbitrageType() {
        return this.type === 'Arbitrage';
    }

    /**
     * Örnek robot konfigürasyon verisi
     */
    static getSampleData() {
        return [
            new RobotConfiguration({
                id: 1,
                type: "Order",
                name: "max_order_size",
                userFriendlyName: "Maksimum Sipariş Boyutu",
                cssClass: "order-config",
                customerFriendlyName: "Maksimum Sipariş Miktarı",
                editorType: "Textbox",
                unit: "BTC",
                digitCount: 8,
                editorChangeStep: 0.001,
                doubleValue: 1.5,
                orderNumber: 1.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T10:00:00")
            }),
            new RobotConfiguration({
                id: 2,
                type: "Order",
                name: "min_order_size",
                userFriendlyName: "Minimum Sipariş Boyutu",
                cssClass: "order-config",
                customerFriendlyName: "Minimum Sipariş Miktarı",
                editorType: "Textbox",
                unit: "BTC",
                digitCount: 8,
                editorChangeStep: 0.001,
                doubleValue: 0.001,
                orderNumber: 2.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T10:30:00")
            }),
            new RobotConfiguration({
                id: 3,
                type: "Arbitrage",
                name: "min_profit_threshold",
                userFriendlyName: "Minimum Kar Eşiği",
                cssClass: "arbitrage-config",
                customerFriendlyName: "Minimum Kar Marjı",
                editorType: "Slider",
                unit: "%",
                digitCount: 4,
                editorChangeStep: 0.1,
                percentageValue: 0.5,
                orderNumber: 3.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T11:00:00")
            }),
            new RobotConfiguration({
                id: 4,
                type: "Arbitrage",
                name: "max_slippage",
                userFriendlyName: "Maksimum Slippage",
                cssClass: "arbitrage-config",
                customerFriendlyName: "Maksimum Kayma",
                editorType: "Textbox",
                unit: "%",
                digitCount: 4,
                editorChangeStep: 0.01,
                percentageValue: 2.0,
                orderNumber: 4.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T11:30:00")
            }),
            new RobotConfiguration({
                id: 5,
                type: "Risk",
                name: "max_daily_loss",
                userFriendlyName: "Maksimum Günlük Zarar",
                cssClass: "risk-config",
                customerFriendlyName: "Günlük Zarar Limiti",
                editorType: "Textbox",
                unit: "USDT",
                digitCount: 2,
                editorChangeStep: 10,
                doubleValue: 1000.00,
                orderNumber: 5.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T12:00:00")
            }),
            new RobotConfiguration({
                id: 6,
                type: "Risk",
                name: "stop_loss_enabled",
                userFriendlyName: "Stop Loss Aktif",
                cssClass: "risk-config",
                customerFriendlyName: "Zarar Durdurma",
                editorType: "Checkbox",
                digitCount: 0,
                editorChangeStep: 1,
                boolValue: true,
                orderNumber: 6.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T12:30:00")
            }),
            new RobotConfiguration({
                id: 7,
                type: "Performance",
                name: "execution_timeout",
                userFriendlyName: "Yürütme Zaman Aşımı",
                cssClass: "performance-config",
                customerFriendlyName: "İşlem Süresi Limiti",
                editorType: "Textbox",
                unit: "ms",
                digitCount: 0,
                editorChangeStep: 100,
                doubleValue: 5000,
                orderNumber: 7.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T13:00:00")
            }),
            new RobotConfiguration({
                id: 8,
                type: "Performance",
                name: "max_concurrent_orders",
                userFriendlyName: "Maksimum Eşzamanlı Sipariş",
                cssClass: "performance-config",
                customerFriendlyName: "Aynı Anda Maksimum İşlem",
                editorType: "Dropdown",
                digitCount: 0,
                editorChangeStep: 1,
                doubleValue: 10,
                orderNumber: 8.00,
                isVisible: true,
                dateAdded: new Date("2024-01-15T13:30:00")
            }),
            new RobotConfiguration({
                id: 9,
                type: "System",
                name: "debug_mode",
                userFriendlyName: "Debug Modu",
                cssClass: "system-config",
                customerFriendlyName: "Hata Ayıklama",
                editorType: "Checkbox",
                digitCount: 0,
                editorChangeStep: 1,
                boolValue: false,
                orderNumber: 9.00,
                isVisible: false,
                dateAdded: new Date("2024-01-15T14:00:00")
            }),
            new RobotConfiguration({
                id: 10,
                type: "System",
                name: "log_level",
                userFriendlyName: "Log Seviyesi",
                cssClass: "system-config",
                customerFriendlyName: "Kayıt Detayı",
                editorType: "Dropdown",
                digitCount: 0,
                editorChangeStep: 1,
                stringValue: "INFO",
                orderNumber: 10.00,
                isVisible: false,
                dateAdded: new Date("2024-01-15T14:30:00")
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.RobotConfiguration = RobotConfiguration;
} 