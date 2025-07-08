using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

public class WebSiteController : RenderController
{
    public WebSiteController(
        ILogger<RenderController> logger,
        ICompositeViewEngine compositeViewEngine,
        IUmbracoContextAccessor umbracoContextAccessor)
        : base(logger, compositeViewEngine, umbracoContextAccessor)
    {
    }

    public override IActionResult Index()
    {
        // Kök node'un ilk child'ı (Portföy sayfası) bulunur
        var portfolio = CurrentPage.Children().FirstOrDefault(x => x.ContentType.Alias == "portfolioPage" || x.Name.ToLower().Contains("portföy") || x.Name.ToLower().Contains("portfolio"));
        if (portfolio != null)
        {
            return Redirect(portfolio.Url());
        }
        // Eğer Portföy yoksa, 404 döndür
        return NotFound();
    }
}