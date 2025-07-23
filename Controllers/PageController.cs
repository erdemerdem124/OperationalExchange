using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Umbraco.Cms.Web.Common.Controllers;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common.Security;

public class PageController : RenderController
{
    private readonly MemberSignInManager _memberSignInManager;

    public PageController(
        ILogger<RenderController> logger,
        ICompositeViewEngine compositeViewEngine,
        IUmbracoContextAccessor umbracoContextAccessor,
        MemberSignInManager memberSignInManager)
        : base(logger, compositeViewEngine, umbracoContextAccessor)
    {
        _memberSignInManager = memberSignInManager;
    }

    public override IActionResult Index()
    {
        if (!_memberSignInManager.IsSignedIn(User))
        {
            // Giriş yapılmamışsa ana/root sayfaya yönlendir
            return Redirect("/");
        }
        return CurrentTemplate(CurrentPage);
    }
} 