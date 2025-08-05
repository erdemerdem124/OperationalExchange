using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;

namespace Deneme1.Controllers
{
    public class SignalRHub : Hub
    {
        // Arbitraj verisi güncellendiğinde
        public async Task UpdateArbitrageData(object data)
        {
            // Tüm bağlı client'lara arbitraj verisi güncellemesi gönder
            await Clients.All.SendAsync("ArbitrageDataUpdated", data);
        }

        // Yeni arbitraj eklendiğinde
        public async Task AddNewArbitrage(object arbitrage)
        {
            // Tüm bağlı client'lara yeni arbitraj bildirimi gönder
            await Clients.All.SendAsync("NewArbitrageAdded", arbitrage);
        }

        // Arbitraj durumu değiştiğinde
        public async Task ChangeArbitrageStatus(int id, object status)
        {
            // Tüm bağlı client'lara durum değişikliği bildirimi gönder
            await Clients.All.SendAsync("ArbitrageStatusChanged", id, status);
        }

        // Website verisi güncellendiğinde
        public async Task UpdateWebsiteData(object data)
        {
            await Clients.All.SendAsync("WebsiteDataUpdated", data);
        }

        // Website durumu değiştiğinde
        public async Task ChangeWebsiteStatus(int websiteId, string status)
        {
            await Clients.All.SendAsync("WebsiteStatusChanged", status);
        }

        // Borsa verisi güncellendiğinde
        public async Task UpdateBorsaData(object data)
        {
            await Clients.All.SendAsync("BorsaDataUpdated", data);
        }

        // Kripto para verisi güncellendiğinde
        public async Task UpdateCryptoData(object data)
        {
            await Clients.All.SendAsync("CryptoDataUpdated", data);
        }

        // Gerçek zamanlı fiyat güncellemesi
        public async Task UpdateRealTimePrice(string symbol, decimal price, string exchange)
        {
            await Clients.All.SendAsync("RealTimePriceUpdated", symbol, price, exchange);
        }

        // Yeni işlem eklendiğinde
        public async Task AddNewTrade(object trade)
        {
            await Clients.All.SendAsync("NewTradeAdded", trade);
        }

        // İşlem durumu değiştiğinde
        public async Task UpdateTradeStatus(int tradeId, string status)
        {
            await Clients.All.SendAsync("TradeStatusChanged", tradeId, status);
        }

        // Portföy güncellemesi
        public async Task UpdatePortfolio(object portfolio)
        {
            await Clients.All.SendAsync("PortfolioUpdated", portfolio);
        }

        // Arbitraj fırsatı bulunduğunda
        public async Task NewArbitrageOpportunity(object opportunity)
        {
            await Clients.All.SendAsync("NewArbitrageOpportunity", opportunity);
        }

        // Client bağlandığında
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
            
            // Bağlanan client'a mevcut verileri gönder
            await SendInitialDataToClient(Context.ConnectionId);
        }

        // Client ayrıldığında
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        // Yeni bağlanan client'a mevcut verileri gönder
        private async Task SendInitialDataToClient(string connectionId)
        {
            // Burada veritabanından veya cache'den mevcut verileri alıp gönderebilirsiniz
            // Şimdilik örnek veriler gönderiyoruz
            
            var initialData = new
            {
                arbitrages = GetInitialArbitrageData(),
                portfolio = GetInitialPortfolioData(),
                opportunities = GetInitialOpportunityData()
            };

            await Clients.Client(connectionId).SendAsync("InitialData", initialData);
        }

        // Örnek başlangıç arbitraj verileri
        private object GetInitialArbitrageData()
        {
            // Burada veritabanından gerçek verileri alabilirsiniz
            return new List<object>();
        }

        // Örnek başlangıç portföy verileri
        private object GetInitialPortfolioData()
        {
            // Burada veritabanından gerçek verileri alabilirsiniz
            return new List<object>();
        }

        // Örnek başlangıç fırsat verileri
        private object GetInitialOpportunityData()
        {
            // Burada veritabanından gerçek verileri alabilirsiniz
            return new List<object>();
        }
    }
} 