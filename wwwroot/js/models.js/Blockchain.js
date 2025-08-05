/**
 * Blockchain DTO - Yüksek frekanslı arbitraj operasyonları için hafif blockchain konfigürasyonu
 * Bellek verimliliği ve hızlı aramalar için optimize edilmiş
 * Çapraz zincir arbitraj tespiti sırasında kullanılır
 * Veritabanında saklanmaz, sadece çalışma zamanı konfigürasyonu olarak hizmet verir
 */

export class Blockchain {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.networkId = data.networkId || 0;
        this.name = data.name || "";
        this.blockchainType = data.blockchainType || "ETH";
        this.rpcUrl = data.rpcUrl || "";
        this._hash = data._hash || null;
    }

    /**
     * Blockchain'in string temsilini döndürür
     */
    toString() {
        return `${this.name} (${this.blockchainType}) - Network ID: ${this.networkId}`;
    }

    /**
     * İki blockchain'in eşit olup olmadığını kontrol eder
     */
    equals(other) {
        if (!other) return false;
        return this.networkId === other.networkId && this.name === other.name;
    }

    /**
     * Blockchain için hash değeri hesaplar
     */
    getHash() {
        if (this._hash === null || this._hash === undefined) {
            const str = this.toString();
            this._hash = this.computeHash(str);
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
     * Blockchain'i doğrular
     */
    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === "") {
            errors.push("Blockchain adı boş olamaz");
        }
        
        if (this.networkId <= 0) {
            errors.push("Network ID pozitif olmalıdır");
        }
        
        if (!this.blockchainType || this.blockchainType.trim() === "") {
            errors.push("Blockchain tipi boş olamaz");
        }
        
        if (!this.rpcUrl || this.rpcUrl.trim() === "") {
            errors.push("RPC URL boş olamaz");
        }
        
        // RPC URL formatını kontrol et
        if (this.rpcUrl && !this.isValidRpcUrl(this.rpcUrl)) {
            errors.push("Geçersiz RPC URL formatı");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * RPC URL formatını kontrol eder
     */
    isValidRpcUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:';
        } catch {
            return false;
        }
    }

    /**
     * Blockchain'i kopyalar
     */
    clone() {
        return new Blockchain({
            ...this,
            _hash: null // Hash'i yeniden hesaplanacak
        });
    }

    /**
     * Blockchain'i JSON'dan parse eder
     */
    static fromJson(json) {
        try {
            const data = JSON.parse(json);
            return new Blockchain(data);
        } catch (error) {
            console.error("Blockchain JSON parse hatası:", error);
            return null;
        }
    }

    /**
     * Blockchain'i JSON'a dönüştürür
     */
    toJson() {
        try {
            return JSON.stringify(this);
        } catch (error) {
            console.error("Blockchain JSON stringify hatası:", error);
            return null;
        }
    }

    /**
     * Yeni bir blockchain objesi oluşturur (static method)
     */
    static create(name, networkId, blockchainType, rpcUrl) {
        return new Blockchain({
            name: name,
            networkId: networkId,
            blockchainType: blockchainType,
            rpcUrl: rpcUrl
        });
    }

    /**
     * Blockchain tipini kontrol eder (static method)
     */
    static isValidBlockchainType(blockchainType) {
        const validTypes = ["ETH", "BSC", "POLYGON", "ARBITRUM", "OPTIMISM", "AVALANCHE", "FANTOM", "CRONOS"];
        return validTypes.includes(blockchainType.toUpperCase());
    }

    /**
     * Network ID'yi kontrol eder (static method)
     */
    static isValidNetworkId(networkId) {
        return networkId > 0 && Number.isInteger(networkId);
    }

    /**
     * Blockchain tipi adını getirir
     */
    getBlockchainTypeName() {
        switch(this.blockchainType.toUpperCase()) {
            case 'ETH': return 'Ethereum';
            case 'BSC': return 'Binance Smart Chain';
            case 'POLYGON': return 'Polygon';
            case 'ARBITRUM': return 'Arbitrum';
            case 'OPTIMISM': return 'Optimism';
            case 'AVALANCHE': return 'Avalanche';
            case 'FANTOM': return 'Fantom';
            case 'CRONOS': return 'Cronos';
            default: return this.blockchainType;
        }
    }

    /**
     * Blockchain tipi badge rengini getirir
     */
    getBlockchainTypeBadgeClass() {
        switch(this.blockchainType.toUpperCase()) {
            case 'ETH': return 'bg-primary';
            case 'BSC': return 'bg-warning';
            case 'POLYGON': return 'bg-purple';
            case 'ARBITRUM': return 'bg-info';
            case 'OPTIMISM': return 'bg-danger';
            case 'AVALANCHE': return 'bg-success';
            case 'FANTOM': return 'bg-secondary';
            case 'CRONOS': return 'bg-dark';
            default: return 'bg-secondary';
        }
    }

    /**
     * Blockchain ikonunu getirir
     */
    getBlockchainIcon() {
        switch(this.blockchainType.toUpperCase()) {
            case 'ETH': return 'fa-cube';
            case 'BSC': return 'fa-link';
            case 'POLYGON': return 'fa-diamond';
            case 'ARBITRUM': return 'fa-bolt';
            case 'OPTIMISM': return 'fa-rocket';
            case 'AVALANCHE': return 'fa-mountain';
            case 'FANTOM': return 'fa-ghost';
            case 'CRONOS': return 'fa-clock';
            default: return 'fa-link';
        }
    }

    /**
     * Örnek blockchain verisi
     */
    static getSampleData() {
        return [
            new Blockchain({ 
                id: 1, 
                name: "Ethereum Mainnet", 
                networkId: 1, 
                blockchainType: "ETH", 
                rpcUrl: "https://mainnet.infura.io/v3/YOUR-PROJECT-ID" 
            }),
            new Blockchain({ 
                id: 2, 
                name: "Binance Smart Chain", 
                networkId: 56, 
                blockchainType: "BSC", 
                rpcUrl: "https://bsc-dataseed1.binance.org/" 
            }),
            new Blockchain({ 
                id: 3, 
                name: "Polygon Mainnet", 
                networkId: 137, 
                blockchainType: "POLYGON", 
                rpcUrl: "https://polygon-rpc.com/" 
            }),
            new Blockchain({ 
                id: 4, 
                name: "Arbitrum One", 
                networkId: 42161, 
                blockchainType: "ARBITRUM", 
                rpcUrl: "https://arb1.arbitrum.io/rpc" 
            }),
            new Blockchain({ 
                id: 5, 
                name: "Optimism", 
                networkId: 10, 
                blockchainType: "OPTIMISM", 
                rpcUrl: "https://mainnet.optimism.io" 
            }),
            new Blockchain({ 
                id: 6, 
                name: "Avalanche C-Chain", 
                networkId: 43114, 
                blockchainType: "AVALANCHE", 
                rpcUrl: "https://api.avax.network/ext/bc/C/rpc" 
            }),
            new Blockchain({ 
                id: 7, 
                name: "Fantom Opera", 
                networkId: 250, 
                blockchainType: "FANTOM", 
                rpcUrl: "https://rpc.ftm.tools/" 
            }),
            new Blockchain({ 
                id: 8, 
                name: "Cronos Mainnet", 
                networkId: 25, 
                blockchainType: "CRONOS", 
                rpcUrl: "https://evm.cronos.org" 
            }),
            new Blockchain({ 
                id: 9, 
                name: "Ethereum Goerli", 
                networkId: 5, 
                blockchainType: "ETH", 
                rpcUrl: "https://goerli.infura.io/v3/YOUR-PROJECT-ID" 
            }),
            new Blockchain({ 
                id: 10, 
                name: "BSC Testnet", 
                networkId: 97, 
                blockchainType: "BSC", 
                rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/" 
            })
        ];
    }
}

// Global erişim için (fallback)
if (typeof window !== 'undefined') {
    window.Blockchain = Blockchain;
} 