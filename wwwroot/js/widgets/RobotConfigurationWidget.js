/**
 * RobotConfiguration Widget - Modüler yapı için Umbraco content'te kullanılacak
 * Bu dosya Umbraco content'te import edilecek
 */

export class RobotConfigurationWidget {
    constructor(containerId = 'robot-configuration-widget-container') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.configurations = [];
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error(`Container with ID '${this.containerId}' not found!`);
            return;
        }

        // Statik veri ile başlat
        this.loadSampleData();
        this.render();
        this.setupEventListeners();
    }

    loadSampleData() {
        this.configurations = this.getSampleRobotConfigurationData();
        console.log('RobotConfiguration sample data loaded:', this.configurations);
    }

    getSampleRobotConfigurationData() {
        return [
            {
                "id": 1,
                "name": "BistMinFreeCapital",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 10000000,
                "decimalValue": 10000000,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "BistMinFreeCapital",
                "customerFriendlyName": "Bist Minimum Serbest Sermaye",
                "orderNumber": 1
            },
            {
                "id": 2,
                "name": "ViopMinFreeCapital",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 2000000,
                "decimalValue": 2000000,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "ViopMinFreeCapital",
                "customerFriendlyName": "Viop Minimum Serbest Sermaye",
                "orderNumber": 2
            },
            {
                "id": 3,
                "name": "BistShortPrevention",
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
                "userFriendlyName": "BistShortPrevention",
                "customerFriendlyName": "Bist Kısa Pozisyon Önleme",
                "orderNumber": 3
            },
            {
                "id": 4,
                "name": "ViopLongPrevention",
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
                "userFriendlyName": "ViopLongPrevention",
                "customerFriendlyName": "Viop Uzun Pozisyon Önleme",
                "orderNumber": 4
            },
            {
                "id": 5,
                "name": "BistPortfolioRatio",
                "type": "Decimal",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": 50.00,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": "%",
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "BistPortfolioRatio",
                "customerFriendlyName": "Bist Portföy Oranı",
                "orderNumber": 5
            },
            {
                "id": 6,
                "name": "ViopPortfolioRatio",
                "type": "Decimal",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": 40.00,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": "%",
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "ViopPortfolioRatio",
                "customerFriendlyName": "Viop Portföy Oranı",
                "orderNumber": 6
            },
            {
                "id": 7,
                "name": "PortfolioDominationLimit",
                "type": "Decimal",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": 33.00,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": "%",
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PortfolioDominationLimit",
                "customerFriendlyName": "Portföy Hakimiyet Limiti",
                "orderNumber": 7
            },
            {
                "id": 8,
                "name": "AutomaticPortfolioCleanupEnabled",
                "type": "Boolean",
                "editorType": "CheckBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": null,
                "booleanValue": false,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-check-input",
                "userFriendlyName": "AutomaticPortfolioCleanupEnabled",
                "customerFriendlyName": "Otomatik Portföy Temizleme",
                "orderNumber": 8
            },
            {
                "id": 9,
                "name": "IsRebalancerRobotOn",
                "type": "Boolean",
                "editorType": "CheckBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": null,
                "booleanValue": false,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-check-input",
                "userFriendlyName": "IsRebalancerRobotOn",
                "customerFriendlyName": "Rebalancer Robot Aktif",
                "orderNumber": 9
            },
            {
                "id": 10,
                "name": "SlippageProtection",
                "type": "Boolean",
                "editorType": "CheckBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": null,
                "booleanValue": false,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-check-input",
                "userFriendlyName": "SlippageProtection",
                "customerFriendlyName": "Slippage Koruması",
                "orderNumber": 10
            },
            {
                "id": 11,
                "name": "StopRobotAfterUnsuccesfulOrders",
                "type": "Boolean",
                "editorType": "CheckBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": null,
                "booleanValue": false,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-check-input",
                "userFriendlyName": "StopRobotAfterUnsuccesfulOrders",
                "customerFriendlyName": "Başarısız Siparişlerden Sonra Robotu Durdur",
                "orderNumber": 11
            },
            {
                "id": 12,
                "name": "StopWhilePortfolioCrossCheck",
                "type": "Boolean",
                "editorType": "CheckBox",
                "stringValue": null,
                "integerValue": null,
                "decimalValue": null,
                "booleanValue": false,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-check-input",
                "userFriendlyName": "StopWhilePortfolioCrossCheck",
                "customerFriendlyName": "Portföy Çapraz Kontrol Sırasında Durdur",
                "orderNumber": 12
            },
            {
                "id": 13,
                "name": "TimeoutReturnDropStep",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 3,
                "decimalValue": 3,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "TimeoutReturnDropStep",
                "customerFriendlyName": "Zaman Aşımı Dönüş Düşüş Adımı",
                "orderNumber": 13
            },
            {
                "id": 14,
                "name": "FirstReturnDropTarget",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 2,
                "decimalValue": 2,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "FirstReturnDropTarget",
                "customerFriendlyName": "İlk Dönüş Düşüş Hedefi",
                "orderNumber": 14
            },
            {
                "id": 15,
                "name": "MaxOrderAmount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 1000,
                "decimalValue": 1000,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "MaxOrderAmount",
                "customerFriendlyName": "Maksimum Sipariş Miktarı",
                "orderNumber": 15
            },
            {
                "id": 16,
                "name": "MaxOrderBookTimeDifferenceMs",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 500,
                "decimalValue": 500,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "MaxOrderBookTimeDifferenceMs",
                "customerFriendlyName": "Maksimum Emir Defteri Zaman Farkı (ms)",
                "orderNumber": 16
            },
            {
                "id": 17,
                "name": "MaxPositionCount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 5,
                "decimalValue": 5,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "MaxPositionCount",
                "customerFriendlyName": "Maksimum Pozisyon Sayısı",
                "orderNumber": 17
            },
            {
                "id": 18,
                "name": "MaxReturnDropCount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 3,
                "decimalValue": 3,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "MaxReturnDropCount",
                "customerFriendlyName": "Maksimum Dönüş Düşüş Sayısı",
                "orderNumber": 18
            },
            {
                "id": 19,
                "name": "OpenOrderCount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 10,
                "decimalValue": 10,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "OpenOrderCount",
                "customerFriendlyName": "Açık Sipariş Sayısı",
                "orderNumber": 19
            },
            {
                "id": 20,
                "name": "OrderDelayMs",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 500,
                "decimalValue": 500,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "OrderDelayMs",
                "customerFriendlyName": "Sipariş Gecikmesi (ms)",
                "orderNumber": 20
            },
            {
                "id": 21,
                "name": "OrderThreshold",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 1,
                "decimalValue": 1,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "OrderThreshold",
                "customerFriendlyName": "Sipariş Eşiği",
                "orderNumber": 21
            },
            {
                "id": 22,
                "name": "OrderTimeoutSec",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 60,
                "decimalValue": 60,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "OrderTimeoutSec",
                "customerFriendlyName": "Sipariş Zaman Aşımı (sn)",
                "orderNumber": 22
            },
            {
                "id": 23,
                "name": "PortfolioCrossCheckWarningThreshold",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 1,
                "decimalValue": 1,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PortfolioCrossCheckWarningThreshold",
                "customerFriendlyName": "Portföy Çapraz Kontrol Uyarı Eşiği",
                "orderNumber": 23
            },
            {
                "id": 24,
                "name": "PortfolioCrossCheckErrorThreshold",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 2,
                "decimalValue": 2,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PortfolioCrossCheckErrorThreshold",
                "customerFriendlyName": "Portföy Çapraz Kontrol Hata Eşiği",
                "orderNumber": 24
            },
            {
                "id": 25,
                "name": "PortfolioCrossCheckTimeSec",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 60,
                "decimalValue": 60,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PortfolioCrossCheckTimeSec",
                "customerFriendlyName": "Portföy Çapraz Kontrol Zamanı (sn)",
                "orderNumber": 25
            },
            {
                "id": 26,
                "name": "PositionEntryAmountLot",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 5,
                "decimalValue": 5,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PositionEntryAmountLot",
                "customerFriendlyName": "Pozisyon Giriş Miktarı (Lot)",
                "orderNumber": 26
            },
            {
                "id": 27,
                "name": "PositionEntryThresholdAmount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 50,
                "decimalValue": 50,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PositionEntryThresholdAmount",
                "customerFriendlyName": "Pozisyon Giriş Eşik Miktarı",
                "orderNumber": 27
            },
            {
                "id": 28,
                "name": "PositionExitPercentage",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 10,
                "decimalValue": 10,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PositionExitPercentage",
                "customerFriendlyName": "Pozisyon Çıkış Yüzdesi",
                "orderNumber": 28
            },
            {
                "id": 29,
                "name": "PositionExitThresholdAmount",
                "type": "Integer",
                "editorType": "NumberBox",
                "stringValue": null,
                "integerValue": 50,
                "decimalValue": 50,
                "booleanValue": null,
                "dateTimeValue": null,
                "unit": null,
                "isVisible": true,
                "cssClass": "form-control",
                "userFriendlyName": "PositionExitThresholdAmount",
                "customerFriendlyName": "Pozisyon Çıkış Eşik Miktarı",
                "orderNumber": 29
            }
        ];
    }

    setupEventListeners() {
        // Form submit event listener
        const form = this.container.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveConfiguration();
            });
        }

        // Input change event listeners
        const inputs = this.container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateConfigurationValue(e.target.name, e.target.value, e.target.type);
            });
        });
    }

    updateConfigurationValue(name, value, type) {
        const config = this.configurations.find(c => c.name === name);
        if (config) {
            if (type === 'checkbox') {
                config.booleanValue = value === 'on' || value === true;
            } else if (type === 'number') {
                config.decimalValue = parseFloat(value);
                config.integerValue = parseInt(value);
            } else {
                config.stringValue = value;
            }
            console.log(`Configuration updated: ${name} = ${value}`);
        }
    }

    saveConfiguration() {
        console.log('Saving configuration:', this.configurations);
        alert('Konfigürasyon kaydedildi!');
    }

    getFormattedValue(config) {
        if (config.booleanValue !== null) {
            return config.booleanValue ? 'true' : 'false';
        } else if (config.decimalValue !== null) {
            return config.decimalValue.toString();
        } else if (config.integerValue !== null) {
            return config.integerValue.toString();
        } else if (config.stringValue !== null) {
            return config.stringValue;
        }
        return '';
    }

    getInputType(config) {
        switch (config.editorType) {
            case 'CheckBox':
                return 'checkbox';
            case 'NumberBox':
                return 'number';
            case 'DropDown':
                return 'text';
            default:
                return 'text';
        }
    }

    getInputValue(config) {
        if (config.editorType === 'CheckBox') {
            return config.booleanValue ? 'checked' : '';
        } else if (config.editorType === 'NumberBox') {
            return config.decimalValue || config.integerValue || '';
        } else {
            return config.stringValue || '';
        }
    }

    getInputStyle(config) {
        if (config.editorType === 'CheckBox') {
            return 'width: 20px; height: 20px;';
        } else if (config.name.includes('Capital') || config.name.includes('Ratio') || config.name.includes('DominationLimit')) {
            return 'width: 120px; height: 32px;';
        } else {
            return 'width: 80px; height: 32px;';
        }
    }

    render() {
        this.container.innerHTML = `
            <style>
                .robot-config-table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin-bottom: 24px !important;
                    background-color: transparent !important;
                    text-align: center !important;
                    margin-left: 0 !important;
                    margin-right: 0 !important;
                    display: table !important;
                    max-width: none !important;
                }
                .robot-config-table td {
                    padding: 4px 2px !important;
                    background-color: transparent !important;
                }
                .robot-config-table label {
                    color: #fff !important;
                    text-align: center !important;
                    display: block !important;
                    padding-left: 20px !important;
                }
                .robot-config-table input[type="number"],
                .robot-config-table input[type="text"] {
                    border: none !important;
                    border-radius: 4px !important;
                    padding: 4px 8px !important;
                    background-color: white !important;
                    color: black !important;
                    outline: none !important;
                    box-shadow: none !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                }
                .robot-config-table input[type="checkbox"] {
                    margin: 0 !important;
                    background-color: white !important;
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                }
                .kucuk-kaydet-btn {
                    background-color: #007bff !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: 4px !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                }
                .kucuk-kaydet-btn:hover {
                    background-color: #0056b3 !important;
                }
                .section-spacer {
                    height: 8px !important;
                }
                /* Tüm input'lar için genel kural */
                .robot-config-table input {
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    border-width: 0 !important;
                    border-style: none !important;
                    border-color: transparent !important;
                }
                /* Umbraco border kuralını override et */
                .robot-config-table td {
                    border-top: none !important;
                    border-bottom: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border: none !important;
                }
                /* Tüm border'ları kaldır */
                .robot-config-table,
                .robot-config-table th,
                .robot-config-table td {
                    border: none !important;
                    border-top: none !important;
                    border-bottom: none !important;
                    border-left: none !important;
                    border-right: none !important;
                }
            </style>
            
            <table class="robot-config-table">
                    <tbody>
                        ${this.configurations.map(config => this.renderConfigurationRow(config)).join('')}
                        <tr>
                        <td colspan="2">
                                <div style="display: flex; justify-content: center;">
                                    <button type="submit" class="kucuk-kaydet-btn">Kaydet</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
        `;

        // Event listener'ları tekrar bağla
        this.setupEventListeners();
    }

    renderConfigurationRow(config) {
        const inputType = this.getInputType(config);
        const inputValue = this.getInputValue(config);
        const inputStyle = this.getInputStyle(config);
        
        // Yüzde değerleri için özel format
        let displayValue = inputValue;
        if (config.unit === '%' && config.decimalValue !== null) {
            displayValue = config.decimalValue.toFixed(2).replace('.', ',') + '%';
        }
            
            return `
                <tr>
                <td style="color:#fff; padding:4px 2px; text-align:right;">
                    <label for="${config.name}">${config.name}</label>
                    </td>
                <td style="padding:4px 2px;">
                    <input 
                        type="${inputType}" 
                        id="${config.name}" 
                        name="${config.name}" 
                        value="${inputType === 'checkbox' ? '' : displayValue}"
                        ${inputType === 'checkbox' && inputValue === 'checked' ? 'checked' : ''}
                        style="${inputStyle}" 
                    />
                    </td>
                </tr>
            `;
    }

    updateData(newData) {
        this.configurations = newData;
        this.render();
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.RobotConfigurationWidget = RobotConfigurationWidget;
} 