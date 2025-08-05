using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Deneme1.Controllers;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Deneme1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestDataController : ControllerBase
    {
        private readonly IHubContext<SignalRHub> _hubContext;

        public TestDataController(IHubContext<SignalRHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // Test arbitraj verisi gönder
        [HttpPost("send-arbitrage")]
        public async Task<IActionResult> SendArbitrageData()
        {
            var testArbitrage = new
            {
                id = 999,
                friendlyId = "TEST-ARB-001",
                dateAdded = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                orders = new[]
                {
                    new { id = 1001, symbol = "BTC/USDT", side = "Buy", quantity = 0.1, price = 45000.00, status = "Filled", exchange = "Binance" },
                    new { id = 1002, symbol = "ETH/BTC", side = "Buy", quantity = 1.5, price = 0.032, status = "Filled", exchange = "Coinbase" },
                    new { id = 1003, symbol = "ETH/USDT", side = "Sell", quantity = 1.5, price = 1450.00, status = "Filled", exchange = "Kraken" }
                },
                tradingPath = "USDT → BTC → ETH → USDT",
                realizedReturn = 25.50,
                realizedReturnRatio = 0.0056,
                totalDurationUs = 1200000,
                marketRiskDurationUs = 600000,
                isDemo = true,
                isFinalized = true,
                isSuccessful = true
            };

            await _hubContext.Clients.All.SendAsync("NewArbitrageAdded", testArbitrage);
            return Ok(new { message = "Test arbitraj verisi gönderildi", data = testArbitrage });
        }

        // Test borsa verisi gönder
        [HttpPost("send-borsa")]
        public async Task<IActionResult> SendBorsaData()
        {
            var testBorsaData = new[]
            {
                new { id = 1, symbol = "THYAO", price = 45.20, change = 2.5, volume = 1500000, lastUpdate = DateTime.Now, exchange = "BIST" },
                new { id = 2, symbol = "GARAN", price = 32.80, change = -1.2, volume = 2200000, lastUpdate = DateTime.Now, exchange = "BIST" },
                new { id = 3, symbol = "AKBNK", price = 28.50, change = 0.8, volume = 1800000, lastUpdate = DateTime.Now, exchange = "BIST" }
            };

            await _hubContext.Clients.All.SendAsync("BorsaDataUpdated", testBorsaData);
            return Ok(new { message = "Test borsa verisi gönderildi", data = testBorsaData });
        }

        // Test kripto verisi gönder
        [HttpPost("send-crypto")]
        public async Task<IActionResult> SendCryptoData()
        {
            var testCryptoData = new[]
            {
                new { 
                    id = 1, 
                    symbol = "BTC", 
                    price = 45000.00, 
                    change24h = 3.2, 
                    volume24h = 25000000000, 
                    marketCap = 850000000000,
                    exchange = "Binance",
                    icon = "/images/btc-icon.png",
                    high24h = 45500.00,
                    low24h = 44500.00
                },
                new { 
                    id = 2, 
                    symbol = "ETH", 
                    price = 1450.00, 
                    change24h = -1.5, 
                    volume24h = 15000000000, 
                    marketCap = 180000000000,
                    exchange = "Coinbase",
                    icon = "/images/eth-icon.png",
                    high24h = 1480.00,
                    low24h = 1430.00
                },
                new { 
                    id = 3, 
                    symbol = "ADA", 
                    price = 0.22, 
                    change24h = 5.8, 
                    volume24h = 800000000, 
                    marketCap = 7500000000,
                    exchange = "Kraken",
                    icon = "/images/ada-icon.png",
                    high24h = 0.225,
                    low24h = 0.215
                }
            };

            await _hubContext.Clients.All.SendAsync("CryptoDataUpdated", testCryptoData);
            return Ok(new { message = "Test kripto verisi gönderildi", data = testCryptoData });
        }

        // Test fiyat güncellemesi gönder
        [HttpPost("send-price-update")]
        public async Task<IActionResult> SendPriceUpdate([FromBody] PriceUpdateRequest request)
        {
            await _hubContext.Clients.All.SendAsync("RealTimePriceUpdated", request.Symbol, request.Price, request.Exchange);
            return Ok(new { message = "Fiyat güncellemesi gönderildi", data = request });
        }

        // Test arbitraj fırsatı gönder
        [HttpPost("send-opportunity")]
        public async Task<IActionResult> SendOpportunity()
        {
            var opportunity = new
            {
                symbol = "BTC/ETH",
                exchange = "Binance",
                profit = 125.50,
                profitRatio = 0.0028,
                timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.All.SendAsync("NewArbitrageOpportunity", opportunity);
            return Ok(new { message = "Arbitraj fırsatı gönderildi", data = opportunity });
        }

        // Başlangıç verilerini gönder
        [HttpPost("send-initial-data")]
        public async Task<IActionResult> SendInitialData()
        {
            var initialData = new
            {
                arbitrages = new[]
                {
                    new { id = 1, friendlyId = "ARB-001", dateAdded = DateTime.UtcNow.AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss.fffZ"), tradingPath = "USDT → BTC → ETH → USDT", realizedReturn = 45.20, realizedReturnRatio = 0.0010, isDemo = true, isFinalized = true, isSuccessful = true }
                },
                borsa = new[]
                {
                    new { id = 1, symbol = "THYAO", price = 45.20, change = 2.5, volume = 1500000, lastUpdate = DateTime.Now, exchange = "BIST" }
                },
                crypto = new[]
                {
                    new { id = 1, symbol = "BTC", price = 45000.00, change24h = 3.2, volume24h = 25000000000, marketCap = 850000000000, exchange = "Binance" }
                }
            };

            await _hubContext.Clients.All.SendAsync("InitialData", initialData);
            return Ok(new { message = "Başlangıç verileri gönderildi", data = initialData });
        }
    }

    public class PriceUpdateRequest
    {
        public string Symbol { get; set; }
        public decimal Price { get; set; }
        public string Exchange { get; set; }
    }
} 