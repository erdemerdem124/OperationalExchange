// Robot Configuration veri işleme fonksiyonları
export function handleRobotConfigurationData(configurations) {
    console.log("Robot Configuration verisi alındı:", configurations);
    
    configurations.forEach(config => {
        console.log("ID:", config.id);
        console.log("İsim:", config.name);
        console.log("Tip:", config.type);
        console.log("Editör Tipi:", config.editorType);
    });
    
    // DOM'u güncelle
    updateRobotConfigurationDisplay(configurations);
    updateRobotConfigurationStatistics(configurations);
}

// RobotConfigurationDisplay display'ini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateRobotConfigurationDisplay(data) {
    console.log("RobotConfigurationDisplay verisi alındı, modüler yapı için hazır:", data);
    // Tablo oluşturma kodu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// RobotConfigurationStatistics istatistiklerini güncelle - Tablo kaldırıldı, modüler yapı için hazır
function updateRobotConfigurationStatistics(data) {
    console.log("RobotConfigurationStatistics istatistikleri hesaplandı, modüler yapı için hazır:", data);
    // İstatistik tablosu kaldırıldı - Umbraco content'te widget olarak yazılacak
}

// Robot Configuration detaylarını göster
export function showRobotConfigurationDetails(configId) {
    console.log("Robot Configuration detayları gösteriliyor:", configId);
    // Modal implementasyonu burada olacak
}

// Robot Configuration düzenle
export function editRobotConfiguration(configId) {
    console.log("Robot Configuration düzenleniyor:", configId);
    // Düzenleme implementasyonu burada olacak
}

// Robot Configuration aktif yap
export function activateRobotConfiguration(configId) {
    console.log("Robot Configuration aktif yapılıyor:", configId);
    // Aktivasyon implementasyonu burada olacak
}

// Robot Configuration pasif yap
export function deactivateRobotConfiguration(configId) {
    console.log("Robot Configuration pasif yapılıyor:", configId);
    // Deaktivasyon implementasyonu burada olacak
}

// Global fonksiyonlar olarak da ekle (HTML'den çağrılabilir)
window.showRobotConfigurationDetails = showRobotConfigurationDetails;
window.editRobotConfiguration = editRobotConfiguration;
window.activateRobotConfiguration = activateRobotConfiguration;
window.deactivateRobotConfiguration = deactivateRobotConfiguration;

// Yardımcı fonksiyonlar
function getConfigurationValue(config) {
    switch(config.type) {
        case 'String': return config.stringValue || '';
        case 'Integer': return config.integerValue || 0;
        case 'Decimal': return config.decimalValue || 0;
        case 'Boolean': return config.booleanValue || false;
        case 'DateTime': return config.dateTimeValue || null;
        default: return 'N/A';
    }
}

function getConfigurationTypeBadgeClass(type) {
    switch(type) {
        case 'String': return 'bg-info';
        case 'Integer': return 'bg-primary';
        case 'Decimal': return 'bg-success';
        case 'Boolean': return 'bg-warning';
        case 'DateTime': return 'bg-secondary';
        default: return 'bg-dark';
    }
}

function getEditorTypeBadgeClass(editorType) {
    switch(editorType) {
        case 'TextBox': return 'bg-info';
        case 'NumberBox': return 'bg-primary';
        case 'CheckBox': return 'bg-warning';
        case 'DatePicker': return 'bg-secondary';
        case 'DropDown': return 'bg-success';
        default: return 'bg-dark';
    }
}

function getVisibilityBadgeClass(isVisible) {
    return isVisible ? 'bg-success' : 'bg-danger';
}

function getVisibilityText(isVisible) {
    return isVisible ? 'Görünür' : 'Gizli';
}

// Örnek robot configuration verisi
export function getSampleRobotConfigurationData() {
    return [
        {
            "id": 1,
            "name": "MaxTradeAmount",
            "type": "Decimal",
            "editorType": "NumberBox",
            "stringValue": null,
            "integerValue": null,
            "decimalValue": 1000.00,
            "booleanValue": null,
            "dateTimeValue": null,
            "unit": "USDT",
            "isVisible": true,
            "cssClass": "form-control",
            "userFriendlyName": "Maksimum İşlem Miktarı",
            "customerFriendlyName": "Maksimum İşlem Tutarı",
            "orderNumber": 1
        },
        {
            "id": 2,
            "name": "EnableArbitrage",
            "type": "Boolean",
            "editorType": "CheckBox",
            "stringValue": null,
            "integerValue": null,
            "decimalValue": null,
            "booleanValue": true,
            "dateTimeValue": null,
            "unit": null,
            "isVisible": true,
            "cssClass": "form-check-input",
            "userFriendlyName": "Arbitraj Etkinleştir",
            "customerFriendlyName": "Arbitraj İşlemlerini Etkinleştir",
            "orderNumber": 2
        },
        {
            "id": 3,
            "name": "MinProfitThreshold",
            "type": "Decimal",
            "editorType": "NumberBox",
            "stringValue": null,
            "integerValue": null,
            "decimalValue": 0.5,
            "booleanValue": null,
            "dateTimeValue": null,
            "unit": "%",
            "isVisible": true,
            "cssClass": "form-control",
            "userFriendlyName": "Minimum Kar Eşiği",
            "customerFriendlyName": "Minimum Kar Yüzdesi",
            "orderNumber": 3
        },
        {
            "id": 4,
            "name": "TradingStrategy",
            "type": "String",
            "editorType": "DropDown",
            "stringValue": "Conservative",
            "integerValue": null,
            "decimalValue": null,
            "booleanValue": null,
            "dateTimeValue": null,
            "unit": null,
            "isVisible": true,
            "cssClass": "form-select",
            "userFriendlyName": "İşlem Stratejisi",
            "customerFriendlyName": "Trading Stratejisi",
            "orderNumber": 4
        },
        {
            "id": 5,
            "name": "MaxOpenPositions",
            "type": "Integer",
            "editorType": "NumberBox",
            "stringValue": null,
            "integerValue": 5,
            "decimalValue": null,
            "booleanValue": null,
            "dateTimeValue": null,
            "unit": "pozisyon",
            "isVisible": true,
            "cssClass": "form-control",
            "userFriendlyName": "Maksimum Açık Pozisyon",
            "customerFriendlyName": "Maksimum Açık İşlem Sayısı",
            "orderNumber": 5
        }
    ];
} 

