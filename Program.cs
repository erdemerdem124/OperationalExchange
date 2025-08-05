using Deneme1.Controllers;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// SignalR servisini ekle
builder.Services.AddSignalR();

builder.CreateUmbracoBuilder()
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build();

WebApplication app = builder.Build();

await app.BootUmbracoAsync();


app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
        
        // SignalR hub endpoint'ini ekle
        u.EndpointRouteBuilder.MapHub<SignalRHub>("/signalrhub");
    });

await app.RunAsync();
